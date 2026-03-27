# Tenant theming

## Objetivo

Separar claramente:

- modo visual del usuario o dispositivo: `light`, `dark`, `system`
- branding del tenant: paleta, tono y personalidad

## Reglas

- El modo visual nunca reemplaza al branding del tenant.
- Toda UI usa tokens semanticos, no colores hardcodeados por cliente.
- El contraste minimo debe mantenerse en todas las paletas.
- Las paletas del tenant deben sentirse serias, comerciales y legibles.
- La base operativa en light mode debe mantenerse blanca o casi blanca; los acentos vivos y los railes oscuros son apoyo jerarquico, no fondo dominante de toda la app.
- No usar el branding para alterar jerarquia de informacion, espaciado o accesibilidad.

## Modelo

- `appearance_mode`: preferencia del usuario/dispositivo
- `tenant_palette_id`: identidad curada del tenant
- `tenant_logo_asset_id`: branding opcional

## Estado fase 1

- ya existe soporte `light` / `dark` / `system`
- el backoffice usa paletas curadas
- falta persistir branding real por tenant desde backend
