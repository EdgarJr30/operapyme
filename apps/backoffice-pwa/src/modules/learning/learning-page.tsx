import {
  BookOpenText,
  FileText,
  Layers3,
  MoveRight,
  Sparkles,
  UsersRound
} from "lucide-react";

import { type ReactNode } from "react";

import { useTranslation } from "@operapyme/i18n";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const guideDefinitions = [
  {
    key: "quotesFast",
    href: "/quotes/new",
    icon: FileText
  },
  {
    key: "quotesManage",
    href: "/quotes/manage",
    icon: BookOpenText
  },
  {
    key: "crmLead",
    href: "/crm",
    icon: UsersRound
  },
  {
    key: "catalog",
    href: "/catalog",
    icon: Layers3
  }
] as const;

export function LearningPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="rounded-4xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5">
        <div className="max-w-3xl space-y-2">
          <span className="inline-flex min-h-8 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {t("learning.header.eyebrow")}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t("learning.header.title")}
          </h1>
          <p className="text-sm leading-6 text-ink-soft">
            {t("learning.header.description")}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="bg-paper">
          <CardHeader className="pb-4">
            <CardTitle>{t("learning.principles.title")}</CardTitle>
            <CardDescription>
              {t("learning.principles.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <PrincipleRow
              icon={<Sparkles className="size-4.5" aria-hidden="true" />}
              title={t("learning.principles.runtimeTitle")}
              description={t("learning.principles.runtimeText")}
            />
            <PrincipleRow
              icon={<BookOpenText className="size-4.5" aria-hidden="true" />}
              title={t("learning.principles.guidesTitle")}
              description={t("learning.principles.guidesText")}
            />
            <PrincipleRow
              icon={<MoveRight className="size-4.5" aria-hidden="true" />}
              title={t("learning.principles.supportTitle")}
              description={t("learning.principles.supportText")}
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          {guideDefinitions.map(({ key, href, icon: Icon }) => (
            <Card key={key}>
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-sand/70 text-ink-soft">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      {t(`learning.guides.${key}.eyebrow`)}
                    </p>
                    <CardTitle className="text-lg">
                      {t(`learning.guides.${key}.title`)}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription>
                  {t(`learning.guides.${key}.description`)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3">
                  <LearningStep index={1}>
                    {t(`learning.guides.${key}.stepOne`)}
                  </LearningStep>
                  <LearningStep index={2}>
                    {t(`learning.guides.${key}.stepTwo`)}
                  </LearningStep>
                  <LearningStep index={3}>
                    {t(`learning.guides.${key}.stepThree`)}
                  </LearningStep>
                </ol>

                <Link
                  to={href}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
                >
                  {t(`learning.guides.${key}.action`)}
                  <MoveRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function PrincipleRow({
  description,
  icon,
  title
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper/80 p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-2xl bg-paper text-ink-soft shadow-panel">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{description}</p>
        </div>
      </div>
    </div>
  );
}

function LearningStep({
  children,
  index
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <li className="flex items-start gap-3 rounded-3xl border border-line/70 bg-paper/75 px-4 py-3">
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-sand-strong text-xs font-semibold text-ink">
        {index}
      </span>
      <span className="text-sm leading-6 text-ink-soft">{children}</span>
    </li>
  );
}
