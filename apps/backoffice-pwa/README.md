# Backoffice PWA

Esta es la app React real de `OperaPyme`.

## Donde mirar primero

- `src/main.tsx`: entrada principal
- `src/app/`: router, providers y estilos base
- `src/modules/`: pantallas y modulos por dominio
- `src/components/`: componentes reutilizables de app
- `public/`: assets publicos
- `.env.example`: variables publicas del frontend
- `motion` (`motion.dev`): estandar unico para animaciones y transiciones de interfaz

## Variables de entorno

El frontend solo consume variables publicas:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

El `service role key` no vive aqui.

## Acceso y bootstrap

- la entrada de fase 2 vive en `/auth`
- `/auth` usa un layout split editorial con un panel de auth fijo y cambio entre acceso existente y primer ingreso desde el mismo panel
- el acceso existente ya soporta correo + contrasena, magic link alterno y recovery de contrasena desde la misma pantalla
- el primer ingreso sigue naciendo por magic link para no duplicar cuentas ni romper el onboarding actual
- `/auth/callback` confirma sesiones tanto con `code` como con `token_hash`, resuelve recovery de contrasena y devuelve al login si el enlace ya no sirve
- el primer usuario autenticado pasa por `/setup`
- el usuario autenticado ya tiene un modulo `/profile` para definir o actualizar su contrasena sin salir del backoffice
- durante refresh o hidratacion de sesion, el router espera el `accessContext` antes de decidir entre shell o `/setup`, y muestra skeleton loaders de aplicacion en lugar de flashear la pantalla incorrecta
- el bootstrap de auth ahora se apoya en eventos de Supabase + una hidratacion separada del `accessContext`, evitando trabajo duplicado en refresh
- el shell principal solo abre cuando ya existe membership activa en un tenant
- el shell principal del backoffice ahora usa sidebar persistente en desktop, navbar superior con breadcrumbs y acciones globales, drawer movil y bottom navigation tipo app
- el shell usa `motion.dev` para transiciones de pagina, drawer movil, panel de notificaciones y menu de usuario
- el cambio de tenant vive en el shell para mantener el contexto multi-tenant visible en toda la operacion
- la navegacion movil deja los modulos principales en tabs inferiores y mueve configuracion o admin al menu extendido
- el modulo `Aprendizaje` vive fuera del runtime operativo para concentrar guias y paso a paso sin contaminar flujos como crear cotizacion
- la auditoria global sigue reservada para `global_admin`
- `dashboard`, `crm`, `catalog` y `quotes` ya consumen lecturas reales desde Supabase con React Query
- `crm`, `catalog` y `quotes` ya incluyen formularios reales de create/update sobre `customers`, `leads`, `catalog_items` y `quotes`
- las mutaciones siguen limitadas al tenant activo y dejan auditoria via triggers de base
- `catalog` ya modela oferta comercial reusable con `product` o `service`, visibilidad `public/private`, pricing `fixed/on_request` y estados `active/draft/archived`
- `quotes` ya delega la numeracion y el incremento de version a RPCs de Supabase para evitar inconsistencias por concurrencia
- `quotes` ya soporta cliente, lead existente o lead rapido, mantiene snapshot del receptor, persiste line items y genera PDF con `@react-pdf/renderer`
- el cotizador declara `autocomplete` semantico y marca sus campos operativos para que extensiones de autofill o password managers no intenten tratarlos como un formulario de login
- la generacion PDF ya no forma parte del bundle inicial; se carga bajo demanda y se precalienta al enfocar o apuntar la accion de descarga
- el bootstrap de i18n ahora usa interpolacion nativa de i18next con placeholders simples y evita pagar `i18next-icu` en el primer paint
- el toaster global y la pantalla de acceso denegado salen por carga diferida, dejando `feedback-vendor` e `icons-vendor` fuera del bundle inicial
- el bundle base del backoffice ahora separa vendors por dominio, difiere `auth`, `setup`, shell y capa de queries, agrega resource hints hacia Supabase y protege el arranque con un check automatico de presupuesto en `tools/performance/check-backoffice-bundle.mjs`
- `settings` y `/setup` ya permiten elegir presets de branding y una paleta propia basica desde cuatro colores base, con preview en vivo para backoffice y storefront

## Shell y navegacion

- desktop: sidebar fijo, sin scroll, compacto y utility-first; el contenido principal nunca mueve el rail al hacer scroll
- desktop: tipografia, controles y bloques con densidad mas compacta para evitar cards infladas y mantener una lectura mas sobria y profesional
- header: breadcrumbs, busqueda corta, notificaciones operativas, toggle de tema y menu de usuario
- mobile: tab bar inferior para `Inicio`, `CRM` y `Cotizaciones`, con el resto en un drawer lateral mas directo y consistente con el sidebar desktop
- `Catalogo` vive en el menu extendido para priorizar captura y seguimiento comercial rapido en movil
- `Aprendizaje` vive en el menu extendido como espacio separado para onboarding, guias y buenas practicas de uso
- todo el copy del shell sigue saliendo desde `@operapyme/i18n`

## Tailwind

Esta app usa Tailwind v4 en modo CSS-first.

- plugin en `vite.config.ts`
- import base en `src/app/styles.css`
- tema compartido en `../../packages/ui/src/theme/theme.css`
- usar utilidades canónicas de Tailwind cuando existan equivalentes; no dejar clases arbitrarias como `h-[46px]`, `max-w-[32rem]`, `rounded-[24px]` o `[background-size:18px_18px]` si el framework ya ofrece `h-11.5`, `max-w-lg`, `rounded-3xl` o `bg-size-[18px_18px]`

## shadcn/ui y MCP

- Esta app ya queda preparada para `shadcn` CLI y su MCP con `components.json` en `apps/backoffice-pwa/components.json`.
- En este repo, cualquier `add` de `shadcn` para el backoffice debe ejecutarse con `--cwd apps/backoffice-pwa`.
- El destino canonico de componentes UI generados es `apps/backoffice-pwa/src/components/ui`.
- Los aliases esperados por `shadcn` en esta app son `@/components`, `@/components/ui`, `@/lib` y `@/lib/utils`.
- Para Codex, el servidor MCP de `shadcn` se declara en `~/.codex/config.toml`; no se autogenera desde el CLI segun la documentacion oficial.
