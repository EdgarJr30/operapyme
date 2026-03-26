import { ArrowRight, FileText, ShieldCheck, Signature } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

const flowSteps = [
  {
    titleKey: "quotes.flow.draftTitle",
    textKey: "quotes.flow.draftText"
  },
  {
    titleKey: "quotes.flow.reviewTitle",
    textKey: "quotes.flow.reviewText"
  },
  {
    titleKey: "quotes.flow.sendTitle",
    textKey: "quotes.flow.sendText"
  },
  {
    titleKey: "quotes.flow.decideTitle",
    textKey: "quotes.flow.decideText"
  }
];

const quoteSamples = [
  {
    number: "COT-2026-000184",
    customerKey: "quotes.list.quote184Customer",
    statusKey: "quotes.list.quote184Status",
    tone: "warning" as const,
    amount: "$12,840"
  },
  {
    number: "COT-2026-000185",
    customerKey: "quotes.list.quote185Customer",
    statusKey: "quotes.list.quote185Status",
    tone: "success" as const,
    amount: "$1,290"
  },
  {
    number: "COT-2026-000186",
    customerKey: "quotes.list.quote186Customer",
    statusKey: "quotes.list.quote186Status",
    tone: "info" as const,
    amount: "$4,920"
  }
];

export function QuotesPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("quotes.header.eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {t("quotes.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-ink-soft">
          {t("quotes.header.description")}
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("quotes.flow.title")}</CardTitle>
            <CardDescription>
              {t("quotes.flow.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              {flowSteps.map((step, index) => (
                <div
                  key={step.titleKey}
                  className="rounded-[24px] border border-line/70 bg-paper/70 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="flex size-8 items-center justify-center rounded-full bg-sage-200 text-xs font-semibold text-ink">
                      {index + 1}
                    </span>
                    {index < flowSteps.length - 1 ? (
                      <ArrowRight className="size-4 text-ink-muted" />
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {t(step.titleKey)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {t(step.textKey)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-paper via-paper to-butter-200/70">
          <CardHeader>
            <CardTitle>{t("quotes.document.title")}</CardTitle>
            <CardDescription>
              {t("quotes.document.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-1 size-4 shrink-0 text-ink" />
              <p className="text-sm leading-6 text-ink-soft">
                {t("quotes.document.structuredSections")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 size-4 shrink-0 text-ink" />
              <p className="text-sm leading-6 text-ink-soft">
                {t("quotes.document.versioning")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Signature className="mt-1 size-4 shrink-0 text-ink" />
              <p className="text-sm leading-6 text-ink-soft">
                {t("quotes.document.publicLinks")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t("quotes.list.title")}</CardTitle>
          <CardDescription>
            {t("quotes.list.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quoteSamples.map((quote) => (
            <div
              key={quote.number}
              className="rounded-[24px] border border-line/70 bg-paper/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{quote.number}</p>
                  <p className="text-sm text-ink-soft">{t(quote.customerKey)}</p>
                </div>
                <StatusPill tone={quote.tone}>{t(quote.statusKey)}</StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {t("quotes.list.currentValueLabel")}: {quote.amount}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
