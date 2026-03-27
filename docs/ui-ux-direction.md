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
- una accion primaria clara por bloque
- formularios compactos con labels arriba
- estados vacios utiles, no decorativos
- errores accionables
- jerarquia visual consistente entre mobile y desktop

## Reglas visuales

- evitar dashboards oscuros saturados o visualmente ruidosos
- evitar morado generico como identidad por defecto
- usar degradados suaves y superficies con contraste controlado
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
- dejar notificaciones, cambio de tema y menu de usuario en la barra superior, no escondidos dentro del contenido
- en desktop, el sidebar puede ser mas utilitario y denso si mejora orientacion y velocidad de acceso
- el sidebar desktop puede usar una superficie contrastada y compacta siempre que conserve legibilidad, tenant visible y estado colapsado opcional
- evitar sidebars convertidos en cards gigantes o en una composicion demasiado editorial cuando la tarea principal es operar
- en movil, la navegacion inferior debe limitarse a los modulos mas usados y el resto vivir en un drawer o menu extendido
- el cambio de tenant debe sentirse visible y cercano, porque afecta permisos y datos en toda la sesion

## Superficies clave

- dashboard con proximas acciones
- acceso y auth con layout dividido: contexto visual en un lado, decision primaria en el otro
- formularios de captura rapida
- listados con filtros cortos y legibles
- modulo admin separado del backoffice comercial
