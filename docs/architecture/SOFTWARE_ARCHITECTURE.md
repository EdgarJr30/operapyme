# Arquitectura de software

## Vision

El monorepo se organiza como una plataforma modular con:

- una app principal de backoffice
- paquetes compartidos por dominio, UI e i18n
- backend en Supabase
- herramientas internas separadas para operaciones de plataforma

## Capas

### Apps

- `apps/backoffice-pwa`: operacion diaria del tenant
- `apps/storefront`: reservado
- `tools/stress-harness`: reservado para pruebas masivas internas

### Packages

- `packages/domain`: permisos, helpers RBAC, contratos y tipos
- `packages/ui`: primitives y theming compartido
- `packages/i18n`: recursos `es/en` y setup compartido

### Backend

- `supabase/migrations`: esquema y politicas
- `supabase/functions`: acciones sensibles, masivas o con service role
- `supabase/seeds`: semillas reutilizables

## Bounded contexts iniciales

- platform access
- tenant management
- CRM
- catalog
- quoting
- finance-lite
- auditing and observability

## Reglas

- el dominio no depende de componentes visuales
- el cliente no decide autorizacion
- cualquier operacion sensible cruza por backend con trazabilidad
