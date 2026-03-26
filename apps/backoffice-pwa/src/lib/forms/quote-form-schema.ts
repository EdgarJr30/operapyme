import { z } from "zod";

import type { TFunction } from "@operapyme/i18n";

export const quoteStatusValues = [
  "draft",
  "sent",
  "viewed",
  "approved",
  "rejected",
  "expired"
] as const;

export function createQuoteFormSchema(t: TFunction<"backoffice">) {
  return z.object({
    customerId: z.string().min(1, t("quotes.form.validation.customerRequired")),
    title: z
      .string()
      .min(2, t("quotes.form.validation.titleMin"))
      .max(160, t("quotes.form.validation.titleMax")),
    status: z.enum(quoteStatusValues),
    currencyCode: z
      .string()
      .min(3, t("quotes.form.validation.currencyCode"))
      .max(3, t("quotes.form.validation.currencyCode")),
    subtotal: z.number().min(0, t("quotes.form.validation.subtotal")),
    discountTotal: z.number().min(0, t("quotes.form.validation.discountTotal")),
    taxTotal: z.number().min(0, t("quotes.form.validation.taxTotal")),
    validUntil: z.string().optional(),
    notes: z.string().max(500, t("quotes.form.validation.notesMax"))
  });
}

export type QuoteFormValues = z.infer<ReturnType<typeof createQuoteFormSchema>>;
