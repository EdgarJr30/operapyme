# Arquitectura tecnica

## Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS v4
- React Query
- React Hook Form + Zod
- Supabase
- Vitest + React Testing Library + Playwright

## Frontend

- router con modulos lazy por dominio
- i18n compartido desde `packages/i18n`
- theming semantico desde `packages/ui`
- futuras integraciones de auth y permisos encapsuladas fuera de componentes presentacionales
- organizacion modular por feature o dominio, no MVC clasico
- componentes visuales pequenos, hooks y servicios para orquestacion
- TypeScript funcional y composable por defecto

## Backend

- Supabase Auth para identidad base
- tablas propias para usuarios de app, memberships, roles y permisos
- RPC o Edge Functions para operaciones sensibles, masivas o con riesgo de abuso
- enfoque data-first y domain-first, no MVC clasico
- reglas de acceso en SQL, politicas y funciones helper

## Seguridad y control

- RLS obligatoria en tablas expuestas
- deny-by-default
- auditoria por eventos y por cambios de fila
- rate limiting y controles de concurrencia como politica de arquitectura

## Superficies reservadas

- `/admin/*` para auditoria y observabilidad global
- `tools/stress-harness` para simulaciones masivas controladas

## Calidad

- `typecheck`, `build` y `verify` deben correr desde la raiz
- cambios de permisos, RLS o auditoria requieren pruebas asociadas

## Patron recomendado

### Arquitectura

- monolito modular

### Organizacion de frontend

- modulos por dominio
- componentes presentacionales + hooks + servicios
- formularios validados con Zod

### Paradigma de codigo

- TypeScript funcional por defecto
- evitar POO pesada salvo cuando una abstraccion concreta lo justifique
- no adoptar MVVM estricto ni MVC clasico en React
