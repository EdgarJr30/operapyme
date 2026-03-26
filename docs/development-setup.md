# Setup de desarrollo

## Requisitos

- Node.js `>=24`
- npm `>=11`
- cuenta y proyecto de Supabase para desarrollo

## Instalacion

```bash
npm install
```

## Comandos principales

```bash
npm run dev:backoffice
npm run typecheck:backoffice
npm run build:backoffice
npm run test
npm run test:unit
npm run test:integration
npm run test:contract
npm run test:e2e
npm run test:e2e:smoke
npm run verify
```

## Variables de entorno

Crear `apps/backoffice-pwa/.env.local` usando como base:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Reglas:

- Nunca colocar secretos reales en variables `VITE_*`.
- Todo secreto operativo va en Supabase, CI o infraestructura.

Para variables operativas o server-side, usar `supabase/.env.local` tomando como base `supabase/.env.example`.

## Flujo local recomendado

1. Instalar dependencias.
2. Levantar el backoffice.
3. Ejecutar `typecheck`.
4. Ejecutar los tests del alcance tocado.
5. Ejecutar `verify` antes de cerrar una tarea relevante.

## Supabase

- Las migraciones se escriben en `supabase/migrations/`.
- No se reescriben migraciones aplicadas.
- Toda tabla de negocio nace con RLS y columnas de tracking.
- Acciones sensibles o masivas deben ir por RPC o Edge Function, no por CRUD cliente directo.
