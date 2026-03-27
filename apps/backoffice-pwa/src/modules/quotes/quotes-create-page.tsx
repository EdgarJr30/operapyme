import { useTranslation } from "@operapyme/i18n";
import { Link } from "react-router-dom";

import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { QuoteCreateWorkspace } from "@/modules/quotes/quote-operations-panel";

export function QuotesCreatePage() {
  const { t } = useTranslation("backoffice");
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: catalogItems = [] } = useCatalogItemsData();

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-4xl border border-line/70 bg-paper p-4 shadow-panel sm:p-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {t("quotes.subroutes.createTitle")}
          </h1>
          <p className="text-sm leading-6 text-ink-soft">
            {t("quotes.createPage.directEntryDescription", {
              customers: customers.length,
              leads: leads.length,
              catalogItems: catalogItems.length
            })}
          </p>
        </div>

        <Link
          to="/quotes/manage"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-line-strong bg-paper px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand-strong/80"
        >
          {t("quotes.actions.reviewQuotes")}
        </Link>
      </section>

      <QuoteCreateWorkspace
        catalogItems={catalogItems}
        customers={customers}
        leads={leads}
        quotes={[]}
      />
    </div>
  );
}
