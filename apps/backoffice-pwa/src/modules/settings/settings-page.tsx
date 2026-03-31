import { Shield, SmartphoneCharging, Webhook } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";

import { TenantPaletteSection } from "@/modules/settings/tenant-palette-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const checklist = [
  "settings.checklist.connectSupabase",
  "settings.checklist.addAuth",
  "settings.checklist.createRbac",
  "settings.checklist.wireQuery",
  "settings.checklist.enableOffline"
];

export function SettingsPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("settings.header.eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t("settings.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-soft">
          {t("settings.header.description")}
        </p>
      </section>

      <TenantPaletteSection />

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.env.title")}</CardTitle>
            <CardDescription>
              {t("settings.env.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusPill tone={isSupabaseConfigured ? "success" : "warning"}>
              {isSupabaseConfigured
                ? t("settings.env.detected")
                : t("settings.env.missing")}
            </StatusPill>
            <p className="text-sm leading-6 text-ink-soft">
              {t("settings.env.instructions")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-paper">
          <CardHeader>
            <CardTitle>{t("settings.checklist.title")}</CardTitle>
            <CardDescription>
              {t("settings.checklist.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {checklist.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[22px] border border-line/70 bg-paper/70 px-4 py-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sand-strong text-xs font-semibold text-ink">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-ink-soft">
                    {t(item)}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <Shield className="size-5 text-ink" />
            </div>
            <p className="text-sm font-semibold text-ink">
              {t("settings.principles.rbacTitle")}
            </p>
            <p className="text-sm leading-6 text-ink-soft">
              {t("settings.principles.rbacText")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <SmartphoneCharging className="size-5 text-ink" />
            </div>
            <p className="text-sm font-semibold text-ink">
              {t("settings.principles.offlineTitle")}
            </p>
            <p className="text-sm leading-6 text-ink-soft">
              {t("settings.principles.offlineText")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
              <Webhook className="size-5 text-ink" />
            </div>
            <p className="text-sm font-semibold text-ink">
              {t("settings.principles.edgeTitle")}
            </p>
            <p className="text-sm leading-6 text-ink-soft">
              {t("settings.principles.edgeText")}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
