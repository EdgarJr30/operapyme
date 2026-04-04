create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_tenant_id uuid;
  target_entity_id uuid;
  audit_action text;
  audit_log_id uuid;
  previous_value jsonb;
  next_value jsonb;
  audit_metadata jsonb;
begin
  previous_value := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  next_value := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;
  target_tenant_id := nullif(
    coalesce(
      next_value ->> 'tenant_id',
      previous_value ->> 'tenant_id'
    ),
    ''
  )::uuid;
  target_entity_id := nullif(
    coalesce(
      next_value ->> 'id',
      previous_value ->> 'id'
    ),
    ''
  )::uuid;
  audit_action := case
    when tg_op = 'INSERT' then 'create'
    when tg_op = 'UPDATE' then 'update'
    when tg_op = 'DELETE' then 'delete_soft'
    else lower(tg_op)
  end;
  audit_metadata := jsonb_build_object(
    'table_name',
    tg_table_name,
    'operation',
    tg_op
  );

  if target_tenant_id is not null
    and not exists (
      select 1
      from public.tenants
      where public.tenants.id = target_tenant_id
    ) then
    audit_metadata := audit_metadata || jsonb_build_object(
      'deleted_tenant_id',
      target_tenant_id
    );
    target_tenant_id := null;
  end if;

  insert into public.audit_logs (
    tenant_id,
    actor_user_id,
    entity_name,
    entity_id,
    action,
    source,
    summary,
    metadata
  )
  values (
    target_tenant_id,
    public.current_app_user_id(),
    tg_table_name,
    target_entity_id,
    audit_action,
    'database',
    format('%s on %s', audit_action, tg_table_name),
    audit_metadata
  )
  returning id into audit_log_id;

  insert into public.audit_row_changes (
    audit_log_id,
    tenant_id,
    table_name,
    row_id,
    before_value,
    after_value
  )
  values (
    audit_log_id,
    target_tenant_id,
    tg_table_name,
    target_entity_id,
    previous_value,
    next_value
  );

  return coalesce(new, old);
end;
$$;
