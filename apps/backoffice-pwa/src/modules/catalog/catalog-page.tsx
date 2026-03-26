import { Boxes, Search, Sparkles, Tag } from "lucide-react";

import {
  type ReactNode,
  useMemo,
  useState
} from "react";

import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import type {
  CatalogItemPricingMode,
  CatalogItemStatus,
  CatalogItemSummary
} from "@/lib/supabase/backoffice-data";
import { CatalogOperationsPanel } from "@/modules/catalog/catalog-operations-panel";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";

const categoryRules = [
  {
    icon: Boxes,
    titleKey: "catalog.rules.captureTitle",
    textKey: "catalog.rules.captureText"
  },
  {
    icon: Tag,
    titleKey: "catalog.rules.pricingTitle",
    textKey: "catalog.rules.pricingText"
  },
  {
    icon: Sparkles,
    titleKey: "catalog.rules.visibilityTitle",
    textKey: "catalog.rules.visibilityText"
  }
];

export function CatalogPage() {
  const { t } = useTranslation("backoffice");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data,
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useCatalogItemsData();
  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return data ?? [];
    }

    return (data ?? []).filter((item) =>
      [
        item.name,
        item.itemCode,
        item.category,
        item.description
      ].some((value) => value?.toLowerCase().includes(normalizedSearch))
    );
  }, [data, searchTerm]);
  const hasSearchTerm = searchTerm.trim().length > 0;

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("catalog.header.eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {t("catalog.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-ink-soft">
          {t("catalog.header.description")}
        </p>
      </section>

      <CatalogOperationsPanel items={data ?? []} />

      <Card>
        <CardHeader>
          <CardTitle>{t("catalog.list.title")}</CardTitle>
          <CardDescription>
            {t("catalog.list.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="catalog-search"
              className="text-sm font-medium text-ink"
            >
              {t("catalog.search.title")}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              />
              <Input
                id="catalog-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-11"
                placeholder={t("catalog.search.placeholder")}
              />
            </div>
            <p className="text-sm text-ink-soft">
              {t("catalog.search.description")}
            </p>
          </div>

          {!hasTenantContext ? (
            <EmptyPanel
              title={t("catalog.list.noTenantTitle")}
              description={t("catalog.list.noTenantDescription")}
            />
          ) : isLoading ? (
            <EmptyPanel
              title={t("catalog.list.loadingTitle")}
              description={t("catalog.list.loadingDescription")}
            />
          ) : isError ? (
            <EmptyPanel
              title={t("catalog.list.errorTitle")}
              description={t("catalog.list.errorDescription", {
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
                  {t("catalog.list.retryAction")}
                </Button>
              }
            />
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredItems.map((item) => (
                <CatalogItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : hasSearchTerm && (data ?? []).length > 0 ? (
            <EmptyPanel
              title={t("catalog.list.searchEmptyTitle")}
              description={t("catalog.list.searchEmptyDescription")}
            />
          ) : (
            <EmptyPanel
              title={t("catalog.list.emptyTitle")}
              description={t("catalog.list.emptyDescription")}
            />
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("catalog.rules.title")}</CardTitle>
            <CardDescription>
              {t("catalog.rules.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryRules.map(({ icon: Icon, titleKey, textKey }) => (
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

        <Card className="bg-linear-to-br from-paper via-paper to-sky-200/50">
          <CardHeader>
            <CardTitle>{t("catalog.guidelines.title")}</CardTitle>
            <CardDescription>
              {t("catalog.guidelines.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-6 text-ink-soft">
              <li>{t("catalog.guidelines.mobileCapture")}</li>
              <li>{t("catalog.guidelines.sharedLanguage")}</li>
              <li>{t("catalog.guidelines.noInventory")}</li>
              <li>{t("catalog.guidelines.readyForQuotes")}</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CatalogItemCard({ item }: { item: CatalogItemSummary }) {
  const { t } = useTranslation("backoffice");

  return (
    <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{item.name}</p>
          <p className="text-sm text-ink-soft">
            {item.itemCode || t("catalog.list.noCode")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={getStatusTone(item.status)}>
            {t(`catalog.status.${item.status}`)}
          </StatusPill>
          <StatusPill tone={item.visibility === "public" ? "success" : "neutral"}>
            {t(`catalog.visibility.${item.visibility}`)}
          </StatusPill>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-ink-soft">
        {item.category || t("catalog.list.noCategory")}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusPill tone="info">{t(`catalog.kind.${item.kind}`)}</StatusPill>
        <StatusPill tone={getPricingTone(item.pricingMode)}>
          {formatCatalogPrice(item, t)}
        </StatusPill>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-soft">
        {item.description || item.notes || t("catalog.list.noDescription")}
      </p>
    </div>
  );
}

function EmptyPanel({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
      {action}
    </div>
  );
}

function getStatusTone(status: CatalogItemStatus) {
  switch (status) {
    case "active":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "neutral";
  }
}

function getPricingTone(pricingMode: CatalogItemPricingMode) {
  return pricingMode === "fixed" ? "info" : "warning";
}

function formatCatalogPrice(
  item: CatalogItemSummary,
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  if (item.pricingMode === "on_request" || item.unitPrice === null) {
    return t("catalog.pricing.onRequest");
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: item.currencyCode,
      maximumFractionDigits: 2
    }).format(item.unitPrice);
  } catch {
    return `${item.currencyCode} ${item.unitPrice.toFixed(2)}`;
  }
}
