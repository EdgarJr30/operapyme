alter table public.customers
add column if not exists is_foreign boolean not null default false;

alter table public.customers
add column if not exists passport_id text;

alter table public.customers
add column if not exists website_url text;

alter table public.customers
add column if not exists attachment_name text;

alter table public.customers
add column if not exists attachment_path text;

with numbered_customers as (
  select
    id,
    tenant_id,
    row_number() over (
      partition by tenant_id
      order by created_at, id
    ) as customer_sequence
  from public.customers
)
update public.customers
set customer_code = 'C' || lpad(numbered_customers.customer_sequence::text, 5, '0')
from numbered_customers
where public.customers.id = numbered_customers.id;

alter table public.customers
alter column customer_code set not null;

create or replace function public.assign_customer_code()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_sequence integer;
begin
  if new.tenant_id is null then
    raise exception 'Tenant id is required to assign a customer code';
  end if;

  if tg_op = 'UPDATE' and new.customer_code is distinct from old.customer_code then
    raise exception 'Customer code is immutable';
  end if;

  if tg_op = 'INSERT' then
    perform pg_advisory_xact_lock(hashtextextended(new.tenant_id::text, 0));

    select coalesce(
      max(substring(customer_code from 2)::integer),
      0
    ) + 1
    into next_sequence
    from public.customers
    where tenant_id = new.tenant_id;

    new.customer_code := 'C' || lpad(next_sequence::text, 5, '0');
  end if;

  return new;
end;
$$;

drop trigger if exists customers_assign_customer_code on public.customers;
create trigger customers_assign_customer_code
before insert or update on public.customers
for each row
execute function public.assign_customer_code();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'customer-attachments',
  'customer-attachments',
  false,
  10485760,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_manage_customer_attachment_asset(
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

  if target_bucket_id <> 'customer-attachments' then
    return false;
  end if;

  tenant_folder := (storage.foldername(object_name))[1];

  if tenant_folder is null
     or tenant_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_tenant_id := tenant_folder::uuid;

  return public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'crm.write');
end;
$$;

create or replace function public.can_read_customer_attachment_asset(
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

  if target_bucket_id <> 'customer-attachments' then
    return false;
  end if;

  tenant_folder := (storage.foldername(object_name))[1];

  if tenant_folder is null
     or tenant_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_tenant_id := tenant_folder::uuid;

  return public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'crm.read')
    or public.has_tenant_permission(target_tenant_id, 'crm.write');
end;
$$;

drop policy if exists "customer_attachments_select" on storage.objects;
create policy "customer_attachments_select"
on storage.objects
for select
to authenticated
using (public.can_read_customer_attachment_asset(bucket_id, name));

drop policy if exists "customer_attachments_insert" on storage.objects;
create policy "customer_attachments_insert"
on storage.objects
for insert
to authenticated
with check (public.can_manage_customer_attachment_asset(bucket_id, name));

drop policy if exists "customer_attachments_update" on storage.objects;
create policy "customer_attachments_update"
on storage.objects
for update
to authenticated
using (public.can_manage_customer_attachment_asset(bucket_id, name))
with check (public.can_manage_customer_attachment_asset(bucket_id, name));

drop policy if exists "customer_attachments_delete" on storage.objects;
create policy "customer_attachments_delete"
on storage.objects
for delete
to authenticated
using (public.can_manage_customer_attachment_asset(bucket_id, name));

grant execute on function public.assign_customer_code() to authenticated;
grant execute on function public.can_manage_customer_attachment_asset(text, text) to authenticated;
grant execute on function public.can_read_customer_attachment_asset(text, text) to authenticated;
