# Guia de documentacion

Esta carpeta contiene la documentacion canonica en Markdown para `OperaPyme`.

## Objetivo

- mantener reglas, arquitectura y decisiones dentro del repo
- alinear producto, seguridad, UX y delivery con un mismo lenguaje
- complementar el espacio vivo de Notion sin reemplazar al repo como fuente de verdad

## Mapa canonico

### `product/`

- `product/PRD.md`
- `product/ROADMAP.md`
- `product/BENCHMARK.md`
- `product/QUOTE_MODULE_GUIDELINES.md`

### `domain/`

- `domain/BUSINESS_RULES.md`
- `domain/DOMAIN_MODEL.md`
- `domain/RBAC_MODEL.md`
- `domain/AUDIT_MODEL.md`

### `architecture/`

- `architecture/SOFTWARE_ARCHITECTURE.md`
- `architecture/TECHNICAL_ARCHITECTURE.md`
- `architecture/SUPABASE_ARCHITECTURE.md`
- `adr/README.md`

### `governance/`

- `governance/CODING_RULES.md`
- `governance/DOCUMENTATION_RULES.md`
- `governance/REGRESSION_RULES.md`
- `governance/SECURITY_RULES.md`
- `governance/SUPABASE_RULES.md`
- `governance/TESTING_RULES.md`
- `governance/UI_UX_RULES.md`
- `governance/VERSIONING_RULES.md`

### `checklists/`

- `checklists/README.md`
- `checklists/CODEX_TASK_BRIEF.md`
- `checklists/MVP_RELEASE_CHECKLIST.md`

## Documentos transversales en raiz de `docs/`

- `docs/AGENTS.md`
- `docs/development-setup.md`
- `docs/notion-information-architecture.md`
- `docs/project-naming.md`
- `docs/saas-blueprint.md`
- `docs/treinta-research-rd.md`

## Superficies canonicas del producto

- `backoffice`: operacion interna mobile-first para pymes
- `admin`: consola global de plataforma para auditoria, errores y operaciones internas
- `storefront`: superficie reservada para experiencias publicas futuras
- `stress-tool`: herramienta separada e interna para pruebas masivas controladas

## Reglas de ubicacion

1. Producto, dominio, arquitectura y reglas permanentes viven en `docs/`.
2. Los detalles operativos de una carpeta concreta viven en su `README.md` local.
3. `README.md` de la raiz mantiene el resumen bilingue; `docs/` opera en espanol first.
4. Cuando se agrega, mueve o elimina un documento canonico, este indice se actualiza en la misma tarea.
5. Las reglas visuales, de UX, shell y theming viven unificadas en `governance/UI_UX_RULES.md`; no duplicarlas en otros docs de reglas.

## Sincronizacion con Notion y Linear

- Los mapas, diagramas, flujos y decisiones visuales viven tambien en `MoonCode > Saas Opera Pyme`.
- Las tareas accionables y su seguimiento viven en Linear.
- Si una decision cambia el producto o la arquitectura, debe quedar reflejada en el repo y, cuando aplique, tambien en Notion.
