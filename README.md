# OperaPyme Workspace

## Espanol

Este repo es la base de `OperaPyme`, nombre temporal de trabajo para una plataforma comercial operativa multi-tenant para pymes.

### Estado del nombre

`OperaPyme` es el nombre temporal unificado para empezar el proyecto en local, Linear y metadata del workspace.

Puede cambiar mas adelante por un nombre comercial definitivo, pero desde ahora evitamos seguir mezclando `SaaS Demo`, `VentaFlow` y `ventaflow`.

El estado del renombre vive en [docs/project-naming.md](./docs/project-naming.md).

### Vision

No estamos construyendo un ERP pesado ni un clon de POS.

Estamos construyendo una plataforma comercial operativa enfocada en:

- CRM ligero
- cotizaciones
- proformas
- factura final interna sin facturacion fiscal real
- gastos
- reportes
- clientes
- proveedores
- deudas
- configuracion multi-tenant con RBAC

### Fuera de alcance por ahora

- POS
- inventario
- caja
- facturacion electronica o fiscal real
- contabilidad completa

### Enfoque de experiencia

- acceso solo web por ahora
- mobile-first real
- totalmente responsive
- backoffice instalable como PWA en equipos

### Stack principal

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS v4
- Backend: Supabase
- Formularios: React Hook Form + Zod
- Datos cliente: React Query
- Internacionalizacion: `i18next` + `react-i18next` + `packages/i18n`
- Theming: `next-themes` + CSS custom properties + tokens semanticos
- Testing: Vitest + React Testing Library + Playwright

### Decision de arquitectura

- arquitectura base: monolito modular en monorepo
- backend: Supabase con enfoque domain-first, RBAC, RLS y auditoria
- frontend: modulos por dominio con TypeScript funcional, no MVC clasico
- evitamos microservicios y POO pesada en esta fase

### Estructura actual

```text
.
|- apps/
|  |- README.md
|  |- backoffice-pwa/
|  |  |- README.md
|  `- storefront/
|- packages/
|  |- config/
|  |- domain/
|  |- i18n/
|  |- offline/
|  `- ui/
|- tools/
|  `- stress-harness/
|- tests/
|  |- unit/
|  |- integration/
|  |- contract/
|  `- e2e/
|- supabase/
|  |- functions/
|  |- migrations/
|  `- seeds/
`- docs/
```

### Documentos clave

- [docs/saas-blueprint.md](./docs/saas-blueprint.md): alcance actual, modulos core y roadmap del producto.
- [docs/ui-ux-direction.md](./docs/ui-ux-direction.md): direccion visual y reglas de UX mobile-first.
- [docs/tenant-theming.md](./docs/tenant-theming.md): estrategia de branding por tenant y appearance modes.
- [docs/development-setup.md](./docs/development-setup.md): instalacion, scripts y flujo local.
- [docs/architecture/SUPABASE_ARCHITECTURE.md](./docs/architecture/SUPABASE_ARCHITECTURE.md): fundacion segura de backend con RBAC, RLS y auditoria.
- [docs/domain/AUDIT_MODEL.md](./docs/domain/AUDIT_MODEL.md): modelo de auditoria y observabilidad.
- [docs/governance/SUPABASE_RULES.md](./docs/governance/SUPABASE_RULES.md): reglas obligatorias para esquema, politicas y operaciones sensibles.
- [docs/project-naming.md](./docs/project-naming.md): estado del nombre temporal y criterios para un renombre futuro.
- [docs/treinta-research-rd.md](./docs/treinta-research-rd.md): research de referencia sobre Treinta y los patrones que si conviene tomar.
- [AGENTS.md](./AGENTS.md): reglas globales del repo.

### Documentacion operativa y seguimiento

