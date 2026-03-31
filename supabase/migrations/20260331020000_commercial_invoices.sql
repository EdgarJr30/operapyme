insert into public.permissions (permission_key, scope, description)
values
  ('invoice.read', 'tenant', 'Read documentary invoices for the active tenant'),
  ('invoice.write', 'tenant', 'Create and update documentary invoices for the active tenant')
on conflict (permission_key) do update
set scope = excluded.scope,
    description = excluded.description,
    updated_at = timezone('utc', now());

insert into public.tenant_role_permissions (role_id, permission_id)
select tr.id, p.id
from public.tenant_roles tr
join public.permissions p
  on p.permission_key in ('invoice.read', 'invoice.write')
where tr.role_key in ('tenant_owner', 'tenant_admin', 'sales_rep', 'finance_operator')
on conflict (role_id, permission_id) do nothing;

insert into public.tenant_role_permissions (role_id, permission_id)
select tr.id, p.id
from public.tenant_roles tr
join public.permissions p
  on p.permission_key = 'invoice.read'
where tr.role_key = 'viewer'
on conflict (role_id, permission_id) do nothing;

create table if not exists public.invoice_number_sequences (
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  invoice_year integer not null check (invoice_year >= 2020),
  last_value integer not null default 0 check (last_value >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  primary key (tenant_id, invoice_year)
);

drop trigger if exists invoice_number_sequences_touch_tracking_columns on public.invoice_number_sequences;
create trigger invoice_number_sequences_touch_tracking_columns
before insert or update on public.invoice_number_sequences
for each row
execute function public.touch_tracking_columns();

alter table public.invoice_number_sequences enable row level security;

create or replace function public.allocate_invoice_number(target_tenant_id uuid)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_year integer := extract(year from timezone('utc', now()))::integer;
  next_value integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to create invoices for this tenant';
  end if;

  insert into public.invoice_number_sequences (
    tenant_id,
    invoice_year,
    last_value,
    created_by,
    updated_by
  )
  values (
    target_tenant_id,
    target_year,
    1,
    auth.uid(),
    auth.uid()
  )
  on conflict (tenant_id, invoice_year)
  do update
  set last_value = public.invoice_number_sequences.last_value + 1,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  returning last_value into next_value;

  return format('FAC-%s-%s', target_year, lpad(next_value::text, 6, '0'));
end;
$$;

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  source_quote_id uuid,
  customer_id uuid,
  lead_id uuid,
  recipient_kind text not null default 'customer',
  recipient_display_name text not null,
  recipient_contact_name text,
  recipient_email text,
  recipient_whatsapp text,
  recipient_phone text,
  invoice_number text not null,
  title text not null,
  document_kind text not null default 'services' check (document_kind in ('items', 'services')),
  status text not null default 'draft' check (status in ('draft', 'issued', 'paid', 'void')),
  currency_code text not null default 'USD',
  subtotal numeric(12, 2) not null default 0,
  discount_total numeric(12, 2) not null default 0,
  tax_total numeric(12, 2) not null default 0,
  grand_total numeric(12, 2) not null default 0,
  issued_on date,
  due_on date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (tenant_id, invoice_number),
  unique (tenant_id, id),
  constraint invoices_recipient_kind_check
    check (recipient_kind in ('customer', 'lead', 'ad_hoc')),
  constraint invoices_recipient_link_check
    check (
      (recipient_kind = 'customer' and customer_id is not null and lead_id is null)
      or (recipient_kind = 'lead' and lead_id is not null and customer_id is null)
      or (recipient_kind = 'ad_hoc' and customer_id is null and lead_id is null)
    ),
  constraint invoices_recipient_display_name_check
    check (length(btrim(recipient_display_name)) >= 2)
);

create table if not exists public.invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  invoice_id uuid not null,
  catalog_item_id uuid,
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

create index if not exists invoices_source_quote_id_tenant_id_idx
on public.invoices (tenant_id, source_quote_id);

create index if not exists invoices_customer_id_tenant_id_idx
on public.invoices (tenant_id, customer_id);

create index if not exists invoices_lead_id_tenant_id_idx
on public.invoices (tenant_id, lead_id);

create index if not exists invoice_line_items_invoice_id_tenant_id_sort_order_idx
on public.invoice_line_items (tenant_id, invoice_id, sort_order);

create index if not exists invoice_line_items_catalog_item_id_tenant_id_idx
on public.invoice_line_items (tenant_id, catalog_item_id);

