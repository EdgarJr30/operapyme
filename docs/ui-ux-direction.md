# UI/UX Direction

Fecha de trabajo: 13 de marzo de 2026

Nota de naming: este documento usa `OperaPyme` como nombre temporal de trabajo. El estado del nombre vive en `docs/project-naming.md`.

## 1. Objetivo

Definir una direccion visual y de experiencia consistente para `OperaPyme`, evitando el dashboard generico y manteniendo una identidad:

- minimalista
- clara
- calmada
- mobile-first
- profesional
- con colores pasteles pero accesibles

## 2. Sintesis de research

Esta direccion combina principios de usabilidad y patrones modernos de producto.

### Hallazgos utiles

#### Mobile-first real

`web.dev` insiste en evitar scroll horizontal, definir el viewport correctamente y dejar que el contenido dicte los breakpoints, empezando desde pantallas pequenas.

Implicacion para este proyecto:

- disenar primero en movil
- romper a tablet/desktop solo cuando el contenido lo pida
- evitar tablas imposibles de usar en 390px

#### Formularios claros y rapidos

`web.dev` recomienda usar formularios semanticos, labels visibles, botones claros, targets comodos para dedo y evitar que el teclado tape la accion principal.

Implicacion:

- labels arriba
- CTA principal visible
- formularios cortos
- no depender de placeholders

#### PWAs confiables

`web.dev` define tres pilares para PWAs: capaces, confiables e instalables.

Implicacion:

- experiencia de app, no solo web
- estados offline comprensibles
- acciones con borradores y sincronizacion clara

#### Jerarquia y consistencia

Apple HIG enfatiza jerarquia clara, consistencia, hit targets de 44x44 y contraste suficiente.

Implicacion:

- pocos niveles tipograficos
- controles claros
- densidad contenida
- contraste real aunque usemos pasteles

#### Espacio en blanco y visual hierarchy

NNGroup destaca jerarquia visual, espacio en blanco, interacciones consistentes y progressive disclosure intuitiva.

Implicacion:

- menos ruido visual
- mostrar primero lo importante
- detalles extra solo cuando el usuario los necesita

## 3. Direccion visual elegida

Esta es una inferencia de mercado y no una cita textual: los productos B2B modernos mas agradables suelen verse calmados, ligeros y precisos. La direccion adecuada para este producto es:

- fondos crema o arena muy claros
- superficies marfil y niebla
- acentos pastel con mas uso en resaltes que en bloques grandes
- tipografia sobria, limpia y ligeramente editorial
- bordes suaves y sombras muy controladas
- iconografia lineal y limpia

## 4. Principios de diseno

### 1. Calm density

La app puede tener mucha informacion, pero nunca debe sentirse pesada.

- maximo 1 CTA primaria por bloque
- maximo 2 niveles de sombra
- maximo 2 colores de acento dominantes por pantalla

### 2. First action visible

Cada vista debe dejar claro que hacer a continuacion en menos de 3 segundos.

Ejemplos:

- crear lead
- registrar gasto
- enviar cotizacion
- retomar borrador

### 3. Progressive disclosure

Primero resumen, luego detalle.

- cards con resumen
- drawers o paneles para detalle
- tabs solo si reducen ruido real

### 4. Soft, not weak

Pastel no significa bajo contraste. El texto siempre debe apoyarse en tonos oscuros y las acciones principales deben tener suficiente peso visual.

### 5. One system, two moods

La identidad debe ser una sola, pero con dos matices:

- Backoffice: mas operativa, estructurada y densa
- Storefront: mas editorial, comercial y aspiracional

### 6. Tenant theming

El tenant debe poder elegir una paleta visual sin romper la identidad compartida del producto.

Reglas:

- personalizacion por presets curados, no por color picker libre en el MVP
- los componentes consumen roles semanticos, no hex hardcodeados por tenant
- la misma paleta debe sentirse mas operativa en backoffice y mas editorial en storefront
- mantener neutros estables y mover sobre todo acentos y fondos atmosfericos
- todo cambio debe verse con preview en vivo y contraste validado

### 7. Appearance modes

La app debe soportar `light`, `dark` y `system` sin convertirse en dos productos distintos.

Reglas:

- dark mode es una variacion de apariencia, no una identidad nueva
- light y dark deben compartir la misma jerarquia, espaciado y lenguaje visual
- los componentes deben consumir tokens semanticos para superficie, borde, texto y acento
- evitar fixes con `white`, `black` o overrides ad hoc que rompan la consistencia
- actualizar `color-scheme`, `theme-color` y contraste real en la PWA
- priorizar fondos oscuros calmados y legibles, no dashboards saturados

