# Blueprint del SaaS

## Resumen

`OperaPyme` es una plataforma comercial operativa multi-tenant para pymes con enfoque mobile-first y backoffice instalable como PWA.

La fase actual prioriza fundacion segura, velocidad operativa y claridad de producto.

## Modulos core de fase 1

- dashboard operativo
- CRM ligero
- clientes y contactos
- proveedores
- catalogo comercial
- cotizaciones
- proformas
- factura final interna no fiscal
- gastos
- deudas
- reportes operativos
- settings del tenant
- auditoria global y logs

## Modulos reservados, no comprometidos en esta fase

- storefront publico
- automatizaciones avanzadas
- IA comercial
- stress tool interno

## Fuera de alcance

- POS
- inventario
- caja
- contabilidad pesada
- facturacion fiscal o electronica real

## Principios de arquitectura

- multi-tenant desde el primer esquema
- RBAC first
- RLS first
- audit first
- feature flags o plan gates para modulos nuevos
- el frontend nunca es fuente de verdad para autorizacion

## Superficies

### Backoffice

Superficie principal del producto. Debe resolver operacion diaria en movil y desktop.

### Admin global

Consola reservada para plataforma. En fase 1 se usa para ver auditorias, errores y eventos de auth.

### Stress tool

Herramienta separada del backoffice para ejecutar pruebas masivas controladas con JSON o CSV. No debe apuntar a produccion por defecto.

## Resultado esperado de esta fase

- reglas de producto alineadas
- docs reescritos al dominio real
- base de testing instalada
- fundacion segura de Supabase documentada y sembrada
- superficies admin y stress tool reservadas
