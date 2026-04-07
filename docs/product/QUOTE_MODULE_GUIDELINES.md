# Modulo de Cotizaciones

Fecha de actualizacion: 2026-03-27

## Objetivo

Definir el criterio de producto, datos y experiencia para el modulo de cotizaciones de `OperaPyme`.

Este modulo debe permitir cotizar rapido desde movil sin obligar a que todo el contexto comercial ya este limpio o completo.

## Principios

- una cotizacion puede iniciar desde un cliente existente
- una cotizacion puede iniciar desde un lead existente
- una cotizacion puede iniciar desde un lead rapido no persistido
- el documento debe guardar snapshot del receptor aunque luego escale a lead o cliente
- toda cotizacion necesita al menos una linea comercial persistida
- los totales deben salir de las lineas, no de campos agregados editados a mano
- el PDF debe salir listo para enviar sin maquetacion manual adicional

## Buenas practicas sintetizadas

### Receptor flexible, pero trazable

La practica comun en herramientas maduras es permitir que la cotizacion nazca desde entidades comerciales ya existentes y, cuando hace falta, capturar el receptor minimo en el momento.

Para `OperaPyme` esto se traduce en:

- `recipient_kind = customer | lead | ad_hoc`
- `customer_id` o `lead_id` cuando exista relacion real
- snapshot del receptor en la cotizacion: nombre visible, contacto y canales

Esto evita perder velocidad comercial y al mismo tiempo conserva historial cuando el CRM evoluciona.

### Line items primero

Las plataformas maduras de quoting centran la cotizacion en line items con:

- nombre del servicio o producto
- descripcion o alcance
- cantidad
- precio unitario
- descuentos
- impuestos
- total por linea

En `OperaPyme` las lineas viven en `quote_line_items` y el total del documento se deriva en SQL desde esas lineas, mas cualquier descuento global permitido a nivel de documento.

Para descuentos por linea:

- la UI debe permitir descuento porcentual y descuento fijo
- el porcentaje es la referencia operativa principal
- cuando cambia cantidad o precio, el descuento fijo se recalcula desde el porcentaje vigente
- si el usuario ajusta el monto fijo, la UI debe derivar el porcentaje equivalente para mantener ambos visibles y sincronizados
- la persistencia actual sigue guardando `discount_total` por linea como valor documental final y `quotes.discount_total` como descuento combinado del documento

### Documento comercial serio

Una cotizacion profesional necesita:

- numero del documento
- fecha del documento o emision
- fecha de validez
- branding visible
- receptor claro
- line items legibles
- codigo del articulo cuando aplique
- subtotal, descuentos, impuestos y total
- notas o condiciones comerciales
- anexo historico opcional para contexto de soporte

### Versionado y seguridad

El documento debe poder cambiar sin perder trazabilidad.

Por eso:

- la numeracion sigue en base de datos
- el versionado sigue en base de datos
- la escritura operativa del documento se hace por RPC
- la UI no calcula el numero ni decide autorizacion real

## Decisiones de implementacion

### Modelo

- `leads` se materializa como entidad minima de CRM
- `quotes` ahora guarda receptor vinculado y snapshot documental
- `quote_line_items` guarda el detalle comercial persistido
- `quote_line_items` tambien debe poder conservar `item_code` como snapshot documental cuando exista
- `quotes` debe guardar `issued_on` como fecha documental editable, separada de `created_at`
- `quotes` puede guardar un solo anexo historico por documento en esta fase
- `quotes` deja de depender de `customer_id` obligatorio para soportar `lead` y `ad_hoc`

### PDF

Se estandariza `@react-pdf/renderer` para PDFs comerciales del backoffice.

Motivos:

- renderer oficial para React web y browser-side generation
- layout declarativo, no basado en `window.print()`
- soporte para descarga controlada
- soporte para imagenes y SVG, util para logo y branding
- encaja mejor con React 19 que un enfoque imperativo de canvas o HTML-to-PDF

Version instalada en el workspace durante esta tarea: `@react-pdf/renderer@^4.3.2`.

### UX del builder

- el builder trabaja por bloques: receptor, metadata, line items, totales y notas
- la landing del modulo ya no debe mezclar overview, create y update en el mismo scroll
- el flujo principal del builder se resuelve por pasos cortos: receptor, documento, line items y revision
- los defaults priorizan velocidad: si hay clientes, inicia desde cliente; si no, desde lead; si no, desde lead rapido
- cuando se elige cliente o lead, el formulario hidrata el snapshot documental y permite ajustarlo
- en line items, descuento % y descuento fijo conviven en la misma fila con sincronizacion bidireccional y porcentaje como base operativa
- el builder permite ademas un descuento global en cabecera para el documento completo, con porcentaje como base y monto fijo sincronizado
- el descuento global se calcula sobre el subtotal neto despues de los descuentos por linea, antes del total final del documento
- el PDF se genera bajo demanda desde una cotizacion ya guardada

## Alcance de esta iteracion

- leads minimos persistidos en CRM
- cotizaciones con `customer`, `lead` y `ad_hoc`
- line items persistidos
- PDF elegante con branding base, fechas y detalle por linea

## Fuera de alcance en esta iteracion

- aprobaciones multinivel
- firma electronica
- links publicos con acceptance flow
- conversion automatica a proforma o factura interna
- branding real por tenant con asset persistido en backend

## Research y fuentes

### HubSpot Knowledge Base

- `Create and share quotes`, actualizado el 2025-05-16
- `Set up quotes`, actualizado el 2026-03-12
- Patron relevante: line items, branding, expiracion, templates, tracking y aprobaciones

https://knowledge.hubspot.com/deals/approve-quotes?zorseWidget=
https://knowledge.hubspot.com/quotes/set-up-quotes?iframe=yes

### Zoho CRM Knowledge Base

- `CRM | Quotes`
- Patron relevante: quotes con validity date, campos estandar, inventario comercial y trabajo por line items

https://help.zoho.com/portal/en/kb/crm/manage-inventory/quotes

### Stripe Docs

- `Quotes overview`
- Patron relevante: quote iniciada desde customer existente o customer nuevo, expiracion y aceptacion formal del documento

https://docs.stripe.com/quotes/overview

### React-pdf

- Documentacion general del renderer
- Blog `Announcing react-pdf v2`
- Patron relevante: renderer dedicado, `PDFDownloadLink`, `usePDF`, soporte de SVG e imagenes

https://v2.react-pdf.org/
https://react-pdf.org/blog/announcing-react-pdf-v2
