import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

import {
  type AuthEmailContent,
  renderAuthEmailHtml,
  renderAuthEmailText
} from "./template.ts";

type AuthHookUser = {
  email?: string;
  email_new?: string;
  id?: string;
  user_metadata?: Record<string, unknown> | null;
};

type AuthHookEmailData = {
  email_action_type: string;
  old_email?: string;
  redirect_to?: string;
  site_url?: string;
  token?: string;
  token_hash?: string;
  token_hash_new?: string;
  token_new?: string;
};

type AuthHookPayload = {
  email_data: AuthHookEmailData;
  user: AuthHookUser;
};

type ResendEmailRequest = {
  from: string;
  html: string;
  subject: string;
  text: string;
  to: string[];
};

type EmailScenario = AuthEmailContent & {
  to: string;
};

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const sendEmailHookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
const authEmailFrom = Deno.env.get("AUTH_EMAIL_FROM") ?? "OperaPyme <auth@mooncode.website>";
const appName = Deno.env.get("AUTH_APP_NAME") ?? "OperaPyme";
const companyName = Deno.env.get("AUTH_COMPANY_NAME") ?? appName;
const companyAddress = Deno.env.get("AUTH_COMPANY_ADDRESS")?.trim() || null;

function normalizeUrl(value: string | null | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
}

function resolveSiteUrl(payload: AuthHookPayload) {
  return (
    normalizeUrl(payload.email_data.redirect_to) ??
    normalizeUrl(payload.email_data.site_url) ??
    "https://operapyme.app"
  );
}

function resolveSupportUrl(payload: AuthHookPayload) {
  return normalizeUrl(Deno.env.get("AUTH_SUPPORT_URL")) ?? resolveSiteUrl(payload);
}

function resolvePrivacyUrl(payload: AuthHookPayload) {
  return normalizeUrl(Deno.env.get("AUTH_PRIVACY_URL")) ?? resolveSiteUrl(payload);
}

function resolveTermsUrl(payload: AuthHookPayload) {
  return normalizeUrl(Deno.env.get("AUTH_TERMS_URL")) ?? resolveSiteUrl(payload);
}

