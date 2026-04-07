-- ─────────────────────────────────────────────────────────────────────────────
-- Invoice NCF, NCF Type, Attachment — and item_code on invoice_line_items
--
-- Changes:
--   1. Create global ncf_types lookup table (CMS-managed)
--   2. Seed initial Dominican Republic NCF types
--   3. Add ncf_type_id to customers
--   4. Add ncf_type_id, ncf, attachment_name, attachment_path to invoices
--   5. Add item_code to invoice_line_items
--   6. Create invoice-attachments storage bucket + RLS policies
--   7. Update replace_invoice_line_items to persist item_code
--   8. Update create_invoice to accept new fields
--   9. Update update_invoice to accept new fields
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. NCF types global lookup table
create table if not exists public.ncf_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null
);

drop trigger if exists ncf_types_touch_tracking_columns on public.ncf_types;
create trigger ncf_types_touch_tracking_columns
before insert or update on public.ncf_types
for each row
execute function public.touch_tracking_columns();

alter table public.ncf_types enable row level security;

-- All authenticated users can read NCF types; only global admins can write
create policy "ncf_types_select_authenticated"
on public.ncf_types
for select
to authenticated
using (true);

create policy "ncf_types_all_global_admin"
on public.ncf_types
for all
to authenticated
using (public.is_global_admin())
with check (public.is_global_admin());

-- 2. Seed Dominican Republic NCF types (e-CF comprobantes)
insert into public.ncf_types (code, label, sort_order) values
  ('31', 'Facturas de Crédito Fiscal Electrónico',  10),
  ('32', 'Facturas de Consumo Electrónica',          20),
  ('33', 'Nota de Débito Electrónica',               30),
  ('34', 'Nota de Crédito Electrónica',              40),
  ('41', 'Compras Electrónico',                      50),
  ('43', 'Gastos Menores Electrónico',               60),
  ('44', 'Regímenes Especiales Electrónico',         70),
  ('45', 'Gubernamental Electrónico',                80),
  ('46', 'Exportaciones Electrónico',                90),
  ('47', 'Pagos al Exterior Electrónico',           100)
on conflict (code) do update
set label      = excluded.label,
    sort_order = excluded.sort_order,
    updated_at = timezone('utc', now());

-- 3. Add ncf_type_id to customers
alter table public.customers
  add column if not exists ncf_type_id uuid references public.ncf_types (id) on delete set null;

-- 4. Add ncf_type_id, ncf, attachment fields to invoices
alter table public.invoices
  add column if not exists ncf_type_id uuid references public.ncf_types (id) on delete set null,
  add column if not exists ncf text,
  add column if not exists attachment_name text,
  add column if not exists attachment_path text;

-- 5. Add item_code to invoice_line_items
alter table public.invoice_line_items
  add column if not exists item_code text;

-- Backfill item_code from catalog for existing lines
update public.invoice_line_items as line_item
set item_code = catalog.item_code
from public.catalog_items as catalog
where line_item.catalog_item_id = catalog.id
  and line_item.tenant_id = catalog.tenant_id
  and line_item.item_code is null;

-- 6. Invoice attachments storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invoice-attachments',
  'invoice-attachments',
  false,
  10485760,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Helper: can manage (write/delete) an invoice attachment
create or replace function public.can_manage_invoice_attachment_asset(
  target_bucket_id text,
  object_name text
)
returns boolean
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  tenant_folder text;
  target_tenant_id uuid;
begin
  if auth.uid() is null then
    return false;
  end if;

  if target_bucket_id <> 'invoice-attachments' then
    return false;
  end if;

  tenant_folder := (storage.foldername(object_name))[1];

  if tenant_folder is null
     or tenant_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_tenant_id := tenant_folder::uuid;

  return public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'invoice.write');
end;
$$;

-- Helper: can read an invoice attachment
create or replace function public.can_read_invoice_attachment_asset(
  target_bucket_id text,
  object_name text
)
returns boolean
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  tenant_folder text;
  target_tenant_id uuid;
