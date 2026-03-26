# Modelo de auditoria

## Objetivo

Toda accion relevante debe poder responder:

- quien la hizo
- cuando la hizo
- sobre que entidad
- en que tenant
- que cambio
- desde que superficie

## Tipos de evidencia

### `audit_logs`

Eventos funcionales de alto nivel:

- crear
- actualizar
- eliminar logico
- enviar
- aprobar
- rechazar
- asignar rol

### `audit_row_changes`

Before/after por fila para cambios relevantes.

### `app_error_logs`

Errores visibles o operativos:

- frontend recoverable
- edge function
- integraciones
- jobs internos

### `auth_event_logs`

Eventos de seguridad y acceso:

- login exitoso
- login fallido
- password reset
- bloqueo
- intentos masivos

## Reglas

- toda entrada guarda actor, tenant y timestamps cuando aplique
- errores deben poder marcarse como pendientes o corregidos
- la auditoria no debe depender del cliente para completarse
- cambios de permisos y membresias siempre se auditan
