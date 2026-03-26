# Tenant Theming y Paletas por Tenant

Fecha de trabajo: 13 de marzo de 2026

Nota de naming: este documento usa `OperaPyme` como nombre temporal de trabajo. El estado del nombre vive en `docs/project-naming.md`.

## 1. Objetivo

Permitir que cada tenant elija una paleta visual para su experiencia sin romper:

- legibilidad
- contraste
- consistencia entre backoffice y storefront
- mobile-first
- multi-tenant
- feature flags

La meta no es ofrecer un editor libre de colores desde el MVP. La meta es ofrecer personalizacion segura, clara y rapida.

## 2. Sintesis de research

Esta sintesis combina fuentes oficiales y una inferencia aplicada al producto.

### Hallazgos clave

#### 1. Usar tokens semanticos, no hex sueltos

Atlassian Design System y Material 3 organizan color por roles, no por valores sueltos. Eso hace que componentes, estados y fondos puedan cambiar sin reescribir cada vista.

Implicacion para este repo:

- definir roles compartidos para superficie, borde, texto y acentos
- dejar que una paleta alimente esos roles
- evitar componentes con colores pegados por marca

#### 2. Dar opciones curadas, no libertad total en el MVP

La documentacion de Shopify sobre configuracion de temas insiste en no saturar al usuario con demasiados settings ni exponer controles innecesariamente granulares.

Implicacion:

- empezar con 4 a 6 paletas validadas
- evitar un color picker libre como primera version
- mostrar nombre, descripcion y preview por paleta

#### 3. La preview debe ser inmediata y contextual

Los flujos de personalizacion de temas que mejor funcionan dejan ver el cambio en vivo y dentro del contexto real del producto.

Implicacion:

- aplicar el cambio al momento
- mostrar preview de backoffice y storefront
- comunicar que la marca es una y el tono visual cambia por contexto

#### 4. Accesibilidad no puede depender del gusto del usuario

WCAG 2.2 exige contraste suficiente y no depender solo del color para comunicar estado. Si abrimos colores arbitrarios, es muy facil romper AA.

Implicacion:

- validar contraste antes de publicar una paleta
- mantener neutros y texto bajo control del sistema
- usar color como parte del estado, no como unica senal

#### 5. CSS custom properties son la mejor capa de entrega runtime

MDN documenta CSS custom properties como la base natural para theming runtime y sobreescritura por contexto.

Implicacion:

- inyectar variables CSS en tiempo de ejecucion
- dejar que Tailwind consuma esas variables
- reutilizar el mismo contrato de tokens en ambas apps

## 3. Decision de producto

Adoptar un sistema de `tenant theming` basado en:

1. una sola identidad de producto
2. multiples paletas curadas por tenant
3. tokens semanticos compartidos
4. dos moods por app

### Una identidad, dos moods

La misma paleta debe verse distinta segun la app:

- Backoffice: mas operativa, mas estructurada, menos editorial
- Storefront: mas comercial, mas aspiracional, mas enfocada en conversion

El tenant no debe configurar dos marcas separadas si realmente es la misma empresa.

### Appearance mode no es branding por tenant

Hay dos capas distintas y no deben mezclarse:

- `appearance mode`: preferencia personal `light`, `dark` o `system`
- `tenant palette`: paleta curada que representa la marca del tenant

Reglas:

- el modo de apariencia puede vivir por dispositivo o por usuario
- la paleta del tenant vive en configuracion compartida del negocio
- cambiar el modo no debe cambiar la marca
- cambiar la paleta no debe romper contraste en ninguno de los modos

### Escalera de personalizacion del producto

La personalizacion visual no debe verse aislada del resto del SaaS. Para este producto conviene documentar tres niveles:

#### Nivel 1: personalizacion segura del MVP

- paleta curada por tenant
- logo
- templates base de documentos y storefront
- preview en vivo con contraste validado

#### Nivel 2: personalizacion operativa guiada

- custom fields, listas y estados via metadata
- formularios publicos y privados configurables
- templates adicionales por rubro o plan
- branding extendido en documentos y comunicaciones

#### Nivel 3: white-label controlado

