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
});
