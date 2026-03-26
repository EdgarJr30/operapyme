import { History, LockKeyhole, ShieldCheck, Workflow } from "lucide-react";

import {
  auditEntityKeys,
  authEventTypeKeys,
  platformPermissionKeys
} from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

const requiredPermissions = platformPermissionKeys.filter((permissionKey) =>
  permissionKey.includes("global")
);

export function AdminAuditPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="warning">/admin/*</StatusPill>
              <StatusPill tone="info">global_admin</StatusPill>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                {t("admin.audit.eyebrow")}
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t("admin.audit.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
                {t("admin.audit.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/admin/errors")}>
                {t("admin.audit.errorsLink")}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/settings")}
              >
                {t("admin.audit.settingsLink")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.audit.accessTitle")}</CardTitle>
            <CardDescription>
              {t("admin.audit.accessDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                {t("admin.audit.requiredRole")}
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">global_admin</p>
            </div>

            <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                {t("admin.audit.requiredPermissions")}
              </p>
              <ul className="mt-3 space-y-2">
                {requiredPermissions.map((permissionKey) => (
                  <li
                    key={permissionKey}
                    className="rounded-2xl bg-sand-strong px-3 py-2 text-sm text-ink-soft"
                  >
                    {permissionKey}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <History className="size-5 text-ink" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {t("admin.audit.feedTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("admin.audit.feedDescription")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <LockKeyhole className="size-5 text-ink" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {t("admin.audit.entitiesTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {auditEntityKeys.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <ShieldCheck className="size-5 text-ink" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {t("admin.audit.nextTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("admin.audit.nextDescription")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.audit.feedTitle")}</CardTitle>
            <CardDescription>
              {t("admin.audit.feedDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditEntityKeys.map((entityKey) => (
              <div
                key={entityKey}
                className="rounded-3xl border border-line/70 bg-paper/70 px-4 py-3"
              >
                <p className="text-sm font-semibold text-ink">{entityKey}</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  actor, tenant, before/after y timestamps obligatorios
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-paper via-paper to-sky-200/60">
          <CardHeader>
            <CardTitle>auth_event_logs</CardTitle>
            <CardDescription>
              Eventos de acceso que deben observarse desde plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {authEventTypeKeys.map((eventTypeKey) => (
                <li key={eventTypeKey} className="flex items-start gap-3">
                  <Workflow className="mt-1 size-4 shrink-0 text-ink" />
                  <p className="text-sm leading-6 text-ink-soft">
                    {eventTypeKey}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
