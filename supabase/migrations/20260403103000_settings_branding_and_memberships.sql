alter table public.tenants
add column if not exists palette_id text not null default 'custom'
check (palette_id in ('slate', 'linen', 'mist', 'clay', 'dusk', 'custom'));

alter table public.tenants
add column if not exists palette_seed_colors jsonb not null default jsonb_build_object(
  'paper', '#f4f7f9',
  'primary', '#2d3e50',
  'secondary', '#ff7a00',
  'tertiary', '#4b637a'
);

alter table public.tenants
drop constraint if exists tenants_palette_seed_colors_shape_check;

alter table public.tenants
add constraint tenants_palette_seed_colors_shape_check
check (
  jsonb_typeof(palette_seed_colors) = 'object'
  and palette_seed_colors ? 'paper'
  and palette_seed_colors ? 'primary'
  and palette_seed_colors ? 'secondary'
  and palette_seed_colors ? 'tertiary'
);

create or replace function public.list_tenant_memberships_for_settings(
  target_tenant_id uuid
)
returns table (
  membership_id uuid,
  app_user_id uuid,
  email text,
  display_name text,
  status text,
  tenant_role_keys text[],
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if target_tenant_id is null then
    raise exception 'Tenant id is required';
  end if;

  if not (
    public.is_global_admin()
    or public.has_tenant_permission(target_tenant_id, 'membership.manage')
    or public.has_tenant_permission(target_tenant_id, 'tenant.update')
  ) then
    raise exception 'You do not have permission to read tenant memberships';
  end if;

  return query
  select
    tm.id as membership_id,
    au.id as app_user_id,
    au.email,
    au.display_name,
    tm.status,
    coalesce(
      (
        select array_agg(distinct tr.role_key order by tr.role_key)
        from public.tenant_membership_roles tmr
        join public.tenant_roles tr on tr.id = tmr.role_id
        where tmr.membership_id = tm.id
      ),
      '{}'::text[]
    ) as tenant_role_keys,
    tm.created_at,
    tm.updated_at
  from public.tenant_memberships tm
  join public.app_users au on au.id = tm.app_user_id
  where tm.tenant_id = target_tenant_id
  order by lower(coalesce(au.display_name, au.email)), tm.created_at;
end;
$$;

grant execute on function public.list_tenant_memberships_for_settings(uuid) to authenticated;
