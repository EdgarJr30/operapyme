# UI_UX_RULES.md

## 1. Proposito

Este archivo define el contrato obligatorio de UX/UI para `OperaPyme`.

Regla de gobernanza:

- este es el unico documento canonico de reglas UX/UI del repo
- absorbe el criterio que antes vivia en `docs/ui-ux-direction.md`, `docs/tenant-theming.md` y `docs/governance/INSTITUTIONAL_UI_RULES.md`
- no se deben crear otros archivos paralelos de reglas visuales o de experiencia para competir con este contrato
- `AGENTS.md` y `apps/*/AGENTS.md` pueden resumirlo, pero no contradecirlo

Ultima revision mayor: `2026-04-03`.

## 2. Base externa y precedencia

Este contrato se apoya en una sintesis de:

- Apple Human Interface Guidelines
- Material Design / Android design guidance
- WCAG 2.2 guidance from W3C
- Baymard Institute research on forms and readability
- Smashing Magazine UX/UI best-practice articles

Regla de precedencia:

1. Apple HIG es la referencia principal de calidad visual y claridad de interaccion.
2. WCAG 2.2 manda cuando haya una decision de accesibilidad.
3. Baymard manda como soporte para formularios, legibilidad y scanning.
4. Material sirve como referencia secundaria de layout responsive y patrones tactiles.
5. Si una futura decision cambia este contrato, debe compararse contra estas fuentes y actualizarse en la misma tarea.

## 3. Norte de producto

La interfaz debe sentirse:

- calmada
- profesional
- legible
- operativa
- confiable
- mobile-first de verdad

Principios obligatorios:

1. Mobile-first siempre.
2. El backoffice debe sentirse como PWA instalable, estable y tactil.
3. La UX debe respetar RBAC en navegacion, acciones, estados vacios y rutas.
4. Menor carga cognitiva gana.
5. Una accion primaria clara por bloque o zona.
6. Consistencia gana a la novedad.
7. Accesibilidad es calidad, no un polish posterior.
8. Tiempo a valor primero: resumen operativo, siguientes pasos y estado real antes que decoracion.
9. Si una pantalla requiere una explicacion larga para entenderse, la UX aun no esta lista.
10. Wizards, defaults y plantillas ganan a configuraciones largas.
11. Las pantallas runtime del backoffice no deben mostrar copy de scaffold, blueprint, reglas internas o explicaciones tecnicas.
12. Las superficies publicas deben explicar el valor del producto rapido, sin claims tecnicos imposibles de verificar.

## 4. Stack UI obligatorio

Elecciones obligatorias:

- iconos: `lucide-react`
- base de componentes: `shadcn/ui`
- base de primitives para `shadcn/ui`: `Radix UI`
- feedback transitorio: `sonner`
- animacion e interacciones: `motion.dev` (`motion`)
- i18n visible al usuario: `packages/i18n`

Reglas de enforcement:

1. No introducir otra libreria general de iconos para UI de producto.
2. No mezclar varias foundations de componentes para el mismo problema.
3. Los componentes reutilizables deben vivir bajo `src/components/ui` siguiendo el modelo local de `shadcn/ui`.
4. Si falta un patron, extender el sistema compartido antes de crear una solucion local de feature.
5. No introducir otro sistema global de toasts o alerts para feedback transitorio.
6. No introducir otra libreria de animacion para modales, drawers, overlays, page transitions o microinteracciones sin decision documentada.
7. Todo texto visible nuevo debe salir con soporte `es` y `en` desde `packages/i18n`.
8. Si el cambio de copy solo necesita placeholders simples como `{count}` o `{tenant}`, usar interpolacion nativa de i18next.

## 5. Estrategia de viewport

1. El viewport minimo soportado es `320px`.
2. La composicion por defecto debe optimizarse primero para `360px` a `390px`.
3. Tambien se debe revisar `768px`, `1024px`, `1280px` y `1440px` en entregas visuales relevantes.
4. No puede existir scroll horizontal en un flujo critico sobre mobile.
5. Desktop puede ganar densidad y visibilidad paralela, pero no puede inventar una arquitectura de informacion distinta a la resuelta en mobile.
6. Deben respetarse safe areas de iOS y Android cuando aplique.
7. En mobile, las acciones primarias frecuentes deben quedar dentro de una zona de alcance razonable sin precision excesiva.

## 6. Layout, espaciado y uso horizontal

### 6.1 Escala de espaciado

Usar una escala basada en `8px`.

Tokens permitidos:

- `4px` solo para microajustes
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `40px`
- `48px`
- `56px`
- `64px`