begin
  if auth.uid() is null then
    return false;
  end if;

  if target_bucket_id <> 'invoice-attachments' then
    return false;
  end if;

  tenant_folder := (storage.foldername(object_name))[1];

  if tenant_folder is null
     or tenant_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_tenant_id := tenant_folder::uuid;

  return public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'invoice.read')
    or public.has_tenant_permission(target_tenant_id, 'invoice.write');
end;
$$;

drop policy if exists "invoice_attachments_select" on storage.objects;
create policy "invoice_attachments_select"
on storage.objects
for select
to authenticated
using (public.can_read_invoice_attachment_asset(bucket_id, name));

drop policy if exists "invoice_attachments_insert" on storage.objects;
create policy "invoice_attachments_insert"
on storage.objects
for insert
to authenticated
with check (public.can_manage_invoice_attachment_asset(bucket_id, name));

drop policy if exists "invoice_attachments_update" on storage.objects;
create policy "invoice_attachments_update"
on storage.objects
for update
to authenticated
using (public.can_manage_invoice_attachment_asset(bucket_id, name))
with check (public.can_manage_invoice_attachment_asset(bucket_id, name));

drop policy if exists "invoice_attachments_delete" on storage.objects;
create policy "invoice_attachments_delete"
on storage.objects
for delete
to authenticated
using (public.can_manage_invoice_attachment_asset(bucket_id, name));

-- 7. Update replace_invoice_line_items to persist item_code
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
  normalized_item_code text;
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
    normalized_item_code := nullif(btrim(line_item ->> 'itemCode'), '');
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
      -- Fetch item_code from catalog (overrides payload value)
      select catalog.item_code
      into normalized_item_code
      from public.catalog_items as catalog
      where catalog.id = normalized_catalog_item_id
        and catalog.tenant_id = target_tenant_id;

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
      item_code,
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
      normalized_item_code,
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

-- 8. Drop and recreate create_invoice with new parameters
drop function if exists public.create_invoice(
  uuid, text, text, text, text, text, jsonb, numeric,
  uuid, uuid, uuid, text, text, text, text, text, date, date, text
);

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
  target_notes text default null,
  target_ncf_type_id uuid default null,
  target_ncf text default null,
  target_attachment_name text default null,
  target_attachment_path text default null
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
  normalized_ncf text := nullif(btrim(target_ncf), '');
  normalized_attachment_name text := nullif(btrim(target_attachment_name), '');
  normalized_attachment_path text := nullif(btrim(target_attachment_path), '');
  normalized_document_discount_total numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  resolved_customer_id uuid;
  resolved_lead_id uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email text;
  resolved_recipient_whatsapp text;
  resolved_recipient_phone text;
  resolved_ncf_type_id uuid;
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

  -- Validate ncf_type_id if provided
  if target_ncf_type_id is not null then
    perform 1 from public.ncf_types where id = target_ncf_type_id and is_active = true;
    if not found then
      raise exception 'NCF type not found or inactive';
    end if;
    resolved_ncf_type_id := target_ncf_type_id;
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
    ncf_type_id,
    ncf,
    attachment_name,
    attachment_path,
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
    resolved_ncf_type_id,
    normalized_ncf,
    normalized_attachment_name,
    normalized_attachment_path,
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

-- 9. Drop and recreate update_invoice with new parameters
drop function if exists public.update_invoice(
  uuid, uuid, text, text, text, text, jsonb, numeric,
  uuid, uuid, text, text, text, text, text, date, date, text
);

