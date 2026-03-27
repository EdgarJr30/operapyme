import type { ReactNode } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  FileText,
  Package2,
  RefreshCw,
  Settings2,
  UsersRound
} from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";
import type {
  CustomerSummary,
  QuoteStatus,
  QuoteSummary
} from "@/lib/supabase/backoffice-data";
import { useDashboardData } from "@/modules/dashboard/use-dashboard-data";

const statCards = [
  {
    id: "customerCount" as const,
    icon: UsersRound,
    iconClassName: "bg-sky-200/70 text-ink"
  },
  {
    id: "quoteCount" as const,
    icon: FileText,
    iconClassName: "bg-sage-200/70 text-ink"
  },
  {
    id: "openQuoteCount" as const,
    icon: Package2,
    iconClassName: "bg-peach-200/70 text-ink"
  }
];

const nextStepItems = [
  {
    key: "captureLead" as const,
    to: "/crm",
    icon: UsersRound
  },
  {
    key: "prepareCatalog" as const,
    to: "/catalog",
    icon: Package2
  },
  {
    key: "sendQuote" as const,
    to: "/quotes",
    icon: FileText
  },
  {
    key: "reviewSettings" as const,
    to: "/settings",
    icon: Settings2
  }
];

export function DashboardPage() {
  const { t } = useTranslation("backoffice");
  const {
    data,
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useDashboardData();
  const isCommercialDataEmpty = Boolean(
    data &&
      data.customerCount === 0 &&
      data.quoteCount === 0 &&
      data.recentCustomers.length === 0 &&
      data.recentQuotes.length === 0
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_340px]">
        <div className="rounded-3xl border border-line/70 bg-linear-to-br from-paper via-paper to-sky-200/45 p-5 shadow-panel sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="space-y-3">
              <span className="inline-flex min-h-9 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {t("dashboard.header.eyebrow")}
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {t("dashboard.header.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
                  {t("dashboard.header.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {hasTenantContext && !isLoading && !isError && data ? (
                <>
                  <StatusPill tone="info">
                    {t("dashboard.header.customerCountBadge", {
                      count: data.customerCount
                    })}
                  </StatusPill>
                  <StatusPill tone="success">
                    {t("dashboard.header.activeCustomerCountBadge", {
                      count: data.activeCustomerCount
                    })}
                  </StatusPill>
                  <StatusPill tone="warning">
                    {t("dashboard.header.openQuoteCountBadge", {
                      count: data.openQuoteCount
                    })}
                  </StatusPill>
                </>
              ) : (
                <StatusPill tone="neutral">
                  {t("dashboard.header.pendingBadge")}
                </StatusPill>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <NavLink
                to="/crm"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
              >
                {t("dashboard.actions.newLead")}
              </NavLink>
              <NavLink
                to="/quotes"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
              >
                {t("dashboard.actions.newQuote")}
              </NavLink>
              <NavLink
                to="/catalog"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
              >
                {t("dashboard.actions.reviewCatalog")}
              </NavLink>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-ink">
              {t("dashboard.checklist.title")}
            </p>
            <p className="text-sm leading-6 text-ink-soft">
              {t("dashboard.checklist.description")}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {nextStepItems.map(({ key, to, icon: Icon }) => (
              <NavLink
                key={key}
                to={to}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-line/70 bg-sand/45 px-4 py-3 transition hover:border-line-strong hover:bg-paper"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-paper text-ink shadow-panel">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {t(`dashboard.checklist.${key}`)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-ink-muted" aria-hidden="true" />
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {!hasTenantContext ? (
          <InlineStatePanel
            title={t("dashboard.livePulse.noTenantTitle")}
            description={t("dashboard.livePulse.noTenantDescription")}
            className="md:col-span-3"
          />
        ) : isLoading ? (
          <InlineStatePanel
            title={t("dashboard.livePulse.loadingTitle")}
            description={t("dashboard.livePulse.loadingDescription")}
            className="md:col-span-3"
          />
        ) : isError ? (
          <InlineStatePanel
            title={t("dashboard.livePulse.errorTitle")}
            description={t("dashboard.livePulse.errorDescription", {
              message: error instanceof Error ? error.message : ""
            })}
            className="md:col-span-3"
            action={
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => {
                  void refetch();
                }}
              >
                <RefreshCw className="mr-2 size-4" aria-hidden="true" />
                {t("dashboard.livePulse.retryAction")}
              </Button>
            }
          />
        ) : (
          statCards.map(({ id, icon: Icon, iconClassName }) => (
            <div
              key={id}
              className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    iconClassName
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <StatusPill tone={getStatTone(id)}>
                  {t(`dashboard.stats.${id}.label`)}
                </StatusPill>
              </div>

              <div className="mt-5">
                <p className="text-3xl font-semibold tracking-tight text-ink">
                  {data?.[id] ?? 0}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t(`dashboard.stats.${id}.detail`, {
                    count: data?.[id] ?? 0
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </section>

      {hasTenantContext && !isLoading && !isError ? (
        isCommercialDataEmpty ? (
          <EmptyStatePanel />
        ) : (
          <section className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-ink">
                    {t("dashboard.livePulse.customersTitle")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t("dashboard.livePulse.customersDescription")}
                  </p>
                </div>
                <UsersRound className="size-5 text-ink-muted" aria-hidden="true" />
              </div>

              <div className="mt-5 space-y-3">
                {data?.recentCustomers.map((customer) => (
                  <CustomerSnapshotCard
                    key={customer.id}
                    customer={customer}
                    t={t}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-ink">
                    {t("dashboard.livePulse.quotesTitle")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t("dashboard.livePulse.quotesDescription")}
                  </p>
                </div>
                <FileText className="size-5 text-ink-muted" aria-hidden="true" />
              </div>

              <div className="mt-5 space-y-3">
                {data?.recentQuotes.map((quote) => (
                  <QuoteSnapshotCard key={quote.id} quote={quote} t={t} />
                ))}
              </div>
            </div>
          </section>
        )
      ) : null}
    </div>
  );
}

function InlineStatePanel({
  action,
  className,
  description,
  title
}: {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/70 bg-paper p-5 shadow-panel",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-peach-200/60 text-ink">
          <CircleAlert className="size-5" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-ink">{title}</p>
          <p className="text-sm leading-6 text-ink-soft">{description}</p>
          {action ? <div className="pt-1">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

function EmptyStatePanel() {
  const { t } = useTranslation("backoffice");

  return (
    <section className="rounded-3xl border border-line/70 bg-paper p-8 shadow-panel">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-sky-200/60 text-ink">
          <Package2 className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          {t("dashboard.emptyState.title")}
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
          {t("dashboard.emptyState.description")}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <NavLink
            to="/crm"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
          >
            {t("dashboard.actions.newLead")}
          </NavLink>
          <NavLink
            to="/catalog"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
          >
            {t("dashboard.actions.reviewCatalog")}
          </NavLink>
          <NavLink
            to="/quotes"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
          >
            {t("dashboard.actions.newQuote")}
          </NavLink>
        </div>
      </div>
    </section>
  );
}

function CustomerSnapshotCard({
  customer,
  t
}: {
  customer: CustomerSummary;
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  const contactValue =
    customer.contactName ||
    customer.email ||
    customer.whatsapp ||
    t("dashboard.livePulse.contactPending");

  return (
    <div className="rounded-2xl border border-line/70 bg-sand/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold text-ink">{customer.displayName}</p>
          <p className="text-sm text-ink-soft">{contactValue}</p>
        </div>
        <StatusPill tone={getCustomerTone(customer.status)}>
          {t(`dashboard.livePulse.customerStatus.${customer.status}`)}
        </StatusPill>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        {t("dashboard.livePulse.customerCodeLabel")}:{" "}
        {customer.customerCode ?? t("dashboard.livePulse.customerCodePending")}
      </p>
    </div>
  );
}

function QuoteSnapshotCard({
  quote,
  t
}: {
  quote: QuoteSummary;
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-sand/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold text-ink">{quote.quoteNumber}</p>
          <p className="text-sm text-ink-soft">
            {quote.recipientDisplayName || t("dashboard.livePulse.contactPending")}
          </p>
        </div>
        <StatusPill tone={getQuoteTone(quote.status)}>
          {t(`dashboard.livePulse.quoteStatus.${quote.status}`)}
        </StatusPill>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm leading-6 text-ink-soft">
          {t("dashboard.livePulse.quoteValueLabel")}:{" "}
          {formatCurrency(quote.grandTotal, quote.currencyCode)}
        </p>
        <ArrowUpRight className="size-4 text-ink-muted" aria-hidden="true" />
      </div>
    </div>
  );
}

function getCustomerTone(status: CustomerSummary["status"]) {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "warning";
    case "archived":
      return "neutral";
  }
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

function getStatTone(id: (typeof statCards)[number]["id"]) {
  switch (id) {
    case "customerCount":
      return "info";
    case "quoteCount":
      return "success";
    case "openQuoteCount":
      return "warning";
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
