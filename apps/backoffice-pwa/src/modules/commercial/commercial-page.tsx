import { FileText, ReceiptText, TrendingUp, UsersRound } from "lucide-react";

import { type ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "@operapyme/i18n";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CappedPreviewSlider } from "@/components/ui/capped-preview-slider";
import type { InvoiceSummary, QuoteSummary } from "@/lib/supabase/backoffice-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";
import { useInvoicesData } from "@/modules/commercial/use-invoices-data";

interface RecentActivityItem {
  id: string;
  kind: "invoice" | "quote";
  meta: string;
  subtitle: string;
  title: string;
  updatedAt: string;
}

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: currencyCode
  }).format(amount);
}

export function CommercialPage() {
  const { t } = useTranslation("backoffice");
  const { data: leads = [] } = useLeadsData();
  const { data: customers = [] } = useCustomersData();
  const { data: quotes = [] } = useQuotesData();
  const { data: invoices = [] } = useInvoicesData();

  const summary = useMemo(
    () => ({
      leads: leads.length,
      customers: customers.filter((customer) => customer.status === "active").length,
      quotes: quotes.filter((quote) =>
        ["draft", "sent", "viewed"].includes(quote.status)
      ).length,
      invoices: invoices.filter((invoice) =>
        ["draft", "issued"].includes(invoice.status)
      ).length
    }),
    [customers, invoices, leads, quotes]
  );

  const recentActivity = useMemo<RecentActivityItem[]>(
    () =>
      [
        ...quotes.map((quote) => mapQuoteToRecentActivity(quote)),
        ...invoices.map((invoice) => mapInvoiceToRecentActivity(invoice))
      ]
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
        .slice(0, 6),
    [invoices, quotes]
  );

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("commercial.summary.title")}</h1>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          href="/commercial/leads"
          icon={<TrendingUp className="size-4" aria-hidden="true" />}
          label={t("navigation.commercialLeads")}
          value={summary.leads}
          description={t("commercial.summary.cards.leads")}
        />
        <MetricCard
          href="/commercial/customers"
          icon={<UsersRound className="size-4" aria-hidden="true" />}
          label={t("navigation.commercialCustomers")}
          value={summary.customers}
          description={t("commercial.summary.cards.customers")}
        />
        <MetricCard
          href="/commercial/quotes"
          icon={<FileText className="size-4" aria-hidden="true" />}
          label={t("navigation.commercialQuotes")}
          value={summary.quotes}
          description={t("commercial.summary.cards.quotes")}
        />
        <MetricCard
          href="/commercial/invoices"
          icon={<ReceiptText className="size-4" aria-hidden="true" />}
          label={t("navigation.commercialInvoices")}
          value={summary.invoices}
          description={t("commercial.summary.cards.invoices")}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("commercial.summary.pipelineTitle")}</CardTitle>
            <p className="text-sm leading-6 text-ink-soft">
              {t("commercial.summary.pipelineDescription")}
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <PipelineCard
              href="/commercial/leads"
              step="01"
              title={t("commercial.summary.stages.leads")}
              value={summary.leads}
            />
            <PipelineCard
              href="/commercial/customers"
              step="02"
              title={t("commercial.summary.stages.customers")}
              value={summary.customers}
            />
            <PipelineCard
              href="/commercial/quotes"
              step="03"
              title={t("commercial.summary.stages.quotes")}
              value={summary.quotes}
            />
            <PipelineCard
              href="/commercial/invoices"
              step="04"
              title={t("commercial.summary.stages.invoices")}
              value={summary.invoices}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("commercial.summary.recentTitle")}</CardTitle>
            <p className="text-sm leading-6 text-ink-soft">
              {t("commercial.summary.recentDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-ink-soft">
                {t("commercial.summary.recentEmpty")}
              </p>
            ) : (
              <CappedPreviewSlider
                ariaLabel={t("commercial.summary.recentTitle")}
                items={recentActivity}
                nextLabel={t("shared.slider.next")}
                previousLabel={t("shared.slider.previous")}
                getItemKey={(item) => item.id}
                renderItem={(item) => <RecentActivityCard item={item} />}
              />
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

function RecentActivityCard({ item }: { item: RecentActivityItem }) {
  return (
    <div className="h-full rounded-2xl border border-line/70 bg-sand/35 p-4">
      <p className="text-sm font-semibold text-ink">{item.title}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-muted">
        {item.meta}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{item.subtitle}</p>
    </div>
  );
}

function MetricCard({
  description,
  href,
  icon,
  label,
  value
}: {
  description: string;
  href: string;
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Link
      to={href}
      className="rounded-3xl border border-line/70 bg-sand/35 p-4 transition hover:bg-sand/55"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-paper text-ink shadow-panel">
          {icon}
        </span>
        <span className="text-2xl font-semibold tracking-tight text-ink">
          {value}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-ink">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{description}</p>
    </Link>
  );
}

function PipelineCard({
  href,
  step,
  title,
  value
}: {
  href: string;
  step: string;
  title: string;
  value: number;
}) {
  return (
    <Link
      to={href}
      className="rounded-3xl border border-line/70 bg-paper p-4 transition hover:bg-sand/45"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {step}
      </p>
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
    </Link>
  );
}

function mapQuoteToRecentActivity(quote: QuoteSummary): RecentActivityItem {
  return {
    id: quote.id,
    kind: "quote",
    meta: quote.quoteNumber,
    subtitle: quote.recipientDisplayName,
    title: quote.title,
    updatedAt: quote.updatedAt
  };
}

function mapInvoiceToRecentActivity(invoice: InvoiceSummary): RecentActivityItem {
  return {
    id: invoice.id,
    kind: "invoice",
    meta: invoice.invoiceNumber,
    subtitle: formatMoney(invoice.grandTotal, invoice.currencyCode),
    title: invoice.title,
    updatedAt: invoice.updatedAt
  };
}
