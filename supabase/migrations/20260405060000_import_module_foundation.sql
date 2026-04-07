-- ─────────────────────────────────────────────────────────────────────────────
-- Import module foundation
--
-- Changes:
--   1. Table: import_jobs             — tracks each import session
--   2. Table: import_staging_rows     — staging area for file rows before upsert
--   3. Table: import_row_errors       — per-row errors for downloadable report
--   4. Column: import_batch_tag       — on customers, leads, catalog_items (rollback)
--   5. RPC: insert_staging_rows       — bulk-insert parsed rows into staging
--   6. RPC: update_staging_validation — mark rows valid/invalid after client validation
--   7. RPC: bulk_upsert_customers     — reads valid staging rows → upserts to customers
--   8. RPC: bulk_upsert_leads         — reads valid staging rows → upserts to leads
--   9. RPC: bulk_upsert_catalog_items — reads valid staging rows → upserts to catalog_items
--  10. RPC: rollback_import_job       — deletes records tagged with batch_tag (72h window)
--  11. RPC: cleanup_staging_rows      — removes processed rows, keeps errored for audit
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. import_jobs ──────────────────────────────────────────────────────────

create table if not exists public.import_jobs (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants (id) on delete cascade,
  entity_type     text not null check (entity_type in ('customer', 'lead', 'catalog_item')),
  import_mode     text not null check (import_mode in ('create', 'update', 'upsert')),
  status          text not null default 'pending'
                  check (status in ('pending', 'processing', 'completed', 'failed', 'rolled_back')),
  file_name       text not null,
  file_row_count  integer not null default 0,
  column_mapping  jsonb not null default '{}',
  rows_created    integer not null default 0,
  rows_updated    integer not null default 0,
  rows_skipped    integer not null default 0,
  rows_errored    integer not null default 0,
  batch_tag       uuid not null default gen_random_uuid(),
  started_at      timestamptz,
  finished_at     timestamptz,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now()),
  created_by      uuid,
  updated_by      uuid
);

create index if not exists import_jobs_tenant_id_idx
  on public.import_jobs (tenant_id, created_at desc);

alter table public.import_jobs enable row level security;

drop policy if exists "import_jobs_select" on public.import_jobs;
create policy "import_jobs_select"
  on public.import_jobs for select
  using (
    has_tenant_permission(tenant_id, 'crm.read') or
    has_tenant_permission(tenant_id, 'catalog.read')
  );

drop policy if exists "import_jobs_insert" on public.import_jobs;
create policy "import_jobs_insert"
  on public.import_jobs for insert
  with check (
    has_tenant_permission(tenant_id, 'crm.write') or
    has_tenant_permission(tenant_id, 'catalog.write')
  );

drop policy if exists "import_jobs_update" on public.import_jobs;
create policy "import_jobs_update"
  on public.import_jobs for update
  using (
    has_tenant_permission(tenant_id, 'crm.write') or
    has_tenant_permission(tenant_id, 'catalog.write')
  );

-- tracking trigger
drop trigger if exists import_jobs_touch_tracking on public.import_jobs;
create trigger import_jobs_touch_tracking
  before insert or update on public.import_jobs
  for each row execute function public.touch_tracking_columns();

-- ─── 2. import_staging_rows ───────────────────────────────────────────────────

create table if not exists public.import_staging_rows (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references public.tenants (id) on delete cascade,
  import_job_id     uuid not null references public.import_jobs (id) on delete cascade,
  row_number        integer not null,
  raw_data          jsonb not null,
  mapped_data       jsonb,
  status            text not null default 'pending'
                    check (status in ('pending', 'valid', 'invalid', 'processed', 'error')),
  validation_errors jsonb,
  created_at        timestamptz not null default timezone('utc', now())
);

create index if not exists import_staging_rows_job_id_idx
  on public.import_staging_rows (import_job_id, row_number);

create index if not exists import_staging_rows_job_status_idx
  on public.import_staging_rows (import_job_id, status);

alter table public.import_staging_rows enable row level security;

drop policy if exists "import_staging_rows_select" on public.import_staging_rows;
create policy "import_staging_rows_select"
  on public.import_staging_rows for select
  using (
    has_tenant_permission(tenant_id, 'crm.read') or
    has_tenant_permission(tenant_id, 'catalog.read')
  );