alter table public.invoices
  add constraint invoices_customer_id_tenant_id_fkey
    foreign key (tenant_id, customer_id)
    references public.customers (tenant_id, id)
    on delete restrict,
  add constraint invoices_lead_id_tenant_id_fkey
    foreign key (tenant_id, lead_id)
    references public.leads (tenant_id, id)
    on delete set null,
  add constraint invoices_source_quote_id_tenant_id_fkey
    foreign key (tenant_id, source_quote_id)
    references public.quotes (tenant_id, id)
    on delete set null;

alter table public.invoice_line_items
  add constraint invoice_line_items_invoice_id_tenant_id_fkey
    foreign key (tenant_id, invoice_id)
    references public.invoices (tenant_id, id)
    on delete cascade,
  add constraint invoice_line_items_catalog_item_id_tenant_id_fkey
    foreign key (tenant_id, catalog_item_id)
    references public.catalog_items (tenant_id, id)
    on delete set null;

drop trigger if exists invoices_touch_tracking_columns on public.invoices;
create trigger invoices_touch_tracking_columns
before insert or update on public.invoices
for each row
execute function public.touch_tracking_columns();

drop trigger if exists invoice_line_items_touch_tracking_columns on public.invoice_line_items;
create trigger invoice_line_items_touch_tracking_columns
before insert or update on public.invoice_line_items
for each row
execute function public.touch_tracking_columns();

drop trigger if exists invoices_write_audit_log on public.invoices;
create trigger invoices_write_audit_log
after insert or update or delete on public.invoices
for each row
execute function public.write_audit_log();

drop trigger if exists invoice_line_items_write_audit_log on public.invoice_line_items;
create trigger invoice_line_items_write_audit_log
after insert or update or delete on public.invoice_line_items
for each row
execute function public.write_audit_log();

alter table public.invoices enable row level security;
alter table public.invoice_line_items enable row level security;

create policy "invoice_number_sequences_no_direct_access"
on public.invoice_number_sequences
for all
to authenticated
using (false)
with check (false);

create policy "invoices_select_tenant_readers"
on public.invoices
for select
using (public.has_tenant_permission(public.invoices.tenant_id, 'invoice.read'));

create policy "invoice_line_items_select_tenant_readers"
on public.invoice_line_items
for select
using (public.has_tenant_permission(public.invoice_line_items.tenant_id, 'invoice.read'));

drop trigger if exists invoices_prevent_tenant_reassignment on public.invoices;
create trigger invoices_prevent_tenant_reassignment
before update on public.invoices
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists invoice_line_items_prevent_tenant_reassignment on public.invoice_line_items;
create trigger invoice_line_items_prevent_tenant_reassignment
before update on public.invoice_line_items
for each row
execute function public.prevent_tenant_reassignment();

drop trigger if exists invoice_number_sequences_prevent_tenant_reassignment on public.invoice_number_sequences;
create trigger invoice_number_sequences_prevent_tenant_reassignment
before update on public.invoice_number_sequences
for each row
execute function public.prevent_tenant_reassignment();

