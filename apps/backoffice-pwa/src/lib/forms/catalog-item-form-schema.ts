import { z } from "zod";

import type { TFunction } from "@operapyme/i18n";

export const catalogItemKindValues = [
  "product",
  "service"
] as const;

export const catalogItemVisibilityValues = [
  "public",
  "private"
] as const;

export const catalogItemPricingModeValues = [
  "fixed",
  "on_request"
] as const;

export const catalogItemStatusValues = [
  "active",
  "draft",
  "archived"
] as const;

export function createCatalogItemFormSchema(t: TFunction<"backoffice">) {
  return z
    .object({
      itemCode: z.string().max(40, t("catalog.form.validation.itemCodeMax")),
      name: z
        .string()
        .min(2, t("catalog.form.validation.nameMin"))
        .max(120, t("catalog.form.validation.nameMax")),
      category: z.string().max(80, t("catalog.form.validation.categoryMax")),
      description: z
        .string()
        .max(2000, t("catalog.form.validation.descriptionMax")),
      kind: z.enum(catalogItemKindValues),
      visibility: z.enum(catalogItemVisibilityValues),
      pricingMode: z.enum(catalogItemPricingModeValues),
      currencyCode: z
        .string()
        .trim()
        .min(3, t("catalog.form.validation.currencyCode"))
        .max(3, t("catalog.form.validation.currencyCode")),
      unitPrice: z.number().nullable(),
      status: z.enum(catalogItemStatusValues),
      notes: z.string().max(500, t("catalog.form.validation.notesMax"))
    })
    .superRefine((values, context) => {
      if (values.pricingMode === "fixed" && values.unitPrice === null) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unitPrice"],
          message: t("catalog.form.validation.unitPriceRequired")
        });
      }

      if (values.unitPrice !== null && values.unitPrice < 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unitPrice"],
          message: t("catalog.form.validation.unitPriceMin")
        });
      }
    });
}

export type CatalogItemFormValues = z.infer<
  ReturnType<typeof createCatalogItemFormSchema>
>;