function resolveUserName(user: AuthHookUser) {
  const metadata = user.user_metadata ?? {};
  const candidates = [
    metadata["full_name"],
    metadata["name"],
    metadata["display_name"],
    metadata["first_name"]
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  if (typeof user.email === "string" && user.email.includes("@")) {
    return user.email.split("@")[0];
  }

  return "equipo";
}

function buildActionUrl(
  payload: AuthHookPayload,
  tokenHash: string | null | undefined,
  otpType: string | null | undefined
) {
  const base = resolveSiteUrl(payload);

  if (!tokenHash || !otpType) {
    return base;
  }

  const url = new URL(base);
  url.searchParams.set("token_hash", tokenHash);
  url.searchParams.set("type", otpType);
  return url.toString();
}

function buildEmailChangeScenario(
  payload: AuthHookPayload,
  options: {
    actionLabel: string;
    emailType: string;
    message: string;
    securityNote: string;
    subject: string;
    subtitle: string;
    summaryText: string;
    title: string;
    to: string;
    tokenHash: string | null | undefined;
  }
): EmailScenario {
  return {
    actionLabel: options.actionLabel,
    actionUrl: buildActionUrl(payload, options.tokenHash, "email_change"),
    emailType: options.emailType,
    message: options.message,
    previewText: options.subtitle,
    securityNote: options.securityNote,
    subject: options.subject,
    subtitle: options.subtitle,
    summaryText: options.summaryText,
    title: options.title,
    to: options.to,
    userEmail: options.to,
    userName: resolveUserName(payload.user)
  };
}

function buildDefaultScenario(payload: AuthHookPayload): EmailScenario[] {
  const actionType = payload.email_data.email_action_type;
  const userEmail = payload.user.email?.trim();

  if (!userEmail) {
    throw new Error("The auth hook payload does not include a recipient email.");
  }

  const siteUrl = resolveSiteUrl(payload);
  const userName = resolveUserName(payload.user);
  const defaultActionUrl = siteUrl;

  const baseScenario = {
    to: userEmail,
    userEmail,
    userName
  };

  switch (actionType) {
    case "magiclink":
      return [
        {
          ...baseScenario,
          actionLabel: "Entrar ahora",
          actionUrl: buildActionUrl(payload, payload.email_data.token_hash, "magiclink"),
          emailType: "Magic link",
          message:
            "Usa este acceso seguro para entrar directamente a tu cuenta desde este dispositivo.",
          previewText: "Tu acceso rapido esta listo para entrar a OperaPyme.",
          securityNote:
            "Si no reconoces esta solicitud, no compartas este enlace con nadie y simplemente ignora este mensaje.",
          subject: `Tu magic link para ${appName} esta listo`,
          subtitle: `Entra a ${appName} sin escribir tu contrasena.`,
          summaryText:
            "El magic link es de un solo uso y puede expirar en poco tiempo.",
          title: "Tu acceso rapido esta listo"
        }
      ];
    case "recovery":
      return [
        {
          ...baseScenario,
          actionLabel: "Restablecer contrasena",
          actionUrl: buildActionUrl(payload, payload.email_data.token_hash, "recovery"),
          emailType: "Recuperacion de contrasena",
          message:
            "Recibimos una solicitud para restablecer tu contrasena. Haz clic en el boton para crear una nueva.",
          previewText: "Restablece tu contrasena de forma segura.",
          securityNote:
            "Si no solicitaste este cambio, te recomendamos ignorar este correo y revisar la seguridad de tu cuenta.",
          subject: `Restablece tu contrasena en ${appName}`,
          subtitle: "Protegemos el acceso a tu cuenta.",
          summaryText:
            "Por seguridad, este enlace debe usarse dentro del tiempo indicado por la plataforma.",
          title: "Restablece tu contrasena"
        }
      ];
    case "signup":
      return [
        {
          ...baseScenario,
          actionLabel: "Confirmar correo",
          actionUrl: buildActionUrl(payload, payload.email_data.token_hash, "signup"),
          emailType: "Confirmacion de cuenta",
          message:
            "Tu cuenta ya casi esta lista. Confirma tu correo para terminar el acceso seguro a la plataforma.",
          previewText: "Confirma tu correo para activar tu cuenta.",
          securityNote:
            "Si no creaste esta cuenta, puedes ignorar este mensaje con seguridad.",
          subject: `Confirma tu cuenta en ${appName}`,
          subtitle: "Activa tu acceso de forma segura.",
          summaryText:
            "La confirmacion valida tu correo y habilita el ingreso inicial a tu tenant.",
          title: "Confirma tu cuenta"
        }
      ];
    case "invite":
      return [
        {
          ...baseScenario,
          actionLabel: "Aceptar invitacion",
          actionUrl: buildActionUrl(payload, payload.email_data.token_hash, "invite"),
          emailType: "Invitacion",
          message:
            "Recibiste una invitacion para entrar a OperaPyme. Usa el boton de abajo para aceptar el acceso y continuar.",
          previewText: "Tu invitacion a OperaPyme esta lista.",
          securityNote:
            "Si no esperabas esta invitacion, ignora este correo y avisanos si necesitas apoyo.",
          subject: `Tienes una invitacion pendiente en ${appName}`,
          subtitle: "Tu acceso colaborativo esta listo.",
          summaryText:
            "La invitacion conecta esta direccion de correo con el espacio de trabajo que te compartieron.",
          title: "Acepta tu invitacion"
        }
      ];
    case "email_change": {
      const currentEmail = payload.user.email?.trim();
      const newEmail = payload.user.email_new?.trim();
      const currentTokenHash = payload.email_data.token_hash_new?.trim();
      const newTokenHash = payload.email_data.token_hash?.trim();
      const scenarios: EmailScenario[] = [];

      if (currentEmail && currentTokenHash) {
        scenarios.push(
          buildEmailChangeScenario(payload, {
            actionLabel: "Confirmar correo actual",
            emailType: "Cambio de correo",
            message:
              "Recibimos una solicitud para cambiar el correo de tu cuenta. Primero necesitamos confirmar que controlas tu correo actual.",
            securityNote:
              "Si no solicitaste este cambio, no hagas clic y revisa la seguridad de tu cuenta.",
            subject: `Confirma el correo actual de tu cuenta en ${appName}`,
            subtitle: "Validemos que sigues teniendo acceso a tu correo actual.",
            summaryText:
              "Este paso protege tu cuenta antes de autorizar un correo nuevo.",
            title: "Confirma tu correo actual",
            to: currentEmail,
            tokenHash: currentTokenHash
          })
        );
      }

      if (newEmail && newTokenHash) {
        scenarios.push(
          buildEmailChangeScenario(payload, {
            actionLabel: "Confirmar correo nuevo",
            emailType: "Cambio de correo",
            message:
              "Tu nuevo correo ya esta casi listo. Confirma esta direccion para terminar el cambio en tu cuenta.",
            securityNote:
              "Si no esperabas este cambio, ignora el mensaje. El correo no se activara sin confirmacion.",
            subject: `Confirma tu nuevo correo en ${appName}`,
            subtitle: "Terminemos la verificacion de tu nuevo correo.",
            summaryText:
              "La confirmacion vinculara esta direccion con tu acceso a la plataforma.",
            title: "Confirma tu correo nuevo",
            to: newEmail,
            tokenHash: newTokenHash
          })
        );
      }

      if (scenarios.length > 0) {
        return scenarios;
      }

      return [
        {
          ...baseScenario,
          actionLabel: "Abrir OperaPyme",
          actionUrl: defaultActionUrl,
          emailType: "Cambio de correo",
          message:
            "Recibimos una solicitud relacionada con el cambio de correo de tu cuenta.",
          previewText: "Revisa el estado del cambio de correo.",
          securityNote:
            "Si no reconoces esta solicitud, ignora este mensaje y revisa la seguridad de tu cuenta.",
          subject: `Revisa el cambio de correo de tu cuenta en ${appName}`,
          subtitle: "Mantengamos tu acceso seguro.",
          summaryText:
            "No fue posible adjuntar los enlaces de confirmacion en este envio, pero tu cuenta no se modificara sin verificacion.",
          title: "Revisa tu cambio de correo"
        }
      ];
    }
    case "password_changed_notification":
      return [
        {
          ...baseScenario,
          actionLabel: "Abrir OperaPyme",
          actionUrl: defaultActionUrl,
          emailType: "Seguridad de cuenta",
          message:
            "Te confirmamos que la contrasena de tu cuenta fue actualizada correctamente.",
          previewText: "Tu contrasena ya fue cambiada.",
          securityNote:
            "Si no realizaste este cambio, revisa de inmediato la seguridad de tu cuenta y contactanos.",
          subject: `Tu contrasena en ${appName} fue actualizada`,
          subtitle: "Te avisamos de un cambio sensible en tu acceso.",
          summaryText:
            "Este mensaje es informativo y se envia para que puedas detectar cambios no autorizados.",
          title: "Tu contrasena fue actualizada"
        }
      ];
    case "email_changed_notification":
      return [
        {
          ...baseScenario,
          actionLabel: "Abrir OperaPyme",
          actionUrl: defaultActionUrl,
          emailType: "Seguridad de cuenta",
          message:
            "El correo asociado a tu cuenta fue actualizado. Si hiciste este cambio, no necesitas hacer nada mas.",
          previewText: "Tu correo de acceso fue actualizado.",
          securityNote:
            "Si no autorizaste este cambio, contactanos lo antes posible.",
          subject: `Tu correo de acceso en ${appName} fue actualizado`,
          subtitle: "Te avisamos de un cambio sensible en tu cuenta.",
          summaryText:
            "Este mensaje sirve como alerta operativa para detectar cambios no esperados.",
          title: "Tu correo fue actualizado"
        }
      ];
    case "reauthentication":
      return [
        {
          ...baseScenario,
          actionLabel: "Confirmar acceso",
          actionUrl: buildActionUrl(payload, payload.email_data.token_hash, "magiclink"),
          emailType: "Confirmacion adicional",
          message:
            "Necesitamos verificar de nuevo tu identidad antes de completar una accion sensible dentro de la plataforma.",
          previewText: "Confirma tu identidad para continuar.",
          securityNote:
            "Si no iniciaste esta validacion, ignora este mensaje.",
          subject: `Confirma tu identidad en ${appName}`,
          subtitle: "Una capa extra de seguridad antes de continuar.",
          summaryText:
            "Este enlace valida tu sesion antes de una accion delicada.",
          title: "Confirma tu identidad"
        }
      ];
    default:
      return [
        {
          ...baseScenario,
          actionLabel: "Abrir OperaPyme",
          actionUrl: defaultActionUrl,
          emailType: "Notificacion de cuenta",
          message:
            "Recibiste una notificacion automatica relacionada con tu acceso o la seguridad de tu cuenta.",
          previewText: "Hay una actualizacion importante en tu cuenta.",
          securityNote:
            "Si no reconoces esta actividad, te recomendamos revisar la seguridad de tu cuenta.",
          subject: `Actualizacion de cuenta en ${appName}`,
          subtitle: "Mantente al tanto de los eventos importantes de tu acceso.",
          summaryText:
            `Tipo de evento detectado: ${actionType}.`,
          title: "Actualizacion de cuenta"
        }
      ];
  }
}

async function sendWithResend(payload: ResendEmailRequest) {
  if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY secret.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API request failed (${response.status}): ${body}`);
  }
}

Deno.serve(async (request) => {
  if (!sendEmailHookSecret) {
    return new Response(
      JSON.stringify({
        error: "Missing SEND_EMAIL_HOOK_SECRET secret."
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const rawPayload = await request.text();
    const webhook = new Webhook(sendEmailHookSecret.replace("v1,whsec_", ""));
    const verifiedPayload = webhook.verify(
      rawPayload,
      Object.fromEntries(request.headers)
    ) as AuthHookPayload;

    const supportUrl = resolveSupportUrl(verifiedPayload);
    const privacyUrl = resolvePrivacyUrl(verifiedPayload);
    const termsUrl = resolveTermsUrl(verifiedPayload);
    const scenarios = buildDefaultScenario(verifiedPayload);

    for (const scenario of scenarios) {
      const html = renderAuthEmailHtml(
        {
          appName,
          companyAddress,
          companyName,
          privacyUrl,
          supportUrl,
          termsUrl
        },
        scenario
      );
      const text = renderAuthEmailText(
        {
          appName,
          companyAddress,
          companyName,
          privacyUrl,
          supportUrl,
          termsUrl
        },
        scenario
      );

      await sendWithResend({
        from: authEmailFrom,
        html,
        subject: scenario.subject,
        text,
        to: [scenario.to]
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("send-auth-email failed", message);

    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    });
  }
});
