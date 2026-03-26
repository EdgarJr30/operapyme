create table if not exists public.quote_number_sequences (
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  quote_year integer not null check (quote_year >= 2020),
  last_value integer not null default 0 check (last_value >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  primary key (tenant_id, quote_year)
);

drop trigger if exists quote_number_sequences_touch_tracking_columns on public.quote_number_sequences;
create trigger quote_number_sequences_touch_tracking_columns
before insert or update on public.quote_number_sequences
for each row
execute function public.touch_tracking_columns();

alter table public.quote_number_sequences enable row level security;

create or replace function public.allocate_quote_number(target_tenant_id uuid)
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

  if not public.has_tenant_permission(target_tenant_id, 'quote.write') then
    raise exception 'You do not have permission to create quotes for this tenant';
  end if;

  insert into public.quote_number_sequences (
    tenant_id,
    quote_year,
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
  on conflict (tenant_id, quote_year)
  do update
  set last_value = public.quote_number_sequences.last_value + 1,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  returning last_value into next_value;

  return format('COT-%s-%s', target_year, lpad(next_value::text, 6, '0'));
end;
$$;

create or replace function public.create_quote(
  target_tenant_id uuid,
  target_customer_id uuid,
  target_title text,
  target_status text,
  target_currency_code text,
  target_subtotal numeric,
  target_discount_total numeric,
  target_tax_total numeric,
  target_valid_until date,
  target_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_quote_id uuid;
  generated_quote_number text;
  normalized_title text := nullif(btrim(target_title), '');
  normalized_currency text := upper(nullif(btrim(target_currency_code), ''));
  normalized_notes text := nullif(btrim(target_notes), '');
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

  if target_subtotal < 0 or target_discount_total < 0 or target_tax_total < 0 then
    raise exception 'Quote totals cannot be negative';
  end if;

  perform 1
  from public.customers
  where id = target_customer_id
    and tenant_id = target_tenant_id;

  if not found then
    raise exception 'Customer does not belong to the active tenant';
  end if;

  generated_quote_number := public.allocate_quote_number(target_tenant_id);

  insert into public.quotes (
    tenant_id,
    customer_id,
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
    target_tenant_id,
    target_customer_id,
    generated_quote_number,
    normalized_title,
    target_status,
    normalized_currency,
    round(target_subtotal::numeric, 2),
    round(target_discount_total::numeric, 2),
    round(target_tax_total::numeric, 2),
    round((target_subtotal - target_discount_total + target_tax_total)::numeric, 2),
    target_valid_until,
    normalized_notes,
    auth.uid(),
    auth.uid()
  )
  returning id into new_quote_id;

  return new_quote_id;
end;
$$;

create or replace function public.update_quote(
  target_tenant_id uuid,
  target_quote_id uuid,
  expected_version integer,
  target_customer_id uuid,
  target_title text,
  target_status text,
  target_currency_code text,
  target_subtotal numeric,
  target_discount_total numeric,
  target_tax_total numeric,
  target_valid_until date,
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
  normalized_notes text := nullif(btrim(target_notes), '');
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

  if target_subtotal < 0 or target_discount_total < 0 or target_tax_total < 0 then
    raise exception 'Quote totals cannot be negative';
  end if;

  perform 1
  from public.customers
  where id = target_customer_id
    and tenant_id = target_tenant_id;

  if not found then
    raise exception 'Customer does not belong to the active tenant';
  end if;

  update public.quotes
  set customer_id = target_customer_id,
      title = normalized_title,
      status = target_status,
      currency_code = normalized_currency,
      subtotal = round(target_subtotal::numeric, 2),
      discount_total = round(target_discount_total::numeric, 2),
      tax_total = round(target_tax_total::numeric, 2),
      grand_total = round((target_subtotal - target_discount_total + target_tax_total)::numeric, 2),
      valid_until = target_valid_until,
      notes = normalized_notes,
      version = public.quotes.version + 1,
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_quote_id
    and version = expected_version
  returning id into updated_quote_id;

  if updated_quote_id is null then
    perform 1
    from public.quotes
    where tenant_id = target_tenant_id
      and id = target_quote_id;

    if found then
      raise exception 'Quote version conflict. Refresh and try again.';
    end if;

    raise exception 'Quote not found for the active tenant';
  end if;

  return updated_quote_id;
end;
$$;

revoke all on function public.allocate_quote_number(uuid) from public;
revoke all on function public.create_quote(uuid, uuid, text, text, text, numeric, numeric, numeric, date, text) from public;
revoke all on function public.update_quote(uuid, uuid, integer, uuid, text, text, text, numeric, numeric, numeric, date, text) from public;

grant execute on function public.allocate_quote_number(uuid) to authenticated;
grant execute on function public.create_quote(uuid, uuid, text, text, text, numeric, numeric, numeric, date, text) to authenticated;
grant execute on function public.update_quote(uuid, uuid, integer, uuid, text, text, text, numeric, numeric, numeric, date, text) to authenticated;
