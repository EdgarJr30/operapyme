import { FileText, ShieldCheck, Signature, UsersRound } from "lucide-react";

import { useMemo, type ReactNode } from "react";

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
  const quoteSummary = useMemo(() => {
    const quotes = data ?? [];

    return {
      total: quotes.length,
      open: quotes.filter((quote) =>
        ["draft", "sent", "viewed"].includes(quote.status)
      ).length,
      approved: quotes.filter((quote) => quote.status === "approved").length
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <div className="rounded-3xl border border-line/70 bg-linear-to-br from-paper via-paper to-butter-200/55 p-5 shadow-panel sm:p-6">
          <div className="space-y-5">
            <div className="space-y-3">
              <span className="inline-flex min-h-9 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {t("quotes.header.eyebrow")}
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {t("quotes.header.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
                  {t("quotes.header.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill tone="info">
                {t("quotes.overview.totalQuotes", {
                  count: quoteSummary.total
                })}
              </StatusPill>
              <StatusPill tone="warning">
                {t("quotes.overview.openQuotes", {
                  count: quoteSummary.open
                })}
              </StatusPill>
              <StatusPill tone="success">
                {t("quotes.overview.approvedQuotes", {
                  count: quoteSummary.approved
                })}
              </StatusPill>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#quotes-editor"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
              >
                {t("quotes.actions.createQuote")}
              </a>
              <a
                href="#quotes-list"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
              >
                {t("quotes.actions.reviewQuotes")}
              </a>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("quotes.overview.title")}</CardTitle>
            <CardDescription>{t("quotes.overview.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <SummaryRow
                icon={<UsersRound className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.customersReady")}
                value={String(customers.length)}
              />
              <SummaryRow
                icon={<ShieldCheck className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.leadsReady")}
                value={String(leads.length)}
              />
              <SummaryRow
                icon={<FileText className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.catalogReady")}
                value={String(catalogItems.length)}
              />
              <SummaryRow
                icon={<Signature className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.readyToSend")}
                value={String(quoteSummary.open)}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <div id="quotes-editor">
        <QuoteOperationsPanel
          catalogItems={catalogItems}
          customers={customers}
          leads={leads}
          quotes={data ?? []}
        />
      </div>

      <Card id="quotes-list">
        <CardHeader>
          <CardTitle>{t("quotes.list.title")}</CardTitle>
          <CardDescription>{t("quotes.list.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!hasTenantContext ? (
            <InlineStateCard
              title={t("quotes.list.noTenantTitle")}
              description={t("quotes.list.noTenantDescription")}
            />
          ) : isLoading ? (
            <InlineStateCard
              title={t("quotes.list.loadingTitle")}
              description={t("quotes.list.loadingDescription")}
            />
          ) : isError ? (
            <InlineStateCard
              title={t("quotes.list.errorTitle")}
              description={t("quotes.list.errorDescription", {
                message: error instanceof Error ? error.message : ""
              })}
              action={
                <Button
                  className="mt-4"
                  variant="secondary"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  {t("quotes.list.retryAction")}
                </Button>
              }
            />
          ) : data && data.length > 0 ? (
            data
              .slice(0, 6)
              .map((quote) => <QuoteCard key={quote.id} quote={quote} t={t} />)
          ) : (
            <InlineStateCard
              title={t("quotes.list.emptyTitle")}
              description={t("quotes.list.emptyDescription")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InlineStateCard({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
      {action}
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-sand/45 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-paper text-ink shadow-panel">
          {icon}
        </span>
        <span className="text-sm font-medium text-ink">{label}</span>
      </div>
      <span className="text-lg font-semibold tracking-tight text-ink">{value}</span>
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
