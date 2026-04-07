alter table public.tenants
add column if not exists cedula text;

alter table public.tenants
drop constraint if exists tenants_cedula_format_check;

alter table public.tenants
add constraint tenants_cedula_format_check
check (
  cedula is null
  or btrim(cedula) = ''
  or btrim(cedula) ~ '^\d{3}-\d{7}-\d$'
  or btrim(cedula) ~ '^\d{11}$'
);

create or replace function public.update_tenant_branding_settings(
  target_tenant_id uuid,
  next_name text,
  next_palette_id text,
  next_palette_seed_colors jsonb,
  next_address text default '__KEEP__',
  next_phone text default '__KEEP__',
  next_rnc text default '__KEEP__',
  next_cedula text default '__KEEP__',
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
  cedula text,
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
  keep_cedula boolean := next_cedula = '__KEEP__';
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
    cedula = case
      when keep_cedula then public.tenants.cedula
      else nullif(btrim(coalesce(next_cedula, '')), '')
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
    public.tenants.cedula,
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

revoke execute on function public.update_tenant_branding_settings(uuid, text, text, jsonb, text, text, text, text) from authenticated;
grant execute on function public.update_tenant_branding_settings(uuid, text, text, jsonb, text, text, text, text, text) to authenticated;
