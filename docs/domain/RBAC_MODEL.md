# Modelo RBAC

## Principio

`OperaPyme` es RBAC first. Todo acceso a datos o acciones viaja por roles y permisos, no por condiciones dispersas en UI.

## Capas de acceso

### Plataforma

Roles globales para administrar el SaaS completo.

Roles iniciales:

- `global_admin`
- `platform_support`
- `platform_observer`

### Tenant

Roles dentro de cada tenant.

Roles iniciales:

- `tenant_owner`
- `tenant_admin`
- `sales_rep`
- `finance_operator`
- `viewer`

## Permisos atomicos sugeridos

- `tenant.read`
- `tenant.update`
- `membership.manage`
- `crm.read`
- `crm.write`
- `catalog.read`
- `catalog.write`
- `quote.read`
- `quote.write`
- `expense.read`
- `expense.write`
- `audit.read.global`
- `audit.read.tenant`
- `error.read.global`
- `role.assign`

## Reglas

- UI puede ocultar acciones, pero backend decide autorizacion real.
- RLS debe apoyarse en helpers de permisos.
- Acciones sensibles o masivas requieren permiso y backend dedicado.
- En fase 1 solo `global_admin` accede a auditoria global completa.
- El acceso parcial de `tenant_admin` queda diferido.
