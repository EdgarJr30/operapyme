# Modelo de dominio

## Entidades de plataforma

- `app_user`
- `tenant`
- `tenant_membership`
- `platform_role`
- `tenant_role`
- `permission`
- `feature_flag`

## Entidades comerciales iniciales

- `lead`
- `customer`
- `contact`
- `supplier`
- `catalog_item`
- `quote`
- `quote_line`
- `proforma`
- `expense`
- `debt`

## Entidades de control

- `audit_log`
- `audit_row_change`
- `app_error_log`
- `auth_event_log`

## Reglas de modelado

- ids publicos con UUID
- `tenant_id` obligatorio salvo tablas globales justificadas
- timestamps y actor de creacion/actualizacion obligatorios
- borrar duro solo cuando este justificado y documentado
