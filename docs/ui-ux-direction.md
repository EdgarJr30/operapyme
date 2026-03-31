# Direccion UI/UX

## Norte

La interfaz debe sentirse:

- calmada
- profesional
- legible
- operativa
- mobile-first de verdad

## Principios

- cada pantalla responde a una tarea de negocio concreta
- cada modulo abre con resumen operativo, acciones directas y estado real del trabajo
- una accion primaria clara por bloque
- formularios compactos con labels arriba
- formularios largos resueltos por pasos cortos o subrutas operativas, no como una sola pantalla gigante
- estados vacios utiles, no decorativos
- errores accionables
- feedback transitorio de acciones por toast global; mensajes inline solo cuando el estado deba permanecer visible en el bloque
- jerarquia visual consistente entre mobile y desktop

## Reglas visuales

- evitar dashboards oscuros saturados o visualmente ruidosos
- evitar morado generico como identidad por defecto
- usar degradados suaves y superficies con contraste controlado
- preferir paletas pastel refinadas, desaturadas y profesionales antes que acentos chillones o demasiado infantiles
- no esconder informacion critica tras hover o tooltips exclusivos de desktop

## Reglas de experiencia

- mobile-first en 390px a 430px antes de escalar
- no usar modales para flujos largos
- en movil, priorizar navegacion inferior y contenido por bloques
- en desktop, usar sidebar solo cuando aporte orientacion real

## Movimiento

- usar `motion.dev` (`motion`) como estandar unico para animaciones y transiciones de interfaz
- respetar `prefers-reduced-motion` y reducir movimiento decorativo en flujos operativos
- usar animaciones cortas y funcionales para drawers, popovers, overlays y transiciones de pagina
- evitar rebotes exagerados, delays largos o microinteracciones que ralenticen la captura y el seguimiento

## Shell del backoffice

- el shell principal debe dar contexto antes que decoracion
- usar navbar superior fija con breadcrumbs, busqueda corta y acciones globales de alto valor
- dejar notificaciones y menu de usuario en la barra superior, no escondidos dentro del contenido
- en desktop, el sidebar puede ser mas utilitario y denso si mejora orientacion y velocidad de acceso
- el sidebar desktop puede usar una superficie contrastada y compacta siempre que conserve legibilidad, tenant visible y estado colapsado opcional
- el sidebar desktop del backoffice debe comportarse como un rail fijo; el scroll del contenido no puede desplazar ni convertir el rail en un panel scrolleable
- evitar sidebars convertidos en cards gigantes o en una composicion demasiado editorial cuando la tarea principal es operar
- en movil, la navegacion inferior debe limitarse a los modulos mas usados y el resto vivir en un drawer o menu extendido
- el cambio de tenant debe sentirse visible y cercano, porque afecta permisos y datos en toda la sesion

## Pantallas operativas

- evitar cards de "reglas", "guidelines", "blueprint" o explicaciones tecnicas dentro de la UI runtime del backoffice
- usar la parte superior de cada modulo para mostrar que puede hacerse ahora, que estado tiene el modulo y cual es la siguiente accion recomendable
- cuando existan datos, priorizar resumenes, listados recientes y accesos directos sobre copy explicativo
- cuando un modulo combine overview, creacion y gestion, separar esas tareas en subrutas o superficies dedicadas antes de seguir agregando bloques en la landing

## Superficies clave

- dashboard con proximas acciones
- acceso y auth con layout dividido: contexto visual en un lado, decision primaria en el otro
- formularios de captura rapida
- listados con filtros cortos y legibles
- modulo admin separado del backoffice comercial
