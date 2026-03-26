# Project Naming

Fecha de actualizacion: 25 de marzo de 2026

## 1. Estado actual

El proyecto adopta `OperaPyme` como nombre temporal de trabajo.

Este nombre ya se usa en:

- documentacion
- proyecto de Linear
- metadata visible del backoffice
- nombres de paquetes y workspace

Todavia puede cambiar por una marca comercial definitiva en el futuro.

## 2. Razon del cambio

Antes habia una mezcla de:

- `SaaS Demo`
- `VentaFlow`
- `ventaflow`

Eso generaba ruido entre branding visible, nombres tecnicos y documentacion.

Desde esta fecha se unifica el workspace sobre `OperaPyme` para poder avanzar sin ambiguedad.

## 3. Alcance del renombre ya aplicado

### Renombre visible

Actualizado en:

- `README.md`
- `docs/saas-blueprint.md`
- `docs/development-setup.md`
- `docs/project-naming.md`
- `docs/treinta-research-rd.md`
- `apps/backoffice-pwa/index.html`
- `apps/backoffice-pwa/public/manifest.webmanifest`
- `packages/i18n/src/resources/es/common.ts`
- `packages/i18n/src/resources/en/common.ts`

### Renombre tecnico

Actualizado en:

- `package.json`
- `package-lock.json`
- `apps/backoffice-pwa/package.json`
- `packages/i18n/package.json`
- imports `@operapyme/*`
- storage keys y atributos runtime que antes usaban `ventaflow`

## 4. Lo que sigue siendo temporal

`OperaPyme` funciona como nombre de proyecto, repo y trabajo interno.

No debe asumirse aun como marca final validada legalmente.

Antes de release comercial real conviene validar:

- dominio
- conflicto de marca
- disponibilidad comercial
- narrativa final

## 5. Criterio para un futuro renombre

Si aparece una marca definitiva, el reemplazo debe hacerse en una sola tarea y cubrir:

- documentacion
- metadata visible
- Linear
- nombres de paquetes si hace falta
- storage keys y caches si decidimos cambiar la capa tecnica otra vez

## 6. Busquedas utiles

Para validar si quedan restos del naming anterior:

```bash
rg -n "SaaS Demo|VentaFlow|ventaflow|@ventaflow" README.md docs apps packages package.json package-lock.json --glob '!**/dist/**' --glob '!**/node_modules/**'
```

Para validar el naming actual:

```bash
rg -n "OperaPyme|operapyme|@operapyme" README.md docs apps packages package.json package-lock.json --glob '!**/dist/**' --glob '!**/node_modules/**'
```
