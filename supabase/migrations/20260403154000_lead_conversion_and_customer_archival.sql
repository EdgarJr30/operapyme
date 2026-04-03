alter table public.leads
  add column if not exists converted_customer_id uuid references public.customers (id) on delete set null,
  add column if not exists converted_at timestamptz;

create index if not exists leads_converted_customer_id_idx
on public.leads (tenant_id, converted_customer_id)
where converted_customer_id is not null;

create or replace function public.convert_lead_to_customer(
  target_tenant_id uuid,
  target_lead_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  lead_row public.leads%rowtype;
  created_customer_id uuid;
  normalized_contact_name text;
  normalized_notes text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_tenant_permission(target_tenant_id, 'crm.write') then
    raise exception 'You do not have permission to convert leads for this tenant';
  end if;

  select *
  into lead_row
  from public.leads
  where tenant_id = target_tenant_id
    and id = target_lead_id
  for update;

  if lead_row.id is null then
    raise exception 'Lead not found';
  end if;

  if lead_row.converted_customer_id is not null or lead_row.converted_at is not null then
    raise exception 'Lead already converted';
  end if;

  if lead_row.status not in ('new', 'qualified', 'proposal') then
    raise exception 'Lead can no longer be converted';
  end if;

  normalized_contact_name := coalesce(nullif(btrim(lead_row.contact_name), ''), lead_row.display_name);
  normalized_notes := concat_ws(
    ' · ',
    nullif(btrim(lead_row.need_summary), ''),
    nullif(btrim(lead_row.notes), '')
  );

  insert into public.customers (
    tenant_id,
    display_name,
    contact_name,
    email,
    whatsapp,
    phone,
    source,
    status,
    notes,
    created_by,
    updated_by
  )
  values (
    lead_row.tenant_id,
    lead_row.display_name,
    normalized_contact_name,
    lead_row.email,
    lead_row.whatsapp,
    lead_row.phone,
    lead_row.source,
    'active',
    nullif(normalized_notes, ''),
    auth.uid(),
    auth.uid()
  )
  returning id into created_customer_id;

  update public.leads
  set status = 'won',
      converted_customer_id = created_customer_id,
      converted_at = timezone('utc', now()),
      updated_at = timezone('utc', now()),
      updated_by = auth.uid()
  where tenant_id = target_tenant_id
    and id = target_lead_id;

  return created_customer_id;
end;
$$;

revoke all on function public.convert_lead_to_customer(uuid, uuid) from public;
grant execute on function public.convert_lead_to_customer(uuid, uuid) to authenticated;
