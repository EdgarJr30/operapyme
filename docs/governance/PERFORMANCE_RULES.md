# PERFORMANCE_RULES.md

## 1. Purpose

This file defines the mandatory performance rules for the web app surfaces of `OperaPyme`, with priority on first load, refresh, and post-auth bootstrap.

Last updated: 2026-03-27.

## 2. Research baseline

These rules are grounded in the current guidance from:

- React `lazy` + `Suspense`: https://react.dev/reference/react/lazy
- React Router route `lazy`: https://reactrouter.com/6.30.3/route/route#lazy
- Vite build chunking and module preload behavior: https://vite.dev/config/build-options.html#build-rollupoptions
- Supabase auth events and callback guidance: https://supabase.com/docs/reference/javascript/auth-onauthstatechange
- i18next interpolation options: https://www.i18next.com/translation-function/interpolation

Working interpretation for this repo:

- React recommends deferring component code until first render for code that is not part of the first paint.
- React Router recommends route-level `lazy` functions to keep route bundles small.
- Vite computes preload dependencies automatically, so anything left in the entry graph will be paid during refresh.
- Supabase recommends keeping `onAuthStateChange` callbacks quick and avoiding async Supabase work inside the callback itself.
- i18next already supports configurable interpolation delimiters, so simple placeholder strings do not justify pulling ICU formatting into the first-load runtime.

## 3. Critical-path rules

The critical path for the backoffice is:

- `index.html`
- app bootstrap in `src/main.tsx`
- global providers in `src/app/providers.tsx`
- auth bootstrap in `src/app/auth-provider.tsx`
- router shell decision in `src/app/router.tsx`
- initial route for `/`, `/auth`, `/auth/callback`, and `/setup`

Mandatory rules:

1. Do not import heavy or infrequent features into the critical path.
2. Treat refresh speed as a product requirement, not a later polish pass.
3. Any code needed only after a user action must load on demand.
4. Any route not needed for first paint must stay outside the entry bundle.
5. Expensive auth follow-up work must happen after session sync, not inside the auth event callback.
6. If auth or first render depends on a cross-origin backend, add targeted resource hints such as `dns-prefetch` or `preconnect` when they measurably help the first request.

## 4. Code-splitting rules

Mandatory rules:

1. Use route-level `lazy` loading for non-core routes and flows.
2. Use component-level `lazy` loading when a route still contains optional or secondary surfaces.
3. Use dynamic imports for user-triggered features such as PDF generation, export tools, editors, or admin utilities.
4. Keep `lazy` declarations at module top level, never inside render functions.
5. Re-check the entry graph when adding a new provider, shell dependency, or route-level import.
6. Keep global feedback UI, access-denied states, and other low-frequency support surfaces behind lazy boundaries when they are not part of the first paint.

Examples of features that must not live in the entry bundle unless proven necessary:

- PDF generation
- form builders used only in secondary flows
- admin-only surfaces
- advanced reporting helpers
- large animation runtimes outside active animated surfaces

## 5. Auth bootstrap rules

Mandatory rules:

1. `onAuthStateChange` callbacks must stay synchronous and lightweight.
2. Do not call other Supabase methods directly inside the auth callback.
3. Use the emitted session state to update local React state first.
4. Run access-context hydration in a separate effect or deferred task after session state is known.
5. Deduplicate in-flight auth bootstrap work so Strict Mode and rapid event bursts do not multiply the same request.
6. Avoid repeated `getSession()` calls when the same information is already available from auth events.

## 6. i18n and support-surface rules

Mandatory rules:

1. If translations only need placeholder replacement such as `{count}` or `{tenant}`, use i18next interpolation and keep the delimiter config aligned with the repo resources.
2. Do not add `i18next-icu` or another formatting runtime to the critical path unless the copy actually uses ICU features such as `plural`, `select`, or advanced date/number formatting.
3. Global support surfaces such as toasters, permission fallbacks, or decorative icon sets must not live in the entry bundle unless they are required for the first visible state.

## 7. Bundle guardrails

Current enforced backoffice budgets:

- initial JS gzip loaded from `dist/index.html`: `<= 400 kB`
- initial CSS gzip loaded from `dist/index.html`: `<= 16 kB`
- disallowed initial chunks: `pdf-vendor`, `forms-vendor`, `query-vendor`, `feedback-vendor`, `icons-vendor`

The automated check lives in `tools/performance/check-backoffice-bundle.mjs`.

If a future change requires raising these budgets, the PR must:

1. explain why the increase is necessary,
2. show before/after numbers, and
3. update this file in the same task.

## 8. Review checklist

Every performance-sensitive PR touching the web app should verify:

1. What new code entered the initial route or provider graph?
2. Could this dependency move to route `lazy`, component `lazy`, or on-demand import?
3. Did auth bootstrap add duplicate network work on refresh?
4. Did the bundle guard pass after production build?
5. Did the user-facing loading state stay calm, short, and understandable on mobile?
6. Did the change introduce a formatting or feedback runtime into the entry bundle without a measured reason?
