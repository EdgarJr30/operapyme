# Reglas de seguridad

## Principios no negociables

- RBAC first
- RLS first
- audit first
- minimo privilegio
- deny-by-default

## OWASP y secure-by-default

- no confiar en la UI para autorizacion
- no enviar secretos al cliente
- no usar sinks inseguros de HTML o ejecucion dinamica
- validar y auditar acciones state-changing
- limitar abuso por actor, tenant y tipo de operacion

## Reglas de acceso

- permisos atomicos
- claims y memberships claros
- acceso a auditoria global solo para `global_admin` en fase 1

## Reglas de observabilidad

- errores visibles deben registrarse
- auth events sensibles deben registrarse
- operaciones masivas deben registrar actor, volumen y resultado

## Reglas anti-abuso

- proteger login masivo
- proteger imports o mutaciones masivas
- limitar colas intensivas
- separar herramientas internas de stress del backoffice cliente
