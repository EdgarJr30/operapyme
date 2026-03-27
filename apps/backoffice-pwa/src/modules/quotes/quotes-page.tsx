import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Signature,
  UsersRound
} from "lucide-react";

import { useMemo, type ReactNode } from "react";

import { useTranslation } from "@operapyme/i18n";
import { Link } from "react-router-dom";

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
  const { data: customers } = useCustomersData({ enabled: false });
  const { data: leads } = useLeadsData({ enabled: false });
  const { data: catalogItems } = useCatalogItemsData({ enabled: false });
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
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
        <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="inline-flex min-h-8 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {t("quotes.header.eyebrow")}
              </span>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {t("quotes.header.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-ink-soft">
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
              <Link
                to="/quotes/new"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
              >
                {t("quotes.actions.createQuote")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/quotes/manage"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line-strong bg-paper/90 px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand-strong/80"
              >
                {t("quotes.actions.reviewQuotes")}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <CompactActionCard
                to="/quotes/new"
                title={t("quotes.landing.createCardTitle")}
                description={t("quotes.landing.createCardDescription")}
              />
              <CompactActionCard
                to="/quotes/manage"
                title={t("quotes.landing.manageCardTitle")}
                description={t("quotes.landing.manageCardDescription")}
              />
              <CompactActionCard
                to="/quotes/manage"
                title={t("quotes.landing.resumeCardTitle")}
                description={t("quotes.landing.resumeCardDescription")}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t("quotes.overview.title")}</CardTitle>
            <CardDescription>{t("quotes.overview.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <SummaryRow
                icon={<UsersRound className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.customersReady")}
                value={formatCachedSummaryValue(customers?.length, t)}
              />
              <SummaryRow
                icon={<ShieldCheck className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.leadsReady")}
                value={formatCachedSummaryValue(leads?.length, t)}
              />
              <SummaryRow
                icon={<FileText className="size-4" aria-hidden="true" />}
                label={t("quotes.overview.catalogReady")}
                value={formatCachedSummaryValue(catalogItems?.length, t)}
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="pb-4">
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
                .slice(0, 4)
                .map((quote) => <QuoteCard key={quote.id} quote={quote} t={t} />)
            ) : (
              <InlineStateCard
                title={t("quotes.list.emptyTitle")}
                description={t("quotes.list.emptyDescription")}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-paper">
          <CardHeader className="pb-4">
            <CardTitle>{t("quotes.flow.title")}</CardTitle>
            <CardDescription>{t("quotes.flow.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FlowRow
              title={t("quotes.flow.draftTitle")}
              description={t("quotes.flow.draftText")}
            />
            <FlowRow
              title={t("quotes.flow.reviewTitle")}
              description={t("quotes.flow.reviewText")}
            />
            <FlowRow
              title={t("quotes.flow.sendTitle")}
              description={t("quotes.flow.sendText")}
            />
            <FlowRow
              title={t("quotes.flow.decideTitle")}
              description={t("quotes.flow.decideText")}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CompactActionCard({
  description,
  title,
  to
}: {
  description: string;
  title: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-line/70 bg-paper/75 p-4 transition hover:bg-sand/60"
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{description}</p>
    </Link>
  );
}

function FlowRow({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper/80 p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{description}</p>
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
    case "rejected":
    case "expired":
      return "warning";
    case "viewed":
      return "info";
    default:
      return "neutral";
  }
}

function formatCurrency(value: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${currencyCode.toUpperCase()} ${value.toFixed(2)}`;
  }
}

function formatCachedSummaryValue(
  value: number | null | undefined,
  t: (key: string) => string
) {
  if (typeof value === "number") {
    return String(value);
  }

  return t("quotes.form.pendingSummaryValue");
}
