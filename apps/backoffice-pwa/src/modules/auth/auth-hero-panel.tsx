import {
  ChevronRight,
  FileText,
  KeyRound,
  Laptop,
  MailCheck,
  ShieldCheck,
  Smartphone,
  Users
} from "lucide-react";
import { motion } from "motion/react";

import { useTranslation } from "@operapyme/i18n";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { backofficeTransition } from "@/lib/motion";

type IconItem = {
  key: string;
  icon: typeof Users;
};

const storyItems: IconItem[] = [
  { key: "capture", icon: Users },
  { key: "quote", icon: FileText },
  { key: "access", icon: ShieldCheck }
];

const capabilityItems: IconItem[] = [
  { key: "mobile", icon: Smartphone },
  { key: "desktop", icon: Laptop },
  { key: "security", icon: KeyRound }
];

export function AuthHeroPanel() {
  const { t } = useTranslation("backoffice");

  return (
    <motion.section
      className="relative overflow-hidden rounded-[2rem] border border-line/60 bg-[linear-gradient(155deg,rgba(45,62,80,0.96),rgba(45,62,80,0.9)_38%,rgba(75,99,122,0.88)_100%)] px-4 py-5 text-sidebar-text shadow-soft sm:px-6 sm:py-6 lg:min-h-[calc(100vh-4rem)] lg:px-8 lg:py-8"
      transition={backofficeTransition}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,185,127,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,231,207,0.16),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/10 px-4 text-sm font-semibold tracking-tight text-white">
              {t("auth.hero.eyebrow")}
            </div>
            <div className="max-w-xl space-y-3">
              <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-[3.4rem]">
                {t("auth.hero.title")}
              </h1>
              <p className="max-w-lg text-sm leading-6 text-sidebar-muted sm:text-base">
                {t("auth.hero.description")}
              </p>
            </div>
          </div>

          <div className="hidden rounded-[1.75rem] border border-white/12 bg-white/10 p-3 lg:block">
            <img
              src="/favicon.svg"
              alt="OperaPyme"
              className="h-10 w-10 rounded-2xl"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {capabilityItems.map(({ key, icon: Icon }, index) => (
            <motion.div
              key={key}
              className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...backofficeTransition, delay: 0.06 * (index + 1) }}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12">
                  <Icon className="size-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t(`auth.capabilities.${key}.title`)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                    {t(`auth.capabilities.${key}.text`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <motion.div
            className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm sm:p-5"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...backofficeTransition, delay: 0.12 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  {t("auth.preview.title")}
                </p>
                <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                  {t("auth.preview.description")}
                </p>
              </div>
              <div className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                {t("auth.preview.badge")}
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.4rem] bg-white p-4 text-ink shadow-panel">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                      {t("auth.preview.pipelineLabel")}
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                      {t("auth.preview.pipelineTitle")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-brand-soft px-3 py-2 text-xs font-semibold text-ink">
                    {t("auth.preview.pipelineBadge")}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {storyItems.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="rounded-[1.2rem] border border-line/60 bg-sand/40 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-paper">
                          <Icon className="size-5 text-brand" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-ink">
                              {t(`auth.story.${key}.title`)}
                            </p>
                            <ChevronRight
                              className="size-4 shrink-0 text-ink-muted"
                              aria-hidden="true"
                            />
                          </div>
                          <p className="mt-1 text-xs leading-5 text-ink-soft">
                            {t(`auth.story.${key}.text`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    {t("auth.metrics.title")}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    {["crm", "quotes", "team"].map((key) => (
                      <div
                        key={key}
                        className="rounded-[1.2rem] bg-white/8 px-4 py-3"
                      >
                        <p className="text-xl font-semibold tracking-tight text-white">
                          {t(`auth.metrics.${key}.value`)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                          {t(`auth.metrics.${key}.label`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-white/14">
                      <MailCheck className="size-5 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t("auth.preview.accessTitle")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                        {t("auth.preview.accessText")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-3"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...backofficeTransition, delay: 0.16 }}
          >
            {["rbac", "audit"].map((key) => (
              <Card
                key={key}
                className="border-white/12 bg-white/8 p-4 text-white shadow-none backdrop-blur-sm"
              >
                <CardHeader className="mb-0">
                  <CardTitle className="text-base text-white">
                    {t(`auth.hero.cards.${key}.title`)}
                  </CardTitle>
                  <CardDescription className="text-sidebar-muted">
                    {t(`auth.hero.cards.${key}.text`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}

            <div className="rounded-[1.5rem] border border-dashed border-white/16 bg-white/6 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                {t("auth.hero.operatingTitle")}
              </p>
              <div className="mt-3 space-y-3">
                {["customers", "documents", "roles"].map((key) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-[1.15rem] bg-white/8 px-3 py-3"
                  >
                    <div className="mt-0.5 size-2 rounded-full bg-sky-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t(`auth.hero.operating.${key}.title`)}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                        {t(`auth.hero.operating.${key}.text`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