No introducir espaciados arbitrarios si no pasan a ser token del sistema.

### 6.2 Padding de pagina

- mobile: `16px` minimo
- large phone / phablet: `20px` a `24px`
- tablet y desktop: `24px` a `32px`

### 6.3 Ritmo vertical

- entre controles muy relacionados: `8px`
- entre campos del mismo grupo: `12px` a `16px`
- entre grupos dentro de la misma seccion: `16px` a `24px`
- entre secciones mayores: `24px` a `32px`
- entre bloques de pagina: `32px` a `48px`

Regla:

- no usar vacios verticales gigantes para simular premium; la jerarquia debe venir de agrupacion, contraste y composicion

### 6.4 Anchuras de contenedor

- superficies de lectura o escritura larga: `720px` a `880px` maximo util
- modulos operativos estandar del backoffice: `1280px` maximo recomendado
- vistas densas con tablas, grids o comparacion paralela: se permite crecer hasta `1440px`
- superficies publicas y landings: `1200px` a `1280px`

Reglas:

1. En desktop, un modulo operativo no debe quedarse atrapado en un contenedor demasiado estrecho por costumbre.
2. Evitar `max-width` de lectura en dashboards o vistas de gestion si eso desperdicia ancho y obliga a apilar todo verticalmente.
3. Si el contenido es operativo y escaneable, usar el ancho para comparar, resumir y decidir mejor.

### 6.5 Composicion mobile-first

1. Mobile usa una sola columna por defecto.
2. Formularios largos, detalles extensos y flujos de captura se apilan primero y luego mejoran progresivamente.
3. Dos columnas en mobile solo se permiten si ambas siguen siendo legibles y tactiles.
4. Barras de accion sticky en mobile deben respetar safe areas y mantener `16px` de padding horizontal.

### 6.6 Regla obligatoria de horizontalidad en desktop

Esta seccion existe para evitar layouts demasiado verticales en pantallas amplias.

Reglas obligatorias:

1. A partir de `1280px`, una pagina operativa de overview o dashboard debe usar al menos dos columnas principales cuando el contenido se beneficie de comparacion o visibilidad paralela.
2. El patron por defecto para overview operativo en desktop es grid de `12 columnas`.
3. Split recomendado para overview: columna principal `7-8` columnas y columna secundaria `4-5` columnas.
4. Si hay `3` o mas KPI del mismo nivel, deben resolverse en grid de `3` o `4` cards antes de apilarse como tarjetas altas y estrechas.
5. Un bloque de bienvenida o resumen no puede monopolizar el first fold de desktop. Como regla general debe ocupar `30%` a `35%` del ancho o `3-4` columnas, no mas.
6. No dejar gutters gigantes o aire muerto a izquierda y derecha mientras el contenido real se vuelve una torre vertical.
7. Evitar cards demasiado altas para un solo dato. En desktop, las cards de KPI deben priorizar anchura util y proporciones balanceadas.
8. Minimo recomendado de ancho para una card de KPI en desktop: `220px` a `280px`.
9. Paneles relacionados como alertas, tareas, salud operativa, actividad reciente, equipo o estados deben ir lado a lado cuando el viewport lo permita.
10. Si una lista compacta puede escanearse mejor en filas alineadas o en una composicion de dos lineas, no debe forzarse a un stack de cuatro o cinco lineas por item.
11. El primer fold de un home o dashboard operativo debe mostrar estado real del negocio: resumen, siguientes acciones y al menos dos bloques de datos vivos cuando existan datos.
12. No resolver la composicion estirando altura de cards. Primero resolver con grid, anchura, agrupacion y paralelismo.
13. El desktop del backoffice debe sentirse operativo, no editorial: sin heroes gigantes, sin saludo sobredimensionado y sin copy largo por encima de la informacion real.

### 6.7 Reglas de landing y superficies publicas

Espaciado recomendado:

- seccion mayor: `48px` mobile / `56px` tablet / `64px` desktop
- seccion de continuidad: `40px` mobile / `48px` tablet / `56px` desktop
- gap entre encabezado de seccion y bloque principal: `32px` mobile / `40px` tablet / `48px` desktop
- gap entre bloques de soporte dentro de la misma seccion: `24px` a `32px`

Reglas:

1. Las superficies publicas pueden ser mas editoriales que el backoffice, pero no deben competir visualmente con el producto operativo.
2. Deben explicar el valor del producto rapido.
3. Deben compartir branding general, tono y claridad con el resto del sistema.
4. No deben exponer datos internos, rutas administrativas ni lenguaje tecnico de implementacion.
5. No deben usar claims tecnicos imposibles de verificar.
6. Secciones consecutivas que cuentan la misma historia deben sentirse conectadas, no como bloques aislados separados por aire muerto.

