import { Cable, KeyRound, ServerCog } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const setupSteps = [
  {
    icon: Cable,
    titleKey: "auth.unconfigured.stepAliasTitle",
    textKey: "auth.unconfigured.stepAliasText"
  },
  {
    icon: KeyRound,
    titleKey: "auth.unconfigured.stepEnvTitle",
    textKey: "auth.unconfigured.stepEnvText"
  },
  {
    icon: ServerCog,
    titleKey: "auth.unconfigured.stepMigrationsTitle",
    textKey: "auth.unconfigured.stepMigrationsText"
  }
];

export function UnconfiguredPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              {t("auth.unconfigured.eyebrow")}
            </p>
            <h1 className="max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {t("auth.unconfigured.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-ink-soft">
              {t("auth.unconfigured.description")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-paper">
          <CardHeader>
            <CardTitle>{t("auth.unconfigured.stepsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {setupSteps.map(({ icon: Icon, titleKey, textKey }) => (
              <div key={titleKey} className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper shadow-panel">
                  <Icon className="size-4 text-ink" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t(titleKey)}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t(textKey)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
