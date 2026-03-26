# Reglas de testing

## Stack oficial

- Vitest
- React Testing Library
- Playwright

## Capas minimas

- `unit`: helpers, permisos, contratos puros
- `integration`: shell, rutas, providers, guards
- `contract`: docs, estructura, migraciones y contratos de plataforma
- `e2e`: smoke flows y rutas reservadas

## Reglas

- todo cambio de RLS, permisos, auditoria o rate limiting debe traer o actualizar tests
- todo modulo nuevo debe tener al menos una prueba de humo
- las pruebas de contrato deben vigilar estructura documental y migraciones base
- no cerrar una tarea grande sin correr `verify`
