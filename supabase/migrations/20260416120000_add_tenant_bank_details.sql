alter table public.tenants
add column if not exists bank text;

alter table public.tenants
add column if not exists bank_account text;

drop function if exists public.update_tenant_branding_settings(uuid, text, text, jsonb, text, text, text, text, text, text, text, text);

create or replace function public.update_tenant_branding_settings(
  target_tenant_id uuid,
  next_name text,
  next_palette_id text,
  next_palette_seed_colors jsonb,
  next_address text default '__KEEP__',
  next_website_url text default '__KEEP__',
  next_email text default '__KEEP__',
  next_phone text default '__KEEP__',
  next_secondary_phone text default '__KEEP__',
  next_rnc text default '__KEEP__',
  next_cedula text default '__KEEP__',
  next_bank text default '__KEEP__',
  next_bank_account text default '__KEEP__',
  next_logo_path text default '__KEEP__'
)
returns table (
  id uuid,
  name text,
  slug text,
  status text,
  address text,
  website_url text,
  email text,
  phone text,
  secondary_phone text,
  rnc text,
  cedula text,
  bank text,
  bank_account text,
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
  keep_website_url boolean := next_website_url = '__KEEP__';
  keep_email boolean := next_email = '__KEEP__';
  keep_phone boolean := next_phone = '__KEEP__';
  keep_secondary_phone boolean := next_secondary_phone = '__KEEP__';
  keep_rnc boolean := next_rnc = '__KEEP__';
  keep_cedula boolean := next_cedula = '__KEEP__';
  keep_bank boolean := next_bank = '__KEEP__';
  keep_bank_account boolean := next_bank_account = '__KEEP__';
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
    website_url = case
      when keep_website_url then public.tenants.website_url
      else nullif(btrim(coalesce(next_website_url, '')), '')
    end,
    email = case
      when keep_email then public.tenants.email
      else nullif(btrim(coalesce(next_email, '')), '')
    end,
    phone = case
      when keep_phone then public.tenants.phone
      else nullif(btrim(coalesce(next_phone, '')), '')
    end,
    secondary_phone = case
      when keep_secondary_phone then public.tenants.secondary_phone
      else nullif(btrim(coalesce(next_secondary_phone, '')), '')
    end,
    rnc = case
      when keep_rnc then public.tenants.rnc
      else nullif(btrim(coalesce(next_rnc, '')), '')
    end,
    cedula = case
      when keep_cedula then public.tenants.cedula
      else nullif(btrim(coalesce(next_cedula, '')), '')
    end,
    bank = case
      when keep_bank then public.tenants.bank
      else nullif(btrim(coalesce(next_bank, '')), '')
    end,
    bank_account = case
      when keep_bank_account then public.tenants.bank_account
      else nullif(btrim(coalesce(next_bank_account, '')), '')
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
    public.tenants.website_url,
    public.tenants.email,
    public.tenants.phone,
    public.tenants.secondary_phone,
    public.tenants.rnc,
    public.tenants.cedula,
    public.tenants.bank,
    public.tenants.bank_account,
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

grant execute on function public.update_tenant_branding_settings(uuid, text, text, jsonb, text, text, text, text, text, text, text, text, text, text) to authenticated;
