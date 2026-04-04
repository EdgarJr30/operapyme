# CI/CD con GitHub Actions y Netlify

## Objetivo

Este repo usa GitHub Actions para validar calidad del monorepo y Netlify para publicar `apps/backoffice-pwa` como SPA.

## CI

El workflow [ci.yml](../../.github/workflows/ci.yml) corre en `pull_request` y en `push` a `main`.

Cobertura actual:

- `npm ci`
- `npm run typecheck:backoffice`
- `npm run build:backoffice`
- `npm run check:backoffice-bundle`
- `npm run test`
- `npm run test:e2e:smoke`

## CD

El workflow [netlify-deploy.yml](../../.github/workflows/netlify-deploy.yml) publica a Netlify solo cuando:

- el workflow `CI` termina exitosamente sobre `main`, o
- se dispara manualmente por `workflow_dispatch`

El deploy usa:

- build command: `npm run build:backoffice`
- publish directory: `apps/backoffice-pwa/dist`
- Netlify config: [netlify.toml](../../netlify.toml)
- Netlify CLI monorepo filter: `--filter=@operapyme/backoffice-pwa`

## Secrets requeridos en GitHub

Agregar estos secrets en el repo o en el environment `production`:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_PUBLIC_SITE_URL`

Reglas:

- `NETLIFY_AUTH_TOKEN` es el token personal o de automation para deploys.
- `NETLIFY_SITE_ID` debe apuntar al sitio Netlify real donde vive el backoffice.
- las variables `VITE_*` son publicas por naturaleza y se usan para compilar la app en CI/CD.
- no guardar secretos backend en `VITE_*`.
- `VITE_PUBLIC_SITE_URL` debe apuntar a la URL publica canonica del backoffice, por ejemplo `https://operapyme.netlify.app`, para que magic link y recovery vuelvan al dominio correcto.

## Netlify

La configuracion base vive en [netlify.toml](../../netlify.toml).

Puntos relevantes:

- el repo publica solo `apps/backoffice-pwa/dist`
- como este repo es un monorepo npm workspaces, el deploy por CLI debe incluir `--filter=@operapyme/backoffice-pwa` para evitar que Netlify intente elegir entre multiples proyectos detectados
- el sitio se trata como SPA y redirige `/*` a `/index.html`
- la instalacion de dependencias ocurre en el entorno de build; el comando de deploy de GitHub Actions solo publica el resultado ya compilado

## Enlace real del sitio

Este repo ya queda listo para CD, pero el deploy real depende de que `NETLIFY_SITE_ID` apunte a un proyecto existente en Netlify.

No se debe asumir ni crear automaticamente un sitio nuevo sin confirmar antes el destino productivo.
