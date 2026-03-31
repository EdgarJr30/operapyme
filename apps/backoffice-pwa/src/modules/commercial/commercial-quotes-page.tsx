import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QuoteStatus, QuoteSummary } from "@/lib/supabase/backoffice-data";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import {
  QuoteCreateWorkspace,
  QuoteManageWorkspace
} from "@/modules/quotes/quote-operations-panel";
import { useQuoteMutations } from "@/modules/quotes/use-quote-mutations";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

const quoteStatusOrder: QuoteStatus[] = [
  "draft",
  "sent",
  "viewed",
  "approved",
  "rejected",
  "expired"
];

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: currencyCode
  }).format(amount);
}

function getNextQuoteStatuses(status: QuoteStatus): QuoteStatus[] {
  switch (status) {
    case "draft":
      return ["sent"];
    case "sent":
      return ["viewed", "approved", "rejected", "expired"];
    case "viewed":
      return ["approved", "rejected", "expired"];
    case "approved":
      return [];
    case "rejected":
      return ["draft"];
    case "expired":
      return ["draft"];
    default:
      return [];
  }
}

export function CommercialQuotesPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const currentTab = searchParams.get("tab") === "manage" ? "manage" : "create";
  const { data: quotes = [] } = useQuotesData();
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: catalogItems = [] } = useCatalogItemsData();
  const { moveQuoteStatusMutation } = useQuoteMutations();

  const quoteSummary = useMemo(
    () => ({
      open: quotes.filter((quote) =>
        ["draft", "sent", "viewed"].includes(quote.status)
      ).length,
      approved: quotes.filter((quote) => quote.status === "approved").length
    }),
    [quotes]
  );

  const quotesByStatus = useMemo(
    () =>
      quoteStatusOrder.map((status) => ({
        status,
        quotes: quotes.filter((quote) => quote.status === status)
      })),
    [quotes]
  );

  async function handleMoveQuoteStatus(quote: QuoteSummary, status: QuoteStatus) {
    const pendingKey = `${quote.id}:${status}`;
    setPendingMove(pendingKey);

    try {
      await moveQuoteStatusMutation.mutateAsync({
        quoteId: quote.id,
        status,
        version: quote.version
      });
      toast.success(
        t("commercial.documents.moveSuccess", {
          document: quote.quoteNumber,
          status: t(`quotes.list.status.${status}`)
        })
      );
    } catch (error) {
      toast.error(
        t("commercial.documents.moveError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    } finally {
      setPendingMove(null);
    }
  }

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
          <section className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">
                {t("commercial.quotes.pipelineTitle")}
              </h3>
              <p className="text-sm text-ink-soft">
                {t("commercial.quotes.pipelineDescription")}
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {quotesByStatus.map(({ status, quotes: quotesInStatus }) => (
                <Card key={status} className="rounded-3xl border-line/70">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline">
                        {t(`quotes.list.status.${status}`)}
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                        {quotesInStatus.length}
                      </span>
                    </div>

                    {quotesInStatus.length === 0 ? (
                      <p className="text-sm text-ink-soft">
                        {t("commercial.documents.emptyStatus")}
                      </p>
                    ) : (
                      quotesInStatus.map((quote) => (
                        <div
                          key={quote.id}
                          className="space-y-3 rounded-2xl border border-line/70 bg-paper/90 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-ink">
                                {quote.title}
                              </p>
                              <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                                {quote.quoteNumber}
                              </p>
                              <p className="mt-1 text-sm text-ink-soft">
                                {quote.recipientDisplayName}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-ink">
                              {formatMoney(quote.grandTotal, quote.currencyCode)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {getNextQuoteStatuses(quote.status).map((targetStatus) => {
                              const pendingKey = `${quote.id}:${targetStatus}`;

                              return (
                                <Button
                                  key={targetStatus}
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  disabled={
                                    moveQuoteStatusMutation.isPending &&
                                    pendingMove === pendingKey
                                  }
                                  onClick={() => {
                                    void handleMoveQuoteStatus(quote, targetStatus);
                                  }}
                                >
                                  {moveQuoteStatusMutation.isPending &&
                                  pendingMove === pendingKey
                                    ? t("commercial.documents.moving")
                                    : t("commercial.documents.moveTo", {
                                        status: t(
                                          `quotes.list.status.${targetStatus}`
                                        )
                                      })}
                                </Button>
                              );
                            })}

                            {quote.status === "approved" ? (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  navigate(
                                    `/commercial/invoices?sourceQuoteId=${quote.id}`
                                  );
                                }}
                              >
                                {t("commercial.quotes.createInvoiceAction")}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

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
