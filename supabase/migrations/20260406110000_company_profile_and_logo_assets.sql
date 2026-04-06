alter table public.tenants
add column if not exists address text;

alter table public.tenants
add column if not exists phone text;

alter table public.tenants
add column if not exists rnc text;

alter table public.tenants
add column if not exists logo_path text;

alter table public.tenants
drop constraint if exists tenants_rnc_format_check;

alter table public.tenants
add constraint tenants_rnc_format_check
check (
  rnc is null
  or btrim(rnc) = ''
  or btrim(rnc) ~ '^[0-9-]{9,11}$'
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tenant-assets',
  'tenant-assets',
  false,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_manage_tenant_logo_asset(
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

  if target_bucket_id <> 'tenant-assets' then
    return false;
  end if;

  tenant_folder := (storage.foldername(object_name))[1];

  if tenant_folder is null
     or tenant_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_tenant_id := tenant_folder::uuid;

  return public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'tenant.update');
end;
$$;

create or replace function public.can_read_tenant_logo_asset(
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

  if target_bucket_id <> 'tenant-assets' then
    return false;
  end if;

  tenant_folder := (storage.foldername(object_name))[1];

  if tenant_folder is null
     or tenant_folder !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return false;
  end if;

  target_tenant_id := tenant_folder::uuid;

  return public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'tenant.read')
    or public.has_tenant_permission(target_tenant_id, 'tenant.update');
end;
$$;

drop policy if exists "tenant_assets_select" on storage.objects;
create policy "tenant_assets_select"
on storage.objects
for select
to authenticated
using (public.can_read_tenant_logo_asset(bucket_id, name));

drop policy if exists "tenant_assets_insert" on storage.objects;
create policy "tenant_assets_insert"
on storage.objects
for insert
to authenticated
with check (public.can_manage_tenant_logo_asset(bucket_id, name));

drop policy if exists "tenant_assets_update" on storage.objects;
create policy "tenant_assets_update"
on storage.objects
for update
to authenticated
using (public.can_manage_tenant_logo_asset(bucket_id, name))
with check (public.can_manage_tenant_logo_asset(bucket_id, name));

drop policy if exists "tenant_assets_delete" on storage.objects;
create policy "tenant_assets_delete"
on storage.objects
for delete
to authenticated
using (public.can_manage_tenant_logo_asset(bucket_id, name));

create or replace function public.update_tenant_branding_settings(
  target_tenant_id uuid,
  next_name text,
  next_palette_id text,
  next_palette_seed_colors jsonb,
  next_address text default '__KEEP__',
  next_phone text default '__KEEP__',
  next_rnc text default '__KEEP__',
  next_logo_path text default '__KEEP__'
)
returns table (
  id uuid,
  name text,
  slug text,
  status text,
  address text,
  phone text,
  rnc text,
  logo_path text,
  palette_id text,
  palette_seed_colors jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text;
  keep_address boolean := next_address = '__KEEP__';
  keep_phone boolean := next_phone = '__KEEP__';
  keep_rnc boolean := next_rnc = '__KEEP__';
  keep_logo_path boolean := next_logo_path = '__KEEP__';
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if target_tenant_id is null then
    raise exception 'Tenant id is required';
  end if;

  normalized_name := btrim(coalesce(next_name, ''));

  if normalized_name = '' then
    raise exception 'Tenant name is required';
  end if;

  if not (
    public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'tenant.update')
  ) then
    raise exception 'You do not have permission to update this tenant';
  end if;

  return query
  update public.tenants
  set
    name = normalized_name,
    address = case
      when keep_address then public.tenants.address
      else nullif(btrim(coalesce(next_address, '')), '')
    end,
    phone = case
      when keep_phone then public.tenants.phone
      else nullif(btrim(coalesce(next_phone, '')), '')
    end,
    rnc = case
      when keep_rnc then public.tenants.rnc
      else nullif(btrim(coalesce(next_rnc, '')), '')
    end,
    logo_path = case
      when keep_logo_path then public.tenants.logo_path
      else nullif(btrim(coalesce(next_logo_path, '')), '')
    end,
    palette_id = coalesce(next_palette_id, public.tenants.palette_id),
    palette_seed_colors = coalesce(
      next_palette_seed_colors,
      public.tenants.palette_seed_colors
    )
  where public.tenants.id = target_tenant_id
  returning
    public.tenants.id,
    public.tenants.name,
    public.tenants.slug,
    public.tenants.status,
    public.tenants.address,
    public.tenants.phone,
    public.tenants.rnc,
    public.tenants.logo_path,
    public.tenants.palette_id,
    public.tenants.palette_seed_colors,
    public.tenants.created_at,
    public.tenants.updated_at;

  if not found then
    raise exception 'Tenant not found';
  end if;
end;
$$;

grant execute on function public.can_manage_tenant_logo_asset(text, text) to authenticated;
grant execute on function public.can_read_tenant_logo_asset(text, text) to authenticated;
grant execute on function public.update_tenant_branding_settings(uuid, text, text, jsonb, text, text, text, text) to authenticated;
