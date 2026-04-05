import { Fragment, type ReactNode, useMemo, useState } from 'react';

import {
  ArrowDownCircle,
  ArrowRight,
  ArrowUpCircle,
  CircleAlert,
  Ellipsis,
  Plus,
  RefreshCcw,
  RefreshCw,
} from 'lucide-react';

import { useTranslation } from '@operapyme/i18n';
import { NavLink } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import type {
  CustomerTransactionSummary,
  CustomerSummary,
  QuoteSummary,
} from '@/lib/supabase/backoffice-data';
import { cn } from '@/lib/utils';
import { useDashboardData } from '@/modules/dashboard/use-dashboard-data';

type BackofficeT = ReturnType<typeof useTranslation<'backoffice'>>['t'];
type DashboardRange = '7d' | '30d' | 'all';

type QuoteActivityStatus = 'positive' | 'neutral' | 'negative';

type ActivityQuote = {
  id: string;
  amount: string;
  helper: string | null;
  client: string;
  description: string;
  invoiceNumber: string;
  to: string;
  statusLabel: string;
  statusTone: QuoteActivityStatus;
  icon: typeof ArrowUpCircle;
};

type ActivityGroup = {
  dateLabel: string;
  dateTime: string;
  quotes: ActivityQuote[];
};

const rangeOptions: DashboardRange[] = ['7d', '30d', 'all'];

const statCards = [
  {
    id: 'customerCount' as const,
    changeType: 'positive' as const,
  },
  {
    id: 'activeCustomerCount' as const,
    changeType: 'positive' as const,
  },
  {
    id: 'quoteCount' as const,
    changeType: 'neutral' as const,
  },
  {
    id: 'openQuoteCount' as const,
    changeType: 'negative' as const,
  },
];

