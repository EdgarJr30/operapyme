export type AuthEmailContent = {
  actionLabel: string;
  actionUrl: string;
  emailType: string;
  message: string;
  previewText: string;
  securityNote: string;
  subject: string;
  subtitle: string;
  summaryText: string;
  title: string;
  userEmail: string;
  userName: string;
};

export type AuthEmailTemplateConfig = {
  appName: string;
  companyAddress: string | null;
  companyName: string;
  privacyUrl: string;
  supportUrl: string;
  termsUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphize(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

export function renderAuthEmailHtml(
  config: AuthEmailTemplateConfig,
  content: AuthEmailContent
) {
  const appName = escapeHtml(config.appName);
  const companyName = escapeHtml(config.companyName);
  const userName = escapeHtml(content.userName);
  const userEmail = escapeHtml(content.userEmail);
  const previewText = escapeHtml(content.previewText);
  const companyLine = config.companyAddress?.trim()
    ? `${companyName} · ${escapeHtml(config.companyAddress.trim())}`
    : companyName;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(content.subject)}</title>
  </head>
  <body style="margin:0;background-color:#f4f7f9;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2d3e50;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
      ${previewText}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#f4f7f9;">
      <tr>
        <td align="center" bgcolor="#f4f7f9" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:24px;">
            <tr>
              <td bgcolor="#2d3e50" style="padding:36px 32px 28px;border-top-left-radius:24px;border-top-right-radius:24px;background-color:#2d3e50;">
                <p style="margin:0;font-size:24px;line-height:32px;font-weight:700;color:#ffffff;">${appName}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
                  <tr>
                    <td bgcolor="#415468" style="border-radius:999px;padding:8px 14px;background-color:#415468;">
                      <p style="margin:0;font-size:12px;line-height:12px;font-weight:700;letter-spacing:0.4px;text-transform:uppercase;color:#dce5ee;">
                        ${escapeHtml(content.emailType)}
                      </p>
                    </td>
                  </tr>
                </table>
                <h1 style="margin:18px 0 10px;font-size:30px;line-height:38px;font-weight:700;color:#ffffff;letter-spacing:-0.6px;">
                  ${escapeHtml(content.title)}
                </h1>
                <p style="margin:0;font-size:15px;line-height:24px;color:#c8d3df;">
                  ${escapeHtml(content.subtitle)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#2d3e50;">
                  Hola ${userName},
                </p>
                <p style="margin:0 0 18px;font-size:15px;line-height:26px;color:#536b82;">
                  ${paragraphize(content.message)}
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;width:100%;background-color:#f7fafc;border:1px solid #e6edf3;border-radius:20px;">
                  <tr>
                    <td style="padding:22px;">
                      <p style="margin:0 0 10px;font-size:15px;line-height:22px;font-weight:700;color:#2d3e50;">
                        Resumen rapido
                      </p>
                      <p style="margin:0;font-size:14px;line-height:24px;color:#61788f;">
                        ${paragraphize(content.summaryText)}
                      </p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
                  <tr>
                    <td bgcolor="#ff7a00" style="border-radius:14px;background-color:#ff7a00;">
                      <a href="${escapeHtml(content.actionUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:16px 24px;font-size:15px;line-height:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                        ${escapeHtml(content.actionLabel)}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:12px 0 0;">
                  <a href="${escapeHtml(config.supportUrl)}" target="_blank" rel="noopener noreferrer" style="font-size:13px;line-height:22px;color:#4b637a;text-decoration:none;">
                    Necesitas ayuda? Contactanos
                  </a>
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;width:100%;background-color:#eef3f7;border-radius:16px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0 0 6px;font-size:12px;line-height:18px;font-weight:700;letter-spacing:0.3px;text-transform:uppercase;color:#6c8297;">
                        Enlace alternativo
                      </p>
                      <p style="margin:0;font-size:13px;line-height:22px;color:#2d3e50;word-break:break-word;">
                        ${escapeHtml(content.actionUrl)}
                      </p>
                    </td>
                  </tr>
                </table>
                <div style="height:1px;margin:28px 0;background-color:#e8edf2;"></div>
                <p style="margin:0;font-size:15px;line-height:26px;color:#536b82;">
                  ${paragraphize(content.securityNote)}
                </p>
                <p style="margin:20px 0 0;font-size:14px;line-height:24px;color:#536b82;">
                  Con aprecio,<br />
                  El equipo de ${appName}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <p style="margin:0 0 8px;font-size:12px;line-height:20px;color:#7b8fa3;">
                  Este correo fue enviado a ${userEmail} porque tienes una cuenta o una accion pendiente en ${appName}.
                </p>
                <p style="margin:0 0 8px;font-size:12px;line-height:20px;color:#7b8fa3;">
                  ${companyLine}
                </p>
                <p style="margin:0;font-size:12px;line-height:20px;color:#7b8fa3;">
                  <a href="${escapeHtml(config.privacyUrl)}" target="_blank" rel="noopener noreferrer" style="color:#4b637a;text-decoration:underline;">Politica de privacidad</a>
                  &nbsp;·&nbsp;
                  <a href="${escapeHtml(config.termsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#4b637a;text-decoration:underline;">Terminos de uso</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderAuthEmailText(
  config: AuthEmailTemplateConfig,
  content: AuthEmailContent
) {
  return [
    `${config.appName} | ${content.emailType}`,
    "",
    `Hola ${content.userName},`,
    "",
    content.message,
    "",
    `Resumen rapido: ${content.summaryText}`,
    "",
    `${content.actionLabel}: ${content.actionUrl}`,
    "",
    content.securityNote,
    "",
    `Ayuda: ${config.supportUrl}`,
    `Privacidad: ${config.privacyUrl}`,
    `Terminos: ${config.termsUrl}`,
    "",
    `Este correo fue enviado a ${content.userEmail}.`,
    config.companyAddress?.trim()
      ? `${config.companyName} · ${config.companyAddress.trim()}`
      : config.companyName
  ].join("\n");
}
