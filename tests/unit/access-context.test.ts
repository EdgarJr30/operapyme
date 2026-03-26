import {
  createEmptyBackofficeAccessContext,
  getPrimaryTenantMembership,
  hasBootstrappedTenant,
  isGlobalAuditVisible
} from "@operapyme/domain";

describe("access context helpers", () => {
  it("detects when the user still has no active tenant", () => {
    expect(hasBootstrappedTenant(createEmptyBackofficeAccessContext())).toBe(false);
  });

  it("picks the preferred active tenant when available", () => {
    const context = {
      ...createEmptyBackofficeAccessContext(),
      memberships: [
        {
          membershipId: "membership-1",
          tenantId: "tenant-a",
          tenantName: "Tenant A",
          tenantSlug: "tenant-a",
          status: "active" as const,
          tenantRoleKeys: ["tenant_owner" as const]
        },
        {
          membershipId: "membership-2",
          tenantId: "tenant-b",
          tenantName: "Tenant B",
          tenantSlug: "tenant-b",
          status: "active" as const,
          tenantRoleKeys: ["tenant_admin" as const]
        }
      ]
    };

    expect(getPrimaryTenantMembership(context, "tenant-b")?.tenantName).toBe(
      "Tenant B"
    );
  });

  it("reuses the global audit helper against a full backoffice context", () => {
    const context = {
      ...createEmptyBackofficeAccessContext(),
      platformPermissionKeys: ["audit.read.global", "error.read.global"]
    };

    expect(isGlobalAuditVisible(context)).toBe(true);
  });
});
