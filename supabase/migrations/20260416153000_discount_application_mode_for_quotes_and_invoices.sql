alter table public.quotes
add column if not exists discount_application_mode text not null default 'before_tax';

alter table public.invoices
add column if not exists discount_application_mode text not null default 'before_tax';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quotes_discount_application_mode_check'
      and conrelid = 'public.quotes'::regclass
  ) then
    alter table public.quotes
    add constraint quotes_discount_application_mode_check
    check (discount_application_mode in ('before_tax', 'after_tax'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'invoices_discount_application_mode_check'
      and conrelid = 'public.invoices'::regclass
  ) then
    alter table public.invoices
    add constraint invoices_discount_application_mode_check
    check (discount_application_mode in ('before_tax', 'after_tax'));
  end if;
end
$$;

drop function if exists public.create_quote(
  uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text, text,
  text, text, date, date, text, text, text
);

drop function if exists public.update_quote(
  uuid, uuid, integer, text, text, text, text, jsonb, numeric, uuid, uuid,
  text, text, text, text, text, date, date, text, text, text
);

create or replace function public.create_quote(
  target_tenant_id uuid,
  target_title text,
  target_status text,
  target_currency_code text,
  target_recipient_kind text,
  target_line_items jsonb,
  target_document_discount_total numeric default 0,
  target_discount_application_mode text default 'before_tax',
  target_customer_id uuid default null,
  target_lead_id uuid default null,
  target_recipient_display_name text default null,
  target_recipient_contact_name text default null,
  target_recipient_email text default null,
  target_recipient_whatsapp text default null,
  target_recipient_phone text default null,
  target_issued_on date default null,
  target_valid_until date default null,
  target_attachment_name text default null,
  target_attachment_path text default null,
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
  normalized_attachment_name text := nullif(btrim(target_attachment_name), '');
  normalized_attachment_path text := nullif(btrim(target_attachment_path), '');
  normalized_notes text := nullif(btrim(target_notes), '');
  normalized_document_discount_total numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  normalized_discount_application_mode text := coalesce(
    nullif(btrim(target_discount_application_mode), ''),
    'before_tax'
  );
  resolved_customer_id uuid;
  resolved_lead_id uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email text;
  resolved_recipient_whatsapp text;
  resolved_recipient_phone text;
  normalized_issued_on date := coalesce(target_issued_on, timezone('utc', now())::date);
  computed_subtotal numeric;
  computed_line_discount_total numeric;
  computed_tax_total numeric;
  computed_grand_total numeric;
  computed_total_discount numeric;
  discountable_document_subtotal numeric;
  computed_raw_tax_total numeric;
  effective_taxable_base numeric;
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

  if normalized_document_discount_total < 0 then
    raise exception 'Document discount cannot be negative';
  end if;

  if normalized_discount_application_mode not in ('before_tax', 'after_tax') then
    raise exception 'Discount application mode is invalid';
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
    discount_application_mode,
    subtotal,
    discount_total,
    tax_total,
    grand_total,
    issued_on,
    valid_until,
    attachment_name,
    attachment_path,
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
    normalized_discount_application_mode,
    0,
    0,
    0,
    0,
    normalized_issued_on,
    target_valid_until,
    normalized_attachment_name,
    normalized_attachment_path,
    normalized_notes,
    auth.uid(),
    auth.uid()
  );

  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_line_discount_total, computed_raw_tax_total, computed_grand_total
  from public.replace_quote_line_items(
    target_tenant_id,
    new_quote_id,
    target_line_items,
    auth.uid()
  );

  discountable_document_subtotal := round(
    (computed_subtotal - computed_line_discount_total)::numeric,
    2
  );

  if normalized_document_discount_total > discountable_document_subtotal then
    raise exception 'Document discount cannot exceed quote subtotal after line discounts';
  end if;

  computed_total_discount := round(
    (computed_line_discount_total + normalized_document_discount_total)::numeric,
    2
  );

  if normalized_discount_application_mode = 'after_tax' then
    computed_tax_total := computed_raw_tax_total;
  else
    effective_taxable_base := greatest(
      0,
      round(
        (discountable_document_subtotal - normalized_document_discount_total)::numeric,
        2
      )
    );

    if discountable_document_subtotal <= 0 or computed_raw_tax_total <= 0 then
      computed_tax_total := computed_raw_tax_total;
    else
      computed_tax_total := round(
        (computed_raw_tax_total * effective_taxable_base / discountable_document_subtotal)::numeric,
        2
      );
    end if;
  end if;

  computed_grand_total := round(
    (computed_subtotal - computed_total_discount + computed_tax_total)::numeric,
    2
  );

  update public.quotes
  set subtotal = computed_subtotal,
      discount_application_mode = normalized_discount_application_mode,
      discount_total = computed_total_discount,
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
  target_document_discount_total numeric default 0,
  target_discount_application_mode text default 'before_tax',
  target_customer_id uuid default null,
  target_lead_id uuid default null,
  target_recipient_display_name text default null,
  target_recipient_contact_name text default null,
  target_recipient_email text default null,
  target_recipient_whatsapp text default null,
  target_recipient_phone text default null,
  target_issued_on date default null,
  target_valid_until date default null,
  target_attachment_name text default null,
  target_attachment_path text default null,
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
  normalized_attachment_name text := nullif(btrim(target_attachment_name), '');
  normalized_attachment_path text := nullif(btrim(target_attachment_path), '');
  normalized_notes text := nullif(btrim(target_notes), '');
  normalized_document_discount_total numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  normalized_discount_application_mode text := coalesce(
    nullif(btrim(target_discount_application_mode), ''),
    'before_tax'
  );
  resolved_customer_id uuid;
  resolved_lead_id uuid;
  resolved_recipient_display_name text;
  resolved_recipient_contact_name text;
  resolved_recipient_email text;
  resolved_recipient_whatsapp text;
  resolved_recipient_phone text;
  normalized_issued_on date := coalesce(target_issued_on, timezone('utc', now())::date);
  computed_subtotal numeric;
  computed_line_discount_total numeric;
  computed_tax_total numeric;
  computed_grand_total numeric;
  computed_total_discount numeric;
  discountable_document_subtotal numeric;
  computed_raw_tax_total numeric;
  effective_taxable_base numeric;
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

  if normalized_document_discount_total < 0 then
    raise exception 'Document discount cannot be negative';
  end if;

  if normalized_discount_application_mode not in ('before_tax', 'after_tax') then
    raise exception 'Discount application mode is invalid';
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
  into computed_subtotal, computed_line_discount_total, computed_raw_tax_total, computed_grand_total
  from public.replace_quote_line_items(
    target_tenant_id,
    target_quote_id,
    target_line_items,
    auth.uid()
  );

  discountable_document_subtotal := round(
    (computed_subtotal - computed_line_discount_total)::numeric,
    2
  );

  if normalized_document_discount_total > discountable_document_subtotal then
    raise exception 'Document discount cannot exceed quote subtotal after line discounts';
  end if;

  computed_total_discount := round(
    (computed_line_discount_total + normalized_document_discount_total)::numeric,
    2
  );

  if normalized_discount_application_mode = 'after_tax' then
    computed_tax_total := computed_raw_tax_total;
  else
    effective_taxable_base := greatest(
      0,
      round(
        (discountable_document_subtotal - normalized_document_discount_total)::numeric,
        2
      )
    );

    if discountable_document_subtotal <= 0 or computed_raw_tax_total <= 0 then
      computed_tax_total := computed_raw_tax_total;
    else
      computed_tax_total := round(
        (computed_raw_tax_total * effective_taxable_base / discountable_document_subtotal)::numeric,
        2
      );
    end if;
  end if;

  computed_grand_total := round(
    (computed_subtotal - computed_total_discount + computed_tax_total)::numeric,
    2
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
      discount_application_mode = normalized_discount_application_mode,
      subtotal = computed_subtotal,
      discount_total = computed_total_discount,
      tax_total = computed_tax_total,
      grand_total = computed_grand_total,
      issued_on = normalized_issued_on,
      valid_until = target_valid_until,
      attachment_name = normalized_attachment_name,
      attachment_path = normalized_attachment_path,
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

drop function if exists public.create_invoice(
  uuid, text, text, text, text, text, jsonb, numeric, uuid, uuid, uuid, text,
  text, text, text, text, date, date, text, uuid, text, text, text
);

drop function if exists public.update_invoice(
  uuid, uuid, text, text, text, text, jsonb, numeric, uuid, uuid, text, text,
  text, text, text, date, date, text, uuid, text, text, text
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
  target_discount_application_mode text default 'before_tax',
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
  normalized_discount_application_mode text := coalesce(
    nullif(btrim(target_discount_application_mode), ''),
    'before_tax'
  );
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
  computed_raw_tax_total numeric;
  effective_taxable_base numeric;
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

  if normalized_discount_application_mode not in ('before_tax', 'after_tax') then
    raise exception 'Discount application mode is invalid';
  end if;

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
    discount_application_mode,
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
    normalized_discount_application_mode,
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
  into computed_subtotal, computed_line_discount_total, computed_raw_tax_total, computed_grand_total
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

  if normalized_discount_application_mode = 'after_tax' then
    computed_tax_total := computed_raw_tax_total;
  else
    effective_taxable_base := greatest(
      0,
      round(
        (discountable_document_subtotal - normalized_document_discount_total)::numeric,
        2
      )
    );

    if discountable_document_subtotal <= 0 or computed_raw_tax_total <= 0 then
      computed_tax_total := computed_raw_tax_total;
    else
      computed_tax_total := round(
        (computed_raw_tax_total * effective_taxable_base / discountable_document_subtotal)::numeric,
        2
      );
    end if;
  end if;

  computed_grand_total := round(
    (computed_subtotal - computed_total_discount + computed_tax_total)::numeric,
    2
  );

  update public.invoices
  set subtotal = computed_subtotal,
      discount_application_mode = normalized_discount_application_mode,
      discount_total = computed_total_discount,
      tax_total = computed_tax_total,
      grand_total = computed_grand_total
  where id = new_invoice_id
    and tenant_id = target_tenant_id;

  return new_invoice_id;
end;
$$;

create or replace function public.update_invoice(
  target_tenant_id uuid,
  target_invoice_id uuid,
  target_title text,
  target_document_kind text,
  target_currency_code text,
  target_recipient_kind text,
  target_line_items jsonb,
  target_document_discount_total numeric default 0,
  target_discount_application_mode text default 'before_tax',
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
  current_status text;
  normalized_title text := nullif(btrim(target_title), '');
  normalized_currency text := upper(nullif(btrim(target_currency_code), ''));
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
  normalized_document_discount numeric := round(coalesce(target_document_discount_total, 0)::numeric, 2);
  normalized_discount_application_mode text := coalesce(
    nullif(btrim(target_discount_application_mode), ''),
    'before_tax'
  );
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
  discountable_subtotal numeric;
  computed_raw_tax_total numeric;
  effective_taxable_base numeric;
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

  if normalized_discount_application_mode not in ('before_tax', 'after_tax') then
    raise exception 'Discount application mode is invalid';
  end if;

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
    resolved_lead_id := null;
  else
    raise exception 'Invoice recipient kind is invalid';
  end if;

  resolved_recipient_display_name := coalesce(normalized_recipient_display_name, resolved_recipient_display_name);
  resolved_recipient_contact_name := coalesce(normalized_recipient_contact_name, resolved_recipient_contact_name);
  resolved_recipient_email := coalesce(normalized_recipient_email, resolved_recipient_email);
  resolved_recipient_whatsapp := coalesce(normalized_recipient_whatsapp, resolved_recipient_whatsapp);
  resolved_recipient_phone := coalesce(normalized_recipient_phone, resolved_recipient_phone);

  if resolved_recipient_display_name is null or length(resolved_recipient_display_name) < 2 then
    raise exception 'Recipient display name is required';
  end if;

  select subtotal, discount_total, tax_total, grand_total
  into computed_subtotal, computed_line_discount_total, computed_raw_tax_total, computed_grand_total
  from public.replace_invoice_line_items(
    target_tenant_id,
    target_invoice_id,
    target_line_items,
    auth.uid()
  );

  discountable_subtotal := round(
    (computed_subtotal - computed_line_discount_total)::numeric,
    2
  );

  if normalized_document_discount > discountable_subtotal then
    raise exception 'Document discount cannot exceed invoice subtotal after line discounts';
  end if;

  computed_total_discount := round(
    (computed_line_discount_total + normalized_document_discount)::numeric,
    2
  );

  if normalized_discount_application_mode = 'after_tax' then
    computed_tax_total := computed_raw_tax_total;
  else
    effective_taxable_base := greatest(
      0,
      round(
        (discountable_subtotal - normalized_document_discount)::numeric,
        2
      )
    );

    if discountable_subtotal <= 0 or computed_raw_tax_total <= 0 then
      computed_tax_total := computed_raw_tax_total;
    else
      computed_tax_total := round(
        (computed_raw_tax_total * effective_taxable_base / discountable_subtotal)::numeric,
        2
      );
    end if;
  end if;

  computed_grand_total := round(
    (computed_subtotal - computed_total_discount + computed_tax_total)::numeric,
    2
  );

  update public.invoices
  set customer_id = resolved_customer_id,
      lead_id = resolved_lead_id,
      recipient_kind = normalized_recipient_kind,
      recipient_display_name = resolved_recipient_display_name,
      recipient_contact_name = resolved_recipient_contact_name,
      recipient_email = resolved_recipient_email,
      recipient_whatsapp = resolved_recipient_whatsapp,
      recipient_phone = resolved_recipient_phone,
      title = normalized_title,
      document_kind = normalized_document_kind,
      currency_code = normalized_currency,
      issued_on = target_issued_on,
      due_on = target_due_on,
      notes = normalized_notes,
      ncf_type_id = resolved_ncf_type_id,
      ncf = normalized_ncf,
      attachment_name = normalized_attachment_name,
      attachment_path = normalized_attachment_path,
      discount_application_mode = normalized_discount_application_mode,
      subtotal = computed_subtotal,
      discount_total = computed_total_discount,
      tax_total = computed_tax_total,
      grand_total = computed_grand_total,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_invoice_id;

  return target_invoice_id;
end;
$$;

revoke all on function public.create_quote(uuid, text, text, text, text, jsonb, numeric, text, uuid, uuid, text, text, text, text, text, date, date, text, text, text) from public;
revoke all on function public.update_quote(uuid, uuid, integer, text, text, text, text, jsonb, numeric, text, uuid, uuid, text, text, text, text, text, date, date, text, text, text) from public;
revoke all on function public.create_invoice(uuid, text, text, text, text, text, jsonb, numeric, text, uuid, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) from public;
revoke all on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, text, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) from public;

grant execute on function public.create_quote(uuid, text, text, text, text, jsonb, numeric, text, uuid, uuid, text, text, text, text, text, date, date, text, text, text) to authenticated;
grant execute on function public.update_quote(uuid, uuid, integer, text, text, text, text, jsonb, numeric, text, uuid, uuid, text, text, text, text, text, date, date, text, text, text) to authenticated;
grant execute on function public.create_invoice(uuid, text, text, text, text, text, jsonb, numeric, text, uuid, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) to authenticated;
grant execute on function public.update_invoice(uuid, uuid, text, text, text, text, jsonb, numeric, text, uuid, uuid, text, text, text, text, text, date, date, text, uuid, text, text, text) to authenticated;
