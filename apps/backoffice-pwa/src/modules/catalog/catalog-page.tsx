import { Boxes, Search, Tag } from "lucide-react";

import { useMemo, useState, type ReactNode } from "react";

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
      [item.name, item.itemCode, item.category, item.description].some((value) =>
        value?.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [data, searchTerm]);
  const catalogSummary = useMemo(() => {
    const items = data ?? [];

    return {
      total: items.length,
      publicItems: items.filter((item) => item.visibility === "public").length,
      onRequest: items.filter((item) => item.pricingMode === "on_request").length
    };
  }, [data]);
  const hasSearchTerm = searchTerm.trim().length > 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <div className="rounded-3xl border border-line/70 bg-linear-to-br from-paper via-paper to-sky-200/45 p-5 shadow-panel sm:p-6">
          <div className="space-y-5">
            <div className="space-y-3">
              <span className="inline-flex min-h-9 items-center rounded-full border border-line/70 bg-paper/85 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {t("catalog.header.eyebrow")}
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {t("catalog.header.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
                  {t("catalog.header.description")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill tone="info">
                {t("catalog.overview.totalItems", {
                  count: catalogSummary.total
                })}
              </StatusPill>
              <StatusPill tone="success">
                {t("catalog.overview.publicItems", {
                  count: catalogSummary.publicItems
                })}
              </StatusPill>
              <StatusPill tone="warning">
                {t("catalog.overview.onRequestItems", {
                  count: catalogSummary.onRequest
                })}
              </StatusPill>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#catalog-editor"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
              >
                {t("catalog.actions.manageItems")}
              </a>
              <a
                href="#catalog-list"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-5 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
              >
                {t("catalog.actions.reviewList")}
              </a>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("catalog.overview.title")}</CardTitle>
            <CardDescription>{t("catalog.overview.description")}</CardDescription>
          </CardHeader>
          <CardContent>
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
            ) : catalogSummary.total > 0 ? (
              <div className="space-y-3">
                <SummaryRow
                  icon={<Boxes className="size-4" aria-hidden="true" />}
                  label={t("catalog.overview.totalLabel")}
                  value={String(catalogSummary.total)}
                />
                <SummaryRow
                  icon={<Tag className="size-4" aria-hidden="true" />}
                  label={t("catalog.overview.publicLabel")}
                  value={String(catalogSummary.publicItems)}
                />
                <SummaryRow
                  icon={<Search className="size-4" aria-hidden="true" />}
                  label={t("catalog.overview.onRequestLabel")}
                  value={String(catalogSummary.onRequest)}
                />
              </div>
            ) : (
              <EmptyPanel
                title={t("catalog.overview.emptyTitle")}
                description={t("catalog.overview.emptyDescription")}
              />
            )}
          </CardContent>
        </Card>
      </section>

      <div id="catalog-editor">
        <CatalogOperationsPanel items={data ?? []} />
      </div>

      <Card id="catalog-list">
        <CardHeader>
          <CardTitle>{t("catalog.list.title")}</CardTitle>
          <CardDescription>{t("catalog.list.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="catalog-search" className="text-sm font-medium text-ink">
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
            <p className="text-sm text-ink-soft">{t("catalog.search.description")}</p>
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
  return pricingMode === "fixed" ? "success" : "warning";
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
