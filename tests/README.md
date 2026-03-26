# Suite de tests

## Capas

- `unit/`: helpers puros, RBAC y contratos de dominio
- `integration/`: shell, rutas y providers
- `contract/`: estructura, docs y fundacion Supabase
- `e2e/`: smoke flows del backoffice

## Comandos

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:contract
npm run test:e2e
npm run test:e2e:smoke
npm run verify
```

## Regla

Si cambias permisos, auditoria, RLS o superficies administrativas, actualiza pruebas en la misma tarea.
