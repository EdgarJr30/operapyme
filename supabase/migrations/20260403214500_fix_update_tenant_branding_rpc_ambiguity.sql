create or replace function public.update_tenant_branding_settings(
  target_tenant_id uuid,
  next_name text,
  next_palette_id text,
  next_palette_seed_colors jsonb
)
returns table (
  id uuid,
  name text,
  slug text,
  status text,
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
    public.tenants.palette_id,
    public.tenants.palette_seed_colors,
    public.tenants.created_at,
    public.tenants.updated_at;

  if not found then
    raise exception 'Tenant not found';
  end if;
end;
$$;

grant execute on function public.update_tenant_branding_settings(uuid, text, text, jsonb) to authenticated;
