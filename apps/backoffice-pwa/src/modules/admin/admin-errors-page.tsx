import { AlertTriangle, Bug, CircleAlert, Gauge } from "lucide-react";

import { appErrorSeverityKeys } from "@operapyme/domain";
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

const requiredControls = [
  "admin.errors.controlActors",
  "admin.errors.controlSource",
  "admin.errors.controlResolution",
  "admin.errors.controlStress"
];

export function AdminErrorsPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                {t("admin.errors.eyebrow")}
              </p>
              <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {t("admin.errors.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-ink-soft">
                {t("admin.errors.description")}
              </p>
            </div>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/admin")}
            >
              {t("admin.errors.auditLink")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.errors.severityTitle")}</CardTitle>
            <CardDescription>
              {t("admin.errors.severityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {appErrorSeverityKeys.map((severityKey) => (
              <div
                key={severityKey}
                className="rounded-3xl border border-line/70 bg-paper/70 px-4 py-3"
              >
                <p className="text-sm font-semibold uppercase text-ink">
                  {severityKey}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <CircleAlert className="size-5 text-ink" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                {t("admin.errors.controlsTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("admin.errors.controlsDescription")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <Bug className="size-5 text-ink" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">app_error_logs</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Frontend, edge functions, jobs y eventos visibles con trazabilidad.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <Gauge className="size-5 text-ink" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">stress-harness</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Escenarios masivos y sus resultados quedaran aislados del backoffice comercial.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.errors.controlsTitle")}</CardTitle>
            <CardDescription>
              {t("admin.errors.controlsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requiredControls.map((controlKey) => (
              <div
                key={controlKey}
                className="rounded-3xl border border-line/70 bg-paper/70 px-4 py-3"
              >
                <p className="text-sm text-ink-soft">{t(controlKey)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-paper">
          <CardHeader>
            <CardTitle>auth_event_logs</CardTitle>
            <CardDescription>
              Los picos de login fallido y bloqueos tambien deben verse desde admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 size-4 shrink-0 text-ink" />
              <p className="text-sm leading-6 text-ink-soft">
                Los errores tecnicos y los eventos de abuso comparten contexto, pero no deben mezclarse sin filtros.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
