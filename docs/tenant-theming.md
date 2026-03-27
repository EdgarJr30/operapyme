# Tenant theming

## Objetivo

Separar claramente:

- modo visual del usuario o dispositivo: `light`, `dark`, `system`
- branding del tenant: paleta, tono y personalidad

## Reglas

- El modo visual nunca reemplaza al branding del tenant.
- Toda UI usa tokens semanticos, no colores hardcodeados por cliente.
- El contraste minimo debe mantenerse en todas las paletas.
- Las paletas del tenant deben sentirse serias, comerciales, legibles y contemporaneas.
- La base operativa en light mode debe mantenerse blanca o casi blanca; los acentos vivos y los railes oscuros son apoyo jerarquico, no fondo dominante de toda la app.
- No usar el branding para alterar jerarquia de informacion, espaciado o accesibilidad.
- La libreria base del producto ofrece presets pastel refinados y una paleta propia basica generada desde cuatro colores semilla: `paper`, `primary`, `secondary` y `tertiary`.
- La paleta propia no es un editor libre de todos los tokens; el sistema deriva superficies, bordes, fondos, CTA y variantes dark para proteger consistencia.

## Modelo

- `appearance_mode`: preferencia del usuario/dispositivo
- `tenant_palette_id`: identidad curada del tenant o selector `custom`
- `tenant_palette_seeds`: colores base de una paleta propia cuando aplique
- `tenant_logo_asset_id`: branding opcional

## Estado fase 1

- ya existe soporte `light` / `dark` / `system`
- el backoffice usa presets pastel refinados y una paleta propia basica editable
- la seleccion y la paleta propia se persisten localmente mientras llega el storage real por tenant
- falta persistir branding real por tenant desde backend
