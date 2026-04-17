// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

const migrationPath = path.resolve(
  "supabase/migrations/202603250001_foundation_security.sql"
);
const phaseTwoMigrationPath = path.resolve(
  "supabase/migrations/202603260001_phase2_auth_bootstrap.sql"
);
const hardeningMigrationPath = path.resolve(
  "supabase/migrations/202603260002_harden_function_search_paths.sql"
);
const customerContactMigrationPath = path.resolve(
  "supabase/migrations/202603260003_add_customer_contact_name.sql"
);
const quoteNumberingMigrationPath = path.resolve(
  "supabase/migrations/202603260004_quote_numbering_in_db.sql"
);
const quoteNumberPolicyMigrationPath = path.resolve(
  "supabase/migrations/202603260005_quote_number_sequences_policy.sql"
);
const catalogItemsMigrationPath = path.resolve(
  "supabase/migrations/202603260006_catalog_items.sql"
);
const quoteRecipientsMigrationPath = path.resolve(
  "supabase/migrations/202603270001_quote_recipients_leads_and_pdf_foundation.sql"
);
const quoteDocumentDiscountMigrationPath = path.resolve(
  "supabase/migrations/202603270004_quote_document_discount.sql"
);
const tenantIsolationHardeningMigrationPath = path.resolve(
  "supabase/migrations/202603300001_tenant_isolation_hardening.sql"
);
const setupSlugValidationMigrationPath = path.resolve(
  "supabase/migrations/20260331152000_setup_slug_validation.sql"
);
const cleanupTenantBootstrapOverloadMigrationPath = path.resolve(
  "supabase/migrations/20260403210240_drop_legacy_create_tenant_with_owner_overload.sql"
);
const importModuleMigrationPath = path.resolve(
  "supabase/migrations/20260405060000_import_module_foundation.sql"
);
const companyProfileMigrationPath = path.resolve(
  "supabase/migrations/20260406110000_company_profile_and_logo_assets.sql"
);
const tenantBankDetailsMigrationPath = path.resolve(
  "supabase/migrations/20260416120000_add_tenant_bank_details.sql"
);

