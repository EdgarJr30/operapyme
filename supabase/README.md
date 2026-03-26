# Supabase

Esta carpeta contiene la fundacion de backend para `OperaPyme`.

## Convenciones

- migraciones aditivas
- multi-tenant desde el esquema
- RLS obligatoria en tablas expuestas
- columnas de tracking obligatorias
- auditoria obligatoria en acciones relevantes

## Contenido

- `migrations/`: esquema, helpers, triggers y politicas
- `functions/`: edge functions para acciones sensibles o masivas
- `seeds/`: datos reutilizables y demos controladas

## Regla de seguridad

El cliente no tiene autorizacion real. La autorizacion real vive en permisos, funciones SQL y politicas RLS.
