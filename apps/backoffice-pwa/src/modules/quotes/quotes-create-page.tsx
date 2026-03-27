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
import { QuoteCreateWorkspace } from "@/modules/quotes/quote-operations-panel";

export function QuotesCreatePage() {
  const { t } = useTranslation("backoffice");
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: catalogItems = [] } = useCatalogItemsData();

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-line/70 bg-linear-to-br from-paper via-paper to-butter-200/45 p-5 shadow-panel sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex min-h-8 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              {t("quotes.subroutes.createEyebrow")}
            </span>
            <h1 className="text-[28px] font-semibold tracking-tight text-ink sm:text-[32px]">
              {t("quotes.subroutes.createTitle")}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-ink-soft sm:text-base">
              {t("quotes.subroutes.createDescription")}
            </p>
          </div>

          <Link
            to="/quotes/manage"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/90 px-6 text-base font-medium text-ink shadow-panel transition hover:bg-sand-strong/80"
          >
            {t("quotes.actions.reviewQuotes")}
          </Link>
        </div>
      </section>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>{t("quotes.form.workflowTitle")}</CardTitle>
          <CardDescription>{t("quotes.form.workflowDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-ink-soft">
          <p>{t("quotes.form.workflowRecipientHint")}</p>
          <p>{t("quotes.form.workflowDocumentHint")}</p>
          <p>{t("quotes.form.workflowItemsHint")}</p>
        </CardContent>
      </Card>

      <QuoteCreateWorkspace
        catalogItems={catalogItems}
        customers={customers}
        leads={leads}
        quotes={[]}
      />
    </div>
  );
}
