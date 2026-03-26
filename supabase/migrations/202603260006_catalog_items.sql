create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  item_code text,
  name text not null,
  description text,
  category text,
  kind text not null default 'product' check (kind in ('product', 'service')),
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  pricing_mode text not null default 'fixed' check (pricing_mode in ('fixed', 'on_request')),
  currency_code text not null default 'USD',
  unit_price numeric(12, 2),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  created_by uuid,
  updated_by uuid,
  unique (tenant_id, item_code),
  constraint catalog_items_price_rule check (
    (
      pricing_mode = 'fixed'
      and unit_price is not null
      and unit_price >= 0
    )
    or (
      pricing_mode = 'on_request'
      and unit_price is null
    )
  )
);

drop trigger if exists catalog_items_touch_tracking_columns on public.catalog_items;
create trigger catalog_items_touch_tracking_columns
before insert or update on public.catalog_items
for each row
execute function public.touch_tracking_columns();

drop trigger if exists catalog_items_write_audit_log on public.catalog_items;
create trigger catalog_items_write_audit_log
after insert or update or delete on public.catalog_items
for each row
execute function public.write_audit_log();

alter table public.catalog_items enable row level security;

create policy "catalog_items_select_tenant_readers"
on public.catalog_items
for select
using (public.has_tenant_permission(public.catalog_items.tenant_id, 'catalog.read'));

create policy "catalog_items_insert_tenant_writers"
on public.catalog_items
for insert
with check (public.has_tenant_permission(public.catalog_items.tenant_id, 'catalog.write'));

create policy "catalog_items_update_tenant_writers"
on public.catalog_items
for update
using (public.has_tenant_permission(public.catalog_items.tenant_id, 'catalog.write'))
with check (public.has_tenant_permission(public.catalog_items.tenant_id, 'catalog.write'));