- El espacio vivo del proyecto en Notion se mantiene en `MoonCode > Saas Opera Pyme`.
- Ruta canonica de acceso para automatizacion: `https://www.notion.so/32fe6e1411f6810286dcf8f2960d1a22`.
- Ahi viven mapas mentales, flujos, diagramas, decisiones y backlog documental del proyecto.
- El repo sigue siendo la fuente de verdad para codigo, arquitectura formal y reglas persistentes.
- Todo trabajo accionable debe tener seguimiento en Linear.
- Por defecto, las tareas de Linear de este proyecto se asignan a `me`, salvo que se indique otro responsable.
- El usuario autoriza crear tareas en Linear directamente sin pedir confirmacion previa; basta con reportarlo en la salida final.
- Se recomienda hacer commits frecuentes cuando haya bloques de cambio coherentes y con valor cerrado, en vez de acumular demasiado trabajo sin versionar.
- Tambien se autoriza hacer commits y preparar o crear PRs directamente cuando sea la opcion mas conveniente para el flujo; basta con reportarlo en la salida final.
- Notion conserva contexto y criterio; Linear conserva ejecucion, prioridad, responsable y estado.
- Para evitar timeouts en herramientas, conviene abrir esa pagina exacta y no la base completa de `MoonCode`.

### Estado actual

- naming temporal unificado a `OperaPyme`
- blueprint del producto actualizado al nuevo enfoque
- Linear alineado con el nuevo nombre temporal
- scaffold inicial del backoffice en progreso
- soporte `light` / `dark` / `system` activo en el backoffice
- baseline de testing y contratos del repo sembrados
- fundacion Supabase segura sembrada con enfoque RBAC, RLS y auditoria
- auth del backoffice sembrado con magic link
- bootstrap inicial de tenant sembrado con membership `tenant_owner`
- primeras tablas operativas `customers` y `quotes` sembradas con RLS y auditoria
- rutas `/admin/*` reservadas para auditoria y errores globales

### Como correr el proyecto

Cuando las dependencias esten instaladas:

```bash
npm install
npm run dev:backoffice
npm run test
npm run verify
```

Flujo funcional actual:

1. completar `apps/backoffice-pwa/.env.local`
2. aplicar migraciones de `supabase/migrations/`
3. abrir el backoffice
4. entrar por `/auth`
5. completar `/setup` si el usuario aun no tiene tenant

Backoffice por defecto:

- URL esperada: `http://localhost:5173/`

Si necesitas especificar host o puerto:

```bash
npm run dev:backoffice -- --host 0.0.0.0 --port 4173
```

Si quieres correrlo manualmente:

```bash
cd /Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
npm install
npm run dev --workspace @operapyme/backoffice-pwa -- --host 0.0.0.0 --port 4173
```

### Variables de entorno del backoffice

Usar `apps/backoffice-pwa/.env.example` como base:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Para variables backend u operativas de Supabase, usar `supabase/.env.example` como referencia y guardar los secretos reales solo en `supabase/.env.local`.

### Alias MCP de Supabase para este repo

- Alias canonico para `OperaPyme`: `supabase_operapyme`
- `project_ref` esperado: `nnycukcepkmuxtyghwbg`
- El alias generico `supabase` puede apuntar a otro proyecto y no debe asumirse como valido para este repo
- Si se actualiza `~/.codex/config.toml`, conviene recargar Codex o VS Code antes de usar herramientas MCP

### Testing y verificacion

- `npm run test`: unit + integration + contract
- `npm run test:e2e:smoke`: prueba de humo del backoffice
- `npm run verify`: typecheck + build + tests + smoke e2e

### Fundacion segura

- `RBAC first`, `RLS first` y `audit first` son obligatorios desde la base.
- Toda tabla expuesta debe nacer con tracking de actor y timestamps.
- El admin global es la unica superficie con acceso completo a auditoria en fase 1.
- El `stress-harness` vive como herramienta separada del backoffice y no debe usarse contra produccion por defecto.

### Internacionalizacion

- El idioma base del producto es espanol.
- El soporte de ingles existe desde la arquitectura inicial.
- La configuracion y recursos compartidos viven en `packages/i18n`.

### Apariencia y theming

- El backoffice soporta `light`, `dark` y `system`.
- La preferencia de apariencia se persiste por dispositivo.
- La apariencia personal y el branding por tenant son capas distintas.
- La estrategia de paletas curadas por tenant vive en [docs/tenant-theming.md](./docs/tenant-theming.md).

### Donde vive la app React real

La raiz del repo es un monorepo, no una app React unica.

