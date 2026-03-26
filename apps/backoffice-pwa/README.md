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

## Tailwind

Esta app usa Tailwind v4 en modo CSS-first.

- plugin en `vite.config.ts`
- import base en `src/app/styles.css`
- tema compartido en `../../packages/ui/src/theme/theme.css`
