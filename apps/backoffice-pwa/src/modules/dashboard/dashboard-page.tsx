import type { ReactNode } from "react";

import {
  ArrowRight,
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
import { CappedPreviewSlider } from "@/components/ui/capped-preview-slider";
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
    to: "/commercial/leads",
    icon: UsersRound
  },
  {
    key: "prepareCatalog" as const,
    to: "/catalog",
    icon: Package2
  },
  {
    key: "sendQuote" as const,
    to: "/commercial/quotes",
    icon: FileText
  },
  {
    key: "reviewSettings" as const,
    to: "/settings",
    icon: Settings2
  }
];

type BackofficeT = ReturnType<typeof useTranslation<"backoffice">>["t"];

type FocusInput = {
  activeCustomerCount: number;
  customerCount: number;
  openQuoteCount: number;
  quoteCount: number;
};

type RecommendedFocus = {
  actionLabel: string;
  description: string;
  to: string;
};

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
  const recommendedFocus =
    hasTenantContext && !isLoading && !isError && data
      ? getRecommendedFocus(data, t)
      : null;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5">
              <div className="space-y-3">
                <span className="inline-flex min-h-9 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  {t("dashboard.header.eyebrow")}
                </span>
                <div className="space-y-2">
                  <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {t("dashboard.header.title")}
                  </h1>
                  <p className="max-w-3xl text-sm leading-6 text-ink-soft sm:text-base">
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
                <ActionLink to="/commercial/leads" variant="secondary">
                  {t("dashboard.actions.newLead")}
                </ActionLink>
                <ActionLink to="/commercial/quotes?tab=create" variant="primary">
                  {t("dashboard.actions.newQuote")}
                </ActionLink>
                <ActionLink to="/catalog" variant="secondary">
                  {t("dashboard.actions.reviewCatalog")}
                </ActionLink>
              </div>

              {!hasTenantContext ? (
                <InlineStatePanel
                  title={t("dashboard.livePulse.noTenantTitle")}
                  description={t("dashboard.livePulse.noTenantDescription")}
                />
              ) : isLoading ? (
                <InlineStatePanel
                  title={t("dashboard.livePulse.loadingTitle")}
                  description={t("dashboard.livePulse.loadingDescription")}
                />
              ) : isError ? (
                <InlineStatePanel
                  title={t("dashboard.livePulse.errorTitle")}
                  description={t("dashboard.livePulse.errorDescription", {
                    message: error instanceof Error ? error.message : ""
                  })}
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
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {statCards.map(({ id, icon: Icon, iconClassName }) => (
                    <div
                      key={id}
                      className="rounded-3xl border border-line/70 bg-sand/30 p-4 shadow-panel sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "flex size-11 items-center justify-center rounded-2xl",
                            iconClassName
                          )}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <StatusPill tone={getStatTone(id)}>
                          {t(`dashboard.stats.${id}.label`)}
                        </StatusPill>
                      </div>

                      <div className="mt-5 space-y-2">
                        <p className="text-3xl font-semibold tracking-tight text-ink">
                          {data?.[id] ?? 0}
                        </p>
                        <p className="text-sm leading-6 text-ink-soft">
                          {t(`dashboard.stats.${id}.detail`, {
                            count: data?.[id] ?? 0
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <NextStepsCard t={t} />
          {recommendedFocus && data ? (
            <RecommendedFocusCard data={data} focus={recommendedFocus} t={t} />
          ) : null}
        </div>
      </section>

      {hasTenantContext && !isLoading && !isError ? (
        isCommercialDataEmpty ? (
          <EmptyStatePanel />
        ) : (
          <section className="grid gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <div className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel">
                <PanelHeader
                  actionLabel={t("dashboard.livePulse.quotesAction")}
                  description={t("dashboard.livePulse.quotesDescription")}
                  title={t("dashboard.livePulse.quotesTitle")}
                  to="/commercial/quotes"
                />

                <div className="mt-5">
                  <CappedPreviewSlider
                    ariaLabel={t("dashboard.livePulse.quotesTitle")}
                    emptyState={
                      <MiniEmptyState
                        message={t("dashboard.livePulse.quotesEmpty")}
                      />
                    }
                    items={data?.recentQuotes ?? []}
                    nextLabel={t("shared.slider.next")}
                    previousLabel={t("shared.slider.previous")}
                    getItemKey={(quote) => quote.id}
                    renderItem={(quote) => (
                      <QuoteSnapshotCard quote={quote} t={t} />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="xl:col-span-5">
              <div className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel">
                <PanelHeader
                  actionLabel={t("dashboard.livePulse.customersAction")}
                  description={t("dashboard.livePulse.customersDescription")}
                  title={t("dashboard.livePulse.customersTitle")}
                  to="/crm"
                />

                <div className="mt-5">
                  <CappedPreviewSlider
                    ariaLabel={t("dashboard.livePulse.customersTitle")}
                    emptyState={
                      <MiniEmptyState
                        message={t("dashboard.livePulse.customersEmpty")}
                      />
                    }
                    items={data?.recentCustomers ?? []}
                    nextLabel={t("shared.slider.next")}
                    previousLabel={t("shared.slider.previous")}
                    getItemKey={(customer) => customer.id}
                    renderItem={(customer) => (
                      <CustomerSnapshotCard customer={customer} t={t} />
                    )}
                  />
                </div>
              </div>
            </div>
          </section>
        )
      ) : null}
    </div>
  );
}

function ActionLink({
  children,
  to,
  variant
}: {
  children: ReactNode;
  to: string;
  variant: "primary" | "secondary";
}) {
  return (
    <NavLink
      to={to}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium transition",
        variant === "primary"
          ? "bg-brand text-brand-contrast shadow-soft hover:bg-brand-hover"
          : "border border-line-strong bg-paper/95 text-ink shadow-panel hover:bg-sand/70"
      )}
    >
      {children}
    </NavLink>
  );
}

function NextStepsCard({ t }: { t: BackofficeT }) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5">
      <div className="space-y-1">
        <p className="text-base font-semibold text-ink sm:text-lg">
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
            className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-line/70 bg-sand/45 px-4 py-3 transition hover:border-line-strong hover:bg-paper"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-paper text-ink shadow-panel">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-ink">
                {t(`dashboard.checklist.${key}`)}
              </p>
            </div>
            <ArrowRight className="size-4 text-ink-muted" aria-hidden="true" />
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function RecommendedFocusCard({
  data,
  focus,
  t
}: {
  data: FocusInput;
  focus: RecommendedFocus;
  t: BackofficeT;
}) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5">
      <div className="space-y-1">
        <p className="text-base font-semibold text-ink sm:text-lg">
          {t("dashboard.focus.title")}
        </p>
        <p className="text-sm leading-6 text-ink-soft">
          {t("dashboard.focus.description")}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <SummaryMetric
          label={t("dashboard.focus.metrics.activeCustomers")}
          value={data.activeCustomerCount}
        />
        <SummaryMetric
          label={t("dashboard.focus.metrics.openQuotes")}
          value={data.openQuoteCount}
        />
        <SummaryMetric
          label={t("dashboard.focus.metrics.totalQuotes")}
          value={data.quoteCount}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-line/70 bg-sand/45 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {t("dashboard.focus.recommendedLabel")}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">
          {focus.description}
        </p>
      </div>

      <NavLink
        to={focus.to}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-paper/95 px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
      >
        {focus.actionLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </NavLink>
    </div>
  );
}

function SummaryMetric({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-sand/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function PanelHeader({
  actionLabel,
  description,
  title,
  to
}: {
  actionLabel: string;
  description: string;
  title: string;
  to: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-lg font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">{description}</p>
      </div>

      <NavLink
        to={to}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line/70 bg-paper px-3 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
      >
        {actionLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </NavLink>
    </div>
  );
}

function MiniEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-sand/25 p-4 text-sm leading-6 text-ink-soft">
      {message}
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
        "rounded-3xl border border-line/70 bg-sand/35 p-5 shadow-panel",
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
          <ActionLink to="/commercial/leads" variant="secondary">
            {t("dashboard.actions.newLead")}
          </ActionLink>
          <ActionLink to="/catalog" variant="secondary">
            {t("dashboard.actions.reviewCatalog")}
          </ActionLink>
          <ActionLink to="/commercial/quotes?tab=create" variant="primary">
            {t("dashboard.actions.newQuote")}
          </ActionLink>
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
  t: BackofficeT;
}) {
  const contactValue =
    customer.contactName ||
    customer.email ||
    customer.whatsapp ||
    t("dashboard.livePulse.contactPending");

  return (
    <div className="h-full rounded-2xl border border-line/70 bg-sand/40 p-4">
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
  t: BackofficeT;
}) {
  return (
    <div className="h-full rounded-2xl border border-line/70 bg-sand/40 p-4">
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
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        {t("dashboard.livePulse.quoteValueLabel")}:{" "}
        {formatCurrency(quote.grandTotal, quote.currencyCode)}
      </p>
    </div>
  );
}

function getRecommendedFocus(data: FocusInput, t: BackofficeT): RecommendedFocus {
  if (data.customerCount === 0) {
    return {
      actionLabel: t("dashboard.actions.newLead"),
      description: t("dashboard.focus.focusCaptureLead"),
      to: "/commercial/leads"
    };
  }

  if (data.openQuoteCount > 0) {
    return {
      actionLabel: t("dashboard.actions.reviewQuotes"),
      description: t("dashboard.focus.focusResumeQuotes", {
        count: data.openQuoteCount
      }),
      to: "/commercial/quotes"
    };
  }

  if (data.quoteCount === 0) {
    return {
      actionLabel: t("dashboard.actions.newQuote"),
      description: t("dashboard.focus.focusPrepareQuote"),
      to: "/commercial/quotes?tab=create"
    };
  }

  return {
    actionLabel: t("dashboard.actions.reviewCatalog"),
    description: t("dashboard.focus.focusReviewCatalog"),
    to: "/catalog"
  };
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