drop policy if exists "import_staging_rows_insert" on public.import_staging_rows;
create policy "import_staging_rows_insert"
  on public.import_staging_rows for insert
  with check (
    has_tenant_permission(tenant_id, 'crm.write') or
    has_tenant_permission(tenant_id, 'catalog.write')
  );

drop policy if exists "import_staging_rows_update" on public.import_staging_rows;
create policy "import_staging_rows_update"
  on public.import_staging_rows for update
  using (
    has_tenant_permission(tenant_id, 'crm.write') or
    has_tenant_permission(tenant_id, 'catalog.write')
  );

drop policy if exists "import_staging_rows_delete" on public.import_staging_rows;
create policy "import_staging_rows_delete"
  on public.import_staging_rows for delete
  using (
    has_tenant_permission(tenant_id, 'crm.write') or
    has_tenant_permission(tenant_id, 'catalog.write')
  );

-- ─── 3. import_row_errors ─────────────────────────────────────────────────────

create table if not exists public.import_row_errors (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references public.tenants (id) on delete cascade,
  import_job_id  uuid not null references public.import_jobs (id) on delete cascade,
  row_number     integer not null,
  field_name     text,
  error_code     text not null,
  error_message  text not null,
  row_data       jsonb,
  created_at     timestamptz not null default timezone('utc', now()),
  updated_at     timestamptz not null default timezone('utc', now()),
  created_by     uuid,
  updated_by     uuid
);

create index if not exists import_row_errors_job_id_idx
  on public.import_row_errors (import_job_id, row_number);

alter table public.import_row_errors enable row level security;

drop policy if exists "import_row_errors_select" on public.import_row_errors;
create policy "import_row_errors_select"
  on public.import_row_errors for select
  using (
    has_tenant_permission(tenant_id, 'crm.read') or
    has_tenant_permission(tenant_id, 'catalog.read')
  );

drop policy if exists "import_row_errors_insert" on public.import_row_errors;
create policy "import_row_errors_insert"
  on public.import_row_errors for insert
  with check (
    has_tenant_permission(tenant_id, 'crm.write') or
    has_tenant_permission(tenant_id, 'catalog.write')
  );

-- tracking trigger
drop trigger if exists import_row_errors_touch_tracking on public.import_row_errors;
create trigger import_row_errors_touch_tracking
  before insert or update on public.import_row_errors
  for each row execute function public.touch_tracking_columns();

-- ─── 4. import_batch_tag column on entity tables ──────────────────────────────

alter table public.customers
  add column if not exists import_batch_tag uuid;

create index if not exists customers_import_batch_tag_idx
  on public.customers (import_batch_tag)
  where import_batch_tag is not null;

alter table public.leads
  add column if not exists import_batch_tag uuid;

create index if not exists leads_import_batch_tag_idx
  on public.leads (import_batch_tag)
  where import_batch_tag is not null;

alter table public.catalog_items
  add column if not exists import_batch_tag uuid;

create index if not exists catalog_items_import_batch_tag_idx
  on public.catalog_items (import_batch_tag)
  where import_batch_tag is not null;

-- ─── 5. RPC: insert_staging_rows ─────────────────────────────────────────────
--
-- Bulk-inserts parsed/mapped rows into import_staging_rows.
-- Expects rows as jsonb array: [{row_number, raw_data, mapped_data}]

create or replace function public.insert_staging_rows(
  target_tenant_id  uuid,
  target_job_id     uuid,
  p_rows            jsonb
)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  inserted_count integer := 0;
  row_item       jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not (
    has_tenant_permission(target_tenant_id, 'crm.write') or
    has_tenant_permission(target_tenant_id, 'catalog.write')
  ) then
    raise exception 'Insufficient permissions to insert staging rows';
  end if;

  -- Validate the job belongs to this tenant
  if not exists (
    select 1 from public.import_jobs
    where id = target_job_id and tenant_id = target_tenant_id
  ) then
    raise exception 'Import job not found';
  end if;

  for row_item in select * from jsonb_array_elements(p_rows)
  loop
    insert into public.import_staging_rows (
      tenant_id,
      import_job_id,
      row_number,
      raw_data,
      mapped_data,
      status
    ) values (
      target_tenant_id,
      target_job_id,
      (row_item->>'row_number')::integer,
      row_item->'raw_data',
      row_item->'mapped_data',
      'pending'
    );
    inserted_count := inserted_count + 1;
  end loop;

  -- Update job row count
  update public.import_jobs
  set file_row_count = inserted_count, updated_at = timezone('utc', now())
  where id = target_job_id and tenant_id = target_tenant_id;

  return inserted_count;
