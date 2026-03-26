# Reglas de Supabase

## Principios

- multi-tenant desde el esquema
- RLS obligatoria en tablas expuestas
- politicas deny-by-default
- auditoria obligatoria en acciones relevantes

## Tablas

Toda tabla expuesta debe tener:

- `id`
- `tenant_id` cuando aplique
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

## Politicas

- cada politica debe expresar su criterio de tenant y permiso
- evitar politicas genericas ambiguas
- revisar `select`, `insert`, `update` y `delete` por separado

## Funciones

- `security definer` solo cuando este justificado
- documentar cualquier uso de service role
- validar actor y payload antes de acciones masivas

## Seeds y migraciones

- migraciones aditivas
- no editar migraciones aplicadas
- seeds solo para datos reutilizables o de demo controlada
