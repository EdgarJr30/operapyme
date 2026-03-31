export const platformRoleKeys = [
  "global_admin",
  "platform_support",
  "platform_observer"
] as const;

export const tenantRoleKeys = [
  "tenant_owner",
  "tenant_admin",
  "sales_rep",
  "finance_operator",
  "viewer"
] as const;

export const platformPermissionKeys = [
  "audit.read.global",
  "error.read.global",
  "auth_event.read.global",
  "tenant.manage.global",
  "membership.manage.global",
  "stress.run.global"
] as const;

export const tenantPermissionKeys = [
  "tenant.read",
  "tenant.update",
  "membership.manage",
  "crm.read",
  "crm.write",
  "catalog.read",
  "catalog.write",
  "quote.read",
  "quote.write",
  "invoice.read",
  "invoice.write",
  "expense.read",
  "expense.write",
  "audit.read.tenant"
] as const;

export type PlatformRoleKey = (typeof platformRoleKeys)[number];
export type TenantRoleKey = (typeof tenantRoleKeys)[number];
export type PlatformPermissionKey = (typeof platformPermissionKeys)[number];
export type TenantPermissionKey = (typeof tenantPermissionKeys)[number];

export interface AccessContext {
  platformRoleKeys?: readonly PlatformRoleKey[];
  platformPermissionKeys?: readonly PlatformPermissionKey[];
  tenantPermissionKeys?: readonly TenantPermissionKey[];
}

function hasKey<T extends string>(keys: readonly T[] | undefined, key: T) {
  return keys?.includes(key) ?? false;
}

export function hasPlatformPermission(
  context: AccessContext,
  permissionKey: PlatformPermissionKey
) {
  return (
    hasKey(context.platformRoleKeys, "global_admin") ||
    hasKey(context.platformPermissionKeys, permissionKey)
  );
}

export function hasTenantPermission(
  context: AccessContext,
  permissionKey: TenantPermissionKey
) {
  return (
    hasKey(context.platformRoleKeys, "global_admin") ||
    hasKey(context.tenantPermissionKeys, permissionKey)
  );
}

export function canAccessGlobalAudit(context: AccessContext) {
  return (
    hasPlatformPermission(context, "audit.read.global") &&
    hasPlatformPermission(context, "error.read.global")
  );
}

export function canAccessStressHarness(context: AccessContext) {
  return hasPlatformPermission(context, "stress.run.global");
}
