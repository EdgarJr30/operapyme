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
- la auditoria global sigue reservada para `global_admin`
- `dashboard`, `crm` y `quotes` ya consumen lecturas reales desde Supabase con React Query
- `crm` y `quotes` ya incluyen formularios reales de create/update sobre `customers` y `quotes`
- las mutaciones siguen limitadas al tenant activo y dejan auditoria via triggers de base
- `quotes` ya delega la numeracion y el incremento de version a RPCs de Supabase para evitar inconsistencias por concurrencia
- el bundle base del backoffice ahora separa vendors por dominio y solo carga los namespaces de i18n que la app realmente necesita

## Tailwind

Esta app usa Tailwind v4 en modo CSS-first.

- plugin en `vite.config.ts`
- import base en `src/app/styles.css`
- tema compartido en `../../packages/ui/src/theme/theme.css`
