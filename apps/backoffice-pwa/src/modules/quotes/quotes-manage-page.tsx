import { useTranslation } from "@operapyme/i18n";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { QuoteManageWorkspace } from "@/modules/quotes/quote-operations-panel";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

export function QuotesManagePage() {
  const { t } = useTranslation("backoffice");
  const {
    data: quotes = [],
    error,
    hasTenantContext,
    isError,
    isLoading
  } = useQuotesData();
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: catalogItems = [] } = useCatalogItemsData();

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-line/70 bg-linear-to-br from-paper via-paper to-butter-200/45 p-5 shadow-panel sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex min-h-8 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              {t("quotes.subroutes.manageEyebrow")}
            </span>
            <h1 className="text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">
              {t("quotes.subroutes.manageTitle")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              {t("quotes.subroutes.manageDescription")}
            </p>
          </div>

          <Link
            to="/quotes/new"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 text-base font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
          >
            {t("quotes.actions.createQuote")}
          </Link>
        </div>
      </section>

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
        />
      ) : (
        <QuoteManageWorkspace
          catalogItems={catalogItems}
          customers={customers}
          leads={leads}
          quotes={quotes}
        />
      )}
    </div>
  );
}

function InlineStateCard({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
      </CardContent>
    </Card>
  );
}