create or replace function public.replace_invoice_line_items(
  target_tenant_id uuid,
  target_invoice_id uuid,
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
    raise exception 'Invoice line items payload must be an array';
  end if;

  if jsonb_array_length(normalized_line_items) = 0 then
    raise exception 'At least one invoice line item is required';
  end if;

  delete from public.invoice_line_items
  where tenant_id = target_tenant_id
    and invoice_id = target_invoice_id;

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
      raise exception 'Each invoice line item must include a name';
    end if;

    if raw_quantity <= 0 then
      raise exception 'Invoice line item quantity must be greater than zero';
    end if;

    if raw_unit_price < 0 or raw_discount_total < 0 or raw_tax_total < 0 then
      raise exception 'Invoice line item amounts cannot be negative';
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

    insert into public.invoice_line_items (
      tenant_id,
      invoice_id,
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
      target_invoice_id,
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

create or replace function public.create_invoice(
  target_tenant_id uuid,
  target_title text,
  target_status text,
  target_document_kind text,
  target_currency_code text,
  target_recipient_kind text,
  target_line_items jsonb,
  target_document_discount_total numeric default 0,
  target_source_quote_id uuid default null,
  target_customer_id uuid default null,
  target_lead_id uuid default null,
  target_recipient_display_name text default null,
  target_recipient_contact_name text default null,
  target_recipient_email text default null,
  target_recipient_whatsapp text default null,
  target_recipient_phone text default null,
  target_issued_on date default null,
  target_due_on date default null,
  target_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_invoice_id uuid := gen_random_uuid();
  generated_invoice_number text;
  normalized_title text := nullif(btrim(target_title), '');
  normalized_currency text := upper(nullif(btrim(target_currency_code), ''));
  normalized_status text := nullif(btrim(target_status), '');
  normalized_document_kind text := nullif(btrim(target_document_kind), '');
  normalized_recipient_kind text := nullif(btrim(target_recipient_kind), '');
  normalized_recipient_display_name text := nullif(btrim(target_recipient_display_name), '');
  normalized_recipient_contact_name text := nullif(btrim(target_recipient_contact_name), '');
  normalized_recipient_email text := nullif(btrim(target_recipient_email), '');
  normalized_recipient_whatsapp text := nullif(btrim(target_recipient_whatsapp), '');
  normalized_recipient_phone text := nullif(btrim(target_recipient_phone), '');
  normalized_notes text := nullif(btrim(target_notes), '');
  normalized_document_discount_total numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  resolved_customer_id uuid;
  resolved_lead_id uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email text;
  resolved_recipient_whatsapp text;
  resolved_recipient_phone text;
  computed_subtotal numeric;
  computed_line_discount_total numeric;
  computed_tax_total numeric;
  computed_grand_total numeric;
  computed_total_discount numeric;
  discountable_document_subtotal numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to create invoices for this tenant';
  end if;

  if normalized_title is null or length(normalized_title) < 2 then
    raise exception 'Invoice title is required';
  end if;

  if normalized_currency is null or length(normalized_currency) <> 3 then
    raise exception 'Currency code must have exactly 3 letters';
  end if;

  if normalized_status is null or normalized_status not in ('draft', 'issued', 'paid', 'void') then
    raise exception 'Invoice status is invalid';
  end if;

  if normalized_document_kind is null or normalized_document_kind not in ('items', 'services') then
    raise exception 'Invoice document kind is invalid';
  end if;

  if normalized_document_discount_total < 0 then
    raise exception 'Document discount cannot be negative';
  end if;

  if target_source_quote_id is not null then
    perform 1
    from public.quotes
    where id = target_source_quote_id
      and tenant_id = target_tenant_id;

    if not found then
      raise exception 'Source quote does not belong to the active tenant';
    end if;
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
    raise exception 'Invoice recipient kind is invalid';
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

  generated_invoice_number := public.allocate_invoice_number(target_tenant_id);

  insert into public.invoices (
    id,
    tenant_id,
    source_quote_id,
    customer_id,
    lead_id,
    recipient_kind,
    recipient_display_name,
    recipient_contact_name,
    recipient_email,
    recipient_whatsapp,
    recipient_phone,
    invoice_number,
    title,
    document_kind,
    status,
    currency_code,
    subtotal,
    discount_total,
    tax_total,
    grand_total,
    issued_on,
    due_on,
    notes,
    created_by,
    updated_by
  )
  values (
    new_invoice_id,
    target_tenant_id,
    target_source_quote_id,
    resolved_customer_id,
    resolved_lead_id,
    normalized_recipient_kind,
    resolved_recipient_display_name,
    resolved_recipient_contact_name,
    resolved_recipient_email,
    resolved_recipient_whatsapp,
    resolved_recipient_phone,
    generated_invoice_number,
    normalized_title,
    normalized_document_kind,
    normalized_status,
    normalized_currency,
    0,
    0,
    0,
    0,
    target_issued_on,
    target_due_on,
    normalized_notes,
    auth.uid(),
    auth.uid()
  );

  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_line_discount_total, computed_tax_total, computed_grand_total
  from public.replace_invoice_line_items(
    target_tenant_id,
    new_invoice_id,
    target_line_items,
    auth.uid()
  );

  discountable_document_subtotal := round(
    (computed_subtotal - computed_line_discount_total)::numeric,
    2
  );

  if normalized_document_discount_total > discountable_document_subtotal then
    raise exception 'Document discount cannot exceed invoice subtotal after line discounts';
  end if;

  computed_total_discount := round(
    (computed_line_discount_total + normalized_document_discount_total)::numeric,
    2
  );

  computed_grand_total := round(
    (computed_subtotal - computed_total_discount + computed_tax_total)::numeric,
    2
  );

  update public.invoices
  set subtotal = computed_subtotal,
      discount_total = computed_total_discount,
      tax_total = computed_tax_total,
      grand_total = computed_grand_total
  where id = new_invoice_id
    and tenant_id = target_tenant_id;

  return new_invoice_id;
end;
$$;

revoke all on function public.allocate_invoice_number(uuid) from public;
revoke all on function public.replace_invoice_line_items(uuid, uuid, jsonb, uuid) from public;
revoke all on function public.create_invoice(uuid, text, text, text, text, text, jsonb, numeric, uuid, uuid, uuid, text, text, text, text, text, date, date, text) from public;

grant execute on function public.allocate_invoice_number(uuid) to authenticated;
grant execute on function public.create_invoice(uuid, text, text, text, text, text, jsonb, numeric, uuid, uuid, uuid, text, text, text, text, text, date, date, text) to authenticated;
