import {
  canAccessGlobalAudit,
  canAccessStressHarness,
  hasTenantPermission
} from "@operapyme/domain";

describe("RBAC helpers", () => {
  it("allows global admin into the global audit surface", () => {
    expect(
      canAccessGlobalAudit({
        platformRoleKeys: ["global_admin"]
      })
    ).toBe(true);
  });

  it("denies global audit without the required global permissions", () => {
    expect(
      canAccessGlobalAudit({
        platformPermissionKeys: ["audit.read.global"]
      })
    ).toBe(false);
  });

  it("keeps tenant permissions separate from platform permissions", () => {
    expect(
      hasTenantPermission(
        {
          tenantPermissionKeys: ["crm.write", "quote.read"]
        },
        "quote.read"
      )
    ).toBe(true);

    expect(
      hasTenantPermission(
        {
          tenantPermissionKeys: ["crm.write", "quote.read"]
        },
        "expense.write"
      )
    ).toBe(false);
  });

  it("gates the stress harness through platform permissions", () => {
    expect(
      canAccessStressHarness({
        platformPermissionKeys: ["stress.run.global"]
      })
    ).toBe(true);
  });
});