La app real vive en `apps/backoffice-pwa/`, donde estan:

- `src/`
- `public/`
- `package.json`
- `vite.config.ts`
- `.env.example`

## English

This repository is the foundation for `OperaPyme`, a temporary working name for a multi-tenant commercial operations platform for SMBs.

### Naming status

`OperaPyme` is the unified temporary name now used across local docs, workspace metadata, and Linear.

It may still change later, but the repo no longer mixes `SaaS Demo`, `VentaFlow`, and `ventaflow`.

See [docs/project-naming.md](./docs/project-naming.md) for naming status.

### Vision

This is not a heavy ERP and not a POS-first product.

The current product focus is:

- light CRM
- quotes
- proformas
- internal final invoices without real fiscal billing
- expenses
- reports
- customers
- suppliers
- debts
- multi-tenant configuration with RBAC

### Out of scope for now

- POS
- inventory
- cash register workflows
- electronic or fiscal invoicing
- full accounting

### Experience direction

- web-only access for now
- true mobile-first UX
- fully responsive layout
- installable PWA backoffice

### Main stack

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS v4
- Backend: Supabase
- Forms: React Hook Form + Zod
- Client-side data: React Query
- Internationalization: `i18next` + `react-i18next` + `packages/i18n`
- Theming: `next-themes` + CSS custom properties + semantic tokens

### Architecture decision

- base architecture: modular monolith in a monorepo
- backend: Supabase with a domain-first, RBAC, RLS, and audit-oriented approach
- frontend: domain modules with functional TypeScript, not classic MVC
- we avoid microservices and heavy OOP in this phase

### Key docs

- [docs/saas-blueprint.md](./docs/saas-blueprint.md): current scope, core modules, and roadmap.
- [docs/ui-ux-direction.md](./docs/ui-ux-direction.md): visual direction and mobile-first UX rules.
- [docs/tenant-theming.md](./docs/tenant-theming.md): tenant branding and appearance strategy.
- [docs/development-setup.md](./docs/development-setup.md): install and local development flow.
- [docs/project-naming.md](./docs/project-naming.md): temporary naming status and future rename criteria.
- [docs/treinta-research-rd.md](./docs/treinta-research-rd.md): reference research on Treinta and the patterns worth borrowing.
- [AGENTS.md](./AGENTS.md): repo-wide working rules.

### Operational docs and tracking

- The project's live Notion space is `MoonCode > Saas Opera Pyme`.
- Canonical automation entry point: `https://www.notion.so/32fe6e1411f6810286dcf8f2960d1a22`.
- Mind maps, flows, diagrams, decisions, and documentation backlog should live there.
- The repo remains the source of truth for code, formal architecture, and persistent rules.
- All actionable work should be tracked in Linear.
- By default, Linear issues for this project should be assigned to `me`, unless a different owner is explicitly requested.
- The user authorizes creating Linear issues directly without prior confirmation; the final output just needs to report what was created or updated.
- Frequent commits are encouraged whenever there is a coherent, self-contained unit of change, instead of letting too much work accumulate unversioned.
- It is also authorized to create commits and prepare or create PRs directly when that is the most practical workflow choice; the final output just needs to report it.
- Notion stores context and reasoning; Linear stores execution, priority, owner, and status.
- To reduce tool timeouts, prefer opening that exact page instead of the full `MoonCode` database.
- Security and testing foundations now live in `docs/architecture/SUPABASE_ARCHITECTURE.md`, `docs/domain/AUDIT_MODEL.md`, `docs/governance/SUPABASE_RULES.md`, and `tests/README.md`.

### Run the project

```bash
npm install
npm run dev:backoffice
```

### Supabase MCP alias for this repo

- Canonical alias for `OperaPyme`: `supabase_operapyme`
- Expected `project_ref`: `nnycukcepkmuxtyghwbg`
- The generic `supabase` alias may point to a different project and should not be assumed to be valid for this repo
- If `~/.codex/config.toml` changes, reload Codex or VS Code before using MCP tools again

Manual workspace command:

```bash
cd /Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
npm install
npm run dev --workspace @operapyme/backoffice-pwa -- --host 0.0.0.0 --port 4173
```
