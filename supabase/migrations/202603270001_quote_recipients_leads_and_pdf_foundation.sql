create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  lead_code text,
  display_name text not null,
  contact_name text,
  email text,
  whatsapp text,
  phone text,
  source text not null default 'manual',
  status text not null default 'new' check (status in ('new', 'qualified', 'proposal', 'won', 'lost', 'archived')),
  need_summary text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (tenant_id, lead_code)
);

drop trigger if exists leads_touch_tracking_columns on public.leads;
create trigger leads_touch_tracking_columns
before insert or update on public.leads
for each row
execute function public.touch_tracking_columns();

drop trigger if exists leads_write_audit_log on public.leads;
create trigger leads_write_audit_log
after insert or update or delete on public.leads
for each row
execute function public.write_audit_log();

alter table public.leads enable row level security;

create policy "leads_select_tenant_readers"
on public.leads
for select
using (public.has_tenant_permission(public.leads.tenant_id, 'crm.read'));

create policy "leads_insert_tenant_writers"
on public.leads
for insert
with check (public.has_tenant_permission(public.leads.tenant_id, 'crm.write'));

create policy "leads_update_tenant_writers"
on public.leads
for update
using (public.has_tenant_permission(public.leads.tenant_id, 'crm.write'))
with check (public.has_tenant_permission(public.leads.tenant_id, 'crm.write'));

