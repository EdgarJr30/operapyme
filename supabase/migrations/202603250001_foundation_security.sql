create extension if not exists pgcrypto;

create or replace function public.current_auth_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid()
$$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.app_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  is_platform_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  permission_key text not null unique,
  scope text not null check (scope in ('platform', 'tenant')),
  description text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.platform_roles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  role_name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.platform_role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.platform_roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (role_id, permission_id)
);

create table if not exists public.app_user_platform_roles (
  id uuid primary key default gen_random_uuid(),
  app_user_id uuid not null references public.app_users (id) on delete cascade,
  role_id uuid not null references public.platform_roles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (app_user_id, role_id)
);

create table if not exists public.tenant_roles (
  id uuid primary key default gen_random_uuid(),
  role_key text not null unique,
  role_name text not null,
  is_system boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.tenant_role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references public.tenant_roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (role_id, permission_id)
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  app_user_id uuid not null references public.app_users (id) on delete cascade,
  status text not null default 'active' check (status in ('invited', 'active', 'suspended')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (tenant_id, app_user_id)
);

create table if not exists public.tenant_membership_roles (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.tenant_memberships (id) on delete cascade,
  role_id uuid not null references public.tenant_roles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (membership_id, role_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete cascade,
  actor_user_id uuid references public.app_users (id) on delete set null,
  entity_name text not null,
  entity_id uuid,
  action text not null,
  source text not null default 'database',
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.audit_row_changes (
  id uuid primary key default gen_random_uuid(),
  audit_log_id uuid not null references public.audit_logs (id) on delete cascade,
  tenant_id uuid references public.tenants (id) on delete cascade,
  table_name text not null,
  row_id uuid,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.app_error_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete cascade,
  actor_user_id uuid references public.app_users (id) on delete set null,
  source text not null,
  severity text not null check (severity in ('info', 'warning', 'error', 'critical')),
  error_code text,
  message text not null,
  status text not null default 'open' check (status in ('open', 'triaged', 'fixed')),
  metadata jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  resolved_by uuid references public.app_users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create table if not exists public.auth_event_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete cascade,
  actor_user_id uuid references public.app_users (id) on delete set null,
  event_type text not null,
  target_email text,
  ip_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid
);

create or replace function public.touch_tracking_columns()
returns trigger
language plpgsql
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

create or replace function public.sync_app_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.app_users (id, email, display_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    timezone('utc', now()),
    timezone('utc', now())
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.app_users.display_name),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.is_global_admin()
returns boolean
language sql
stable
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
    jsonb_build_object('table_name', tg_table_name, 'operation', tg_op)
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row
execute function public.sync_app_user_from_auth();

drop trigger if exists tenants_touch_tracking_columns on public.tenants;
create trigger tenants_touch_tracking_columns
before insert or update on public.tenants
for each row
execute function public.touch_tracking_columns();

drop trigger if exists permissions_touch_tracking_columns on public.permissions;
create trigger permissions_touch_tracking_columns
before insert or update on public.permissions
for each row
execute function public.touch_tracking_columns();

drop trigger if exists platform_roles_touch_tracking_columns on public.platform_roles;
create trigger platform_roles_touch_tracking_columns
before insert or update on public.platform_roles
for each row
execute function public.touch_tracking_columns();

drop trigger if exists platform_role_permissions_touch_tracking_columns on public.platform_role_permissions;
create trigger platform_role_permissions_touch_tracking_columns
before insert or update on public.platform_role_permissions
for each row
execute function public.touch_tracking_columns();

drop trigger if exists app_user_platform_roles_touch_tracking_columns on public.app_user_platform_roles;
create trigger app_user_platform_roles_touch_tracking_columns
before insert or update on public.app_user_platform_roles
for each row
execute function public.touch_tracking_columns();

drop trigger if exists tenant_roles_touch_tracking_columns on public.tenant_roles;
create trigger tenant_roles_touch_tracking_columns
before insert or update on public.tenant_roles
for each row
execute function public.touch_tracking_columns();

drop trigger if exists tenant_role_permissions_touch_tracking_columns on public.tenant_role_permissions;
create trigger tenant_role_permissions_touch_tracking_columns
before insert or update on public.tenant_role_permissions
for each row
execute function public.touch_tracking_columns();

drop trigger if exists tenant_memberships_touch_tracking_columns on public.tenant_memberships;
create trigger tenant_memberships_touch_tracking_columns
before insert or update on public.tenant_memberships
for each row
execute function public.touch_tracking_columns();

drop trigger if exists tenant_membership_roles_touch_tracking_columns on public.tenant_membership_roles;
create trigger tenant_membership_roles_touch_tracking_columns
before insert or update on public.tenant_membership_roles
for each row
execute function public.touch_tracking_columns();

drop trigger if exists audit_logs_touch_tracking_columns on public.audit_logs;
create trigger audit_logs_touch_tracking_columns
before insert or update on public.audit_logs
for each row
execute function public.touch_tracking_columns();

drop trigger if exists audit_row_changes_touch_tracking_columns on public.audit_row_changes;
create trigger audit_row_changes_touch_tracking_columns
before insert or update on public.audit_row_changes
for each row
execute function public.touch_tracking_columns();

drop trigger if exists app_error_logs_touch_tracking_columns on public.app_error_logs;
create trigger app_error_logs_touch_tracking_columns
before insert or update on public.app_error_logs
for each row
execute function public.touch_tracking_columns();

drop trigger if exists auth_event_logs_touch_tracking_columns on public.auth_event_logs;
create trigger auth_event_logs_touch_tracking_columns
before insert or update on public.auth_event_logs
for each row
execute function public.touch_tracking_columns();

drop trigger if exists tenants_write_audit_log on public.tenants;
create trigger tenants_write_audit_log
after insert or update or delete on public.tenants
for each row
execute function public.write_audit_log();

drop trigger if exists tenant_memberships_write_audit_log on public.tenant_memberships;
create trigger tenant_memberships_write_audit_log
after insert or update or delete on public.tenant_memberships
for each row
execute function public.write_audit_log();

drop trigger if exists tenant_membership_roles_write_audit_log on public.tenant_membership_roles;
create trigger tenant_membership_roles_write_audit_log
after insert or update or delete on public.tenant_membership_roles
for each row
execute function public.write_audit_log();

alter table public.tenants enable row level security;
alter table public.app_users enable row level security;
alter table public.permissions enable row level security;
alter table public.platform_roles enable row level security;
alter table public.platform_role_permissions enable row level security;
alter table public.app_user_platform_roles enable row level security;
alter table public.tenant_roles enable row level security;
alter table public.tenant_role_permissions enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.tenant_membership_roles enable row level security;
alter table public.audit_logs enable row level security;
alter table public.audit_row_changes enable row level security;
alter table public.app_error_logs enable row level security;
alter table public.auth_event_logs enable row level security;

create policy "app_users_select_self_or_global_admin"
on public.app_users
for select
using (id = public.current_app_user_id() or public.is_global_admin());

create policy "app_users_update_self_or_global_admin"
on public.app_users
for update
using (id = public.current_app_user_id() or public.is_global_admin())
with check (id = public.current_app_user_id() or public.is_global_admin());

create policy "tenants_select_members_or_global_admin"
on public.tenants
for select
using (
  public.is_global_admin()
  or exists (
    select 1
    from public.tenant_memberships tm
    where tm.tenant_id = public.tenants.id
      and tm.app_user_id = public.current_app_user_id()
      and tm.status = 'active'
  )
);

create policy "tenants_update_admins"
on public.tenants
for update
using (
  public.has_platform_permission('tenant.manage.global')
  or public.has_tenant_permission(public.tenants.id, 'tenant.update')
)
with check (
  public.has_platform_permission('tenant.manage.global')
  or public.has_tenant_permission(public.tenants.id, 'tenant.update')
);

create policy "tenant_memberships_select_self_or_global_admin"
on public.tenant_memberships
for select
using (
  app_user_id = public.current_app_user_id()
  or public.is_global_admin()
);

create policy "tenant_membership_roles_select_self_or_global_admin"
on public.tenant_membership_roles
for select
using (
  public.is_global_admin()
  or exists (
    select 1
    from public.tenant_memberships tm
    where tm.id = public.tenant_membership_roles.membership_id
      and tm.app_user_id = public.current_app_user_id()
  )
);

create policy "permissions_select_global_admin"
on public.permissions
for select
using (public.is_global_admin());

create policy "platform_roles_select_global_admin"
on public.platform_roles
for select
using (public.is_global_admin());

create policy "platform_role_permissions_select_global_admin"
on public.platform_role_permissions
for select
using (public.is_global_admin());

create policy "app_user_platform_roles_select_global_admin"
on public.app_user_platform_roles
for select
using (public.is_global_admin());

create policy "tenant_roles_select_global_or_tenant_admin"
on public.tenant_roles
for select
using (public.is_global_admin());

create policy "tenant_role_permissions_select_global_admin"
on public.tenant_role_permissions
for select
using (public.is_global_admin());

create policy "audit_logs_select_global_admin"
on public.audit_logs
for select
using (public.has_platform_permission('audit.read.global'));

create policy "audit_row_changes_select_global_admin"
on public.audit_row_changes
for select
using (public.has_platform_permission('audit.read.global'));

create policy "app_error_logs_select_global_admin"
on public.app_error_logs
for select
using (public.has_platform_permission('error.read.global'));

create policy "auth_event_logs_select_global_admin"
on public.auth_event_logs
for select
using (public.has_platform_permission('auth_event.read.global'));

insert into public.permissions (permission_key, scope, description)
values
  ('audit.read.global', 'platform', 'Ver auditoria global'),
  ('error.read.global', 'platform', 'Ver errores globales'),
  ('auth_event.read.global', 'platform', 'Ver eventos globales de auth'),
  ('tenant.manage.global', 'platform', 'Gestion global de tenants'),
  ('membership.manage.global', 'platform', 'Gestion global de membresias'),
  ('stress.run.global', 'platform', 'Ejecutar stress harness'),
  ('tenant.read', 'tenant', 'Leer configuracion del tenant'),
  ('tenant.update', 'tenant', 'Actualizar configuracion del tenant'),
  ('membership.manage', 'tenant', 'Gestionar membresias del tenant'),
  ('crm.read', 'tenant', 'Leer CRM'),
  ('crm.write', 'tenant', 'Escribir CRM'),
  ('catalog.read', 'tenant', 'Leer catalogo'),
  ('catalog.write', 'tenant', 'Escribir catalogo'),
  ('quote.read', 'tenant', 'Leer cotizaciones'),
  ('quote.write', 'tenant', 'Escribir cotizaciones'),
  ('expense.read', 'tenant', 'Leer gastos'),
  ('expense.write', 'tenant', 'Escribir gastos'),
  ('audit.read.tenant', 'tenant', 'Leer auditoria del tenant')
on conflict (permission_key) do nothing;

insert into public.platform_roles (role_key, role_name)
values
  ('global_admin', 'Global admin'),
  ('platform_support', 'Platform support'),
  ('platform_observer', 'Platform observer')
on conflict (role_key) do nothing;

insert into public.tenant_roles (role_key, role_name)
values
  ('tenant_owner', 'Tenant owner'),
  ('tenant_admin', 'Tenant admin'),
  ('sales_rep', 'Sales rep'),
  ('finance_operator', 'Finance operator'),
  ('viewer', 'Viewer')
on conflict (role_key) do nothing;

insert into public.platform_role_permissions (role_id, permission_id)
select pr.id, p.id
from public.platform_roles pr
join public.permissions p on p.permission_key in (
  'audit.read.global',
  'error.read.global',
  'auth_event.read.global',
  'tenant.manage.global',
  'membership.manage.global',
  'stress.run.global'
)
where pr.role_key = 'global_admin'
on conflict (role_id, permission_id) do nothing;

insert into public.tenant_role_permissions (role_id, permission_id)
select tr.id, p.id
from public.tenant_roles tr
join public.permissions p on p.permission_key in (
  'tenant.read',
  'tenant.update',
  'membership.manage',
  'crm.read',
  'crm.write',
  'catalog.read',
  'catalog.write',
  'quote.read',
  'quote.write',
  'expense.read',
  'expense.write',
  'audit.read.tenant'
)
where tr.role_key = 'tenant_admin'
on conflict (role_id, permission_id) do nothing;

insert into public.tenant_role_permissions (role_id, permission_id)
select tr.id, p.id
from public.tenant_roles tr
join public.permissions p on p.permission_key in (
  'crm.read',
  'crm.write',
  'catalog.read',
  'quote.read',
  'quote.write'
)
where tr.role_key = 'sales_rep'
on conflict (role_id, permission_id) do nothing;

insert into public.tenant_role_permissions (role_id, permission_id)
select tr.id, p.id
from public.tenant_roles tr
join public.permissions p on p.permission_key in (
  'expense.read',
  'expense.write',
  'quote.read'
)
where tr.role_key = 'finance_operator'
on conflict (role_id, permission_id) do nothing;

insert into public.tenant_role_permissions (role_id, permission_id)
select tr.id, p.id
from public.tenant_roles tr
join public.permissions p on p.permission_key in (
  'tenant.read',
  'crm.read',
  'catalog.read',
  'quote.read',
  'expense.read'
)
where tr.role_key = 'viewer'
on conflict (role_id, permission_id) do nothing;
