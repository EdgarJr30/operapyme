drop function if exists public.create_quote(
  uuid,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
);

drop function if exists public.update_quote(
  uuid,
  uuid,
  integer,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
);

create or replace function public.create_quote(
  target_tenant_id uuid,
  target_title text,
  target_status text,
  target_currency_code text,
  target_recipient_kind text,
  target_line_items jsonb,
  target_document_discount_total numeric default 0,
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
  into computed_subtotal, computed_line_discount_total, computed_tax_total, computed_grand_total
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
  computed_grand_total := round(
    (computed_subtotal - computed_total_discount + computed_tax_total)::numeric,
    2
  );

  update public.quotes
  set subtotal = computed_subtotal,
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
  into computed_subtotal, computed_line_discount_total, computed_tax_total, computed_grand_total
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
      subtotal = computed_subtotal,
      discount_total = computed_total_discount,
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

revoke all on function public.create_quote(
  uuid,
  text,
  text,
  text,
  text,
  jsonb,
  numeric,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
) from public;

revoke all on function public.update_quote(
  uuid,
  uuid,
  integer,
  text,
  text,
  text,
  text,
  jsonb,
  numeric,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
) from public;

grant execute on function public.create_quote(
  uuid,
  text,
  text,
  text,
  text,
  jsonb,
  numeric,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
) to authenticated;

grant execute on function public.update_quote(
  uuid,
  uuid,
  integer,
  text,
  text,
  text,
  text,
  jsonb,
  numeric,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  date,
  text
) to authenticated;
