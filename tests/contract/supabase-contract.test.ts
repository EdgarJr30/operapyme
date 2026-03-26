// @vitest-environment node

import fs from "node:fs";
import path from "node:path";

const migrationPath = path.resolve(
  "supabase/migrations/202603250001_foundation_security.sql"
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
});
