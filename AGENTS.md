# AGENTS.md

## Proposito del repo

Este monorepo construye `OperaPyme`, nombre temporal de trabajo para una plataforma comercial operativa multi-tenant para pymes.

El enfoque actual del producto es:

- gestion operativa para pymes
- acceso web first
- experiencia mobile-first totalmente responsive
- backoffice instalable como PWA
- CRM ligero
- cotizaciones
- proformas
- factura final interna sin facturacion fiscal real
- gastos y reportes
- clientes, proveedores y deudas

Fuera de alcance por ahora:

- POS
- inventario
- caja
- facturacion electronica o fiscal real
- ERP pesado

## Fuentes de verdad

Antes de proponer arquitectura, modelo de datos o UX, revisar:

- `docs/saas-blueprint.md`
- `docs/ui-ux-direction.md`
- `docs/tenant-theming.md`
- `README.md`

Si una decision nueva cambia el rumbo del producto, documentarla primero.

Para documentacion operativa viva, mapas, flujos, diagramas, decisiones y contexto transversal del proyecto, usar tambien `MoonCode > Saas Opera Pyme` en Notion.

Acceso canonico para automatizacion y herramientas:

- pagina exacta: `https://www.notion.so/32fe6e1411f6810286dcf8f2960d1a22`
- page id: `32fe6e14-11f6-8102-86dc-f8f2960d1a22`
- parent data source de `MoonCode`: `collection://803ae008-dcb7-4ba3-9a09-d8426729c20a`

Para evitar `RequestTimeoutError`, preferir siempre abrir la pagina exacta por URL o `page_id`. Evitar como primera opcion:

- buscarla por workspace search amplio
- abrir la base completa de `MoonCode`
- depender de busquedas semanticas cuando ya existe la URL canonica

El repo sigue siendo la fuente de verdad para codigo, arquitectura formal y reglas operativas persistentes. Notion complementa al repo como espacio visual y de trabajo vivo.

## Reglas no negociables

- Mobile-first siempre.
- El backoffice debe comportarse como PWA instalable.
- Multi-tenant desde la base.
- RBAC obligatorio.
- `tenant_id` + RLS son parte del diseno, no un extra.
- No construir un ERP pesado.
- No meter POS, inventario o caja en esta fase del producto.
- La facturacion actual es documental, no fiscal.
- Todo modulo nuevo debe poder activarse o desactivarse por plan o feature flag.
- El idioma base del producto es espanol.
- Toda UI nueva debe salir con soporte `es` y `en` desde `packages/i18n`, no con strings hardcodeados en componentes.
- La apariencia visual se divide en dos capas: modo de usuario o dispositivo (`light`, `dark`, `system`) y branding por tenant con paletas curadas.
- Todo cambio visual debe apoyarse en tokens semanticos y mantener contraste, calma visual e identidad consistente.

## Filosofia de producto

- Priorizar tiempo a valor.
- Preferir setup guiado por wizard antes que configuracion manual extensa.
- Preferir plantillas y parametrizacion antes que logica hecha a medida.
- Toda funcionalidad debe poder entenderse rapido en movil.
- Si una pantalla requiere explicacion larga, la UX todavia no esta lista.
- Resolver primero operaciones comerciales y administrativas diarias antes que expansion a modulos pesados.

## Estructura esperada

- `apps/backoffice-pwa`: operacion interna, mobile-first, PWA instalable.
- `apps/storefront`: reservado para futuras experiencias publicas, formularios o enlaces compartibles.
- `packages/*`: dominio, UI, configuracion, offline e i18n compartido.
- `supabase/*`: schema, seeds, edge functions y politicas.
- `docs/*`: decisiones, research y direccion de producto/diseno.

## Reglas para cambios

- No agregar dependencias si el problema ya se resuelve con el stack actual.
- Mantener ASCII por defecto al editar archivos.
- No mezclar logica de dominio con componentes de presentacion.
- Evitar nombres ligados a un rubro especifico en el core.
- Todo cambio de datos debe contemplar estados vacios, errores y permisos.
- Todo cambio relevante debe evaluar si requiere actualizacion en `MoonCode > Saas Opera Pyme`.
- Toda iniciativa, bug, mejora o tarea accionable debe crearse o mantenerse en Linear.
- Por defecto, toda tarea creada en Linear para este proyecto debe asignarse a `me`, salvo instruccion explicita del usuario para asignarla a otra persona.
- El usuario autoriza crear tareas en Linear directamente sin pedir confirmacion previa. Solo hace falta informar en la salida final que se creo o actualizo.
- Notion documenta contexto, mapas, diagramas, flujos y decisiones; Linear documenta ejecucion, prioridad, responsable y seguimiento.
- Cuando una herramienta automatizada necesite entrar a Notion, usar primero la URL canonica de `Saas Opera Pyme` y no la base completa de `MoonCode`.

## Calidad minima de entrega

Una entrega esta incompleta si no incluye:

- responsive usable en movil
- accesibilidad basica
- empty states
- loading y error states
- textos claros
- permisos coherentes con RBAC si toca datos o acciones

## Documentacion

- El `README.md` debe mantenerse en espanol e ingles.
- Docs de onboarding, arquitectura y reglas deben quedar dentro del repo.
- Research con datos de mercado o producto debe llevar fecha y fuentes.
- Mientras no exista nombre comercial definitivo, usar `OperaPyme` como nombre temporal de trabajo y mantener documentado el estado del naming en `docs/project-naming.md`.

## Politica de sincronizacion documental

- Si una tarea cambia reglas de negocio, capacidades del producto, arquitectura, UX, theming, setup, scripts, dependencias relevantes, variables de entorno o cualquier comportamiento visible, actualizar la documentacion en la misma tarea.
- Si el cambio impacta el entendimiento general del repo, actualizar `README.md`.
- Si el cambio agrega, endurece o cambia reglas operativas del equipo o de Codex, actualizar este `AGENTS.md`.
- Si el cambio afecta solo a una app, actualizar tambien su `apps/*/AGENTS.md`.
- Si el cambio afecta direccion visual, branding o apariencia, actualizar `docs/ui-ux-direction.md` y `docs/tenant-theming.md` cuando corresponda.
- Si el cambio afecta arquitectura, alcance del producto o modulos core, actualizar `docs/saas-blueprint.md`.
- Si una tarea introduce o cambia flujos, mapas, diagramas, decisiones de producto o contexto operativo util para el equipo, actualizar tambien Notion en `MoonCode > Saas Opera Pyme` dentro de la misma tarea.
- Si una tarea requiere seguimiento accionable, crear o actualizar su tarea correspondiente en Linear dentro de la misma tarea.
- No dejar deuda documental para despues cuando el alcance del cambio ya esta claro.
