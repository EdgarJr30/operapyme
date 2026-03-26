# ADR 0001: Monolito modular y domain-first

## Contexto

`OperaPyme` necesita iteracion rapida, gobierno fuerte de seguridad y una base multi-tenant auditable.

El producto aun esta definiendo sus bounded contexts reales y no gana suficiente valor operando como microservicios.

## Decision

Adoptar un **monolito modular** dentro del monorepo como arquitectura base.

Adoptar **domain-first** como criterio de organizacion.

Adoptar **TypeScript funcional y composable** como paradigma por defecto.

No adoptar en esta fase:

- microservicios
- MVC clasico para React + Supabase
- MVVM estricto
- POO pesada como patron dominante

## Consecuencias

- la complejidad operativa inicial baja
- RBAC, RLS y auditoria se gobiernan desde una base unificada
- los modulos crecen por bounded context sin dispersar despliegues
- seguimos pudiendo extraer servicios despues si el dominio lo exige

## Alternativas descartadas

### Microservicios tempranos

Descartados por sobrecosto operativo y poca ganancia actual.

### MVC clasico

Descartado porque no representa bien la combinacion React + hooks + Supabase + politicas RLS.

### MVVM estricto

Descartado porque agrega una capa mental extra que hoy no mejora la velocidad del equipo.

### POO pesada

Descartada porque el dominio actual encaja mejor con tipos, funciones puras, schemas y servicios pequenos.