## 7. Shell del backoffice y navegacion

### 7.1 Shell del backoffice

1. El shell principal debe dar contexto antes que decoracion.
2. Usar top bar fija para contexto, busqueda corta y acciones globales de alto valor cuando el layout lo requiera.
3. Notificaciones y menu de usuario deben vivir en la barra superior, no escondidos dentro del contenido.
4. El sidebar desktop debe comportarse como rail fijo e independiente del scroll del contenido.
5. El sidebar desktop puede ser mas utilitario y denso si mejora orientacion y velocidad.
6. Evitar sidebars convertidos en cards gigantes o composiciones demasiado editoriales.
7. El cambio de tenant debe sentirse visible y cercano porque cambia datos y permisos.

### 7.2 Navegacion mobile

1. La navegacion inferior se usa para `3` a `5` destinos top-level realmente frecuentes.
2. El resto debe vivir en drawer o menu extendido.
3. Filtros, acciones secundarias y controles densos deben moverse a sheets o drawers en mobile.
4. No esconder informacion critica detras de hover o tooltips exclusivos de desktop.

### 7.3 Navegacion desktop

1. Sidebar para modulos top-level cuando el ancho lo soporte.
2. Top bar para contexto de pagina, busqueda y acciones globales ligeras.
3. Breadcrumbs solo cuando la profundidad sea real y util.
4. Mantener orden y lenguaje estable de navegacion entre tenants y roles cuando sea posible.
5. No crear ramas de informacion exclusivas de desktop si rompen continuidad con mobile.

### 7.4 Reglas de arquitectura de informacion

1. Las rutas no autorizadas deben ocultarse salvo que la descubribilidad sea intencional.
2. Labels de navegacion deben usar lenguaje de dominio estable y claro.
3. El usuario no debe reaprender el mismo flujo entre mobile y desktop.

## 7.5 Patron operativo por defecto para modulos CRUD y documentales

Regla obligatoria para modulos internos tipo clientes, proveedores, cotizaciones, facturas documentales y equivalentes:

1. La superficie principal debe abrir en modo `table-first` o lista operativa equivalente, no en un wizard vacio ni en tabs que separen "crear" y "gestionar" como dos mundos distintos.
2. El listado debe ser la fuente principal de contexto: busqueda, filtros, estado, total y acciones inmediatas.
3. La accion primaria de crear debe vivir visible en el header del modulo.
4. Crear y editar deben reutilizar la misma superficie contextual siempre que el flujo siga siendo razonable para esa modalidad.
5. En desktop, la edicion contextual por defecto es modal; en mobile debe escalar a una presentacion de pantalla completa o casi completa sin perder continuidad con el listado.
6. Solo se justifica una ruta dedicada o un flujo separado cuando el proceso sea claramente largo, de alto riesgo o requiera comparacion paralela imposible de resolver de forma contextual.
7. Los cambios simples de estado o acciones secundarias frecuentes deben poder ejecutarse desde la tabla sin obligar a abrir siempre el editor completo.
8. Estados vacios, loading, errores y permisos deben resolverse dentro de la misma superficie del listado.

## 8. Direccion visual y theming por tenant

### 8.1 Direccion visual

La interfaz debe evitar:

- dashboards oscuros saturados
- ruido visual
- morado generico como identidad por defecto
- glow o blur decorativo excesivo
- sombras pesadas solo por parecer premium

La interfaz debe preferir:

- base blanca o casi blanca en light mode
- contraste controlado
- superficies calmadas
- acentos medidos
- jerarquia fuerte por layout y espaciado
- paletas refinadas, serias y comerciales

### 8.2 Capas de apariencia

La apariencia visual se divide en dos capas:

- `appearance_mode`: `light`, `dark`, `system`
- branding del tenant: paleta, tono, logo e identidad curada

Reglas:

1. El modo visual nunca reemplaza al branding del tenant.
2. El branding del tenant nunca puede romper jerarquia, contraste o accesibilidad.
3. Toda UI debe usar tokens semanticos; no colores hardcodeados por cliente dentro de componentes.
4. Dark mode debe conservar la misma jerarquia visual y no convertirse en interfaz neon, gamer o saturada.
5. La identidad visual por defecto del producto sigue siendo light-first.

### 8.3 Reglas de palette

