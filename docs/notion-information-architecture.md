# Arquitectura de informacion para Notion

## Objetivo

Reordenar `MoonCode > Saas Opera Pyme` para que cualquier persona, tecnica o no tecnica, pueda encontrar rapido:

- que es el producto
- para quien es
- que modulos existen y cuales faltan
- en que fase vamos
- donde ver arquitectura y seguridad
- donde ver diseno y UX
- donde ver decisiones y pendientes

## Problema actual

La estructura actual de Notion tiene paginas utiles, pero no comunica bien por donde empezar ni como navegar.

Puntos de friccion:

- el hub principal funciona mas como lista plana que como indice guiado
- arquitectura, diseno, roadmap y modulos no estan agrupados por una logica obvia para negocio
- varias paginas suenan tecnicas incluso cuando el lector solo quiere entender alcance o estado
- no hay una pagina clara de "empieza aqui"
- no es evidente donde ver lo ya construido vs lo pendiente

## Estado real del repo por fases

### Fase 1: Fundacion segura

Estado: mayormente completada en repo y Supabase remoto.

Cubierto:

- docs reescritos al dominio real de `OperaPyme`
- base segura en Supabase con RBAC, RLS y auditoria
- baseline de testing
- rutas reservadas de `/admin/*`
- `tools/stress-harness` reservado y documentado

Todavia no completado al nivel de producto final:

- `stress-harness` aun no ejecuta escenarios reales
- admin global de auditoria y errores sigue como superficie reservada, no como modulo vivo conectado a logs reales

### Fase 2: Operacion comercial minima

Estado: parcialmente completada, con una base operativa ya funcional.

Cubierto:

- auth real con magic link
- bootstrap inicial de tenant
- `customers` y `quotes` con lecturas reales
- create/update real de `customers` y `quotes`
- dashboard leyendo datos reales
- numeracion y versionado de quotes ya movidos a Supabase

Todavia faltante contra el roadmap:

- pipeline CRM simple mas completo
- proformas como flujo distinguible
- gastos y deudas
- mas modulos comerciales visibles en navegacion

### Fase 3

No iniciada formalmente como bloque de producto, aunque ya hay bases tecnicas que la preparan.

Pendientes naturales:

- reportes base
- approvals basicas
- tenant setup guiado completo
- feature flags por plan

## Estructura propuesta para Notion

## 1. Empieza aqui

Pagina recomendada: `Inicio de OperaPyme`

Debe responder en menos de 1 minuto:

- que es `OperaPyme`
- para quien es
- que problemas resuelve
- en que fase va
- cuales son los modulos actuales
- que se recomienda leer segun el tipo de persona

Bloques sugeridos:

- resumen ejecutivo
- estado actual del proyecto
- fases del roadmap
- accesos rapidos por perfil

## 2. Producto y alcance

Seccion recomendada: `Producto`

Paginas:

- `Vision y propuesta de valor`
- `Alcance del producto`
- `Mapa de modulos`
- `Roadmap por fases`
- `Que no estamos construyendo ahora`

Objetivo:

- que negocio y stakeholders entiendan el producto sin entrar en temas tecnicos

## 3. Modulos del producto

Seccion recomendada: `Modulos`

Una pagina por modulo, con formato consistente:

- `Dashboard`
- `CRM`
- `Cotizaciones y Proformas`
- `Catalogo`
- `Tenant Settings`
- `Admin global`
- `Stress harness interno`

Cada pagina de modulo debe tener:

- objetivo del modulo
- usuarios o roles que lo usan
- alcance actual
- fuera de alcance actual
- estado de implementacion
- dependencias con otros modulos

## 4. Diseno y experiencia

Seccion recomendada: `Diseno y UX`

Paginas:

- `Direccion visual`
- `Principios UX`
- `Mobile-first y PWA`
- `Theming por tenant`
- `Navegacion del backoffice`
- `Flujos clave`

Objetivo:

- que diseño, producto y negocio entiendan como debe sentirse el sistema

## 5. Arquitectura y seguridad

Seccion recomendada: `Arquitectura y seguridad`

Paginas:

- `Arquitectura de software`
- `Arquitectura tecnica`
- `Supabase y seguridad`
- `RBAC y permisos`
- `Modelo de auditoria`
- `Decisiones de arquitectura`

Objetivo:

- que cualquiera encuentre rapido donde viven los temas de backend, seguridad y reglas de acceso

## 6. Delivery y operacion

Seccion recomendada: `Delivery`

Paginas:

- `Estado de Fase 1`
- `Estado de Fase 2`
- `Pendientes activos`
- `Como se conecta con Linear`
- `Setup y entorno`

Objetivo:

- separar claramente lo que esta hecho, lo que esta en curso y lo que falta

## 7. Research y decisiones

Seccion recomendada: `Research y decisiones`

Paginas:

- `Benchmark`
- `Research externo`
- `Decisiones tomadas`
- `Backlog documental`

Objetivo:

- que el contexto historico no se mezcle con el indice principal

## Pagina home sugerida

La home de Notion no deberia ser una lista larga de links. Deberia tener este orden:

1. Que es OperaPyme
2. Estado actual
3. Leer segun lo que buscas
4. Accesos a grandes secciones
5. Decisiones recientes

## Navegacion sugerida para lectores

### Si alguien quiere entender el producto

- `Inicio de OperaPyme`
- `Producto > Vision y propuesta de valor`
- `Producto > Mapa de modulos`
- `Producto > Roadmap por fases`

### Si alguien quiere entender arquitectura

- `Inicio de OperaPyme`
- `Arquitectura y seguridad > Arquitectura de software`
- `Arquitectura y seguridad > Supabase y seguridad`
- `Arquitectura y seguridad > RBAC y permisos`

### Si alguien quiere entender diseño

- `Inicio de OperaPyme`
- `Diseno y UX > Reglas maestras de UI y UX`
- `Diseno y UX > Navegacion del backoffice`
- `Diseno y UX > Flujos clave`

### Si alguien quiere saber que falta

- `Inicio de OperaPyme`
- `Delivery > Estado de Fase 1`
- `Delivery > Estado de Fase 2`
- `Producto > Roadmap por fases`

## Mapeo desde el repo hacia Notion

- `README.md` -> `Inicio de OperaPyme`
- `docs/product/PRD.md` -> `Producto > Vision y propuesta de valor`
- `docs/product/ROADMAP.md` -> `Producto > Roadmap por fases`
- `docs/saas-blueprint.md` -> `Producto > Alcance del producto`
- `docs/governance/UI_UX_RULES.md` -> `Diseno y UX > Reglas maestras de UI y UX`
- `docs/architecture/*` -> `Arquitectura y seguridad/*`
- `docs/domain/*` -> `Arquitectura y seguridad/*`
- `docs/development-setup.md` -> `Delivery > Setup y entorno`

## Recomendacion operativa

Cuando vuelva el acceso del MCP de Notion, aplicar esta reorganizacion en este orden:

1. crear una nueva pagina de home clara
2. agrupar el contenido actual en las 6 secciones grandes
3. renombrar paginas que hoy no se entienden rapido
4. crear dos paginas de estado: `Estado de Fase 1` y `Estado de Fase 2`
5. dejar accesos rapidos por perfil: negocio, producto, diseno y tecnica
