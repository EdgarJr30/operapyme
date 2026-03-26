# AGENTS.md

## Mision de esta app

`apps/storefront` queda reservado para futuras experiencias publicas por tenant: formularios, enlaces compartibles y presencia publica ligera cuando el roadmap lo pida.

## Reglas clave

- Debe estar optimizada para SEO y velocidad.
- La UX publica debe compartir la misma identidad visual del backoffice, pero con tono mas editorial y comercial.
- No reutilizar chrome de admin en la experiencia publica.
- El tenant debe poder decidir si publica solo formularios o enlaces compartibles segun el alcance activo.
- Formularios publicos deben crear leads limpios y accionables dentro del CRM.
- Todo contenido publico debe soportar dominio custom y branding por tenant.
- El storefront debe arrancar en espanol y soportar ingles desde el primer release.
- Textos publicos, metadata y CTAs deben definirse en `@operapyme/i18n`, no directo en componentes o loaders.

## Reglas tecnicas

- Mantener la logica de tenant, catalogo y visibilidad separada de la presentacion.
- No mezclar estados internos de admin con paginas publicas.
- Cuidar metadata, Open Graph, sitemap y rutas publicables.

## Documentacion viva

- Si cambias SEO, metadata, theming, branding por tenant, visibilidad publica, formularios o comportamiento visible del storefront, actualiza en la misma tarea el `README.md` y el doc fuente que corresponda.
- Si cambian reglas permanentes de esta app, actualiza tambien este `apps/storefront/AGENTS.md`.
