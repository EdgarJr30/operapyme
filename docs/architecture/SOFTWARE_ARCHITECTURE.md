# Arquitectura de software

## Vision

El monorepo se organiza como una plataforma modular con:

- una app principal de backoffice
- paquetes compartidos por dominio, UI e i18n
- backend en Supabase
- herramientas internas separadas para operaciones de plataforma

## Decision de arquitectura

La arquitectura base del producto es un **monolito modular** dentro del monorepo.

No usaremos microservicios en esta fase.

## Por que

- necesitamos velocidad de iteracion
- el equipo aun no gana nada real con distribucion temprana
- RBAC, RLS y auditoria son mas faciles de gobernar con una base unificada
- el producto todavia esta validando sus bounded contexts reales

## Como se aplica

- una app principal concentra la operacion del tenant
- los limites de dominio viven en carpetas y contratos, no en procesos separados
- las herramientas internas viven separadas por superficie, no como microservicios tempranos
- si un bounded context madura y lo justifica, se podra extraer despues

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
- el monolito se mantiene modular por bounded context y paquetes compartidos
