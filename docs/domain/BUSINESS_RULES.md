# Reglas de negocio

## Reglas transversales

- Todo dato comercial pertenece a un tenant.
- Todo modulo debe poder activarse o desactivarse por plan o feature flag.
- La facturacion actual es documental, no fiscal.
- Ningun permiso importante depende solo del frontend.
- Toda accion relevante debe dejar rastro auditable.

## CRM

- un lead puede nacer por varios canales pero termina en un modelo unico
- cliente y contacto son entidades separadas
- el seguimiento debe registrar proxima accion y responsable

## Cotizaciones y proformas

- una cotizacion puede tener multiples versiones
- enviar o aprobar una cotizacion es evento auditable
- una proforma nace desde una cotizacion o una base equivalente trazable

## Gastos y deudas

- todo gasto debe tener estado y fecha
- deuda y pago parcial deben poder rastrearse
- operaciones financieras ligeras requieren permiso explicito

## Auditoria

- cambios de permisos son auditables
- cambios de configuracion del tenant son auditables
- errores operativos visibles deben quedar registrados
