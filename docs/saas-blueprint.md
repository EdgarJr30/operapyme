# Blueprint Inicial de OperaPyme

Fecha de actualizacion: 25 de marzo de 2026

## 1. Nombre y contexto

`OperaPyme` es el nombre temporal de trabajo para este producto.

No es necesariamente el nombre comercial final, pero desde esta fecha se adopta como nombre unificado para:

- documentacion
- metadata local del workspace
- Linear
- package scopes tecnicos

El estado del naming se mantiene en `docs/project-naming.md`.

## 2. Tesis del producto

La oportunidad no esta en competir con ERPs pesados ni en construir otro POS generico.

La apuesta es una `plataforma comercial operativa multi-tenant para pymes` que resuelva el trabajo diario de equipos pequenos que hoy operan con:

- WhatsApp
- Excel
- notas sueltas
- PDFs manuales
- seguimiento informal a clientes y deudas

El producto debe ayudar a vender, documentar y dar seguimiento mejor, sin obligar a entrar de inmediato en POS, inventario o caja.

## 3. Posicionamiento

`OperaPyme` se posiciona como software de gestion operativa para pymes con foco comercial y administrativo liviano.

No venderlo como:

- ERP
- software contable completo
- sistema POS
- facturacion fiscal

Si venderlo como:

- CRM ligero
- cotizaciones y documentos comerciales
- gastos y reportes operativos
- clientes, proveedores y deudas
- backoffice web-first instalable como PWA

## 4. Alcance actual

### Modulos dentro del scope

- autenticacion y organizacion multi-tenant
- RBAC
- CRM ligero
- clientes
- proveedores
- cotizaciones
- proformas
- factura final interna
- gastos
- deudas y seguimiento de cobro
- reportes operativos
- configuracion del tenant
- branding por tenant

### Fuera de alcance por ahora

- POS
- inventario
- caja
- contabilidad completa
- facturacion electronica o fiscal real
- ecommerce publico complejo
- chat interno
- automatizaciones pesadas

## 5. Flujo principal del producto

El flujo central debe sentirse asi:

1. captas o registras un cliente
2. preparas una cotizacion
3. conviertes esa cotizacion en proforma o factura final interna
4. registras gastos relacionados si aplica
5. das seguimiento a cobros o deudas
6. revisas reportes para entender operacion y conversion

La app debe optimizar ese camino antes de abrir mas dominios.

## 6. Usuario objetivo

### ICP inicial

Pymes de 2 a 30 usuarios que:

- venden servicios o productos sin necesitar POS
- preparan cotizaciones con frecuencia
- llevan cuentas por cobrar o saldos pendientes
- necesitan ver gastos y reportes basicos
- trabajan mayormente desde web, pero quieren interfaz usable en movil

### Rubros compatibles

- servicios tecnicos
- agencias y estudios pequenos
- distribuidores que cotizan por pedido
- negocios B2B ligeros
- comercios con operacion comercial sin POS en esta fase

## 7. Diferenciadores

- mobile-first real aunque el acceso inicial sea web
- PWA instalable para equipos internos
- multi-tenant desde el principio
- RBAC desde la base
- documentos comerciales como dominio central
- UX clara para pymes, sin lenguaje enterprise
- branding por tenant sin romper consistencia

## 8. Experiencia de producto

### Canal de acceso

Por ahora el producto es:

- web-only
- responsive
- instalable como PWA

No se construye app nativa en esta fase.

### Principios UX

- primera accion clara por pantalla
- formularios cortos y directos
- lectura rapida en movil
- estados vacios utiles
- errores accionables
- nada que parezca contabilidad pesada

## 9. Arquitectura funcional

### App principal

`apps/backoffice-pwa`

Responsabilidad:

- CRM
- clientes
- proveedores
- cotizaciones
- proformas
- factura final interna
- gastos
- deudas
- reportes
- configuracion

### App publica

`apps/storefront`

No es core del MVP actual. Se mantiene reservada para futuras experiencias publicas como:

- formularios
- enlaces compartibles
- landing o micrositio por tenant

## 10. Modelo funcional base

Entidades iniciales recomendadas:

- tenants
- tenant_users
- roles
- permissions
- customers
- suppliers
- quotes
- quote_items
- commercial_documents
- expenses
- debt_accounts
- debt_events
- report_snapshots
- tenant_branding

## 11. Reglas de negocio iniciales

- toda informacion pertenece a un `tenant_id`
- toda accion protegida por RBAC
- una cotizacion puede pasar a `proforma`
- una cotizacion o proforma puede pasar a `factura_final_interna`
- esa factura final no implica cumplimiento fiscal externo
- gastos y deudas deben contemplar estados, notas y responsable
- reportes iniciales salen de datos operativos, no de cierres contables

## 12. Reporting inicial

Reportes minimos recomendados:

- cotizaciones emitidas
- conversion de cotizacion a proforma
- conversion de cotizacion a factura final interna
- gastos por periodo
- cuentas pendientes por cobrar
- actividad por cliente
- actividad por proveedor

## 13. Guardrails

- no disfrazar un ERP como MVP simple
- no meter inventario "ligero" si en realidad introduce stock, movimientos y conciliacion
- no llamar facturacion a algo fiscal si aun no lo es
- no mezclar branding del tenant con appearance mode
- no construir desktop-first

## 14. Roadmap sugerido

### Fase 0: fundacion

- naming temporal unificado
- arquitectura base del monorepo
- theming por tenant
- i18n es/en
- shell PWA del backoffice

### Fase 1: core comercial

- clientes
- proveedores
- cotizaciones
- proformas
- factura final interna
- CRM ligero

### Fase 2: operacion administrativa

- gastos
- deudas
- reportes operativos
- vistas filtrables por fecha, estado y responsable

### Fase 3: endurecimiento multi-tenant

- RBAC mas granular
- auditoria
- feature flags por plan
- configuracion avanzada por tenant

## 15. Criterio de exito inicial

El MVP va bien si un tenant puede:

1. entrar desde web y usarlo bien en movil
2. crear clientes y proveedores
3. emitir una cotizacion
4. convertirla en proforma o factura final interna
5. registrar gastos
6. revisar deudas y un resumen operativo basico

## 16. Decision de enfoque frente a Treinta

Treinta sigue siendo una referencia util en:

- simplicidad
- mobile-first
- claridad comercial
- activacion rapida

Pero `OperaPyme` no debe copiar su sesgo a:

- POS
- inventario
- caja
- contabilidad operativa pesada

La inspiracion correcta es la claridad de experiencia, no el alcance funcional completo de Treinta.
