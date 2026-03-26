# Stress harness

Herramienta interna separada del backoffice para ejecutar pruebas masivas controladas.

## Objetivo

- cargar escenarios por JSON o CSV
- simular acciones masivas como crear cientos de usuarios
- registrar tiempos, errores, limites y comportamiento de la plataforma

## Reglas de seguridad

- no usar contra produccion por defecto
- acceso solo para plataforma
- toda ejecucion debe quedar auditada
- los escenarios sensibles deben pasar por backend controlado, no por CRUD cliente

## Estado fase 1

Superficie reservada y documentada. La ejecucion completa se construira en una fase posterior.
