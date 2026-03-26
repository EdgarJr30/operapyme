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
- gastos y deudas
- lectura real de dashboard, CRM y quotes sobre Supabase antes de ampliar mutaciones
- create/update real de `customers` y `quotes` ya sembrado en el backoffice

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