## 5. Paleta recomendada

Colores pensados para tonos calmados con contraste util.

### Base

- `sand-50`: `#f7f4ef`
- `sand-100`: `#f0ebe4`
- `paper-0`: `#fffdf9`
- `ink-900`: `#201c17`
- `ink-700`: `#554f49`
- `line-200`: `#d8d1c8`

### Acentos pasteles

- `sage-200`: `#cfe3d8`
- `sage-400`: `#99c3b0`
- `sky-200`: `#d6e4f3`
- `sky-400`: `#a9c4e5`
- `peach-200`: `#f0d7c7`
- `peach-400`: `#ddb299`
- `butter-200`: `#f2e5ba`

### Reglas de uso

- fondos base: `sand` y `paper`
- acento principal por defecto: `sage`
- acento secundario por contexto: `sky` o `peach`
- estados nunca solo por color; combinar con icono o texto

## 6. Tipografia

Direccion sugerida:

- Sans principal: `Manrope` o equivalente sobrio y redondeado
- Mono opcional para codigos, SKUs y numeros

Escala:

- Display: `32/38`
- H1: `24/30`
- H2: `18/24`
- Body: `15/22`
- Meta: `13/18`

Reglas:

- no mas de 3 tamanos principales visibles en la misma vista
- usar peso medio o semibold para jerarquia
- evitar bloques largos densos

## 7. Layout

### Movil

- una columna
- bottom nav
- header compacto y sticky
- cards con acciones prioritarias al final

### Tablet/Desktop

- sidebar solo desde `lg`
- grids con aire, no paneles pegados
- tablas con filtros arriba y resumen antes del detalle

## 8. Componentes base

### Cards

- radio amplio
- borde suave
- sombra tenue
- encabezado corto

### Formularios

- label visible arriba
- ayuda contextual corta
- errores debajo del campo
- CTA sticky en movil si el flujo crece

### Tablas y listas

- usar listas tipo cards en movil
- tablas reales solo cuando aporten claridad
- acciones mas usadas visibles sin menu escondido

### Estados

- exito: texto + icono + color
- advertencia: texto + icono + color
- error: texto + icono + color
- offline: texto explicito, no solo badge

## 9. Motion

- sutil y corta
- preferir fade, slide leve y stagger ligero
- no usar motion decorativa gratuita

## 10. Accesibilidad minima

- targets de 44x44 minimo
- contraste de texto y CTAs validable
- focus visible
- navegacion por teclado razonable
- no depender de color solamente
- formularios con semantica HTML real

## 11. Decision operativa

La interfaz del SaaS debe sentirse como una mezcla entre:

- la claridad estructural de una app de productividad
- la calma visual de una herramienta premium
- la simplicidad operativa de una app movil bien resuelta

No queremos:

- dashboards oscuros saturados
- fondos blancos planos con morado generico
- exceso de widgets
- densidad visual de ERP clasico

## 12. Fuentes usadas

- web.dev responsive basics: https://web.dev/articles/responsive-web-design-basics
- web.dev sign-in form best practices: https://web.dev/articles/sign-in-form-best-practices
- web.dev sign-up form best practices: https://web.dev/sign-up-form-best-practices/
- web.dev PWAs overview: https://web.dev/articles/what-are-pwas
- web.dev PWA collection: https://web.dev/progressive-web-apps/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple UI design tips: https://developer.apple.com/design/tips/
- Apple accessibility guidance: https://developer.apple.com/design/human-interface-guidelines/accessibility
- NNGroup visual design principles poster: https://media.nngroup.com/media/articles/attachments/Visual-Design-Principles-Poster.pdf
- Atlassian design tokens: https://atlassian.design/tokens/design-tokens/
- Android Developers Material color roles: https://developer.android.com/design/ui/wear/guides/styles/color/roles-tokens
- Shopify theme settings best practices: https://shopify.dev/docs/storefronts/themes/best-practices/theme-settings
- Shopify color schemes: https://shopify.dev/docs/storefronts/themes/architecture/settings/color-schemes
- MDN CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
- W3C contrast minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- NNGroup notes on whitespace, consistency and hierarchy: https://media.nngroup.com/media/reports/free/Intranet_Design_Annual_2007.pdf
