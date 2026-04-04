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
- el aislamiento entre tenants se cierra tambien con integridad referencial por `tenant_id`, no solo con politicas

## Funciones helper esperadas

- `current_app_user_id()`
- `current_platform_role_keys()`
- `current_tenant_role_keys(target_tenant_id uuid)`
- `current_tenant_permission_keys(target_tenant_id uuid)`
- `get_my_access_context()`
- `create_tenant_with_owner(target_name text, target_slug text, next_palette_id text default 'slate', next_palette_seed_colors jsonb default null)`
- `has_platform_permission(permission_key text)`
- `has_tenant_permission(target_tenant_id uuid, permission_key text)`
- `touch_updated_at()`
- funciones de auditoria por trigger

## Fase 2 sembrada

La fase 2 ya deja listos estos bloques iniciales:

- acceso por magic link desde Supabase Auth
- acceso mixto para cuentas existentes: magic link mas email y contrasena sobre la misma identidad
- sincronizacion de sesion hacia `app_users`
- RPC `get_my_access_context()` para hidratar roles, permisos y memberships
- RPC `create_tenant_with_owner()` para bootstrap inicial del primer tenant
- recovery de contrasena apoyado en callback de Supabase y actualizacion segura de credenciales desde sesion autenticada
- tablas `customers`, `quotes` e `invoices` con tracking, RLS y auditoria
- hardening de funciones SQL con `search_path` fijo para dejar limpia la linteria de seguridad base
- lectura real del backoffice sobre `customers`, `quotes` e `invoices` usando el tenant activo y RLS
- mutaciones reales de `customers`, `quotes` e `invoices` desde el backoffice usando el tenant activo y las mismas politicas RLS
- numeracion y versionado de `quotes` trasladados a funciones SQL para mantener consistencia y seguridad bajo concurrencia
- numeracion documental de `invoices` trasladada a funciones SQL para mantener consistencia y seguridad bajo concurrencia
- `leads` como entidad minima de CRM para quoting y seguimiento comercial
- `quote_line_items` como detalle persistido del documento
- `invoice_line_items` como detalle persistido de la factura documental
- snapshot documental del receptor dentro de `quotes` para soportar `customer`, `lead` y `ad_hoc`
- snapshot documental del receptor dentro de `invoices` para soportar `customer`, `lead` y `ad_hoc`
- escritura de cotizaciones concentrada en RPCs para evitar inconsistencias de line items y totales
- escritura de facturas concentrada en RPCs para evitar inconsistencias de line items, totales y numeracion
- endurecimiento de grants en RPCs de `quotes`: `create_quote` y `update_quote` quedan para `authenticated`, mientras `replace_quote_line_items` no se expone al cliente

## Primeras tablas operativas

- `customers`: base multi-tenant para clientes del CRM
- `customers.contact_name`: contacto principal para los flujos comerciales del CRM
- `leads`: base multi-tenant para oportunidades y receptores previos a cliente
- `quotes`: base multi-tenant para cotizaciones con version, receptor flexible y snapshot documental
- `quote_line_items`: detalle comercial persistido por cotizacion
- `quote_number_sequences`: contador interno por tenant y anio para generar numeros `COT-YYYY-######`
- `invoices`: base multi-tenant para facturas documentales internas con receptor flexible y origen opcional en cotizacion
- `invoice_line_items`: detalle facturable persistido por factura
- `invoice_number_sequences`: contador interno por tenant y anio para generar numeros `FAC-YYYY-######`

## Reglas duras de aislamiento

- toda query del backoffice debe partir del tenant activo de la sesion
- toda operacion tenant-scoped falla si no recibe tenant activo valido
- `tenant_id` es inmutable despues del insert en `customers`, `leads`, `catalog_items`, `quotes`, `quote_line_items`, `quote_number_sequences`, `invoices`, `invoice_line_items` e `invoice_number_sequences`
- toda relacion entre tablas tenant-scoped debe incluir `tenant_id` en la integridad referencial, no solo el `id`
- ejemplos obligatorios:
  - `quotes (tenant_id, customer_id) -> customers (tenant_id, id)`
  - `quotes (tenant_id, lead_id) -> leads (tenant_id, id)`
  - `quote_line_items (tenant_id, quote_id) -> quotes (tenant_id, id)`
  - `quote_line_items (tenant_id, catalog_item_id) -> catalog_items (tenant_id, id)`
  - `invoices (tenant_id, customer_id) -> customers (tenant_id, id)`
  - `invoices (tenant_id, lead_id) -> leads (tenant_id, id)`
  - `invoices (tenant_id, source_quote_id) -> quotes (tenant_id, id)`
  - `invoice_line_items (tenant_id, invoice_id) -> invoices (tenant_id, id)`
  - `invoice_line_items (tenant_id, catalog_item_id) -> catalog_items (tenant_id, id)`
- RLS controla visibilidad y permiso; las claves compuestas impiden cruces accidentales o maliciosos entre tenants

## Estado del security advisor base

- warnings `function_search_path_mutable` corregidos para las funciones sembradas en fundacion y fase 2
- estado esperado despues del hardening: sin lints de seguridad pendientes en esta base inicial

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
