# Arquitectura Supabase

## Objetivo

Construir un backend seguro con estas prioridades:

1. RBAC first
2. RLS first
3. audit first

## Modelo base

### Identidad

- `auth.users` sigue siendo la fuente de identidad primaria de Supabase Auth
- `public.app_users` sincroniza la identidad util del producto

### Acceso global

- `platform_roles`
- `platform_role_permissions`
- `app_user_platform_roles`

### Acceso por tenant

- `tenant_memberships`
- `tenant_roles`
- `tenant_role_permissions`
- `tenant_membership_roles`

### Auditoria y observabilidad

- `audit_logs`
- `audit_row_changes`
- `app_error_logs`
- `auth_event_logs`

## Columnas obligatorias

Toda tabla publica o expuesta debe definir:

- `id`
- `tenant_id` cuando aplique
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

## Politicas

- RLS habilitada en toda tabla expuesta
- politicas deny-by-default
- acceso por claims y helpers SQL
- el frontend nunca sustituye RLS

## Funciones helper esperadas

- `current_app_user_id()`
- `current_platform_role_keys()`
- `has_platform_permission(permission_key text)`
- `has_tenant_permission(target_tenant_id uuid, permission_key text)`
- `touch_updated_at()`
- funciones de auditoria por trigger

## Reglas para operaciones sensibles

No exponer como CRUD cliente directo:

- acciones masivas
- asignaciones de roles
- imports
- jobs internos
- escrituras que alteren multiples tenants

Deben ir por RPC o Edge Function con:

- validacion fuerte
- limites de volumen
- logging de actor y resultado

## Acceso a auditorias

- fase 1: solo `global_admin` ve auditoria completa
- fase posterior: `tenant_admin` con acceso parcial filtrado
