import { z } from "zod";

import type { TFunction } from "@operapyme/i18n";

export const customerSourceValues = [
  "manual",
  "website",
  "whatsapp",
  "walk-in",
  "repeat"
] as const;

export const customerStatusValues = [
  "active",
  "inactive",
  "archived"
] as const;

export function createCustomerFormSchema(t: TFunction<"backoffice">) {
  return z.object({
    displayName: z
      .string()
      .min(2, t("crm.customerForm.validation.displayNameMin"))
      .max(120, t("crm.customerForm.validation.displayNameMax")),
    contactName: z
      .string()
      .min(2, t("crm.customerForm.validation.contactNameMin"))
      .max(120, t("crm.customerForm.validation.contactNameMax")),
    legalName: z.string().max(160, t("crm.customerForm.validation.legalNameMax")),
    email: z
      .string()
      .trim()
      .max(120, t("crm.customerForm.validation.emailMax"))
      .refine((value) => value === "" || z.string().email().safeParse(value).success, {
        message: t("crm.customerForm.validation.email")
      }),
    whatsapp: z.string().max(30, t("crm.customerForm.validation.whatsappMax")),
    phone: z.string().max(30, t("crm.customerForm.validation.phoneMax")),
    documentId: z
      .string()
      .max(60, t("crm.customerForm.validation.documentIdMax")),
    isForeign: z.boolean(),
    passportId: z
      .string()
      .max(60, t("crm.customerForm.validation.passportIdMax")),
    websiteUrl: z
      .string()
      .trim()
      .max(160, t("crm.customerForm.validation.websiteUrlMax"))
      .refine((value) => value === "" || isWebsiteUrlValid(value), {
        message: t("crm.customerForm.validation.websiteUrl")
      }),
    source: z.enum(customerSourceValues),
    status: z.enum(customerStatusValues),
    notes: z.string().max(500, t("crm.customerForm.validation.notesMax"))
  }).superRefine((value, ctx) => {
    if (value.isForeign && value.passportId.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("crm.customerForm.validation.passportIdRequired"),
        path: ["passportId"]
      });
    }
  });
}

export type CustomerFormValues = z.infer<ReturnType<typeof createCustomerFormSchema>>;

function isWebsiteUrlValid(value: string) {
  if (/\s/.test(value)) {
    return false;
  }

  const normalizedValue =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;

  try {
    const url = new URL(normalizedValue);
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}