create or replace function public.update_invoice(
  target_tenant_id               uuid,
  target_invoice_id              uuid,
  target_title                   text,
  target_document_kind           text,
  target_currency_code           text,
  target_recipient_kind          text,
  target_line_items              jsonb,
  target_document_discount_total numeric default 0,
  target_customer_id             uuid    default null,
  target_lead_id                 uuid    default null,
  target_recipient_display_name  text    default null,
  target_recipient_contact_name  text    default null,
  target_recipient_email         text    default null,
  target_recipient_whatsapp      text    default null,
  target_recipient_phone         text    default null,
  target_issued_on               date    default null,
  target_due_on                  date    default null,
  target_notes                   text    default null,
  target_ncf_type_id             uuid    default null,
  target_ncf                     text    default null,
  target_attachment_name         text    default null,
  target_attachment_path         text    default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_status                  text;
  normalized_title                text    := nullif(btrim(target_title), '');
  normalized_currency             text    := upper(nullif(btrim(target_currency_code), ''));
  normalized_document_kind        text    := nullif(btrim(target_document_kind), '');
  normalized_recipient_kind       text    := nullif(btrim(target_recipient_kind), '');
  normalized_recipient_display_name text  := nullif(btrim(target_recipient_display_name), '');
  normalized_recipient_contact_name text  := nullif(btrim(target_recipient_contact_name), '');
  normalized_recipient_email      text    := nullif(btrim(target_recipient_email), '');
  normalized_recipient_whatsapp   text    := nullif(btrim(target_recipient_whatsapp), '');
  normalized_recipient_phone      text    := nullif(btrim(target_recipient_phone), '');
  normalized_notes                text    := nullif(btrim(target_notes), '');
  normalized_ncf                  text    := nullif(btrim(target_ncf), '');
  normalized_attachment_name      text    := nullif(btrim(target_attachment_name), '');
  normalized_attachment_path      text    := nullif(btrim(target_attachment_path), '');
  normalized_document_discount    numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  resolved_customer_id            uuid;
  resolved_lead_id                uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email        text;
  resolved_recipient_whatsapp     text;
  resolved_recipient_phone        text;
  resolved_ncf_type_id            uuid;
  computed_subtotal               numeric;
  computed_line_discount_total    numeric;
  computed_tax_total              numeric;
  computed_grand_total            numeric;
  computed_total_discount         numeric;
  discountable_subtotal           numeric;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'invoice.write') then
    raise exception 'You do not have permission to update invoices for this tenant';
  end if;

  select status into current_status
  from public.invoices
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  if current_status is null then
    raise exception 'Invoice not found';
  end if;

  if current_status not in ('draft', 'issued') then
    raise exception 'Only draft or issued invoices can be edited';
  end if;

  if normalized_title is null or length(normalized_title) < 2 then
    raise exception 'Invoice title is required';
  end if;

  if normalized_currency is null or length(normalized_currency) <> 3 then
    raise exception 'Currency code must have exactly 3 letters';
  end if;

  if normalized_document_kind is null or normalized_document_kind not in ('items', 'services') then
    raise exception 'Invoice document kind is invalid';
  end if;

  if normalized_document_discount < 0 then
    raise exception 'Document discount cannot be negative';
  end if;

  -- Validate ncf_type_id if provided
  if target_ncf_type_id is not null then
    perform 1 from public.ncf_types where id = target_ncf_type_id and is_active = true;
    if not found then
      raise exception 'NCF type not found or inactive';
    end if;
    resolved_ncf_type_id := target_ncf_type_id;
  end if;

  if normalized_recipient_kind = 'customer' then
    select
      c.id,
      c.display_name,
      c.contact_name,
      c.email,
      c.whatsapp,
      c.phone
    into
      resolved_customer_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.customers c
    where c.id = target_customer_id
      and c.tenant_id = target_tenant_id;

    if resolved_customer_id is null then
      raise exception 'Customer does not belong to the active tenant';
    end if;

  elsif normalized_recipient_kind = 'lead' then
    select
      l.id,
      l.display_name,
      l.contact_name,
      l.email,
      l.whatsapp,
      l.phone
    into
      resolved_lead_id,
      resolved_recipient_display_name,
      resolved_recipient_contact_name,
      resolved_recipient_email,
      resolved_recipient_whatsapp,
      resolved_recipient_phone
    from public.leads l
    where l.id = target_lead_id
      and l.tenant_id = target_tenant_id;

    if resolved_lead_id is null then
      raise exception 'Lead does not belong to the active tenant';
    end if;

  elsif normalized_recipient_kind = 'ad_hoc' then
    resolved_customer_id := null;
    resolved_lead_id     := null;
  else
    raise exception 'Invoice recipient kind is invalid';
  end if;

  resolved_recipient_display_name := coalesce(normalized_recipient_display_name, resolved_recipient_display_name);
  resolved_recipient_contact_name := coalesce(normalized_recipient_contact_name, resolved_recipient_contact_name);
  resolved_recipient_email        := coalesce(normalized_recipient_email,        resolved_recipient_email);
  resolved_recipient_whatsapp     := coalesce(normalized_recipient_whatsapp,     resolved_recipient_whatsapp);
  resolved_recipient_phone        := coalesce(normalized_recipient_phone,        resolved_recipient_phone);

  if resolved_recipient_display_name is null or length(resolved_recipient_display_name) < 2 then
    raise exception 'Recipient display name is required';
  end if;

  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_line_discount_total, computed_tax_total, computed_grand_total
  from public.replace_invoice_line_items(
    target_tenant_id,
    target_invoice_id,
    target_line_items,
    auth.uid()
  );

  discountable_subtotal := round((computed_subtotal - computed_line_discount_total)::numeric, 2);

  if normalized_document_discount > discountable_subtotal then
    raise exception 'Document discount cannot exceed invoice subtotal after line discounts';
  end if;

  computed_total_discount := round((computed_line_discount_total + normalized_document_discount)::numeric, 2);
  computed_grand_total    := round((computed_subtotal - computed_total_discount + computed_tax_total)::numeric, 2);

  update public.invoices
  set customer_id               = resolved_customer_id,
      lead_id                   = resolved_lead_id,
      recipient_kind            = normalized_recipient_kind,
      recipient_display_name    = resolved_recipient_display_name,
      recipient_contact_name    = resolved_recipient_contact_name,
      recipient_email           = resolved_recipient_email,
      recipient_whatsapp        = resolved_recipient_whatsapp,
      recipient_phone           = resolved_recipient_phone,
      title                     = normalized_title,
      document_kind             = normalized_document_kind,
      currency_code             = normalized_currency,
      issued_on                 = target_issued_on,
      due_on                    = target_due_on,
      notes                     = normalized_notes,
      ncf_type_id               = resolved_ncf_type_id,
      ncf                       = normalized_ncf,
      attachment_name           = normalized_attachment_name,
      attachment_path           = normalized_attachment_path,
      subtotal                  = computed_subtotal,
      discount_total            = computed_total_discount,
      tax_total                 = computed_tax_total,
      grand_total               = computed_grand_total,
      updated_at                = timezone('utc', now()),
      updated_by                = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  return target_invoice_id;
end;
$$;

-- Grants
revoke all on function public.can_manage_invoice_attachment_asset(text, text) from public;
revoke all on function public.can_read_invoice_attachment_asset(text, text) from public;
revoke all on function public.replace_invoice_line_items(uuid, uuid, jsonb, uuid) from public;
revoke all on function public.create_invoice(uuid, text, text, text, text, text, jsonb, numeric, uuid, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) from public;
revoke all on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) from public;

grant execute on function public.can_manage_invoice_attachment_asset(text, text) to authenticated;
grant execute on function public.can_read_invoice_attachment_asset(text, text) to authenticated;
grant execute on function public.replace_invoice_line_items(uuid, uuid, jsonb, uuid) to authenticated;
grant execute on function public.create_invoice(uuid, text, text, text, text, text, jsonb, numeric, uuid, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) to authenticated;
grant execute on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) to authenticated;
