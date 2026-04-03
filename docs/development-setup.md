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

## CI/CD

El repo ya queda preparado con:

- CI en `.github/workflows/ci.yml`
- CD a Netlify en `.github/workflows/netlify-deploy.yml`
- configuracion de build en `netlify.toml`

Secrets esperados en GitHub para deploy:

```bash
NETLIFY_AUTH_TOKEN=
NETLIFY_SITE_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_PUBLIC_SITE_URL=
```

El detalle operativo vive en `docs/deployment/netlify-cicd.md`.

## Variables de entorno

Crear `apps/backoffice-pwa/.env.local` usando como base:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_PUBLIC_SITE_URL=
```

Reglas:

- Nunca colocar secretos reales en variables `VITE_*`.
- Todo secreto operativo va en Supabase, CI o infraestructura.

Para variables operativas o server-side, usar `supabase/.env.local` tomando como base `supabase/.env.example`.

## MCP de Supabase para este repo

La configuracion global de Codex puede tener varios proyectos de Supabase. Para `OperaPyme`, el alias correcto es:

```toml
[mcp_servers.supabase_operapyme]
url = "https://mcp.supabase.com/mcp?project_ref=nnycukcepkmuxtyghwbg&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cstorage"
```

Reglas:

- Este repo usa `supabase_operapyme` como alias MCP canonico.
- El `project_ref` esperado para este repo es `nnycukcepkmuxtyghwbg`.
- No asumir que el alias generico `supabase` apunta a `OperaPyme`.
- Despues de editar `~/.codex/config.toml`, recargar Codex o VS Code para que relea la configuracion.
- Si una automatizacion no sabe que alias usar, debe usar `supabase_operapyme`.

## shadcn/ui CLI y MCP

Segun la documentacion oficial de `shadcn`, el MCP usa `components.json` para entender donde instalar componentes y, en Codex, el servidor debe declararse manualmente en `~/.codex/config.toml`.

En `OperaPyme`:

- la app preparada para `shadcn` es `apps/backoffice-pwa`
- el archivo canonico es `apps/backoffice-pwa/components.json`
- cualquier comando de `shadcn` para el backoffice debe correrse con `--cwd apps/backoffice-pwa`
- la base por defecto para primitives de `shadcn` en este repo es `Radix UI`
- no mezclar `Radix UI` y `Base UI` dentro de la misma superficie sin una decision documentada

Configuracion MCP recomendada para Codex:

```toml
[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]
```

Despues de editar `~/.codex/config.toml`, reiniciar Codex para que cargue el servidor nuevo.

## Flujo local recomendado

1. Instalar dependencias.
2. Completar `apps/backoffice-pwa/.env.local`.
3. Aplicar migraciones de `supabase/migrations/`.
4. Levantar el backoffice.
5. Entrar por `/auth` y completar el bootstrap del tenant si es el primer acceso.
6. Si el magic link vuelve por `/auth/callback`, el cliente ahora acepta callbacks con `code` o `token_hash` y redirige al login cuando el enlace ya vencio o esta incompleto.
7. Ejecutar `typecheck`.
8. Ejecutar los tests del alcance tocado.
9. Ejecutar `verify` antes de cerrar una tarea relevante.

## Supabase

- Las migraciones se escriben en `supabase/migrations/`.
- No se reescriben migraciones aplicadas.
- Toda tabla de negocio nace con RLS y columnas de tracking.
- Acciones sensibles o masivas deben ir por RPC o Edge Function, no por CRUD cliente directo.
- El bootstrap inicial del tenant usa `create_tenant_with_owner()`.
- El frontend hidrata su contexto con `get_my_access_context()`.
