import { Clock3, MessageSquareMore, PhoneCall } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { LeadIntakeForm } from "@/modules/crm/lead-intake-form";

const recentLeads = [
  {
    id: "techport",
    tone: "warning" as const
  },
  {
    id: "motofix",
    tone: "info" as const
  },
  {
    id: "atlas",
    tone: "success" as const
  }
];

const operatingRules = [
  {
    icon: MessageSquareMore,
    titleKey: "crm.rules.captureTitle",
    textKey: "crm.rules.captureText"
  },
  {
    icon: PhoneCall,
    titleKey: "crm.rules.followUpTitle",
    textKey: "crm.rules.followUpText"
  },
  {
    icon: Clock3,
    titleKey: "crm.rules.responseTimeTitle",
    textKey: "crm.rules.responseTimeText"
  }
];

export function CrmPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("crm.header.eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {t("crm.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-ink-soft">
          {t("crm.header.description")}
        </p>
      </section>

      <LeadIntakeForm />

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("crm.recent.title")}</CardTitle>
            <CardDescription>
              {t("crm.recent.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-[24px] border border-line/70 bg-paper/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">
                        {t(`crm.recent.${lead.id}Company`)}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {t(`crm.recent.${lead.id}Contact`)}
                      </p>
                    </div>
                    <StatusPill tone={lead.tone}>
                      {t(`crm.recent.${lead.id}Stage`)}
                    </StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">
                    {t("crm.recent.originLabel")}: {t(`crm.recent.${lead.id}Channel`)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-paper via-paper to-sky-200/50">
          <CardHeader>
            <CardTitle>{t("crm.rules.title")}</CardTitle>
            <CardDescription>
              {t("crm.rules.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {operatingRules.map(({ icon: Icon, titleKey, textKey }) => (
              <div key={titleKey} className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-paper shadow-panel">
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
      </section>
    </div>
  );
}
