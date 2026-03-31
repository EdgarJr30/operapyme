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
- El backoffice actual queda fijado en `light`; no expone toggle de modo mientras esta direccion visual siga vigente.
- No usar el branding para alterar jerarquia de informacion, espaciado o accesibilidad.
- La libreria base del producto ofrece presets pastel refinados y una paleta propia basica generada desde cuatro colores semilla: `paper`, `primary`, `secondary` y `tertiary`.
- La paleta propia no es un editor libre de todos los tokens; el sistema deriva superficies, bordes, fondos, CTA y variantes dark para proteger consistencia.

## Modelo

- `appearance_mode`: preferencia del usuario/dispositivo
- `tenant_palette_id`: identidad curada del tenant o selector `custom`
- `tenant_palette_seeds`: colores base de una paleta propia cuando aplique
- `tenant_logo_asset_id`: branding opcional

## Estado fase 1

- el backoffice queda fijado en `light`
- la paleta operativa por defecto usa `primary #2D3E50`, `secondary #FF7A00`, `tertiary #4B637A` y `neutral #F4F7F9`
- el backoffice usa esa paleta como base visual activa con rail oscuro, fondos claros y acento naranja para acciones
- la seleccion y la paleta propia se persisten localmente mientras llega el storage real por tenant
- falta persistir branding real por tenant desde backend
