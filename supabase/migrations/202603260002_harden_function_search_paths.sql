create or replace function public.current_auth_user_id()
returns uuid
language sql
stable
set search_path = public, auth
as $$
  select auth.uid()
$$;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
set search_path = public, auth
as $$
  select auth.uid()
$$;

create or replace function public.touch_tracking_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := coalesce(new.created_at, timezone('utc', now()));
    new.updated_at := coalesce(new.updated_at, timezone('utc', now()));
    if new.created_by is null then
      new.created_by := public.current_app_user_id();
    end if;
    if new.updated_by is null then
      new.updated_by := public.current_app_user_id();
    end if;
  else
    new.updated_at := timezone('utc', now());
    new.updated_by := public.current_app_user_id();
  end if;
  return new;
end;
$$;

create or replace function public.is_global_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.app_user_platform_roles upr
    join public.platform_roles pr on pr.id = upr.role_id
    where upr.app_user_id = public.current_app_user_id()
      and pr.role_key = 'global_admin'
  )
$$;

create or replace function public.has_platform_permission(permission_key text)
returns boolean
language sql
stable
set search_path = public
as $$
  select
    public.is_global_admin()
    or exists (
      select 1
      from public.app_user_platform_roles upr
      join public.platform_role_permissions prp on prp.role_id = upr.role_id
      join public.permissions p on p.id = prp.permission_id
      where upr.app_user_id = public.current_app_user_id()
        and p.permission_key = permission_key
    )
$$;

create or replace function public.has_tenant_permission(target_tenant_id uuid, permission_key text)
returns boolean
language sql
stable
set search_path = public
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
        and tm.app_user_id = public.current_app_user_id()
        and tm.status = 'active'
        and p.permission_key = permission_key
    )
$$;

create or replace function public.current_platform_role_keys()
returns text[]
language sql
stable
set search_path = public
as $$
  select coalesce(
    array_agg(distinct pr.role_key order by pr.role_key),
    '{}'::text[]
  )
  from public.app_user_platform_roles upr
  join public.platform_roles pr on pr.id = upr.role_id
  where upr.app_user_id = public.current_app_user_id()
$$;

create or replace function public.current_tenant_role_keys(target_tenant_id uuid)
returns text[]
language sql
stable
set search_path = public
as $$
  select coalesce(
    array_agg(distinct tr.role_key order by tr.role_key),
    '{}'::text[]
  )
  from public.tenant_memberships tm
  join public.tenant_membership_roles tmr on tmr.membership_id = tm.id
  join public.tenant_roles tr on tr.id = tmr.role_id
  where tm.tenant_id = target_tenant_id
    and tm.app_user_id = public.current_app_user_id()
    and tm.status = 'active'
$$;

create or replace function public.current_tenant_permission_keys(target_tenant_id uuid)
returns text[]
language sql
stable
set search_path = public
as $$
  select coalesce(
    array_agg(distinct p.permission_key order by p.permission_key),
    '{}'::text[]
  )
  from public.tenant_memberships tm
  join public.tenant_membership_roles tmr on tmr.membership_id = tm.id
  join public.tenant_role_permissions trp on trp.role_id = tmr.role_id
  join public.permissions p on p.id = trp.permission_id
  where tm.tenant_id = target_tenant_id
    and tm.app_user_id = public.current_app_user_id()
    and tm.status = 'active'
$$;
