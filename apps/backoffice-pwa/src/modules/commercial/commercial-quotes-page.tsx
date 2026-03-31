import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useTranslation } from "@operapyme/i18n";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import {
  QuoteCreateWorkspace,
  QuoteManageWorkspace
} from "@/modules/quotes/quote-operations-panel";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

export function CommercialQuotesPage() {
  const { t } = useTranslation("backoffice");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") === "manage" ? "manage" : "create";
  const { data: quotes = [] } = useQuotesData();
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: catalogItems = [] } = useCatalogItemsData();

  const quoteSummary = useMemo(
    () => ({
      open: quotes.filter((quote) =>
        ["draft", "sent", "viewed"].includes(quote.status)
      ).length,
      approved: quotes.filter((quote) => quote.status === "approved").length
    }),
    [quotes]
  );

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("commercial.quotes.title")}</h1>

      <section className="flex flex-wrap gap-3">
        <Card className="min-w-32 rounded-3xl">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
              {t("quotes.overview.openQuotes", { count: quoteSummary.open })}
            </p>
          </CardContent>
        </Card>
        <Card className="min-w-32 rounded-3xl">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
              {t("quotes.overview.approvedQuotes", {
                count: quoteSummary.approved
              })}
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          setSearchParams(value === "manage" ? { tab: "manage" } : {});
        }}
      >
        <TabsList className="h-auto rounded-2xl bg-sand/60 p-1">
          <TabsTrigger value="create">{t("commercial.quotes.createTab")}</TabsTrigger>
          <TabsTrigger value="manage">{t("commercial.quotes.manageTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <h2 className="sr-only">{t("quotes.subroutes.createTitle")}</h2>
          <QuoteCreateWorkspace
            catalogItems={catalogItems}
            customers={customers}
            leads={leads}
            quotes={quotes}
          />
        </TabsContent>

        <TabsContent value="manage" className="mt-4">
          <h2 className="sr-only">{t("quotes.subroutes.manageTitle")}</h2>
          <QuoteManageWorkspace
            catalogItems={catalogItems}
            customers={customers}
            leads={leads}
            quotes={quotes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
