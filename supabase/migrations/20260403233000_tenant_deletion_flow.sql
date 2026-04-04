insert into public.permissions (permission_key, scope, description)
values (
  'tenant.delete',
  'tenant',
  'Eliminar un tenant de forma permanente'
)
on conflict (permission_key) do update
set
  scope = excluded.scope,
  description = excluded.description;

insert into public.tenant_role_permissions (role_id, permission_id)
select
  tr.id,
  p.id
from public.tenant_roles tr
join public.permissions p on p.permission_key = 'tenant.delete'
where tr.role_key = 'tenant_owner'
on conflict (role_id, permission_id) do nothing;

create or replace function public.delete_tenant_for_shutdown(
  target_tenant_id uuid,
  target_actor_user_id uuid,
  delete_reason text default 'owner_requested'
)
returns table (
  id uuid,
  name text,
  slug text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_tenant public.tenants%rowtype;
begin
  if target_tenant_id is null then
    raise exception 'Tenant id is required';
  end if;

  if target_actor_user_id is null then
    raise exception 'Actor user id is required';
  end if;

  select *
  into target_tenant
  from public.tenants
  where public.tenants.id = target_tenant_id;

  if not found then
    raise exception 'Tenant not found';
  end if;

  insert into public.audit_logs (
    tenant_id,
    actor_user_id,
    entity_name,
    entity_id,
    action,
    source,
    summary,
    metadata,
    created_by,
    updated_by
  )
  values (
    null,
    target_actor_user_id,
    'tenants',
    target_tenant.id,
    'delete_soft',
    'edge_function',
    format('Permanent tenant deletion requested for %s', target_tenant.slug),
    jsonb_build_object(
      'tenant_id',
      target_tenant.id,
      'tenant_slug',
      target_tenant.slug,
      'tenant_name',
      target_tenant.name,
      'delete_reason',
      coalesce(nullif(btrim(delete_reason), ''), 'owner_requested')
    ),
    target_actor_user_id,
    target_actor_user_id
  );

  return query
  delete from public.tenants
  where public.tenants.id = target_tenant_id
  returning
    public.tenants.id,
    public.tenants.name,
    public.tenants.slug;

  if not found then
    raise exception 'Tenant not found';
  end if;
end;
$$;

revoke all on function public.delete_tenant_for_shutdown(uuid, uuid, text) from public;
revoke all on function public.delete_tenant_for_shutdown(uuid, uuid, text) from anon;
revoke all on function public.delete_tenant_for_shutdown(uuid, uuid, text) from authenticated;
grant execute on function public.delete_tenant_for_shutdown(uuid, uuid, text) to service_role;
