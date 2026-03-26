import { z } from "zod";

import type { TFunction } from "@operapyme/i18n";

export const leadSourceValues = [
  "website",
  "whatsapp",
  "walk-in",
  "repeat"
] as const;

export function createLeadIntakeSchema(t: TFunction<"backoffice">) {
  return z.object({
    company: z
      .string()
      .min(2, t("crm.validation.companyMin"))
      .max(120, t("crm.validation.companyMax")),
    contactName: z
      .string()
      .min(2, t("crm.validation.contactNameMin"))
      .max(120, t("crm.validation.contactNameMax")),
    email: z.string().email(t("crm.validation.email")),
    whatsapp: z
      .string()
      .min(8, t("crm.validation.whatsappMin"))
      .max(30, t("crm.validation.whatsappMax")),
    source: z.enum(leadSourceValues),
    needSummary: z
      .string()
      .min(12, t("crm.validation.needSummaryMin"))
      .max(500, t("crm.validation.needSummaryMax"))
  });
}

export type LeadIntakeValues = z.infer<ReturnType<typeof createLeadIntakeSchema>>;
