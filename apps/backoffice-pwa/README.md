# Backoffice PWA

Esta es la app React real de `OperaPyme`.

## Donde mirar primero

- `src/main.tsx`: entrada principal
- `src/app/`: router, providers y estilos base
- `src/modules/`: pantallas y modulos por dominio
- `src/components/`: componentes reutilizables de app
- `public/`: assets publicos
- `.env.example`: variables publicas del frontend

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
- `/auth/callback` confirma sesiones tanto con `code` como con `token_hash` y devuelve al login si el enlace ya no sirve
- el primer usuario autenticado pasa por `/setup`
- el shell principal solo abre cuando ya existe membership activa en un tenant
- el shell principal del backoffice ahora usa sidebar persistente en desktop, navbar superior con breadcrumbs y acciones globales, drawer movil y bottom navigation tipo app
- el cambio de tenant vive en el shell para mantener el contexto multi-tenant visible en toda la operacion
- la navegacion movil deja los modulos principales en tabs inferiores y mueve configuracion o admin al menu extendido
- la auditoria global sigue reservada para `global_admin`
- `dashboard`, `crm`, `catalog` y `quotes` ya consumen lecturas reales desde Supabase con React Query
- `crm`, `catalog` y `quotes` ya incluyen formularios reales de create/update sobre `customers`, `catalog_items` y `quotes`
- las mutaciones siguen limitadas al tenant activo y dejan auditoria via triggers de base
- `catalog` ya modela oferta comercial reusable con `product` o `service`, visibilidad `public/private`, pricing `fixed/on_request` y estados `active/draft/archived`
- `quotes` ya delega la numeracion y el incremento de version a RPCs de Supabase para evitar inconsistencias por concurrencia
- el bundle base del backoffice ahora separa vendors por dominio y solo carga los namespaces de i18n que la app realmente necesita

## Shell y navegacion

- desktop: sidebar utilitario con grupos de modulos, cambio de tenant visible y acceso rapido a cerrar sesion
- header: breadcrumbs, busqueda corta, notificaciones operativas, toggle de tema y menu de usuario
- mobile: tab bar inferior para `Inicio`, `CRM` y `Cotizaciones`, con el resto en un drawer
- `Catalogo` vive en el menu extendido para priorizar captura y seguimiento comercial rapido en movil
- todo el copy del shell sigue saliendo desde `@operapyme/i18n`

## Tailwind

Esta app usa Tailwind v4 en modo CSS-first.

- plugin en `vite.config.ts`
- import base en `src/app/styles.css`
- tema compartido en `../../packages/ui/src/theme/theme.css`
- usar utilidades canónicas de Tailwind cuando existan equivalentes; no dejar clases arbitrarias como `h-[46px]`, `max-w-[32rem]`, `rounded-[24px]` o `[background-size:18px_18px]` si el framework ya ofrece `h-11.5`, `max-w-lg`, `rounded-3xl` o `bg-size-[18px_18px]`