describe("supabase foundation contracts", () => {
  it("creates the required secure foundation tables", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");

    expect(migration).toContain("create table if not exists public.audit_logs");
    expect(migration).toContain(
      "create table if not exists public.audit_row_changes"
    );
    expect(migration).toContain(
      "create table if not exists public.app_error_logs"
    );
    expect(migration).toContain(
      "create table if not exists public.auth_event_logs"
    );
  });

  it("enables RLS and helper functions for access control", () => {
    const migration = fs.readFileSync(migrationPath, "utf8");

    expect(migration).toContain("enable row level security");
    expect(migration).toContain(
      "create or replace function public.has_platform_permission"
    );
    expect(migration).toContain(
      "create or replace function public.has_tenant_permission"
    );
  });

  it("adds bootstrap access context helpers and the first business tables in phase 2", () => {
    const migration = fs.readFileSync(phaseTwoMigrationPath, "utf8");

    expect(migration).toContain(
      "create or replace function public.get_my_access_context"
    );
    expect(migration).toContain(
      "create or replace function public.create_tenant_with_owner"
    );
    expect(migration).toContain("create table if not exists public.customers");
    expect(migration).toContain("create table if not exists public.quotes");
    expect(migration).toContain(
      "alter table public.customers enable row level security"
    );
    expect(migration).toContain(
      "alter table public.quotes enable row level security"
    );
  });

  it("hardens the mutable search_path functions after phase 2", () => {
    const migration = fs.readFileSync(hardeningMigrationPath, "utf8");

    expect(migration).toContain(
      "create or replace function public.current_auth_user_id"
    );
    expect(migration).toContain(
      "create or replace function public.current_tenant_permission_keys"
    );
    expect(migration).toContain("set search_path = public, auth");
    expect(migration).toContain("set search_path = public");
  });

  it("extends customers with contact_name for crm capture flows", () => {
    const migration = fs.readFileSync(customerContactMigrationPath, "utf8");

    expect(migration).toContain("alter table public.customers");
    expect(migration).toContain("add column if not exists contact_name text");
  });

  it("moves quote numbering and versioning control to database functions", () => {
    const migration = fs.readFileSync(quoteNumberingMigrationPath, "utf8");

    expect(migration).toContain(
      "create table if not exists public.quote_number_sequences"
    );
    expect(migration).toContain(
      "create or replace function public.allocate_quote_number"
    );
    expect(migration).toContain(
      "create or replace function public.create_quote"
    );
    expect(migration).toContain(
      "create or replace function public.update_quote"
    );
    expect(migration).toContain("version = public.quotes.version + 1");
  });

  it("keeps the internal quote counter table behind an explicit policy", () => {
    const migration = fs.readFileSync(quoteNumberPolicyMigrationPath, "utf8");

    expect(migration).toContain(
      "create policy \"quote_number_sequences_select_global_admin\""
    );
    expect(migration).toContain("using (public.is_global_admin())");
  });

  it("creates catalog_items with audit triggers and tenant-scoped RLS", () => {
    const migration = fs.readFileSync(catalogItemsMigrationPath, "utf8");

    expect(migration).toContain("create table if not exists public.catalog_items");
    expect(migration).toContain(
      "create trigger catalog_items_touch_tracking_columns"
    );
    expect(migration).toContain("execute function public.write_audit_log()");
    expect(migration).toContain(
      "alter table public.catalog_items enable row level security"
    );
    expect(migration).toContain(
      "create policy \"catalog_items_select_tenant_readers\""
    );
    expect(migration).toContain(
      "public.has_tenant_permission(public.catalog_items.tenant_id, 'catalog.write')"
    );
  });

  it("adds leads, quote line items, and quote recipient snapshots for the quote builder", () => {
    const migration = fs.readFileSync(quoteRecipientsMigrationPath, "utf8");

    expect(migration).toContain("create table if not exists public.leads");
    expect(migration).toContain("create table if not exists public.quote_line_items");
    expect(migration).toContain("add column if not exists recipient_kind text");
    expect(migration).toContain("add column if not exists recipient_display_name text");
    expect(migration).toContain("create or replace function public.replace_quote_line_items");
    expect(migration).toContain(
      "create or replace function public.create_quote"
    );
    expect(migration).toContain(
      "create or replace function public.update_quote"
    );
    expect(migration).toContain("jsonb_array_length(normalized_line_items) = 0");
  });

  it("allows document-level discounts on top of line-item discounts", () => {
    const migration = fs.readFileSync(quoteDocumentDiscountMigrationPath, "utf8");

    expect(migration).toContain("target_document_discount_total numeric default 0");
    expect(migration).toContain(
      "Document discount cannot exceed quote subtotal after line discounts"
    );
    expect(migration).toContain("discount_total = computed_total_discount");
  });

  it("hardens tenant isolation with composite tenant foreign keys and immutable tenant scope", () => {
    const migration = fs.readFileSync(
      tenantIsolationHardeningMigrationPath,
      "utf8"
    );

    expect(migration).toContain(
      "create or replace function public.prevent_tenant_reassignment"
    );
    expect(migration).toContain(
      "add constraint customers_tenant_id_id_key unique (tenant_id, id)"
    );
    expect(migration).toContain(
      "add constraint quotes_customer_id_tenant_id_fkey"
    );
    expect(migration).toContain(
      "foreign key (tenant_id, customer_id)"
    );
    expect(migration).toContain(
      "add constraint quote_line_items_quote_id_tenant_id_fkey"
    );
    expect(migration).toContain(
      "raise exception 'tenant_id is immutable once inserted'"
    );
  });

  it("drops the legacy two-argument tenant bootstrap overload to keep the RPC unambiguous", () => {
    const migration = fs.readFileSync(
      cleanupTenantBootstrapOverloadMigrationPath,
      "utf8"
    );

    expect(migration).toContain(
      "drop function if exists public.create_tenant_with_owner(text, text);"
    );
  });

  it("creates import_jobs, import_staging_rows, and import_row_errors with RLS and RPCs", () => {
    const migration = fs.readFileSync(importModuleMigrationPath, "utf8");

    // Core tables
    expect(migration).toContain("create table if not exists public.import_jobs");
    expect(migration).toContain("create table if not exists public.import_staging_rows");
    expect(migration).toContain("create table if not exists public.import_row_errors");

    // RLS enabled on import_jobs (staging rows inherit via cascade policy)
    expect(migration).toContain("alter table public.import_jobs enable row level security");

    // Rollback batch tag columns on entity tables
    expect(migration).toContain("add column if not exists import_batch_tag uuid");

    // Required RPCs
    expect(migration).toContain("create or replace function public.insert_staging_rows");
    expect(migration).toContain("create or replace function public.update_staging_validation");
    expect(migration).toContain("create or replace function public.bulk_upsert_customers");
    expect(migration).toContain("create or replace function public.bulk_upsert_leads");
    expect(migration).toContain("create or replace function public.bulk_upsert_catalog_items");
    expect(migration).toContain("create or replace function public.rollback_import_job");
    expect(migration).toContain("create or replace function public.cleanup_staging_rows");

    // Rollback window guard (72 hours)
    expect(migration).toContain("72");

    // SECURITY DEFINER on RPCs that bypass RLS for bulk writes
    expect(migration).toContain("security definer");
  });

  it("adds slug availability validation before bootstrapping the first tenant", () => {
    const migration = fs.readFileSync(setupSlugValidationMigrationPath, "utf8");

    expect(migration).toContain(
      "create or replace function public.is_tenant_slug_available"
    );
    expect(migration).toContain(
      "grant execute on function public.is_tenant_slug_available(text) to authenticated"
    );
    expect(migration).toContain(
      "if not public.is_tenant_slug_available(normalized_slug) then"
    );
    expect(migration).toContain(
      "raise exception 'Tenant slug is already in use'"
    );
  });

  it("adds company profile fields and protected tenant logo storage", () => {
    const migration = fs.readFileSync(companyProfileMigrationPath, "utf8");

    expect(migration).toContain("add column if not exists address text");
    expect(migration).toContain("add column if not exists phone text");
    expect(migration).toContain("add column if not exists rnc text");
    expect(migration).toContain("add column if not exists logo_path text");
    expect(migration).toContain("insert into storage.buckets");
    expect(migration).toContain("tenant-assets");
    expect(migration).toContain(
      "create or replace function public.can_manage_tenant_logo_asset"
    );
    expect(migration).toContain(
      "create or replace function public.can_read_tenant_logo_asset"
    );
    expect(migration).toContain('create policy "tenant_assets_insert"');
    expect(migration).toContain(
      "create or replace function public.update_tenant_branding_settings"
    );
    expect(migration).toContain("next_logo_path text default '__KEEP__'");
  });

  it("adds bank details to tenant settings and document printing data", () => {
    const migration = fs.readFileSync(tenantBankDetailsMigrationPath, "utf8");

    expect(migration).toContain("add column if not exists bank text");
    expect(migration).toContain("add column if not exists bank_account text");
    expect(migration).toContain("next_bank text default '__KEEP__'");
    expect(migration).toContain("next_bank_account text default '__KEEP__'");
    expect(migration).toContain("public.tenants.bank");
    expect(migration).toContain("public.tenants.bank_account");
  });
});
