create or replace function public.current_platform_role_keys()
returns text[]
language sql
stable
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

create or replace function public.get_my_access_context()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user public.app_users%rowtype;
begin
  if auth.uid() is null then
    return jsonb_build_object(
      'appUserId', null,
      'email', null,
      'displayName', null,
      'isGlobalAdmin', false,
      'platformRoleKeys', '[]'::jsonb,
      'platformPermissionKeys', '[]'::jsonb,
      'tenantPermissionKeys', '[]'::jsonb,
      'memberships', '[]'::jsonb
    );
  end if;

  select *
  into target_user
  from public.app_users
  where id = auth.uid();

  return jsonb_build_object(
    'appUserId', target_user.id,
    'email', target_user.email,
    'displayName', target_user.display_name,
    'isGlobalAdmin', public.is_global_admin(),
    'platformRoleKeys', to_jsonb(public.current_platform_role_keys()),
    'platformPermissionKeys', to_jsonb(
      coalesce(
        (
          select array_agg(distinct p.permission_key order by p.permission_key)
          from public.app_user_platform_roles upr
          join public.platform_role_permissions prp on prp.role_id = upr.role_id
          join public.permissions p on p.id = prp.permission_id
          where upr.app_user_id = auth.uid()
        ),
        '{}'::text[]
      )
    ),
    'tenantPermissionKeys', to_jsonb(
      coalesce(
        (
          select array_agg(distinct permission_key order by permission_key)
          from (
            select unnest(public.current_tenant_permission_keys(tm.tenant_id)) as permission_key
            from public.tenant_memberships tm
            where tm.app_user_id = auth.uid()
              and tm.status = 'active'
          ) permission_keys
        ),
        '{}'::text[]
      )
    ),
    'memberships', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'membershipId', tm.id,
            'tenantId', t.id,
            'tenantName', t.name,
            'tenantSlug', t.slug,
            'status', tm.status,
            'tenantRoleKeys', to_jsonb(public.current_tenant_role_keys(t.id))
          )
          order by t.name
        )
        from public.tenant_memberships tm
        join public.tenants t on t.id = tm.tenant_id
        where tm.app_user_id = auth.uid()
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.create_tenant_with_owner(target_name text, target_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  new_membership_id uuid;
  owner_role_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if target_name is null or length(trim(target_name)) < 2 then
    raise exception 'Tenant name is required';
  end if;

  if target_slug is null or target_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Tenant slug is invalid';
  end if;

  insert into public.app_users (id, email, display_name)
  values (
    auth.uid(),
    coalesce((select email from auth.users where id = auth.uid()), ''),
    coalesce(
      (select raw_user_meta_data ->> 'full_name' from auth.users where id = auth.uid()),
      (select raw_user_meta_data ->> 'name' from auth.users where id = auth.uid())
    )
  )
  on conflict (id) do update
  set updated_at = timezone('utc', now());

  insert into public.tenants (slug, name, created_by, updated_by)
  values (trim(target_slug), trim(target_name), auth.uid(), auth.uid())
  returning id into new_tenant_id;

  insert into public.tenant_memberships (
    tenant_id,
    app_user_id,
    status,
    created_by,
    updated_by
  )
  values (new_tenant_id, auth.uid(), 'active', auth.uid(), auth.uid())
  returning id into new_membership_id;

  select id
  into owner_role_id
  from public.tenant_roles
  where role_key = 'tenant_owner';

  if owner_role_id is null then
    raise exception 'tenant_owner role is missing';
  end if;

  insert into public.tenant_membership_roles (
    membership_id,
    role_id,
    created_by,
    updated_by
  )
  values (new_membership_id, owner_role_id, auth.uid(), auth.uid())
  on conflict (membership_id, role_id) do nothing;

  return jsonb_build_object(
    'tenantId', new_tenant_id,
    'membershipId', new_membership_id,
    'tenantSlug', trim(target_slug)
  );
end;
$$;

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
where tr.role_key = 'tenant_owner'
on conflict (role_id, permission_id) do nothing;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  customer_code text,
  display_name text not null,
  legal_name text,
  email text,
  whatsapp text,
  phone text,
  document_id text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  source text not null default 'manual',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (tenant_id, customer_code)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete restrict,
  quote_number text not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired')),
  currency_code text not null default 'USD',
  subtotal numeric(12, 2) not null default 0,
  discount_total numeric(12, 2) not null default 0,
  tax_total numeric(12, 2) not null default 0,
  grand_total numeric(12, 2) not null default 0,
  version integer not null default 1,
  valid_until date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (tenant_id, quote_number)
);

drop trigger if exists customers_touch_tracking_columns on public.customers;
create trigger customers_touch_tracking_columns
before insert or update on public.customers
for each row
execute function public.touch_tracking_columns();

drop trigger if exists quotes_touch_tracking_columns on public.quotes;
create trigger quotes_touch_tracking_columns
before insert or update on public.quotes
for each row
execute function public.touch_tracking_columns();

drop trigger if exists customers_write_audit_log on public.customers;
create trigger customers_write_audit_log
after insert or update or delete on public.customers
for each row
execute function public.write_audit_log();

drop trigger if exists quotes_write_audit_log on public.quotes;
create trigger quotes_write_audit_log
after insert or update or delete on public.quotes
for each row
execute function public.write_audit_log();

alter table public.customers enable row level security;
alter table public.quotes enable row level security;

create policy "customers_select_tenant_readers"
on public.customers
for select
using (public.has_tenant_permission(public.customers.tenant_id, 'crm.read'));

create policy "customers_insert_tenant_writers"
on public.customers
for insert
with check (public.has_tenant_permission(public.customers.tenant_id, 'crm.write'));

create policy "customers_update_tenant_writers"
on public.customers
for update
using (public.has_tenant_permission(public.customers.tenant_id, 'crm.write'))
with check (public.has_tenant_permission(public.customers.tenant_id, 'crm.write'));

create policy "quotes_select_tenant_readers"
on public.quotes
for select
using (public.has_tenant_permission(public.quotes.tenant_id, 'quote.read'));

create policy "quotes_insert_tenant_writers"
on public.quotes
for insert
with check (public.has_tenant_permission(public.quotes.tenant_id, 'quote.write'));

create policy "quotes_update_tenant_writers"
on public.quotes
for update
using (public.has_tenant_permission(public.quotes.tenant_id, 'quote.write'))
with check (public.has_tenant_permission(public.quotes.tenant_id, 'quote.write'));
