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
- una cotizacion puede iniciar desde cliente, lead o receptor rapido no persistido
- toda cotizacion guarda snapshot del receptor aunque exista relacion con CRM
- toda cotizacion necesita al menos una linea comercial persistida
- cada linea de cotizacion puede editar descuento porcentual o descuento fijo; el porcentaje es la referencia operativa y el monto se deriva o recalcula desde esa base
- la cotizacion puede aplicar ademas un descuento global de documento, calculado sobre el subtotal neto despues de los descuentos por linea
- subtotal, descuentos, impuestos y total del documento se derivan desde las lineas y los ajustes globales permitidos del documento; no se editan como totales manuales sueltos
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
