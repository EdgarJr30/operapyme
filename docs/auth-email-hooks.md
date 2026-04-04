# Auth Emails Con Resend

Fecha: `2026-04-03`

## Objetivo

Centralizar los correos de autenticacion de `OperaPyme` en una sola base visual y de copy, usando:

- Supabase Auth como orquestador del evento
- `Send Email Hook` como punto unico de salida
- Resend como proveedor de envio
- una plantilla versionada dentro del repo en `supabase/functions/send-auth-email`

Esto evita depender de HTML pegado manualmente en el dashboard y permite mantener versionado el branding de magic link, recovery, invitaciones y notificaciones sensibles.

## Tipos de correo cubiertos

La Edge Function `send-auth-email` resuelve hoy estos eventos:

- `magiclink`
- `recovery`
- `signup`
- `invite`
- `email_change`
- `reauthentication`
- `password_changed_notification`
- `email_changed_notification`
- fallback generico para otros eventos de Auth soportados por Supabase

## Archivos fuente

- `supabase/functions/send-auth-email/index.ts`
- `supabase/functions/send-auth-email/template.ts`

## Secretos requeridos en Supabase

Obligatorios:

- `RESEND_API_KEY`
- `SEND_EMAIL_HOOK_SECRET`

Recomendados:

- `AUTH_EMAIL_FROM`
- `AUTH_APP_NAME`
- `AUTH_COMPANY_NAME`
- `AUTH_COMPANY_ADDRESS`
- `AUTH_SUPPORT_URL`
- `AUTH_PRIVACY_URL`
- `AUTH_TERMS_URL`

Valores sugeridos para este proyecto:

```ini
AUTH_EMAIL_FROM="OperaPyme <auth@mooncode.website>"
AUTH_APP_NAME="OperaPyme"
AUTH_COMPANY_NAME="OperaPyme"
```

## Activacion

1. Desplegar la funcion `send-auth-email`.
2. Ir a `Supabase Dashboard > Auth > Hooks`.
3. Activar `Send Email Hook`.
4. Seleccionar la Edge Function `send-auth-email`.
5. Generar o copiar el secreto del hook y guardarlo como `SEND_EMAIL_HOOK_SECRET`.

Comportamiento importante:

- si `Send Email Hook` esta activo, Supabase deja de usar SMTP para estos correos
- el SMTP configurado puede quedarse como fallback operativo si luego desactivas el hook

## Notas de implementacion

- El backoffice ya consume callbacks con `code` o `token_hash`, asi que los enlaces del hook apuntan al mismo flujo de `/auth/callback`.
- `email_change` contempla el caso de doble confirmacion y puede enviar dos correos cuando Supabase entrega ambos tokens.
- El contenido sale en espanol porque hoy el flujo de acceso del producto esta definido asi.

## Siguiente mejora natural

Si luego queremos edicion visual desde Resend Dashboard, podemos replicar esta misma familia visual como templates editables en Resend, pero la fuente de verdad debe seguir viviendo en el repo para no perder trazabilidad.
