import { ArrowRight, FileText, ShieldCheck, Signature } from "lucide-react";

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
import type { QuoteStatus, QuoteSummary } from "@/lib/supabase/backoffice-data";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { QuoteOperationsPanel } from "@/modules/quotes/quote-operations-panel";
import { QuotePdfDownloadButton } from "@/modules/quotes/quote-pdf-download-button";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

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

export function QuotesPage() {
  const { t } = useTranslation("backoffice");
  const {
    data,
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useQuotesData();
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: catalogItems = [] } = useCatalogItemsData();

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
                  className="rounded-3xl border border-line/70 bg-paper/70 p-4"
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

      <QuoteOperationsPanel
        catalogItems={catalogItems}
        customers={customers}
        leads={leads}
        quotes={data ?? []}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("quotes.list.title")}</CardTitle>
          <CardDescription>
            {t("quotes.list.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!hasTenantContext ? (
            <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
              <p className="text-sm font-medium text-ink">
                {t("quotes.list.noTenantTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("quotes.list.noTenantDescription")}
              </p>
            </div>
          ) : isLoading ? (
            <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
              <p className="text-sm font-medium text-ink">
                {t("quotes.list.loadingTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("quotes.list.loadingDescription")}
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
              <p className="text-sm font-medium text-ink">
                {t("quotes.list.errorTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("quotes.list.errorDescription", {
                  message: error instanceof Error ? error.message : ""
                })}
              </p>
              <Button
                className="mt-4"
                variant="secondary"
                onClick={() => {
                  void refetch();
                }}
              >
                {t("quotes.list.retryAction")}
              </Button>
            </div>
          ) : data && data.length > 0 ? (
            data
              .slice(0, 6)
              .map((quote) => <QuoteCard key={quote.id} quote={quote} t={t} />)
          ) : (
            <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
              <p className="text-sm font-medium text-ink">
                {t("quotes.list.emptyTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("quotes.list.emptyDescription")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuoteCard({
  quote,
  t
}: {
  quote: QuoteSummary;
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{quote.quoteNumber}</p>
          <p className="text-sm text-ink-soft">
            {quote.recipientDisplayName || t("quotes.list.customerPending")}
          </p>
        </div>
        <StatusPill tone={getQuoteTone(quote.status)}>
          {t(`quotes.list.status.${quote.status}`)}
        </StatusPill>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-ink-soft">
          {t("quotes.list.currentValueLabel")}:{" "}
          {formatCurrency(quote.grandTotal, quote.currencyCode)}
        </p>
        <QuotePdfDownloadButton
          quoteId={quote.id}
          quoteNumber={quote.quoteNumber}
        />
      </div>
    </div>
  );
}

function getQuoteTone(status: QuoteStatus) {
  switch (status) {
    case "approved":
      return "success";
    case "draft":
    case "sent":
    case "viewed":
      return "warning";
    case "rejected":
    case "expired":
      return "neutral";
  }
}

function formatCurrency(value: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}
