# AGENTS.md

## Rol de `packages/*`

Los paquetes compartidos deben contener piezas reutilizables entre apps sin acoplarse a pantallas concretas.

## Reglas

- `packages/domain`: tipos, esquemas, permisos, eventos, helpers de dominio.
- `packages/ui`: primitivas y patrones reutilizables, no paginas completas.
- `packages/config`: configuracion compartida, tokens y constantes.
- `packages/offline`: sync queue, storage local y utilidades offline.
- `packages/i18n`: configuracion compartida de idiomas, namespaces y recursos `es/en` para todas las apps.

## Restricciones

- No meter dependencias de app dentro de paquetes de dominio.
- No meter branding especifico por tenant en paquetes compartidos.
- Exports pequenos, estables y faciles de testear.
- Si un modulo solo sirve a una app por ahora, dejalo en esa app hasta que el segundo uso sea real.
- En i18n, mantener `es` como fallback del producto y agregar claves equivalentes en `en` desde el inicio.
