# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev:backoffice              # Start backoffice dev server (http://localhost:5173)
npm run build:backoffice            # Production build
npm run typecheck:backoffice        # Type-check backoffice
npm run check:backoffice-bundle     # Validate bundle size budget

# Tests
npm run test                        # Unit + integration + contract (Vitest)
npm run test:unit                   # Unit tests only
npm run test:integration            # Integration tests only
npm run test:contract               # Contract/Supabase structure tests
npm run test:e2e                    # Full Playwright suite
npm run test:e2e:smoke              # Playwright smoke tests only (recommended pre-push)

# Run a single test file
npx vitest run tests/unit/rbac.test.ts
npx playwright test tests/e2e/smoke.spec.ts

# Full pre-merge verification
npm run verify                      # typecheck + build + bundle + test + smoke e2e
```

**Environment setup:** Create `apps/backoffice-pwa/.env.local` with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Architecture

This is an **npm workspaces monorepo** building OperaPyme — a multi-tenant commercial operations SaaS for SMBs.

### Workspace layout

```
apps/backoffice-pwa/   # Main internal operations app (PWA-installable)
apps/storefront/       # Reserved for public-facing features
packages/domain/       # Types, Zod schemas, RBAC definitions, domain helpers
packages/i18n/         # i18next + react-i18next, ES/EN resources
packages/ui/           # Reusable design system primitives (not full pages)
packages/offline/      # Sync queue, local storage, offline utilities
supabase/              # Migrations, Edge Functions, seeds
tests/unit|integration|contract|e2e/
docs/                  # Architecture decisions, governance, product direction
```

### backoffice-pwa internals

- **`src/modules/*`** — Feature domains (dashboard, commercial, catalog, etc.)
- **`src/app/`** — App shell: `main.tsx`, `providers.tsx`, `auth-provider.tsx`, `router.tsx`
- **`src/components/`** — Reusable components; shadcn/ui components install to `src/components/ui`

Tech: React 19, TypeScript 5, Vite 7, Tailwind CSS v4, React Router 7, TanStack Query 5, React Hook Form 7 + Zod, Supabase, motion.dev, sonner, Radix UI / shadcn (base: `apps/backoffice-pwa/components.json`).

### Testing layers

| Layer | Directory | Runner | Purpose |
|-------|-----------|--------|---------|
| Unit | `tests/unit/` | Vitest | Pure functions, RBAC, domain helpers |
| Integration | `tests/integration/` | Vitest | Shell, routes, providers |
| Contract | `tests/contract/` | Vitest | Supabase structure and RLS validation |
| E2E | `tests/e2e/` | Playwright | Smoke flows at `http://127.0.0.1:4173` |

Vitest config: `vitest.config.mts` — jsdom environment, globals enabled, setup file at `apps/backoffice-pwa/src/test/setup.ts`.

Playwright config: `playwright.config.ts` — auto-starts backoffice on port 4173, Chromium only.

### Supabase / backend

- **MCP alias for this project:** `supabase_operapyme` (project_ref: `nnycukcepkmuxtyghwbg`). Always use this alias, never the generic `supabase`.
- All tables must have `created_at`, `updated_at`, `created_by`, `updated_by`.
- `tenant_id` is immutable on tenant-scoped tables; composite foreign keys with `tenant_id` are mandatory to prevent cross-tenant references.
- Sensitive/bulk operations go through RPC, not direct client CRUD.
- Never put async Supabase work inside `onAuthStateChange` — synchronize session only, then hydrate separately.

## Non-negotiable rules

### Multi-tenancy and security
- RBAC + RLS are part of the design, not an afterthought.
- UI only expresses permission states; never resolve real authorization in the frontend.
- Any change touching RLS, permissions, audit, or rate limiting must include or update tests.

### Bundle and critical path
- `src/main.tsx`, `src/app/providers.tsx`, `src/app/auth-provider.tsx`, `src/app/router.tsx`, and routes `/`, `/auth`, `/auth/callback`, `/setup` cannot receive heavy imports without explicit justification.
- High-cost, low-frequency features (PDF, exports, admin flows, toaster, permission-denied screens) must use `lazy()` or dynamic `import()`.
- If initial render depends on Supabase, add `dns-prefetch` or `preconnect` in `index.html`.

### i18n
- All visible text must come from `@operapyme/i18n` with both `es` and `en` keys. No hardcoded strings in components.
- Base language is Spanish. Use native i18next interpolation (`{count}`, `{tenant}`) — do not add ICU runtime to the critical path.

### UI / UX
- Mobile-first always: design at 390–430px baseline.
- Desktop: fixed sidebar + main scroll. Mobile: bottom navigation.
- Touch targets minimum 44px. Inputs always have labels above (never placeholder-only).
- `type="number"` spinners advance by `1`; decimals allowed via manual typing only.
- All animations/transitions/drawers/modals use `motion.dev` (`motion`). Respect `prefers-reduced-motion`.
- Transient action feedback via `sonner` toast. Inline messages only for persistent structural states.
- Theming uses semantic tokens (surface, border, text, accent). Never hardcode `white`, `black`, or tenant colors in components.
- Light/dark/system modes supported. Dark mode must not become neon or saturated.
- Tailwind: always prefer canonical framework classes over arbitrary values (e.g. `h-11.5` not `h-[46px]`, `max-w-lg` not `max-w-[32rem]`).
- shadcn components for this app install under `src/components/ui` using Radix UI base.

### Documentation sync
- Changes to rules, architecture, UX, scripts, env vars, or visible behavior must update the relevant doc in the same task: `README.md`, `AGENTS.md`, `apps/backoffice-pwa/AGENTS.md`, or files under `docs/`.
- Track actionable work in Linear; document context, maps, and decisions in Notion (`MoonCode > Saas Opera Pyme`, page: `32fe6e14-11f6-8102-86dc-f8f2960d1a22`).

### Product scope (current phase)
- In scope: light CRM, quotes, proformas, internal invoices (non-fiscal), expenses, reports, customers, suppliers, debts.
- Out of scope: POS, inventory, cash register, electronic/fiscal invoicing, heavy ERP.
- Every module must be activatable/deactivatable per plan or feature flag.

### Governance docs (read before proposing architecture, data model, or UX)
- `docs/saas-blueprint.md` — product scope and modules
- `docs/governance/UI_UX_RULES.md` — mandatory UX contract
- `docs/governance/PERFORMANCE_RULES.md` — bundle and load rules
- `docs/governance/SUPABASE_RULES.md` — RLS, RPC, schema rules
