# Reglas de codigo

## Generales

- ASCII por defecto
- tipos estrictos
- funciones y componentes pequenos
- nombres orientados al dominio, no al rubro de un cliente

## Frontend

- no meter strings visibles hardcodeados
- no consultar Supabase directo desde componentes complejos
- no confiar en guardas de UI para seguridad real
- evitar sinks inseguros como `dangerouslySetInnerHTML` o `innerHTML`

## Backend y datos

- toda accion sensible debe quedar auditada
- preferir RPC o Edge Functions para procesos masivos
- RLS y permisos se prueban, no se asumen
