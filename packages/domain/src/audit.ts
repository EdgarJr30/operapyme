export const auditActionKeys = [
  "create",
  "update",
  "delete_soft",
  "send",
  "approve",
  "reject",
  "assign_role"
] as const;

export const auditEntityKeys = [
  "tenant",
  "membership",
  "lead",
  "customer",
  "catalog_item",
  "quote",
  "expense",
  "error_log",
  "auth_event"
] as const;

export const appErrorSeverityKeys = [
  "info",
  "warning",
  "error",
  "critical"
] as const;

export const authEventTypeKeys = [
  "login_success",
  "login_failure",
  "password_reset_requested",
  "password_reset_completed",
  "rate_limit_triggered",
  "account_locked"
] as const;

export type AuditActionKey = (typeof auditActionKeys)[number];
export type AuditEntityKey = (typeof auditEntityKeys)[number];
export type AppErrorSeverityKey = (typeof appErrorSeverityKeys)[number];
export type AuthEventTypeKey = (typeof authEventTypeKeys)[number];

export function isAuditableAction(action: string): action is AuditActionKey {
  return auditActionKeys.includes(action as AuditActionKey);
}

export function isCriticalErrorSeverity(severity: AppErrorSeverityKey) {
  return severity === "critical";
}