- dominio custom
- remitentes y correo transaccional alineado a la marca
- branding ampliado por tenant bajo guardrails del sistema
- mayor capacidad de API y configuracion por plan enterprise

Lo que no se recomienda abrir:

- CSS arbitrario por tenant
- backoffice y storefront con marcas totalmente distintas
- overrides visuales que rompan accesibilidad, PWA o mantenimiento

## 4. Reglas operativas

### 1. El selector del MVP sera por presets

No implementar color picker libre en la primera version.

Razon:

- reduce errores de contraste
- acelera activacion
- mantiene consistencia del sistema
- evita soporte manual por combinaciones rotas

### 2. Los componentes consumen roles, no nombres de color de negocio

Roles base recomendados:

- `paper`
- `sand`
- `line`
- `ink`
- `primary`
- `secondary`
- `tertiary`
- `highlight`
- `brand`

Los componentes siguen hablando de superficie, borde, texto o acento. Nunca de "verde cliente X".

### 3. Los neutros deben moverse poco

La personalizacion principal debe ocurrir en acentos y fondos atmosfericos. Los neutros deben mantenerse relativamente estables para conservar legibilidad y familiaridad.

### 4. El selector debe explicar impacto real

Cada opcion de paleta debe decir:

- como se siente
- para que tipo de marca sirve
- que se mantiene igual entre apps

### 5. El cambio debe vivir por tenant

El valor final debe salir de una configuracion por tenant, no por navegador.

## 5. Integracion recomendada en este monorepo

## Capa compartida

Crear una capa comun en `packages/ui` que exponga:

- catalogo de paletas
- tokens runtime
- helpers de contraste
- provider de tema

## Capa de app

Cada app consume el provider compartido y define su mood:

- `apps/backoffice-pwa`: `backoffice`
- `apps/storefront`: `storefront`

## Persistencia

### MVP inmediato

- persistencia local para demo y scaffold
- modo de apariencia `light` / `dark` / `system` persistido por dispositivo

### Persistencia real

- tabla de branding o settings del tenant en Supabase
- cache local para arranque rapido
- sincronizacion al entrar a la app
- preferencia de apariencia futura por usuario si el producto la necesita

## Modelo de datos sugerido

Esto es una recomendacion para la siguiente fase de Supabase:

```sql
tenant_branding (
  tenant_id uuid primary key references tenants(id),
  palette_id text not null,
  logo_url text null,
  updated_at timestamptz not null default now(),
  updated_by uuid null
)
```

Para el MVP visual basta con `palette_id`.

Si mas adelante se persiste la apariencia por usuario, debe vivir fuera del branding del tenant.

## 6. UX del flujo

### Donde se configura

- onboarding wizard del tenant
- configuracion visual en backoffice
- opcion futura en storefront solo para usuarios autorizados del tenant

### Como se presenta

- grid de 4 a 6 paletas
- preview en vivo
- estado de seleccion claro
- notas cortas de accesibilidad y alcance

### Que no hacer

- sliders o pickers HSL en el MVP
- pedir 10 colores distintos
- separar la marca de backoffice y storefront sin una razon comercial real

## 7. QA minima

Una paleta no esta lista si no valida:

- contraste de texto principal sobre superficie
- contraste de CTA principal
- contraste de focus ring
- estados success/info/warning entendibles con icono o copy
- uso aceptable en movil bajo luz fuerte

## 8. Primera propuesta de presets

- `sage`: calmado, balanceado, premium
- `lagoon`: mas tecnologico, limpio, preciso
- `terracotta`: cercano, comercial, servicio
- `graphite`: sobrio, industrial, serio

## 9. Fuentes

- Atlassian Design System, design tokens: https://atlassian.design/tokens/design-tokens/
- Android Developers, Material 3 color roles: https://developer.android.com/design/ui/wear/guides/styles/color/roles-tokens
- Shopify Dev, theme settings best practices: https://shopify.dev/docs/storefronts/themes/best-practices/theme-settings
- Shopify Dev, color schemes and section styling: https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes
- MDN, using CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
- W3C WAI, Understanding SC 1.4.3 Contrast Minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
