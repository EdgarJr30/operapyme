# AGENTS.md

## Mision de esta app

`apps/backoffice-pwa` es la app interna del SaaS. Debe sentirse como una herramienta de trabajo diaria, rapida, clara e instalable.

## Reglas de arquitectura

- React 19 + TypeScript + Vite.
- Tailwind CSS v4 con tokens en CSS-first config.
- React Query para datos remotos.
- React Hook Form + Zod para formularios.
- Supabase para auth, datos y realtime.
- Organizar por dominios dentro de `src/modules/*`.
- Rutas administrativas reservadas bajo `/admin/*` para auditoria global y errores operativos.

## Reglas de UI

- Mobile-first de verdad: disenar primero en 390px-430px.
- `docs/governance/UI_UX_RULES.md` es obligatorio para cualquier cambio visual o de UX en esta app.
- No usar layouts desktop-first encogidos.
- Bottom navigation en movil; sidebar solo en desktop amplio.
- El sidebar desktop debe quedar fijo e independiente del scroll del contenido; no se permite usar scroll del rail como solucion de layout.
- CTA principal visible sin tener que buscarlo.
- Touch targets minimos de 44px.
- Inputs con label arriba, nunca solo placeholder.
- No usar modales para flujos largos en movil; preferir pantalla completa o drawer.
- No convertir dark mode en la identidad visual por defecto ni en un dashboard oscuro saturado.
- No usar morado generico como color principal.
- Usar la direccion visual definida en `docs/ui-ux-direction.md`.
- Las pantallas runtime del backoffice deben abrir con resumen operativo, acciones y estados reales; no usar cards de blueprint, scaffold, reglas internas o explicaciones tecnicas dentro de la app.
- Toda animacion, transicion de entrada o salida, drawer, popover o apertura/cierre de modal debe implementarse con `motion.dev` (`motion`).
- Respetar `prefers-reduced-motion` con la configuracion global de Motion y evitar animaciones decorativas que ralenticen tareas operativas.
- El idioma por defecto del backoffice es espanol.
- Todo texto visible debe salir de `@operapyme/i18n` con claves `es` y `en`.
- Si una vista nueva requiere cambio de idioma, persistir la preferencia del usuario sin romper el fallback a espanol.
- Soportar `light`, `dark` y `system` sin romper la misma jerarquia visual ni convertir dark mode en una interfaz neon o gamer.
- Consumir tokens semanticos de superficie, borde, texto y acento; evitar hardcodear `white`, `black` o colores por cliente en componentes de app.

## Reglas de codigo

- Componentes pequenos y orientados a una sola responsabilidad.
- Hooks de datos cerca del dominio, no en carpetas globales gigantes.
- Validacion siempre compartida con Zod cuando haya formulario.
- No consultar Supabase directo desde componentes visuales complejos; encapsular acceso.
- No resolver autorizacion real en UI; la UI solo expresa estados de permiso.
- Evitar props drilling profundo. Elevar o aislar estado.
- En Tailwind, preferir siempre la clase canonica del framework cuando ya exista una equivalente.
- Evitar utilidades arbitrarias de tamano, radio, ancho o propiedades inline cuando Tailwind ya tenga una clase estandar.
- Antes de dejar una clase como `h-[46px]`, `max-w-[32rem]`, `rounded-[24px]` o `[background-size:18px_18px]`, comprobar si existe una forma canonica como `h-11.5`, `max-w-lg`, `rounded-3xl` o `bg-size-[18px_18px]`.
- Si el editor sugiere `suggestCanonicalClasses`, tomarlo como correccion esperada y no como warning opcional.

## Reglas de producto

- Cada pantalla debe responder a una pregunta operativa concreta.
- Priorizar flujos: captar lead, crear cotizacion, convertir a proforma o factura final interna, registrar gasto, hacer seguimiento.
- Mostrar contexto de tenant, estado y proximas acciones sin ruido.
- Las notificaciones deben ayudar a actuar, no solo informar.
- El modulo admin global esta separado del backoffice comercial y no debe mezclarse con flujos del tenant.

## Offline y PWA

- Priorizar borradores, datos operativos recientes y cola de acciones.
- Marcar claramente cuando una accion esta en cola.
- Nunca ocultar si un dato es stale, local o sincronizado.

## Accesibilidad

- No depender solo del color para estados.
- Contraste suficiente en textos y CTAs.
- Focus visible.
- Iconos acompanados por texto cuando afecten una accion importante.

## Documentacion viva

- Si cambias shell, navegacion, settings, theming, i18n, offline, setup, variables de entorno o cualquier flujo visible del backoffice, actualiza en la misma tarea el `README.md` y el doc fuente que corresponda.
- Si cambian reglas permanentes de esta app, actualiza tambien este `apps/backoffice-pwa/AGENTS.md`.