export function DashboardPage() {
  const { t } = useTranslation('backoffice');
  const [range, setRange] = useState<DashboardRange>('7d');
  const { data, error, hasTenantContext, isError, isLoading, refetch } =
    useDashboardData();

  const dashboardData =
    hasTenantContext && !isLoading && !isError && data ? data : null;

  const filteredQuotes = useMemo(
    () => filterRecordsByRange(data?.recentQuotes ?? [], range, 'updatedAt'),
    [data?.recentQuotes, range]
  );
  const filteredCustomers = useMemo(
    () => filterRecordsByRange(data?.recentCustomers ?? [], range, 'updatedAt'),
    [data?.recentCustomers, range]
  );
  const activityGroups = useMemo(
    () => groupQuotesByDay(filteredQuotes, t),
    [filteredQuotes, t]
  );
  const customerTransactionsByCustomerId = useMemo(
    () =>
      new Map(
        (dashboardData?.customerTransactions ?? []).map((transaction) => [
          transaction.customerId,
          transaction,
        ])
      ),
    [dashboardData?.customerTransactions]
  );

  return (
    <div className="space-y-10 pb-10">
      <section className="overflow-hidden rounded-[28px] border border-line/70 bg-paper shadow-panel">
        <div className="border-b border-line/60 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              {t('dashboard.header.title')}
            </h1>

            <div className="hidden h-8 w-px bg-line/80 sm:block" />

            <div className="order-last flex w-full flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold sm:order-0 sm:w-auto">
              {rangeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setRange(option);
                  }}
                  className={cn(
                    'transition',
                    range === option
                      ? 'text-brand'
                      : 'text-ink-soft hover:text-ink'
                  )}
                >
                  {t(`dashboard.ranges.${option}`)}
                </button>
              ))}
            </div>

            <div className="ml-auto">
              <ActionLink to="/commercial/quotes?tab=create" variant="primary">
                <Plus className="mr-1.5 size-4" aria-hidden="true" />
                {t('dashboard.actions.newQuote')}
              </ActionLink>
            </div>
          </div>
        </div>

        {!hasTenantContext ? (
          <StatePanel
            title={t('dashboard.livePulse.noTenantTitle')}
            description={t('dashboard.livePulse.noTenantDescription')}
          />
        ) : isLoading ? (
          <StatePanel
            title={t('dashboard.livePulse.loadingTitle')}
            description={t('dashboard.livePulse.loadingDescription')}
          />
        ) : isError ? (
          <StatePanel
            title={t('dashboard.livePulse.errorTitle')}
            description={t('dashboard.livePulse.errorDescription', {
              message: error instanceof Error ? error.message : '',
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
                {t('dashboard.livePulse.retryAction')}
              </Button>
            }
          />
        ) : dashboardData ? (
          <div className="border-b border-line/60 lg:border-t lg:border-t-line/40">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat, index) => (
                <div
                  key={stat.id}
                  className={cn(
                    'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-line/40 px-4 py-10 sm:px-6 lg:border-t-0 lg:px-8',
                    index % 2 === 1 ? 'sm:border-l sm:border-line/40' : '',
                    index >= 2 ? 'lg:border-l lg:border-line/40' : ''
                  )}
                >
                  <dt className="text-sm font-medium text-ink-muted">
                    {t(`dashboard.stats.${stat.id}.label`)}
                  </dt>
                  <dd
                    className={cn(
                      'text-xs font-medium',
                      stat.changeType === 'negative'
                        ? 'text-danger'
                        : stat.changeType === 'positive'
                          ? 'text-brand'
                          : 'text-ink-soft'
                    )}
                  >
                    {t(`dashboard.stats.${stat.id}.change`, {
                      count: dashboardData[stat.id],
                    })}
                  </dd>
                  <dd className="w-full text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    {formatDashboardStatValue(
                      stat.id,
                      dashboardData[stat.id],
                      t
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </section>

      {dashboardData &&
      dashboardData.customerCount === 0 &&
      dashboardData.quoteCount === 0 &&
      dashboardData.recentCustomers.length === 0 &&
      dashboardData.recentQuotes.length === 0 ? (
        <EmptyStatePanel />
      ) : dashboardData ? (
        <>
          <section>
            <div className="px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                {t('dashboard.activity.title')}
              </h2>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-line/60 bg-paper shadow-panel">
              {activityGroups.length === 0 ? (
                <div className="p-6">
                  <MiniEmptyState
                    message={t(
                      range === 'all'
                        ? 'dashboard.activity.empty'
                        : 'dashboard.activity.emptyRange'
                    )}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="sr-only">
                      <tr>
                        <th>{t('dashboard.activity.headers.amount')}</th>
                        <th>{t('dashboard.activity.headers.recipient')}</th>
                        <th>{t('dashboard.activity.headers.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityGroups.map((group) => (
                        <Fragment key={group.dateTime}>
                          <tr className="text-sm text-ink">
                            <th
                              scope="colgroup"
                              colSpan={3}
                              className="relative isolate border-b border-line/60 bg-sand/20 px-6 py-4 text-left text-xl font-semibold tracking-tight text-ink"
                            >
                              <time dateTime={group.dateTime}>
                                {group.dateLabel}
                              </time>
                            </th>
                          </tr>

                          {group.quotes.map((quote) => (
                            <ActivityRow key={quote.id} quote={quote} />
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                {t('dashboard.clients.title')}
              </h2>
              <NavLink
                to="/crm"
                className="text-sm font-semibold text-brand transition hover:text-brand-hover"
              >
                {t('dashboard.clients.viewAll')}
              </NavLink>
            </div>

            <div className="mt-6 grid gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
              {filteredCustomers.length === 0 ? (
                <div className="lg:col-span-3">
                  <MiniEmptyState
                    message={t(
                      range === 'all'
                        ? 'dashboard.livePulse.customersEmpty'
                        : 'dashboard.clients.emptyRange'
                    )}
                  />
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    customerTransaction={customerTransactionsByCustomerId.get(
                      customer.id
                    )}
                    t={t}
                  />
                ))
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function ActivityRow({ quote }: { quote: ActivityQuote }) {
  const StatusIcon = quote.icon;

  return (
    <tr>
      <td className="relative border-b border-line/50 px-6 py-8 pr-6">
        <div className="flex gap-x-5">
          <StatusIcon
            aria-hidden="true"
            className="mt-1 hidden size-6 flex-none text-ink-muted sm:block"
          />
          <div className="flex-auto">
            <div className="flex flex-wrap items-start gap-3">
              <div className="text-2xl font-semibold tracking-tight text-ink">
                {quote.amount}
              </div>
              <div
                className={cn(
                  'rounded-xl px-3 py-1 text-sm font-medium ring-1 ring-inset',
                  quote.statusTone === 'positive'
                    ? 'bg-success/10 text-success ring-success/20'
                    : quote.statusTone === 'negative'
                      ? 'bg-danger/10 text-danger ring-danger/20'
                      : 'bg-sand/45 text-ink-soft ring-line/70'
                )}
              >
                {quote.statusLabel}
              </div>
            </div>
            {quote.helper ? (
              <div className="mt-2 text-sm text-ink-muted">{quote.helper}</div>
            ) : null}
          </div>
        </div>
      </td>
      <td className="border-b border-line/50 px-6 py-8 pr-6 align-top">
        <div className="text-2xl tracking-tight text-ink">{quote.client}</div>
        <div className="mt-2 text-sm text-ink-muted">{quote.description}</div>
      </td>
      <td className="border-b border-line/50 px-6 py-8 text-right align-top">
        <NavLink
          to={quote.to}
          className="text-sm font-semibold text-brand transition hover:text-brand-hover"
        >
          {quote.statusTone === 'neutral' ? 'View draft' : 'View transaction'}
        </NavLink>
        <div className="mt-2 text-sm text-ink-muted">
          Invoice <span className="text-ink">#{quote.invoiceNumber}</span>
        </div>
      </td>
    </tr>
  );
}

function CustomerCard({
  customer,
  customerTransaction,
  t,
}: {
  customer: CustomerSummary;
  customerTransaction?: CustomerTransactionSummary;
  t: BackofficeT;
}) {
  const invoiceInfo = getCustomerCardInvoice(customer, customerTransaction, t);

  return (
    <article className="overflow-hidden rounded-[28px] border border-line/60 bg-paper shadow-panel">
      <div className="flex items-center gap-x-4 border-b border-line/50 bg-sand/20 p-6">
        <div className="flex size-20 items-center justify-center rounded-2xl border border-line/50 bg-paper text-2xl font-semibold tracking-tight text-brand">
          {getInitials(customer.displayName)}
        </div>
        <div className="text-2xl tracking-tight text-ink">
          {customer.displayName}
        </div>
        <button
          type="button"
          className="ml-auto rounded-full p-2 text-ink-muted transition hover:bg-paper hover:text-ink"
          aria-label={t('dashboard.clients.optionsLabel', {
            customer: customer.displayName,
          })}
        >
          <Ellipsis className="size-6" aria-hidden="true" />
        </button>
      </div>

      <dl className="space-y-6 px-6 py-6 text-sm">
        <div className="flex items-start justify-between gap-x-4 border-b border-line/40 pb-6">
          <dt className="text-ink-muted">
            {t('dashboard.clients.lastTouchLabel')}
          </dt>
          <dd className="text-right text-ink">
            <time dateTime={invoiceInfo.dateTime}>{invoiceInfo.dateLabel}</time>
          </dd>
        </div>
        <div className="flex items-start justify-between gap-x-4">
          <dt className="text-ink-muted">
            {t('dashboard.clients.amountLabel')}
          </dt>
          <dd className="flex items-center gap-x-3 text-right">
            <span className="text-2xl font-semibold tracking-tight text-ink">
              {invoiceInfo.amount}
            </span>
            <div
              className={cn(
                'rounded-xl px-3 py-1 text-sm font-medium ring-1 ring-inset',
                invoiceInfo.statusTone === 'positive'
                  ? 'bg-success/10 text-success ring-success/20'
                  : invoiceInfo.statusTone === 'negative'
                    ? 'bg-danger/10 text-danger ring-danger/20'
                    : 'bg-sand/45 text-ink-soft ring-line/70'
              )}
            >
              {invoiceInfo.statusLabel}
            </div>
          </dd>
        </div>
      </dl>
    </article>
  );
}

function ActionLink({
  children,
  to,
  variant,
}: {
  children: ReactNode;
  to: string;
  variant: 'primary' | 'secondary';
}) {
  return (
    <NavLink
      to={to}
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition',
        variant === 'primary'
          ? 'bg-brand text-brand-contrast shadow-soft hover:bg-brand-hover'
          : 'border border-line-strong bg-paper text-ink shadow-panel hover:bg-sand/70'
      )}
    >
      {children}
    </NavLink>
  );
}

function StatePanel({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-line/70 bg-sand/25 p-5">
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
    </div>
  );
}

function EmptyStatePanel() {
  const { t } = useTranslation('backoffice');

  return (
    <section className="rounded-[28px] border border-line/60 bg-paper p-8 shadow-panel">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {t('dashboard.emptyState.title')}
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
          {t('dashboard.emptyState.description')}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ActionLink to="/commercial/leads" variant="secondary">
            {t('dashboard.actions.newLead')}
          </ActionLink>
          <ActionLink to="/catalog" variant="secondary">
            {t('dashboard.actions.reviewCatalog')}
          </ActionLink>
          <ActionLink to="/commercial/quotes?tab=create" variant="primary">
            {t('dashboard.actions.newQuote')}
          </ActionLink>
        </div>
      </div>
    </section>
  );
}

function MiniEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-sand/15 p-5 text-sm leading-6 text-ink-soft">
      {message}
    </div>
  );
}

function filterRecordsByRange<T extends { updatedAt: string }>(
  records: T[],
  range: DashboardRange,
  dateKey: keyof T
) {
  if (range === 'all') {
    return records;
  }

  const dayCount = range === '7d' ? 7 : 30;
  const cutoff = Date.now() - dayCount * 24 * 60 * 60 * 1000;

  return records.filter((record) => {
    const timestamp = new Date(String(record[dateKey])).getTime();
    return Number.isFinite(timestamp) && timestamp >= cutoff;
  });
}

function groupQuotesByDay(
  quotes: QuoteSummary[],
  t: BackofficeT
): ActivityGroup[] {
  const groups = new Map<string, QuoteSummary[]>();

  for (const quote of quotes) {
    const dateKey = quote.updatedAt.slice(0, 10);
    const existing = groups.get(dateKey);

    if (existing) {
      existing.push(quote);
      continue;
    }

    groups.set(dateKey, [quote]);
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([dateTime, groupQuotes]) => ({
      dateLabel: formatActivityDate(dateTime, t),
      dateTime,
      quotes: [...groupQuotes]
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
        .map((quote) => mapQuoteToActivity(quote, t)),
    }));
}

function mapQuoteToActivity(
  quote: QuoteSummary,
  t: BackofficeT
): ActivityQuote {
  const statusTone = getActivityStatusTone(quote.status);

  return {
    id: quote.id,
    amount: `${formatCurrency(quote.grandTotal, quote.currencyCode)} ${quote.currencyCode}`,
    helper:
      quote.taxTotal > 0
        ? `${formatCurrency(quote.taxTotal, quote.currencyCode)} tax`
        : null,
    client:
      quote.recipientDisplayName || t('dashboard.livePulse.contactPending'),
    description: quote.title,
    invoiceNumber: quote.quoteNumber,
    to: `/commercial/quotes`,
    statusLabel: t(`dashboard.activity.status.${statusTone}`),
    statusTone,
    icon:
      statusTone === 'positive'
        ? ArrowUpCircle
        : statusTone === 'negative'
          ? RefreshCcw
          : ArrowDownCircle,
  };
}

function getActivityStatusTone(
  status: QuoteSummary['status']
): QuoteActivityStatus {
  switch (status) {
    case 'approved':
      return 'positive';
    case 'rejected':
    case 'expired':
      return 'negative';
    default:
      return 'neutral';
  }
}

function formatActivityDate(value: string, t: BackofficeT) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameCalendarDay(date, today)) {
    return t('dashboard.activity.today');
  }

  if (isSameCalendarDay(date, yesterday)) {
    return t('dashboard.activity.yesterday');
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
  }).format(date);
}

function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDashboardStatValue(
  id: (typeof statCards)[number]['id'],
  value: number,
  t: BackofficeT
) {
  if (id === 'quoteCount' || id === 'openQuoteCount') {
    return t('dashboard.stats.documentsValue', { count: value });
  }

  return t('dashboard.stats.customersValue', { count: value });
}

function formatCurrency(value: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

function getCustomerCardInvoice(
  customer: CustomerSummary,
  customerTransaction: CustomerTransactionSummary | undefined,
  t: BackofficeT
) {
  if (!customerTransaction) {
    const statusTone = getCustomerStatusTone(customer.status);

    return {
      dateTime: customer.updatedAt,
      dateLabel: formatShortDate(customer.updatedAt),
      amount: '--',
      statusTone,
      statusLabel: t(`dashboard.livePulse.customerStatus.${customer.status}`),
    };
  }

  if (customerTransaction.openAmount > 0 && customerTransaction.lastOpenAt) {
    return {
      dateTime: customerTransaction.lastOpenAt,
      dateLabel: formatShortDate(customerTransaction.lastOpenAt),
      amount: formatCurrency(
        customerTransaction.openAmount,
        customerTransaction.currencyCode
      ),
      statusTone:
        customerTransaction.lastOpenStatus === 'draft'
          ? ('neutral' as const)
          : ('negative' as const),
      statusLabel:
        customerTransaction.lastOpenStatus === 'draft'
          ? t('commercial.invoices.statuses.draft')
          : t('dashboard.clients.pendingCollectionStatus'),
    };
  }

  if (customerTransaction.paidAmount > 0 && customerTransaction.lastPaidAt) {
    return {
      dateTime: customerTransaction.lastPaidAt,
      dateLabel: formatShortDate(customerTransaction.lastPaidAt),
      amount: formatCurrency(
        customerTransaction.paidAmount,
        customerTransaction.currencyCode
      ),
      statusTone: 'positive' as const,
      statusLabel: t('commercial.invoices.statuses.paid'),
    };
  }

  return {
    dateTime: customer.updatedAt,
    dateLabel: formatShortDate(customer.updatedAt),
    amount: '--',
    statusTone: getCustomerStatusTone(customer.status),
    statusLabel: t(`dashboard.livePulse.customerStatus.${customer.status}`),
  };
}

function getCustomerStatusTone(
  status: CustomerSummary['status']
): QuoteActivityStatus {
  switch (status) {
    case 'active':
      return 'positive';
    case 'archived':
      return 'negative';
    default:
      return 'neutral';
  }
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
  }).format(date);
}

function getInitials(value: string) {
  return value
    .split(' ')
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('');
}