create table if not exists public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  quote_id uuid not null references public.quotes (id) on delete cascade,
  catalog_item_id uuid references public.catalog_items (id) on delete set null,
  sort_order integer not null default 0 check (sort_order >= 0),
  item_name text not null,
  item_description text,
  quantity numeric(12, 2) not null check (quantity > 0),
  unit_label text,
  unit_price numeric(12, 2) not null default 0 check (unit_price >= 0),
  discount_total numeric(12, 2) not null default 0 check (discount_total >= 0),
  tax_total numeric(12, 2) not null default 0 check (tax_total >= 0),
  line_subtotal numeric(12, 2) not null default 0 check (line_subtotal >= 0),
  line_total numeric(12, 2) not null default 0 check (line_total >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create index if not exists quote_line_items_quote_id_sort_order_idx
on public.quote_line_items (quote_id, sort_order);

drop trigger if exists quote_line_items_touch_tracking_columns on public.quote_line_items;
create trigger quote_line_items_touch_tracking_columns
before insert or update on public.quote_line_items
for each row
execute function public.touch_tracking_columns();

drop trigger if exists quote_line_items_write_audit_log on public.quote_line_items;
create trigger quote_line_items_write_audit_log
after insert or update or delete on public.quote_line_items
for each row
execute function public.write_audit_log();

alter table public.quote_line_items enable row level security;

create policy "quote_line_items_select_tenant_readers"
on public.quote_line_items
for select
using (public.has_tenant_permission(public.quote_line_items.tenant_id, 'quote.read'));

drop policy if exists "quotes_insert_tenant_writers" on public.quotes;
drop policy if exists "quotes_update_tenant_writers" on public.quotes;

alter table public.quotes
  alter column customer_id drop not null;

alter table public.quotes
  add column if not exists lead_id uuid references public.leads (id) on delete set null,
  add column if not exists recipient_kind text not null default 'customer',
  add column if not exists recipient_display_name text,
  add column if not exists recipient_contact_name text,
  add column if not exists recipient_email text,
  add column if not exists recipient_whatsapp text,
  add column if not exists recipient_phone text;

update public.quotes as quote
set recipient_kind = 'customer',
    recipient_display_name = coalesce(quote.recipient_display_name, customer.display_name),
    recipient_contact_name = coalesce(quote.recipient_contact_name, customer.contact_name),
    recipient_email = coalesce(quote.recipient_email, customer.email),
    recipient_whatsapp = coalesce(quote.recipient_whatsapp, customer.whatsapp),
    recipient_phone = coalesce(quote.recipient_phone, customer.phone)
from public.customers as customer
where quote.customer_id = customer.id
  and quote.tenant_id = customer.tenant_id;

alter table public.quotes
  alter column recipient_display_name set not null;

alter table public.quotes
  drop constraint if exists quotes_recipient_kind_check,
  add constraint quotes_recipient_kind_check
    check (recipient_kind in ('customer', 'lead', 'ad_hoc')),
  drop constraint if exists quotes_recipient_link_check,
  add constraint quotes_recipient_link_check
    check (
      (recipient_kind = 'customer' and customer_id is not null and lead_id is null)
      or (recipient_kind = 'lead' and lead_id is not null and customer_id is null)
      or (recipient_kind = 'ad_hoc' and customer_id is null and lead_id is null)
    ),
  drop constraint if exists quotes_recipient_display_name_check,
  add constraint quotes_recipient_display_name_check
    check (length(btrim(recipient_display_name)) >= 2);

drop function if exists public.create_quote(uuid, uuid, text, text, text, numeric, numeric, numeric, date, text);
drop function if exists public.update_quote(uuid, uuid, integer, uuid, text, text, text, numeric, numeric, numeric, date, text);

create or replace function public.replace_quote_line_items(
  target_tenant_id uuid,
  target_quote_id uuid,
  target_line_items jsonb,
  target_actor_id uuid
)
returns table (
  subtotal numeric,
  discount_total numeric,
  tax_total numeric,
  grand_total numeric
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_line_items jsonb := coalesce(target_line_items, '[]'::jsonb);
  line_item jsonb;
  line_index integer := 0;
  normalized_catalog_item_id uuid;
  normalized_item_name text;
  normalized_item_description text;
  normalized_unit_label text;
  raw_quantity numeric;
  raw_unit_price numeric;
  raw_discount_total numeric;
  raw_tax_total numeric;
  computed_line_subtotal numeric;
  computed_line_total numeric;
begin
  if jsonb_typeof(normalized_line_items) <> 'array' then
    raise exception 'Quote line items payload must be an array';
  end if;

  if jsonb_array_length(normalized_line_items) = 0 then
    raise exception 'At least one quote line item is required';
  end if;

  delete from public.quote_line_items
  where tenant_id = target_tenant_id
    and quote_id = target_quote_id;

  subtotal := 0;
  discount_total := 0;
  tax_total := 0;
  grand_total := 0;

  for line_item in
    select value
    from jsonb_array_elements(normalized_line_items)
  loop
    line_index := line_index + 1;
    normalized_catalog_item_id := nullif(line_item ->> 'catalogItemId', '')::uuid;
    normalized_item_name := nullif(btrim(line_item ->> 'itemName'), '');
    normalized_item_description := nullif(btrim(line_item ->> 'itemDescription'), '');
    normalized_unit_label := nullif(btrim(line_item ->> 'unitLabel'), '');
    raw_quantity := coalesce((line_item ->> 'quantity')::numeric, 0);
    raw_unit_price := coalesce((line_item ->> 'unitPrice')::numeric, 0);
    raw_discount_total := coalesce((line_item ->> 'discountTotal')::numeric, 0);
    raw_tax_total := coalesce((line_item ->> 'taxTotal')::numeric, 0);

    if normalized_item_name is null or length(normalized_item_name) < 2 then
      raise exception 'Each quote line item must include a name';
    end if;

    if raw_quantity <= 0 then
      raise exception 'Quote line item quantity must be greater than zero';
    end if;

    if raw_unit_price < 0 or raw_discount_total < 0 or raw_tax_total < 0 then
      raise exception 'Quote line item amounts cannot be negative';
    end if;

    if normalized_catalog_item_id is not null then
      perform 1
      from public.catalog_items
      where id = normalized_catalog_item_id
        and tenant_id = target_tenant_id;

      if not found then
        raise exception 'Catalog item does not belong to the active tenant';
      end if;
    end if;

    computed_line_subtotal := round((raw_quantity * raw_unit_price)::numeric, 2);

    if raw_discount_total > computed_line_subtotal then
      raise exception 'Line discount cannot exceed line subtotal';
    end if;

    computed_line_total := round((computed_line_subtotal - raw_discount_total + raw_tax_total)::numeric, 2);

    insert into public.quote_line_items (
      tenant_id,
      quote_id,
      catalog_item_id,
      sort_order,
      item_name,
      item_description,
      quantity,
      unit_label,
      unit_price,
      discount_total,
      tax_total,
      line_subtotal,
      line_total,
      created_by,
      updated_by
    )
    values (
      target_tenant_id,
      target_quote_id,
      normalized_catalog_item_id,
      line_index - 1,
      normalized_item_name,
      normalized_item_description,
      round(raw_quantity, 2),
      normalized_unit_label,
      round(raw_unit_price, 2),
      round(raw_discount_total, 2),
      round(raw_tax_total, 2),
      computed_line_subtotal,
      computed_line_total,
      target_actor_id,
      target_actor_id
    );

    subtotal := subtotal + computed_line_subtotal;
    discount_total := discount_total + raw_discount_total;
    tax_total := tax_total + raw_tax_total;
  end loop;

  subtotal := round(subtotal, 2);
  discount_total := round(discount_total, 2);
  tax_total := round(tax_total, 2);
  grand_total := round((subtotal - discount_total + tax_total)::numeric, 2);

  return next;
end;
$$;

create or replace function public.create_quote(
  target_tenant_id uuid,
  target_title text,
  target_status text,
  target_currency_code text,
  target_recipient_kind text,
  target_line_items jsonb,
  target_customer_id uuid default null,
  target_lead_id uuid default null,
  target_recipient_display_name text default null,
  target_recipient_contact_name text default null,
  target_recipient_email text default null,
  target_recipient_whatsapp text default null,
  target_recipient_phone text default null,
  target_valid_until date default null,
  target_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_quote_id uuid := gen_random_uuid();
  generated_quote_number text;
  normalized_title text := nullif(btrim(target_title), '');
  normalized_currency text := upper(nullif(btrim(target_currency_code), ''));
  normalized_status text := nullif(btrim(target_status), '');
  normalized_recipient_kind text := nullif(btrim(target_recipient_kind), '');
  normalized_recipient_display_name text := nullif(btrim(target_recipient_display_name), '');
  normalized_recipient_contact_name text := nullif(btrim(target_recipient_contact_name), '');
  normalized_recipient_email text := nullif(btrim(target_recipient_email), '');
  normalized_recipient_whatsapp text := nullif(btrim(target_recipient_whatsapp), '');
  normalized_recipient_phone text := nullif(btrim(target_recipient_phone), '');
  normalized_notes text := nullif(btrim(target_notes), '');
  resolved_customer_id uuid;
  resolved_lead_id uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email text;
  resolved_recipient_whatsapp text;
  resolved_recipient_phone text;
  computed_subtotal numeric;
  computed_discount_total numeric;
  computed_tax_total numeric;
  computed_grand_total numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'quote.write') then
    raise exception 'You do not have permission to create quotes for this tenant';
  end if;

  if normalized_title is null or length(normalized_title) < 2 then
    raise exception 'Quote title is required';
  end if;

  if normalized_currency is null or length(normalized_currency) <> 3 then
    raise exception 'Currency code must have exactly 3 letters';
  end if;

  if normalized_status is null or normalized_status not in ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired') then
    raise exception 'Quote status is invalid';
  end if;

  if normalized_recipient_kind = 'customer' then
    select
      customer.id,
      customer.display_name,
      customer.contact_name,
      customer.email,
      customer.whatsapp,
      customer.phone
    into
      resolved_customer_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.customers as customer
    where customer.id = target_customer_id
      and customer.tenant_id = target_tenant_id;

    if resolved_customer_id is null then
      raise exception 'Customer does not belong to the active tenant';
    end if;
  elsif normalized_recipient_kind = 'lead' then
    select
      lead.id,
      lead.display_name,
      lead.contact_name,
      lead.email,
      lead.whatsapp,
      lead.phone
    into
      resolved_lead_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.leads as lead
    where lead.id = target_lead_id
      and lead.tenant_id = target_tenant_id;

    if resolved_lead_id is null then
      raise exception 'Lead does not belong to the active tenant';
    end if;
  elsif normalized_recipient_kind = 'ad_hoc' then
    resolved_customer_id := null;
    resolved_lead_id := null;
  else
    raise exception 'Quote recipient kind is invalid';
  end if;

  resolved_recipient_display_name := coalesce(
    normalized_recipient_display_name,
    resolved_recipient_display_name
  );
  resolved_recipient_contact_name := coalesce(
    normalized_recipient_contact_name,
    resolved_recipient_contact_name
  );
  resolved_recipient_email := coalesce(
    normalized_recipient_email,
    resolved_recipient_email
  );
  resolved_recipient_whatsapp := coalesce(
    normalized_recipient_whatsapp,
    resolved_recipient_whatsapp
  );
  resolved_recipient_phone := coalesce(
    normalized_recipient_phone,
    resolved_recipient_phone
  );

  if resolved_recipient_display_name is null or length(resolved_recipient_display_name) < 2 then
    raise exception 'Recipient display name is required';
  end if;

  generated_quote_number := public.allocate_quote_number(target_tenant_id);

  insert into public.quotes (
    id,
    tenant_id,
    customer_id,
    lead_id,
    recipient_kind,
    recipient_display_name,
    recipient_contact_name,
    recipient_email,
    recipient_whatsapp,
    recipient_phone,
    quote_number,
    title,
    status,
    currency_code,
    subtotal,
    discount_total,
    tax_total,
    grand_total,
    valid_until,
    notes,
    created_by,
    updated_by
  )
  values (
    new_quote_id,
    target_tenant_id,
    resolved_customer_id,
    resolved_lead_id,
    normalized_recipient_kind,
    resolved_recipient_display_name,
    resolved_recipient_contact_name,
    resolved_recipient_email,
    resolved_recipient_whatsapp,
    resolved_recipient_phone,
    generated_quote_number,
    normalized_title,
    normalized_status,
    normalized_currency,
    0,
    0,
    0,
    0,
    target_valid_until,
    normalized_notes,
    auth.uid(),
    auth.uid()
  );

  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_discount_total, computed_tax_total, computed_grand_total
  from public.replace_quote_line_items(
    target_tenant_id,
    new_quote_id,
    target_line_items,
    auth.uid()
  );

  update public.quotes
  set subtotal = computed_subtotal,
      discount_total = computed_discount_total,
      tax_total = computed_tax_total,
      grand_total = computed_grand_total
  where id = new_quote_id
    and tenant_id = target_tenant_id;

  return new_quote_id;
end;
$$;

create or replace function public.update_quote(
  target_tenant_id uuid,
  target_quote_id uuid,
  expected_version integer,
  target_title text,
  target_status text,
  target_currency_code text,
  target_recipient_kind text,
  target_line_items jsonb,
  target_customer_id uuid default null,
  target_lead_id uuid default null,
  target_recipient_display_name text default null,
  target_recipient_contact_name text default null,
  target_recipient_email text default null,
  target_recipient_whatsapp text default null,
  target_recipient_phone text default null,
  target_valid_until date default null,
  target_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  updated_quote_id uuid;
  normalized_title text := nullif(btrim(target_title), '');
  normalized_currency text := upper(nullif(btrim(target_currency_code), ''));
  normalized_status text := nullif(btrim(target_status), '');
  normalized_recipient_kind text := nullif(btrim(target_recipient_kind), '');
  normalized_recipient_display_name text := nullif(btrim(target_recipient_display_name), '');
  normalized_recipient_contact_name text := nullif(btrim(target_recipient_contact_name), '');
  normalized_recipient_email text := nullif(btrim(target_recipient_email), '');
  normalized_recipient_whatsapp text := nullif(btrim(target_recipient_whatsapp), '');
  normalized_recipient_phone text := nullif(btrim(target_recipient_phone), '');
  normalized_notes text := nullif(btrim(target_notes), '');
  resolved_customer_id uuid;
  resolved_lead_id uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email text;
  resolved_recipient_whatsapp text;
  resolved_recipient_phone text;
  computed_subtotal numeric;
  computed_discount_total numeric;
  computed_tax_total numeric;
  computed_grand_total numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'quote.write') then
    raise exception 'You do not have permission to update quotes for this tenant';
  end if;

  if normalized_title is null or length(normalized_title) < 2 then
    raise exception 'Quote title is required';
  end if;

  if normalized_currency is null or length(normalized_currency) <> 3 then
    raise exception 'Currency code must have exactly 3 letters';
  end if;

  if expected_version < 1 then
    raise exception 'Expected version is invalid';
  end if;

  if normalized_status is null or normalized_status not in ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired') then
    raise exception 'Quote status is invalid';
  end if;

  perform 1
  from public.quotes
  where tenant_id = target_tenant_id
    and id = target_quote_id
    and version = expected_version
  for update;

  if not found then
    perform 1
    from public.quotes
    where tenant_id = target_tenant_id
      and id = target_quote_id;

    if found then
      raise exception 'Quote version conflict. Refresh and try again.';
    end if;

    raise exception 'Quote not found for the active tenant';
  end if;

  if normalized_recipient_kind = 'customer' then
    select
      customer.id,
      customer.display_name,
      customer.contact_name,
      customer.email,
      customer.whatsapp,
      customer.phone
    into
      resolved_customer_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.customers as customer
    where customer.id = target_customer_id
      and customer.tenant_id = target_tenant_id;

    if resolved_customer_id is null then
      raise exception 'Customer does not belong to the active tenant';
    end if;
  elsif normalized_recipient_kind = 'lead' then
    select
      lead.id,
      lead.display_name,
      lead.contact_name,
      lead.email,
      lead.whatsapp,
      lead.phone
    into
      resolved_lead_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.leads as lead
    where lead.id = target_lead_id
      and lead.tenant_id = target_tenant_id;

    if resolved_lead_id is null then
      raise exception 'Lead does not belong to the active tenant';
    end if;
  elsif normalized_recipient_kind = 'ad_hoc' then
    resolved_customer_id := null;
    resolved_lead_id := null;
  else
    raise exception 'Quote recipient kind is invalid';
  end if;

  resolved_recipient_display_name := coalesce(
    normalized_recipient_display_name,
    resolved_recipient_display_name
  );
  resolved_recipient_contact_name := coalesce(
    normalized_recipient_contact_name,
    resolved_recipient_contact_name
  );
  resolved_recipient_email := coalesce(
    normalized_recipient_email,
    resolved_recipient_email
  );
  resolved_recipient_whatsapp := coalesce(
    normalized_recipient_whatsapp,
    resolved_recipient_whatsapp
  );
  resolved_recipient_phone := coalesce(
    normalized_recipient_phone,
    resolved_recipient_phone
  );

  if resolved_recipient_display_name is null or length(resolved_recipient_display_name) < 2 then
    raise exception 'Recipient display name is required';
  end if;

  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_discount_total, computed_tax_total, computed_grand_total
  from public.replace_quote_line_items(
    target_tenant_id,
    target_quote_id,
    target_line_items,
    auth.uid()
  );

  update public.quotes
  set customer_id = resolved_customer_id,
      lead_id = resolved_lead_id,
      recipient_kind = normalized_recipient_kind,
      recipient_display_name = resolved_recipient_display_name,
      recipient_contact_name = resolved_recipient_contact_name,
      recipient_email = resolved_recipient_email,
      recipient_whatsapp = resolved_recipient_whatsapp,
      recipient_phone = resolved_recipient_phone,
      title = normalized_title,
      status = normalized_status,
      currency_code = normalized_currency,
      subtotal = computed_subtotal,
      discount_total = computed_discount_total,
      tax_total = computed_tax_total,
      grand_total = computed_grand_total,
      valid_until = target_valid_until,
      notes = normalized_notes,
      version = public.quotes.version + 1,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_quote_id
    and version = expected_version
  returning id into updated_quote_id;

  return updated_quote_id;
end;
$$;

revoke all on function public.replace_quote_line_items(uuid, uuid, jsonb, uuid) from public;
revoke all on function public.create_quote(uuid, text, text, text, text, jsonb, uuid, uuid, text, text, text, text, text, date, text) from public;
revoke all on function public.update_quote(uuid, uuid, integer, text, text, text, text, jsonb, uuid, uuid, text, text, text, text, text, date, text) from public;

grant execute on function public.create_quote(uuid, text, text, text, text, jsonb, uuid, uuid, text, text, text, text, text, date, text) to authenticated;
grant execute on function public.update_quote(uuid, uuid, integer, text, text, text, text, jsonb, uuid, uuid, text, text, text, text, text, date, text) to authenticated;
