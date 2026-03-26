# Development Setup

Fecha de actualizacion: 25 de marzo de 2026

## Espanol

Esta guia explica como instalar dependencias, levantar el backoffice y probar la UI localmente.

### Naming actual

El proyecto usa `OperaPyme` como nombre temporal de trabajo.

Los paquetes del workspace ahora usan el scope tecnico `@operapyme/*`.

### Requisitos

- Node.js `24.x` o superior
- npm `11.x` o superior
- VS Code o cualquier terminal local

### Ruta esperada del proyecto

```bash
/Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
```

### Instalacion inicial

```bash
cd /Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
npm install
```

### Ejecutar el backoffice

```bash
npm run dev:backoffice
```

URL esperada:

- `http://localhost:5173/`

### Ejecutar manualmente

```bash
cd /Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
npm install
npm run dev --workspace @operapyme/backoffice-pwa -- --host 0.0.0.0 --port 4173
```

URL esperada:

- `http://localhost:4173/`

### Variables de entorno

Usa como base:

```bash
apps/backoffice-pwa/.env.example
```

Contenido esperado:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### Comandos utiles

Typecheck:

```bash
npm run typecheck:backoffice
```

Build:

```bash
npm run build:backoffice
```

### Lo que deberias poder probar

- shell del backoffice
- navegacion mobile-first
- modulo CRM base
- modulo de cotizaciones base
- pagina de settings
- theming y cambio de idioma

### Nota de producto

El foco actual no incluye POS, inventario ni caja. El scaffold existente puede contener modulos de referencia mientras aterrizamos el nuevo alcance del producto.

## English

This guide explains how to install dependencies, start the backoffice, and test the UI locally.

### Current naming

The project now uses `OperaPyme` as its temporary working name.

Workspace packages use the `@operapyme/*` technical scope.

### Requirements

- Node.js `24.x` or higher
- npm `11.x` or higher
- VS Code or any local terminal

### Expected project path

```bash
/Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
```

### Initial install

```bash
cd /Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
npm install
```

### Run the backoffice

```bash
npm run dev:backoffice
```

Expected URL:

- `http://localhost:5173/`

### Run manually

```bash
cd /Users/edgarperez/Documents/EdgarPerez_PP/code/2026/operapyme
npm install
npm run dev --workspace @operapyme/backoffice-pwa -- --host 0.0.0.0 --port 4173
```
