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

## Entidades de importacion masiva

- `import_job` — tracking de cada sesion de importacion (status, contadores, batch_tag)
- `import_staging_row` — filas en staging antes de hacer upsert a la tabla destino
- `import_row_error` — errores por fila para reporte descargable

Notas:
- `import_batch_tag uuid` nullable en `customers`, `leads`, `catalog_items` — habilita rollback por sesion
- Ventana de rollback: 72 horas desde `created_at` del job
- Entidades soportadas en Fase 1: `customer`, `lead`, `catalog_item`
- Permisos reutilizados: `crm.write` y `catalog.write` (sin permiso nuevo)

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
- `quote` conserva snapshot del receptor aunque tambien apunte a `lead` o `customer`
