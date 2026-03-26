import { Clock3, MessageSquareMore, PhoneCall } from "lucide-react";

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
import type { CustomerSummary } from "@/lib/supabase/backoffice-data";
import { CustomerOperationsPanel } from "@/modules/crm/customer-operations-panel";
import { useCustomersData } from "@/modules/crm/use-customers-data";

const operatingRules = [
  {
    icon: MessageSquareMore,
    titleKey: "crm.rules.captureTitle",
    textKey: "crm.rules.captureText"
  },
  {
    icon: PhoneCall,
    titleKey: "crm.rules.followUpTitle",
    textKey: "crm.rules.followUpText"
  },
  {
    icon: Clock3,
    titleKey: "crm.rules.responseTimeTitle",
    textKey: "crm.rules.responseTimeText"
  }
];

export function CrmPage() {
  const { t } = useTranslation("backoffice");
  const {
    data,
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useCustomersData();

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("crm.header.eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {t("crm.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-ink-soft">
          {t("crm.header.description")}
        </p>
      </section>

      <CustomerOperationsPanel customers={data ?? []} />

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("crm.recent.title")}</CardTitle>
            <CardDescription>
              {t("crm.recent.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasTenantContext ? (
              <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
                <p className="text-sm font-medium text-ink">
                  {t("crm.recent.noTenantTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("crm.recent.noTenantDescription")}
                </p>
              </div>
            ) : isLoading ? (
              <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
                <p className="text-sm font-medium text-ink">
                  {t("crm.recent.loadingTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("crm.recent.loadingDescription")}
                </p>
              </div>
            ) : isError ? (
              <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
                <p className="text-sm font-medium text-ink">
                  {t("crm.recent.errorTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("crm.recent.errorDescription", {
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
                  {t("crm.recent.retryAction")}
                </Button>
              </div>
            ) : data && data.length > 0 ? (
              <div className="space-y-3">
                {data.slice(0, 6).map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} t={t} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
                <p className="text-sm font-medium text-ink">
                  {t("crm.recent.emptyTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("crm.recent.emptyDescription")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-paper via-paper to-sky-200/50">
          <CardHeader>
            <CardTitle>{t("crm.rules.title")}</CardTitle>
            <CardDescription>
              {t("crm.rules.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {operatingRules.map(({ icon: Icon, titleKey, textKey }) => (
              <div key={titleKey} className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-paper shadow-panel">
                  <Icon className="size-4 text-ink" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t(titleKey)}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t(textKey)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
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
    <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
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