end;
$$;

-- ─── 6. RPC: update_staging_validation ───────────────────────────────────────
--
-- Updates status and validation_errors for staging rows after client validation.
-- Expects results as jsonb array: [{row_number, status, validation_errors}]

create or replace function public.update_staging_validation(
  target_tenant_id  uuid,
  target_job_id     uuid,
  p_results         jsonb
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  result_item jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not (
    has_tenant_permission(target_tenant_id, 'crm.write') or
    has_tenant_permission(target_tenant_id, 'catalog.write')
  ) then
    raise exception 'Insufficient permissions to update staging validation';
  end if;

  if not exists (
    select 1 from public.import_jobs
    where id = target_job_id and tenant_id = target_tenant_id
  ) then
    raise exception 'Import job not found';
  end if;

  for result_item in select * from jsonb_array_elements(p_results)
  loop
    update public.import_staging_rows
    set
      status            = result_item->>'status',
      validation_errors = result_item->'validation_errors'
    where
      import_job_id = target_job_id
      and row_number = (result_item->>'row_number')::integer
      and tenant_id  = target_tenant_id;
  end loop;
end;
$$;

-- ─── 7. RPC: bulk_upsert_customers ───────────────────────────────────────────
--
-- Reads up to batch_size valid rows from staging and upserts to customers.
-- Returns jsonb: {created, updated, errors: [{row_number, field, code, message}]}

create or replace function public.bulk_upsert_customers(
  target_tenant_id  uuid,
  target_job_id     uuid,
  p_batch_tag       uuid,
  p_import_mode     text,
  p_batch_size      integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  staging_row   record;
  d             jsonb;
  created_count integer := 0;
  updated_count integer := 0;
  error_list    jsonb   := '[]'::jsonb;
  normalized_mode text  := lower(trim(coalesce(p_import_mode, 'upsert')));
  existing_id   uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not has_tenant_permission(target_tenant_id, 'crm.write') then
    raise exception 'Insufficient permissions to import customers';
  end if;

  if not exists (
    select 1 from public.import_jobs
    where id = target_job_id and tenant_id = target_tenant_id
  ) then
    raise exception 'Import job not found';
  end if;

  for staging_row in
    select id, row_number, mapped_data
    from public.import_staging_rows
    where
      import_job_id = target_job_id
      and tenant_id = target_tenant_id
      and status    = 'valid'
    order by row_number
    limit p_batch_size
  loop
    d := staging_row.mapped_data;

    begin
      -- Check if record exists
      select id into existing_id
      from public.customers
      where
        tenant_id     = target_tenant_id
        and customer_code = nullif(trim(d->>'customer_code'), '');

      if existing_id is not null then
        -- Record exists
        if normalized_mode in ('update', 'upsert') then
          update public.customers set
            display_name  = coalesce(nullif(trim(d->>'display_name'), ''), display_name),
            contact_name  = coalesce(nullif(trim(d->>'contact_name'), ''), contact_name),
            email         = coalesce(nullif(trim(lower(d->>'email')), ''), email),
            whatsapp      = coalesce(nullif(trim(d->>'whatsapp'), ''), whatsapp),
            phone         = coalesce(nullif(trim(d->>'phone'), ''), phone),
            document_id   = coalesce(nullif(trim(d->>'document_id'), ''), document_id),
            notes         = coalesce(nullif(trim(d->>'notes'), ''), notes),
            status        = coalesce(nullif(trim(d->>'status'), ''), status),
            source        = coalesce(nullif(trim(d->>'source'), ''), source),
            import_batch_tag = p_batch_tag,
            updated_at    = timezone('utc', now()),
            updated_by    = current_app_user_id()
          where id = existing_id and tenant_id = target_tenant_id;
          updated_count := updated_count + 1;
        else
          -- mode = 'create': skip existing
          update public.import_staging_rows
          set status = 'processed'
          where id = staging_row.id;
          continue;
        end if;
      else
        -- Record does not exist
        if normalized_mode in ('create', 'upsert') then
          insert into public.customers (
            tenant_id,
            customer_code,
            display_name,
            contact_name,
            email,
            whatsapp,
            phone,
            document_id,
            notes,
            status,
            source,
            import_batch_tag,
            created_by,
            updated_by
          ) values (
            target_tenant_id,
            nullif(trim(d->>'customer_code'), ''),
            coalesce(nullif(trim(d->>'display_name'), ''), 'Sin nombre'),
            nullif(trim(d->>'contact_name'), ''),
            nullif(trim(lower(d->>'email')), ''),
            nullif(trim(d->>'whatsapp'), ''),
            nullif(trim(d->>'phone'), ''),
            nullif(trim(d->>'document_id'), ''),
            nullif(trim(d->>'notes'), ''),
            coalesce(nullif(trim(d->>'status'), ''), 'active'),
            coalesce(nullif(trim(d->>'source'), ''), 'import'),
            p_batch_tag,
            current_app_user_id(),
            current_app_user_id()
          );
          created_count := created_count + 1;
        else
          -- mode = 'update': skip non-existing
          update public.import_staging_rows
          set status = 'processed'
          where id = staging_row.id;
          continue;
        end if;
      end if;

      -- Mark staging row as processed
      update public.import_staging_rows
      set status = 'processed'
      where id = staging_row.id;

    exception when others then
      -- Mark staging row as error
      update public.import_staging_rows
      set status = 'error'
      where id = staging_row.id;

      error_list := error_list || jsonb_build_object(
        'row_number', staging_row.row_number,
        'field', null,
        'code', 'db_error',
        'message', sqlerrm
      );
    end;
  end loop;

  return jsonb_build_object(
    'created', created_count,
    'updated', updated_count,
    'errors',  error_list
  );
end;
$$;

-- ─── 8. RPC: bulk_upsert_leads ────────────────────────────────────────────────

create or replace function public.bulk_upsert_leads(
  target_tenant_id  uuid,
  target_job_id     uuid,
  p_batch_tag       uuid,
  p_import_mode     text,
  p_batch_size      integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  staging_row   record;
  d             jsonb;
  created_count integer := 0;
  updated_count integer := 0;
  error_list    jsonb   := '[]'::jsonb;
  normalized_mode text  := lower(trim(coalesce(p_import_mode, 'upsert')));
  existing_id   uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not has_tenant_permission(target_tenant_id, 'crm.write') then
    raise exception 'Insufficient permissions to import leads';
  end if;

  if not exists (
    select 1 from public.import_jobs
    where id = target_job_id and tenant_id = target_tenant_id
  ) then
    raise exception 'Import job not found';
  end if;

  for staging_row in
    select id, row_number, mapped_data
    from public.import_staging_rows
    where
      import_job_id = target_job_id
      and tenant_id = target_tenant_id
      and status    = 'valid'
    order by row_number
    limit p_batch_size
  loop
    d := staging_row.mapped_data;

    begin
      select id into existing_id
      from public.leads
      where
        tenant_id  = target_tenant_id
        and lead_code = nullif(trim(d->>'lead_code'), '');

      if existing_id is not null then
        if normalized_mode in ('update', 'upsert') then
          update public.leads set
            display_name  = coalesce(nullif(trim(d->>'display_name'), ''), display_name),
            contact_name  = coalesce(nullif(trim(d->>'contact_name'), ''), contact_name),
            email         = coalesce(nullif(trim(lower(d->>'email')), ''), email),
            whatsapp      = coalesce(nullif(trim(d->>'whatsapp'), ''), whatsapp),
            phone         = coalesce(nullif(trim(d->>'phone'), ''), phone),
            source        = coalesce(nullif(trim(d->>'source'), ''), source),
            status        = coalesce(nullif(trim(d->>'status'), ''), status),
            need_summary  = coalesce(nullif(trim(d->>'need_summary'), ''), need_summary),
            notes         = coalesce(nullif(trim(d->>'notes'), ''), notes),
            import_batch_tag = p_batch_tag,
            updated_at    = timezone('utc', now()),
            updated_by    = current_app_user_id()
          where id = existing_id and tenant_id = target_tenant_id;
          updated_count := updated_count + 1;
        else
          update public.import_staging_rows set status = 'processed' where id = staging_row.id;
          continue;
        end if;
      else
        if normalized_mode in ('create', 'upsert') then
          insert into public.leads (
            tenant_id,
            lead_code,
            display_name,
            contact_name,
            email,
            whatsapp,
            phone,
            source,
            status,
            need_summary,
            notes,
            import_batch_tag,
            created_by,
            updated_by
          ) values (
            target_tenant_id,
            nullif(trim(d->>'lead_code'), ''),
            coalesce(nullif(trim(d->>'display_name'), ''), 'Sin nombre'),
            nullif(trim(d->>'contact_name'), ''),
            nullif(trim(lower(d->>'email')), ''),
            nullif(trim(d->>'whatsapp'), ''),
            nullif(trim(d->>'phone'), ''),
            coalesce(nullif(trim(d->>'source'), ''), 'import'),
            coalesce(nullif(trim(d->>'status'), ''), 'new'),
            nullif(trim(d->>'need_summary'), ''),
            nullif(trim(d->>'notes'), ''),
            p_batch_tag,
            current_app_user_id(),
            current_app_user_id()
          );
          created_count := created_count + 1;
        else
          update public.import_staging_rows set status = 'processed' where id = staging_row.id;
          continue;
        end if;
      end if;

      update public.import_staging_rows set status = 'processed' where id = staging_row.id;

    exception when others then
      update public.import_staging_rows set status = 'error' where id = staging_row.id;
      error_list := error_list || jsonb_build_object(
        'row_number', staging_row.row_number,
        'field', null,
        'code', 'db_error',
        'message', sqlerrm
      );
    end;
  end loop;

  return jsonb_build_object(
    'created', created_count,
    'updated', updated_count,
    'errors',  error_list
  );
end;
$$;

-- ─── 9. RPC: bulk_upsert_catalog_items ────────────────────────────────────────

create or replace function public.bulk_upsert_catalog_items(
  target_tenant_id  uuid,
  target_job_id     uuid,
  p_batch_tag       uuid,
  p_import_mode     text,
  p_batch_size      integer default 50
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  staging_row   record;
  d             jsonb;
  created_count integer := 0;
  updated_count integer := 0;
  error_list    jsonb   := '[]'::jsonb;
  normalized_mode text  := lower(trim(coalesce(p_import_mode, 'upsert')));
  existing_id   uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not has_tenant_permission(target_tenant_id, 'catalog.write') then
    raise exception 'Insufficient permissions to import catalog items';
  end if;

  if not exists (
    select 1 from public.import_jobs
    where id = target_job_id and tenant_id = target_tenant_id
  ) then
    raise exception 'Import job not found';
  end if;

  for staging_row in
    select id, row_number, mapped_data
    from public.import_staging_rows
    where
      import_job_id = target_job_id
      and tenant_id = target_tenant_id
      and status    = 'valid'
    order by row_number
    limit p_batch_size
  loop
    d := staging_row.mapped_data;

    begin
      select id into existing_id
      from public.catalog_items
      where
        tenant_id  = target_tenant_id
        and item_code = nullif(trim(d->>'item_code'), '');

      if existing_id is not null then
        if normalized_mode in ('update', 'upsert') then
          update public.catalog_items set
            name          = coalesce(nullif(trim(d->>'name'), ''), name),
            description   = coalesce(nullif(trim(d->>'description'), ''), description),
            category      = coalesce(nullif(trim(d->>'category'), ''), category),
            kind          = coalesce(nullif(trim(d->>'kind'), ''), kind),
            visibility    = coalesce(nullif(trim(d->>'visibility'), ''), visibility),
            pricing_mode  = coalesce(nullif(trim(d->>'pricing_mode'), ''), pricing_mode),
            currency_code = coalesce(nullif(trim(d->>'currency_code'), ''), currency_code),
            unit_price    = coalesce(nullif(d->>'unit_price', '')::numeric, unit_price),
            status        = coalesce(nullif(trim(d->>'status'), ''), status),
            import_batch_tag = p_batch_tag,
            updated_at    = timezone('utc', now()),
            updated_by    = current_app_user_id()
          where id = existing_id and tenant_id = target_tenant_id;
          updated_count := updated_count + 1;
        else
          update public.import_staging_rows set status = 'processed' where id = staging_row.id;
          continue;
        end if;
      else
        if normalized_mode in ('create', 'upsert') then
          insert into public.catalog_items (
            tenant_id,
            item_code,
            name,
            description,
            category,
            kind,
            visibility,
            pricing_mode,
            currency_code,
            unit_price,
            status,
            import_batch_tag,
            created_by,
            updated_by
          ) values (
            target_tenant_id,
            nullif(trim(d->>'item_code'), ''),
            coalesce(nullif(trim(d->>'name'), ''), 'Sin nombre'),
            nullif(trim(d->>'description'), ''),
            nullif(trim(d->>'category'), ''),
            coalesce(nullif(trim(d->>'kind'), ''), 'product'),
            coalesce(nullif(trim(d->>'visibility'), ''), 'private'),
            coalesce(nullif(trim(d->>'pricing_mode'), ''), 'fixed'),
            coalesce(nullif(trim(d->>'currency_code'), ''), 'DOP'),
            coalesce(nullif(d->>'unit_price', '')::numeric, 0),
            coalesce(nullif(trim(d->>'status'), ''), 'draft'),
            p_batch_tag,
            current_app_user_id(),
            current_app_user_id()
          );
          created_count := created_count + 1;
        else
          update public.import_staging_rows set status = 'processed' where id = staging_row.id;
          continue;
        end if;
      end if;

      update public.import_staging_rows set status = 'processed' where id = staging_row.id;

    exception when others then
      update public.import_staging_rows set status = 'error' where id = staging_row.id;
      error_list := error_list || jsonb_build_object(
        'row_number', staging_row.row_number,
        'field', null,
        'code', 'db_error',
        'message', sqlerrm
      );
    end;
  end loop;

  return jsonb_build_object(
    'created', created_count,
    'updated', updated_count,
    'errors',  error_list
  );
end;
$$;

-- ─── 10. RPC: rollback_import_job ─────────────────────────────────────────────
--
-- Deletes all entity records created/updated in an import (via batch_tag).
-- Only allowed within 72 hours of completion.

create or replace function public.rollback_import_job(
  target_tenant_id uuid,
  target_job_id    uuid
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  job_rec       record;
  deleted_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not (
    has_tenant_permission(target_tenant_id, 'crm.write') or
    has_tenant_permission(target_tenant_id, 'catalog.write')
  ) then
    raise exception 'Insufficient permissions to rollback import';
  end if;

  select * into job_rec
  from public.import_jobs
  where id = target_job_id and tenant_id = target_tenant_id;

  if not found then
    raise exception 'Import job not found';
  end if;

  if job_rec.status not in ('completed') then
    raise exception 'Only completed jobs can be rolled back. Current status: %', job_rec.status;
  end if;

  if job_rec.finished_at < timezone('utc', now()) - interval '72 hours' then
    raise exception 'Rollback window has expired (72 hours after completion)';
  end if;

  -- Delete records from the appropriate entity table
  if job_rec.entity_type = 'customer' then
    delete from public.customers
    where tenant_id = target_tenant_id and import_batch_tag = job_rec.batch_tag;
    get diagnostics deleted_count = row_count;

  elsif job_rec.entity_type = 'lead' then
    delete from public.leads
    where tenant_id = target_tenant_id and import_batch_tag = job_rec.batch_tag;
    get diagnostics deleted_count = row_count;

  elsif job_rec.entity_type = 'catalog_item' then
    delete from public.catalog_items
    where tenant_id = target_tenant_id and import_batch_tag = job_rec.batch_tag;
    get diagnostics deleted_count = row_count;
  end if;

  -- Mark job as rolled back
  update public.import_jobs
  set
    status      = 'rolled_back',
    updated_at  = timezone('utc', now()),
    updated_by  = current_app_user_id()
  where id = target_job_id and tenant_id = target_tenant_id;
end;
$$;

-- ─── 11. RPC: cleanup_staging_rows ────────────────────────────────────────────
--
-- Removes processed rows from staging after a successful import.
-- Keeps errored rows for audit purposes.

create or replace function public.cleanup_staging_rows(
  target_tenant_id uuid,
  target_job_id    uuid
)
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  deleted_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not (
    has_tenant_permission(target_tenant_id, 'crm.write') or
    has_tenant_permission(target_tenant_id, 'catalog.write')
  ) then
    raise exception 'Insufficient permissions to cleanup staging rows';
  end if;

  if not exists (
    select 1 from public.import_jobs
    where id = target_job_id and tenant_id = target_tenant_id
  ) then
    raise exception 'Import job not found';
  end if;

  delete from public.import_staging_rows
  where
    import_job_id = target_job_id
    and tenant_id = target_tenant_id
    and status    = 'processed';

  get diagnostics deleted_count = row_count;

  return deleted_count;
end;
$$;
