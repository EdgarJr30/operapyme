# Roadmap

## Fase 1: Fundacion segura

- reescribir docs al dominio real
- sembrar RBAC, RLS y auditoria en Supabase
- crear baseline de testing
- reservar modulo `/admin/*`
- reservar `tools/stress-harness`

## Fase 2: Operacion comercial minima

- auth real del backoffice con magic link
- bootstrap inicial de tenant y membership `tenant_owner`
- clientes y contactos
- pipeline CRM simple
- cotizaciones y proformas
- cotizaciones con receptor flexible, line items persistidos y PDF comercial
- gastos y deudas
- lectura real de dashboard, CRM y quotes sobre Supabase antes de ampliar mutaciones
- create/update real de `customers`, `leads` y `quotes` ya sembrado en el backoffice

## Checkpoint QA 2026-03-26

### Estado de Fase 1

- validada por `TASK-59` con suite automatizada base, auth/callback, bootstrap, RBAC, superficies admin reservadas y baseline PWA/i18n
- sin defects funcionales abiertos de severidad alta para el alcance actual
- follow-up tecnico menor abierto: `TASK-66` para limpiar el warning CJS de Vite en la suite

### Estado de Fase 2

- validada funcionalmente para auth del backoffice, dashboard, CRM, quotes, create/update real, empty states, loading/error states y navegacion responsive base
- el tenant demo remoto sigue sin `customers`, `quotes` ni `quote_number_sequences`, por lo que la validacion visual/manual con data comercial no vacia queda diferida
- follow-up abierto: `TASK-69` para sembrar dataset QA minimo sobre el tenant demo y completar esa validacion no vacia

## Fase 3: Control operativo

- reportes clave
- approvals basicas
- tenant setup guiado completo
- feature flags por plan

## Fase 4: Expansiones controladas

- storefront o enlaces publicos
- automatizaciones
- IA comercial modular
- stress tool con ejecucion real ampliada
