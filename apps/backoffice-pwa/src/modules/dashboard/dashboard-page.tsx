import {
  Bot,
  ClipboardList,
  PackageSearch,
  Smartphone,
  Sparkles,
  TrendingUp
} from "lucide-react";

import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

const stats = [
  {
    id: "timeToFirstQuote",
    icon: Sparkles,
    tone: "success" as const
  },
  {
    id: "mobileUsageGoal",
    icon: Smartphone,
    tone: "info" as const
  },
  {
    id: "conversionSurface",
    icon: PackageSearch,
    tone: "warning" as const
  }
];

const milestones = [
  "dashboard.milestones.setupWizard",
  "dashboard.milestones.catalogCrud",
  "dashboard.milestones.crmKanban",
  "dashboard.milestones.quoteBuilder",
  "dashboard.milestones.websitePublishing",
  "dashboard.milestones.securityFoundation"
];

const modules = [
  {
    titleKey: "dashboard.operatingModel.catalogTitle",
    textKey: "dashboard.operatingModel.catalogText"
  },
  {
    titleKey: "dashboard.operatingModel.crmTitle",
    textKey: "dashboard.operatingModel.crmText"
  },
  {
    titleKey: "dashboard.operatingModel.quotesTitle",
    textKey: "dashboard.operatingModel.quotesText"
  },
  {
    titleKey: "dashboard.operatingModel.aiTitle",
    textKey: "dashboard.operatingModel.aiText"
  }
];

export function DashboardPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="success">
                {t("dashboard.hero.badgeBlueprint")}
              </StatusPill>
              <StatusPill tone="info">{t("dashboard.hero.badgePastel")}</StatusPill>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                {t("dashboard.hero.eyebrow")}
              </p>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t("dashboard.hero.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
                {t("dashboard.hero.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg">{t("dashboard.hero.primaryAction")}</Button>
              <Button size="lg" variant="secondary">
                {t("dashboard.hero.secondaryAction")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.milestones.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.milestones.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {milestones.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-line/70 bg-paper/70 px-4 py-3"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sage-200/90 text-xs font-semibold text-ink">
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
        {stats.map(({ id, icon: Icon, tone }) => (
          <Card key={id}>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-sand-strong">
                  <Icon className="size-5 text-ink" aria-hidden="true" />
                </div>
                <StatusPill tone={tone}>
                  {t(`dashboard.stats.${id}.label`)}
                </StatusPill>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-ink">
                  {t(`dashboard.stats.${id}.value`)}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t(`dashboard.stats.${id}.detail`)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.operatingModel.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.operatingModel.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.titleKey}
                className="rounded-[24px] border border-line/70 bg-paper/70 p-4"
              >
                <p className="text-sm font-semibold text-ink">
                  {t(module.titleKey)}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t(module.textKey)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-paper via-paper to-sky-200/60">
          <CardHeader>
            <CardTitle>{t("dashboard.uxWhy.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.uxWhy.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <TrendingUp className="mt-1 size-4 shrink-0 text-ink" />
                <p className="text-sm leading-6 text-ink-soft">
                  {t("dashboard.uxWhy.learnFaster")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <ClipboardList className="mt-1 size-4 shrink-0 text-ink" />
                <p className="text-sm leading-6 text-ink-soft">
                  {t("dashboard.uxWhy.formQuality")}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Bot className="mt-1 size-4 shrink-0 text-ink" />
                <p className="text-sm leading-6 text-ink-soft">
                  {t("dashboard.uxWhy.aiFocus")}
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
