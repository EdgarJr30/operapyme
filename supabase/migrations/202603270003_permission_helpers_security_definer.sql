create or replace function public.is_global_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.app_user_platform_roles upr
    join public.platform_roles pr on pr.id = upr.role_id
    where upr.app_user_id = auth.uid()
      and pr.role_key = 'global_admin'
  )
$$;

create or replace function public.has_platform_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    public.is_global_admin()
    or exists (
      select 1
      from public.app_user_platform_roles upr
      join public.platform_role_permissions prp on prp.role_id = upr.role_id
      join public.permissions p on p.id = prp.permission_id
      where upr.app_user_id = auth.uid()
        and p.permission_key = permission_key
    )
$$;

create or replace function public.has_tenant_permission(target_tenant_id uuid, permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    public.is_global_admin()
    or exists (
      select 1
      from public.tenant_memberships tm
      join public.tenant_membership_roles tmr on tmr.membership_id = tm.id
      join public.tenant_role_permissions trp on trp.role_id = tmr.role_id
      join public.permissions p on p.id = trp.permission_id
      where tm.tenant_id = target_tenant_id
        and tm.app_user_id = auth.uid()
        and tm.status = 'active'
        and p.permission_key = permission_key
    )
$$;
