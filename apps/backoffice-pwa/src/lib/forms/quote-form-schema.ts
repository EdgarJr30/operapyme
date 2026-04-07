import { z } from "zod";

import type { TFunction } from "@operapyme/i18n";

import {
  MAX_QUOTE_LINE_DISCOUNT_PERCENT,
  calculateQuoteDocumentDiscountBase,
  calculateQuoteLineSubtotal
} from "@/lib/forms/quote-line-discounts";

export const quoteRecipientKindValues = [
  "customer",
  "lead",
  "ad_hoc"
] as const;

export const quoteStatusValues = [
  "draft",
  "sent",
  "viewed",
  "approved",
  "rejected",
  "expired"
] as const;

export function createQuoteFormSchema(t: TFunction<"backoffice">) {
  const lineItemSchema = z.object({
    catalogItemId: z.string().optional(),
    itemCode: z.string().max(60, t("quotes.form.validation.itemCodeMax")),
    itemName: z
      .string()
      .min(2, t("quotes.form.validation.lineItemNameMin"))
      .max(160, t("quotes.form.validation.lineItemNameMax")),
    itemDescription: z
      .string()
      .max(500, t("quotes.form.validation.lineItemDescriptionMax")),
    quantity: z.number().positive(t("quotes.form.validation.quantity")),
    unitLabel: z
      .string()
      .max(40, t("quotes.form.validation.unitLabelMax")),
    unitPrice: z.number().min(0, t("quotes.form.validation.unitPrice")),
    discountPercent: z
      .number()
      .min(0, t("quotes.form.validation.discountPercent"))
      .max(
        MAX_QUOTE_LINE_DISCOUNT_PERCENT,
        t("quotes.form.validation.discountPercentMax")
      ),
    discountTotal: z
      .number()
      .min(0, t("quotes.form.validation.discountTotal")),
    taxTotal: z.number().min(0, t("quotes.form.validation.taxTotal"))
  });

  return z
    .object({
      recipientKind: z.enum(quoteRecipientKindValues),
      customerId: z.string().optional(),
      leadId: z.string().optional(),
      recipientDisplayName: z
        .string()
        .min(2, t("quotes.form.validation.recipientDisplayNameMin"))
        .max(120, t("quotes.form.validation.recipientDisplayNameMax")),
      recipientContactName: z
        .string()
        .max(120, t("quotes.form.validation.recipientContactNameMax")),
      recipientEmail: z
        .string()
        .max(120, t("quotes.form.validation.recipientEmailMax"))
        .refine(
          (value) =>
            value.trim().length === 0 || z.email().safeParse(value).success,
          t("quotes.form.validation.recipientEmail")
        ),
      recipientWhatsApp: z
        .string()
        .max(30, t("quotes.form.validation.recipientWhatsAppMax")),
      recipientPhone: z
        .string()
        .max(30, t("quotes.form.validation.recipientPhoneMax")),
      title: z
        .string()
        .min(2, t("quotes.form.validation.titleMin"))
        .max(160, t("quotes.form.validation.titleMax")),
      status: z.enum(quoteStatusValues),
      currencyCode: z
        .string()
        .min(3, t("quotes.form.validation.currencyCode"))
        .max(3, t("quotes.form.validation.currencyCode")),
      issuedOn: z.string().optional(),
      documentDiscountPercent: z
        .number()
        .min(0, t("quotes.form.validation.documentDiscountPercent"))
        .max(
          MAX_QUOTE_LINE_DISCOUNT_PERCENT,
          t("quotes.form.validation.documentDiscountPercentMax")
        ),
      documentDiscountTotal: z
        .number()
        .min(0, t("quotes.form.validation.documentDiscountTotal")),
      validUntil: z.string().optional(),
      notes: z.string().max(500, t("quotes.form.validation.notesMax")),
      lineItems: z
        .array(lineItemSchema)
        .min(1, t("quotes.form.validation.lineItemsMin"))
    })
    .superRefine((values, context) => {
      if (values.recipientKind === "customer" && !values.customerId?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("quotes.form.validation.customerRequired"),
          path: ["customerId"]
        });
      }

      if (values.recipientKind === "lead" && !values.leadId?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("quotes.form.validation.leadRequired"),
          path: ["leadId"]
        });
      }

      values.lineItems.forEach((lineItem, index) => {
        const lineSubtotal = calculateQuoteLineSubtotal(lineItem);

        if (lineItem.discountTotal > lineSubtotal) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("quotes.form.validation.discountTotalExceeded"),
            path: ["lineItems", index, "discountTotal"]
          });
        }
      });

      if (
        values.documentDiscountTotal >
        calculateQuoteDocumentDiscountBase(values.lineItems)
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("quotes.form.validation.documentDiscountTotalExceeded"),
          path: ["documentDiscountTotal"]
        });
      }
    });
}

export type QuoteFormValues = z.infer<ReturnType<typeof createQuoteFormSchema>>;
