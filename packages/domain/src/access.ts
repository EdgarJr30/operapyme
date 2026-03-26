import {
  canAccessGlobalAudit,
  type AccessContext,
  type PlatformPermissionKey,
  type PlatformRoleKey,
  type TenantPermissionKey,
  type TenantRoleKey
} from "./rbac";

export interface TenantMembershipAccess {
  membershipId: string;
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  status: "invited" | "active" | "suspended";
  tenantRoleKeys: TenantRoleKey[];
}

export interface BackofficeAccessContext extends AccessContext {
  appUserId: string | null;
  email: string | null;
  displayName: string | null;
  isGlobalAdmin: boolean;
  memberships: TenantMembershipAccess[];
  platformRoleKeys: PlatformRoleKey[];
  platformPermissionKeys: PlatformPermissionKey[];
  tenantPermissionKeys: TenantPermissionKey[];
}

export function createEmptyBackofficeAccessContext(): BackofficeAccessContext {
  return {
    appUserId: null,
    email: null,
    displayName: null,
    isGlobalAdmin: false,
    memberships: [],
    platformRoleKeys: [],
    platformPermissionKeys: [],
    tenantPermissionKeys: []
  };
}

export function hasBootstrappedTenant(context: BackofficeAccessContext | null) {
  return Boolean(
    context?.memberships.some((membership) => membership.status === "active")
  );
}

export function getPrimaryTenantMembership(
  context: BackofficeAccessContext | null,
  preferredTenantId?: string | null
) {
  if (!context) {
    return null;
  }

  const activeMemberships = context.memberships.filter(
    (membership) => membership.status === "active"
  );

  if (activeMemberships.length === 0) {
    return null;
  }

  if (preferredTenantId) {
    const preferredMembership = activeMemberships.find(
      (membership) => membership.tenantId === preferredTenantId
    );

    if (preferredMembership) {
      return preferredMembership;
    }
  }

  return activeMemberships[0];
}

export function isGlobalAuditVisible(
  context: BackofficeAccessContext | null | undefined
) {
  if (!context) {
    return false;
  }

  return canAccessGlobalAudit(context);
}
