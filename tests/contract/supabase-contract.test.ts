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
});
