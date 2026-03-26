import { Eye, EyeOff, FileStack, Wrench } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";

const products = [
  {
    id: "ruggedTabletKit",
    categoryKey: "ruggedTabletKitCategory",
    visibility: "public",
    tone: "success" as const,
    showPrice: true,
    price: "$1,890"
  },
  {
    id: "screenRepair",
    categoryKey: "screenRepairCategory",
    visibility: "private",
    tone: "warning" as const,
    showPrice: false,
    priceKey: "onRequest",
    isRepair: true
  },
  {
    id: "hydraulicFilterSet",
    categoryKey: "hydraulicFilterSetCategory",
    visibility: "public",
    tone: "info" as const,
    showPrice: false,
    priceKey: "contactSales"
  }
];

const categoryRules = [
  {
    titleKey: "catalog.vertical.computersTitle",
    textKey: "catalog.vertical.computersText"
  },
  {
    titleKey: "catalog.vertical.repairsTitle",
    textKey: "catalog.vertical.repairsText"
  },
  {
    titleKey: "catalog.vertical.industrialTitle",
    textKey: "catalog.vertical.industrialText"
  }
];

export function CatalogPage() {
  const { t } = useTranslation("backoffice");

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

      <Card>
        <CardHeader>
          <CardTitle>{t("catalog.search.title")}</CardTitle>
          <CardDescription>
            {t("catalog.search.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder={t("catalog.search.placeholder")} />
          <div className="grid gap-4 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-[26px] border border-line/70 bg-paper/70 p-4"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex size-14 items-center justify-center rounded-[20px] bg-sand-strong">
                    {product.isRepair ? (
                      <Wrench className="size-5 text-ink" />
                    ) : (
                      <FileStack className="size-5 text-ink" />
                    )}
                  </div>
                  <StatusPill tone={product.tone}>
                    {t(`catalog.visibility.${product.visibility}`)}
                  </StatusPill>
                </div>

                <p className="text-base font-semibold text-ink">
                  {t(`catalog.products.${product.id}Name`)}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {t(`catalog.products.${product.categoryKey}`)}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
                  {product.showPrice ? (
                    <>
                      <Eye className="size-4" />
                      <span>{product.price}</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-4" />
                      <span>{t(`catalog.pricing.${product.priceKey}`)}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("catalog.vertical.title")}</CardTitle>
            <CardDescription>
              {t("catalog.vertical.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryRules.map((rule) => (
              <div
                key={rule.titleKey}
                className="rounded-[22px] border border-line/70 bg-paper/70 p-4"
              >
                <p className="text-sm font-semibold text-ink">
                  {t(rule.titleKey)}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t(rule.textKey)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-paper via-paper to-peach-200/50">
          <CardHeader>
            <CardTitle>{t("catalog.rules.title")}</CardTitle>
            <CardDescription>
              {t("catalog.rules.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-6 text-ink-soft">
              <li>{t("catalog.rules.calmCards")}</li>
              <li>{t("catalog.rules.obviousVisibility")}</li>
              <li>{t("catalog.rules.technicalFiles")}</li>
              <li>{t("catalog.rules.searchSpeed")}</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
