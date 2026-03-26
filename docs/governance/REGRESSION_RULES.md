# Reglas anti-regresion

## Regla base

Ningun cambio se considera completo si rompe:

- rutas existentes
- i18n `es/en`
- responsive mobile-first
- permisos esperados
- estados de carga, vacio o error

## Casos especiales

- cambios de RLS requieren tests o contratos actualizados
- cambios de auditoria requieren validar que el rastro siga completo
- cambios de modulo admin requieren revisar filtrado y visibilidad