1. Las paletas del tenant deben sentirse serias, comerciales, legibles y contemporaneas.
2. Los acentos vivos son apoyo jerarquico, no fondo dominante de toda la aplicacion.
3. El contraste minimo debe mantenerse en todas las paletas.
4. Estado nunca depende solo del color; debe combinarse con texto, icono o ambos.
5. Las variantes dark deben derivar de tokens semanticos compartidos, no de overrides ad hoc por feature.

Baseline operativa actual mientras llega branding completo por tenant:

- `primary`: `#2D3E50`
- `secondary`: `#FF7A00`
- `tertiary`: `#4B637A`
- `neutral`: `#F4F7F9`

### 8.4 Modelo de theming

Modelo esperado:

- `appearance_mode`
- `tenant_palette_id`
- `tenant_palette_seeds`
- `tenant_logo_asset_id`

Reglas:

1. La libreria base ofrece presets curados y una paleta propia basica generada desde semillas.
2. La paleta propia no es un editor libre de todos los tokens; el sistema debe derivar superficies, bordes, fondos, CTA y variantes oscuras para proteger consistencia.

## 9. Tipografia y copy

Escala base recomendada:

- page title: `28px` mobile / `32px` a `36px` desktop
- section title: `24px`
- subsection title: `20px`
- card o group title: `18px`
- body: `16px`
- secondary body: `14px`
- caption o helper: `12px` a `13px`
- form labels: `14px` a `16px`

Reglas:

1. Body text principal en mobile no baja de `16px`.
2. Evitar contenido critico por debajo de `14px`.
3. Usar line-height de `1.2` a `1.3` para headings y `1.5` a `1.7` para parrafos.
4. Mantener line length aproximada de `45` a `75` caracteres cuando el layout lo permita.
5. Preferir parrafos cortos.
6. Headings deben adelantar significado; evitar titulos genericos si hay uno mas preciso.
7. Usar sentence case en labels, botones, ayudas, empty states y navegacion.
8. Evitar all caps en controles, navegacion y copy corrido.
9. El copy de soporte debe explicar que puede hacerse ahora, no repetir el titulo.
10. En el runtime del backoffice, el copy debe ser operativo y concreto, no conceptual ni academico.

## 10. Dashboards, cards, listas y tablas

### 10.1 Dashboards operativos

1. Cada modulo debe abrir con resumen operativo, acciones directas y estado real.
2. Cuando existan datos, priorizar indicadores, listados recientes y accesos directos sobre copy explicativo.
3. Si un modulo combina overview, creacion y gestion, separar esas tareas en subrutas o superficies dedicadas antes de seguir apilando bloques.
4. Evitar dashboards que sean solo saludo, contexto y explicacion sin datos accionables.

### 10.2 Cards y listas

1. Cada card debe representar una entidad, resumen o decision unit clara.
2. Una card debe tener estructura predecible: titulo, metadata critica, estado y acciones.
3. Evitar nested cards innecesarias.
4. Rows y cards clicables en mobile deben ofrecer al menos `48px` de altura tactil.
5. En desktop, una lista densa debe escanearse por filas y columnas utiles, no por torres de texto repetitivas.

### 10.3 Tablas

1. Las tablas se permiten para datos densos en desktop.
2. Toda tabla debe tener alternativa mobile: cards apiladas, lista agrupada o drill-down.
3. No usar tablas con scroll horizontal como solucion mobile por defecto.
4. Las acciones de fila deben seguir siendo visibles y tactiles.

### 10.4 Filtros, orden y paginacion

1. Reutilizar patrones de filtros y orden dentro del producto.
2. En mobile, filtros dentro de sheets o full-screen flows, no en filas apretadas.
3. La paginacion debe ser finger-friendly.
4. Infinite scroll no es el default.

## 11. Formularios y captura de datos

### 11.1 Estructura

1. Los formularios mobile son de una sola columna por defecto.
2. Los formularios largos deben resolverse por secciones, pasos o subrutas.
3. Usar progressive disclosure para opciones avanzadas o poco frecuentes.
4. Preservar draft state cuando el usuario invierte esfuerzo significativo.

### 11.2 Campos

1. Todo campo debe tener label visible y permanente.
2. Placeholder es ejemplo, nunca label unica.
3. Ajustar keyboard, `inputmode` y `autocomplete` al tipo de dato.
4. Si un requisito es delicado, mostrar helper text antes de que falle la validacion.
5. En `type="number"`, el spinner nativo debe avanzar de `1` en `1`.
6. Si el dominio acepta decimales, se permiten por digitacion manual sin convertir el spinner a `0.01`.

### 11.3 Validacion

