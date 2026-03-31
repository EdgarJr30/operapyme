# AGENTS.md

## Principios base

Supabase es el backend principal del SaaS. Toda decision en esta carpeta debe asumir multi-tenant, RLS y auditabilidad.

La prioridad tecnica de esta carpeta es:

- RBAC first
- RLS first
- audit first
- minimo privilegio
- deny-by-default

## Reglas de datos

- Toda tabla de negocio lleva `tenant_id`, salvo tablas globales justificadas.
- Toda tabla expuesta lleva `created_at`, `updated_at`, `created_by` y `updated_by`.
- RLS debe negar por defecto y abrir solo lo necesario.
- No confiar en permisos de frontend.
- Politicas y funciones deben ser explicitamente multi-tenant.
- `tenant_id` no se reasigna por `update` en tablas tenant-scoped.
- Toda relacion entre tablas tenant-scoped debe incluir integridad referencial compuesta con `tenant_id`.
- Si un cambio afecta integridad o seguridad, documentarlo.
- Cambios de permisos, membresias, cotizaciones, errores y auth events deben ser auditables.

## Migraciones

- Preferir migraciones aditivas.
- No reescribir migraciones aplicadas.
- Nombrar migraciones segun el orden definido en `docs/saas-blueprint.md`.
- Crear seeds solo para templates, demos o configuracion inicial reutilizable.
- Si una accion es sensible o masiva, preferir RPC o Edge Function en vez de CRUD cliente directo.

## Edge Functions

- Son el lugar correcto para IA, webhooks, emails, push y acciones con service role.
- No exponer secretos en frontend.
- Loggear uso, errores y eventos sensibles.
- Aplicar limites por actor, tenant y tipo de accion cuando haya riesgo de abuso.

## Auditoria

- Cambios relevantes de cotizaciones, permisos y publicaciones deben dejar rastro.
- Si una accion tiene impacto comercial o de seguridad, debe poder auditarse.
- El admin global es el unico con acceso completo a auditoria en fase 1.
