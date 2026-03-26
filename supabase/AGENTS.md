# AGENTS.md

## Principios base

Supabase es el backend principal del SaaS. Toda decision en esta carpeta debe asumir multi-tenant, RLS y auditabilidad.

## Reglas de datos

- Toda tabla de negocio lleva `tenant_id`, salvo tablas globales justificadas.
- RLS debe negar por defecto y abrir solo lo necesario.
- No confiar en permisos de frontend.
- Politicas y funciones deben ser explicitamente multi-tenant.
- Si un cambio afecta integridad o seguridad, documentarlo.

## Migraciones

- Preferir migraciones aditivas.
- No reescribir migraciones aplicadas.
- Nombrar migraciones segun el orden definido en `docs/saas-blueprint.md`.
- Crear seeds solo para templates, demos o configuracion inicial reutilizable.

## Edge Functions

- Son el lugar correcto para IA, webhooks, emails, push y acciones con service role.
- No exponer secretos en frontend.
- Loggear uso, errores y eventos sensibles.

## Auditoria

- Cambios relevantes de cotizaciones, permisos y publicaciones deben dejar rastro.
- Si una accion tiene impacto comercial o de seguridad, debe poder auditarse.
