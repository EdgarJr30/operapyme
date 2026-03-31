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
- `tenant_id` inmutable despues del insert en tablas tenant-scoped
- claves y referencias que impidan relaciones cruzadas entre tenants cuando una tabla tenant-scoped apunte a otra

## Aislamiento por tenant

- todo acceso de lectura y escritura debe resolverse bajo un tenant activo valido
- el frontend puede filtrar por `tenant_id`, pero ese filtro nunca sustituye las garantias de la base
- toda tabla tenant-scoped que referencie otra tabla tenant-scoped debe amarrarse por claves compuestas con `tenant_id`
- no se permite mover registros de un tenant a otro via `update`
- si una operacion necesita contexto de tenant, debe fallar cuando ese contexto falte o venga vacio
- los RPC `security definer` deben validar explicitamente el tenant objetivo antes de escribir

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
