import { CircleAlert, UserPlus, UsersRound } from "lucide-react";

import { type ReactNode, useMemo } from "react";

import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import { CappedPreviewSlider } from "@/components/ui/capped-preview-slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import type { CustomerSummary } from "@/lib/supabase/backoffice-data";
import { CustomerOperationsPanel } from "@/modules/crm/customer-operations-panel";
import { LeadIntakeForm } from "@/modules/crm/lead-intake-form";
import { useCustomersData } from "@/modules/crm/use-customers-data";

export function CrmPage() {
  const { t } = useTranslation("backoffice");
  const {
    data,
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useCustomersData({ statuses: [] });

  const customerSummary = useMemo(() => {
    const customers = data ?? [];

    return {
      total: customers.length,
      active: customers.filter((customer) => customer.status === "active").length,
      inactive: customers.filter((customer) => customer.status === "inactive")
        .length,
      archived: customers.filter((customer) => customer.status === "archived")
        .length
    };
  }, [data]);

  const recentCustomers = useMemo(
    () => (data ?? []).filter((customer) => customer.status !== "archived").slice(0, 6),
    [data]
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5">
          <div className="space-y-4">
            <div className="space-y-3">
              <span className="inline-flex min-h-9 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {t("crm.header.eyebrow")}
              </span>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {t("crm.header.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-ink-soft">
                  {t("crm.header.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill tone="info">
                {t("crm.overview.totalCustomers", {
                  count: customerSummary.total
                })}
              </StatusPill>
              <StatusPill tone="success">
                {t("crm.overview.activeCustomers", {
                  count: customerSummary.active
                })}
              </StatusPill>
              <StatusPill tone="warning">
                {t("crm.overview.inactiveCustomers", {
                  count: customerSummary.inactive + customerSummary.archived
                })}
              </StatusPill>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#crm-lead-intake"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
              >
                {t("crm.actions.captureLead")}
              </a>
              <a
                href="#crm-customer-operations"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
              >
                {t("crm.actions.manageCustomers")}
              </a>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("crm.overview.title")}</CardTitle>
            <CardDescription>{t("crm.overview.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasTenantContext ? (
              <InlineStateCard
                title={t("crm.recent.noTenantTitle")}
                description={t("crm.recent.noTenantDescription")}
              />
            ) : isLoading ? (
              <InlineStateCard
                title={t("crm.recent.loadingTitle")}
                description={t("crm.recent.loadingDescription")}
              />
            ) : isError ? (
              <InlineStateCard
                title={t("crm.recent.errorTitle")}
                description={t("crm.recent.errorDescription", {
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
                    {t("crm.recent.retryAction")}
                  </Button>
                }
              />
            ) : customerSummary.total > 0 ? (
              <div className="space-y-3">
                <SummaryRow
                  icon={<UsersRound className="size-4" aria-hidden="true" />}
                  label={t("crm.overview.totalLabel")}
                  value={String(customerSummary.total)}
                />
                <SummaryRow
                  icon={<UserPlus className="size-4" aria-hidden="true" />}
                  label={t("crm.overview.activeLabel")}
                  value={String(customerSummary.active)}
                />
                <SummaryRow
                  icon={<CircleAlert className="size-4" aria-hidden="true" />}
                  label={t("crm.overview.needsAttentionLabel")}
                  value={String(
                    customerSummary.inactive + customerSummary.archived
                  )}
                />
              </div>
            ) : (
              <InlineStateCard
                title={t("crm.overview.emptyTitle")}
                description={t("crm.overview.emptyDescription")}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_0.95fr]">
        <div id="crm-lead-intake">
          <LeadIntakeForm />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("crm.recent.title")}</CardTitle>
            <CardDescription>{t("crm.recent.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasTenantContext ? (
              <InlineStateCard
                title={t("crm.recent.noTenantTitle")}
                description={t("crm.recent.noTenantDescription")}
              />
            ) : isLoading ? (
              <InlineStateCard
                title={t("crm.recent.loadingTitle")}
                description={t("crm.recent.loadingDescription")}
              />
            ) : isError ? (
              <InlineStateCard
                title={t("crm.recent.errorTitle")}
                description={t("crm.recent.errorDescription", {
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
                    {t("crm.recent.retryAction")}
                  </Button>
                }
              />
            ) : recentCustomers.length > 0 ? (
              <CappedPreviewSlider
                ariaLabel={t("crm.recent.title")}
                items={recentCustomers}
                nextLabel={t("shared.slider.next")}
                previousLabel={t("shared.slider.previous")}
                getItemKey={(customer) => customer.id}
                renderItem={(customer) => (
                  <CustomerCard customer={customer} t={t} />
                )}
              />
            ) : (
              <InlineStateCard
                title={t("crm.recent.emptyTitle")}
                description={t("crm.recent.emptyDescription")}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <div id="crm-customer-operations">
        <CustomerOperationsPanel customers={data ?? []} />
      </div>
    </div>
  );
}

function InlineStateCard({
  action,
  description,
  title
}: {
  action?: ReactNode;
  description: string;
  title: string;
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

function CustomerCard({
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
    t("crm.recent.contactPending");

  return (
    <div className="h-full rounded-3xl border border-line/70 bg-paper/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{customer.displayName}</p>
          <p className="text-sm text-ink-soft">{contactValue}</p>
        </div>
        <StatusPill tone={getCustomerTone(customer.status)}>
          {t(`crm.recent.customerStatus.${customer.status}`)}
        </StatusPill>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        {t("crm.recent.originLabel")}: {t(getSourceTranslationKey(customer.source))}
      </p>
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

function getSourceTranslationKey(source: string) {
  switch (source) {
    case "website":
      return "crm.recent.source.website";
    case "whatsapp":
      return "crm.recent.source.whatsapp";
    case "walk-in":
      return "crm.recent.source.walkIn";
    case "repeat":
      return "crm.recent.source.repeat";
    default:
      return "crm.recent.source.manual";
  }
}