1. Los mensajes de validacion deben ser especificos y accionables.
2. No validar agresivamente en cada keystroke si no ayuda.
3. Los errores van cerca del campo y se resumen arriba si el formulario es largo.
4. El tratamiento de required y optional debe ser consistente en el mismo flujo.

### 11.4 Usabilidad mobile

1. Evitar campos side-by-side en phones salvo que sigan siendo claros y tactiles.
2. No atrapar entradas largas dentro de dialogs pequenos.
3. En formularios largos, se permite CTA sticky inferior.
4. El submit debe mostrar loading, success o failure accionable.

## 12. Feedback, estados y permisos

Toda pantalla o componente async importante debe definir:

- loading
- skeleton o placeholder
- empty
- no-results
- error
- success cuando aplique
- disabled cuando aplique
- offline o degraded state cuando aplique
- permission-denied cuando aplique

Reglas:

1. Los empty states deben explicar para que sirve la pantalla y cual es el siguiente paso.
2. Los errores deben ayudar a recuperarse.
3. El feedback transitorio debe usar `sonner`.
4. Reservar mensajes inline para estados estructurales, vacios, cargas o errores persistentes.
5. Una accion destructiva o costosa no puede depender de un toast como unica confirmacion.
6. La UI expresa permisos, pero no reemplaza autorizacion real.

## 13. Accesibilidad base

1. WCAG 2.2 AA es el objetivo por defecto.
2. Controles interactivos deben ser keyboard reachable cuando el contexto soporte teclado.
3. Screen-reader names deben coincidir con el label visible o comunicar la misma accion.
4. `focus-visible` es obligatorio.
5. Usar HTML semantico antes de sumar ARIA.
6. Soportar zoom y text resizing hasta `200%` sin romper el flujo.
7. Estados, validacion y prioridad nunca dependen solo del color.
8. Todo target primario debe respetar `44x44 CSS px`, con preferencia por `48x48`.

## 14. Movimiento

1. El movimiento debe apoyar orientacion, jerarquia o feedback.
2. Las transiciones estandar deben quedar normalmente entre `150ms` y `250ms`.
3. Superficies grandes pueden llegar a `300ms` si siguen sintiendose responsivas.
4. Evitar rebotes exagerados, delays largos y animaciones decorativas que ralenticen la operacion.
5. Respetar `prefers-reduced-motion`.
6. Drawers, overlays, popovers, modales y transiciones de pagina deben implementarse con `motion`.

## 15. Checklist de revision obligatoria

Antes de cerrar una entrega visual relevante, verificar:

1. Funciona en `320px`, `360px`, `390px`, `768px`, `1280px` y `1440px`.
2. No hay scroll horizontal en mobile.
3. Los targets primarios cumplen `44x44`, idealmente `48x48`.
4. El body text sigue siendo legible sin zoom.
5. Los formularios usan labels visibles y composicion mobile de una columna.
6. La pantalla tiene estados de loading, empty, error y permisos coherentes.
7. La navegacion y las acciones respetan RBAC.
8. Se usan tokens semanticos y no colores hardcodeados por feature.
9. Todo texto nuevo sale por `packages/i18n` con `es` y `en`.
10. El desktop no se comporta como una torre vertical estrecha si la tarea se beneficia del ancho disponible.
11. El first fold de un overview operativo muestra resumen, acciones y datos reales.
12. La solucion reutiliza el sistema compartido en vez de inventar patrones locales.
13. La propuesta cumple los criterios de claridad, interactividad, legibilidad y organizacion inspirados en Apple.

## 16. Referencias externas usadas en esta revision

- Apple UI design tips: https://developer.apple.com/design/tips/
- Apple accessibility guidance: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple larger text evaluation criteria: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-accessibility-evaluation-criteria/
- Android mobile layout and navigation patterns: https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns
- Material accessibility touch targets: https://m1.material.io/usability/accessibility.html
- WCAG 2.2 target size minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 contrast and resize text: https://www.w3.org/TR/WCAG22/
- Baymard on single-column forms: https://baymard.com/blog/avoid-multi-column-forms
- Baymard on visible labels: https://baymard.com/blog/mobile-forms-avoid-inline-labels
- Baymard on readable line length: https://baymard.com/blog/line-length-readability
- Smashing Magazine on mobile form design: https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/
- Smashing Magazine on form labels and mobile input UX: https://www.smashingmagazine.com/2018/08/ux-html5-mobile-form-part-1/
- Smashing Magazine on efficient web forms: https://www.smashingmagazine.com/2017/06/designing-efficient-web-forms/
- Smashing Magazine on line height and responsive typography: https://www.smashingmagazine.com/2014/09/balancing-line-length-font-size-responsive-web-design/
