import type { ReactNode } from "react";

import type { UseFormReturn } from "react-hook-form";

import { useTranslation } from "@operapyme/i18n";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildOperationalAutofillProps } from "@/lib/forms/autofill";
import {
  customerSourceValues,
  customerStatusValues,
  type CustomerFormValues
} from "@/lib/forms/customer-form-schema";
import type { CustomerSummary, NcfType } from "@/lib/supabase/backoffice-data";

export const customerFormDefaultValues: CustomerFormValues = {
  displayName: "",
  contactName: "",
  legalName: "",
  email: "",
  whatsapp: "",
  phone: "",
  documentId: "",
  isForeign: false,
  passportId: "",
  websiteUrl: "",
  ncfTypeId: "",
  source: "manual",
  status: "active",
  notes: ""
};

export function mapCustomerToFormValues(
  customer: CustomerSummary
): CustomerFormValues {
  return {
    displayName: customer.displayName,
    contactName: customer.contactName ?? "",
    legalName: customer.legalName ?? "",
    email: customer.email ?? "",
    whatsapp: customer.whatsapp ?? "",
    phone: customer.phone ?? "",
    documentId: customer.documentId ?? "",
    isForeign: customer.isForeign,
    passportId: customer.passportId ?? "",
    websiteUrl: customer.websiteUrl ?? "",
    ncfTypeId: customer.ncfTypeId ?? "",
    source: toCustomerSource(customer.source),
    status: customer.status,
    notes: customer.notes ?? ""
  };
}

export function getCustomerSourceTranslationKey(source: string) {
  switch (source) {
    case "website":
      return "crm.recent.source.website";
    case "whatsapp":
      return "crm.recent.source.whatsapp";
    case "walk-in":
      return "crm.recent.source.walkIn";
    case "repeat":
      return "crm.recent.source.repeat";
    default:
      return "crm.recent.source.manual";
  }
}

export function toCustomerSource(
  source: string
): CustomerFormValues["source"] {
  switch (source) {
    case "website":
    case "whatsapp":
    case "walk-in":
    case "repeat":
    case "manual":
      return source;
    default:
      return "manual";
  }
}

export function CustomerFormFields({
  form,
  idPrefix,
  customerCode,
  ncfTypes = []
}: {
  form: UseFormReturn<CustomerFormValues>;
  idPrefix: string;
  customerCode?: string | null;
  ncfTypes?: NcfType[];
}) {
  const { t } = useTranslation("backoffice");
  const {
    formState: { errors },
    register,
    watch
  } = form;
  const autofillSection = `section-${idPrefix}-customer`;
  const isForeign = watch("isForeign");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.customerCodeLabel")}
          htmlFor={`${idPrefix}-customer-code`}
          hint={
            customerCode
              ? t("crm.customerForm.customerCodeLockedHint")
              : t("crm.customerForm.customerCodeAutoHint")
          }
        >
          <Input
            id={`${idPrefix}-customer-code`}
            value={customerCode ?? t("crm.customerForm.customerCodePending")}
            readOnly
            disabled
            {...buildOperationalAutofillProps("off")}
          />
        </Field>

        <Field
          label={t("crm.customerForm.displayNameLabel")}
          error={errors.displayName?.message}
          htmlFor={`${idPrefix}-customer-display-name`}
        >
          <Input
            id={`${idPrefix}-customer-display-name`}
            placeholder={t("crm.customerForm.displayNamePlaceholder")}
            {...buildOperationalAutofillProps(`${autofillSection} organization`)}
            {...register("displayName")}
          />
        </Field>

        <Field
          label={t("crm.customerForm.contactNameLabel")}
          error={errors.contactName?.message}
          htmlFor={`${idPrefix}-customer-contact-name`}
        >
          <Input
            id={`${idPrefix}-customer-contact-name`}
            placeholder={t("crm.customerForm.contactNamePlaceholder")}
            {...buildOperationalAutofillProps(`${autofillSection} name`)}
            {...register("contactName")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.legalNameLabel")}
          error={errors.legalName?.message}
          htmlFor={`${idPrefix}-customer-legal-name`}
        >
          <Input
            id={`${idPrefix}-customer-legal-name`}
            placeholder={t("crm.customerForm.legalNamePlaceholder")}
            {...buildOperationalAutofillProps(`${autofillSection} organization`)}
            {...register("legalName")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.emailLabel")}
          error={errors.email?.message}
          htmlFor={`${idPrefix}-customer-email`}
        >
          <Input
            id={`${idPrefix}-customer-email`}
            type="email"
            placeholder={t("crm.customerForm.emailPlaceholder")}
            {...buildOperationalAutofillProps(`${autofillSection} email`)}
            {...register("email")}
          />
        </Field>

        <Field
          label={t("crm.customerForm.whatsappLabel")}
          error={errors.whatsapp?.message}
          htmlFor={`${idPrefix}-customer-whatsapp`}
        >
          <Input
            id={`${idPrefix}-customer-whatsapp`}
            placeholder={t("crm.customerForm.whatsappPlaceholder")}
            {...buildOperationalAutofillProps(`${autofillSection} tel`)}
            {...register("whatsapp")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.documentIdLabel")}
          error={errors.documentId?.message}
          htmlFor={`${idPrefix}-customer-document`}
        >
          <Input
            id={`${idPrefix}-customer-document`}
            placeholder={t("crm.customerForm.documentIdPlaceholder")}
            {...buildOperationalAutofillProps("off")}
            {...register("documentId")}
          />
        </Field>

        <Field
          label={t("crm.customerForm.websiteUrlLabel")}
          error={errors.websiteUrl?.message}
          htmlFor={`${idPrefix}-customer-website`}
        >
          <Input
            id={`${idPrefix}-customer-website`}
            placeholder={t("crm.customerForm.websiteUrlPlaceholder")}
            {...buildOperationalAutofillProps("url")}
            {...register("websiteUrl")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.phoneLabel")}
          error={errors.phone?.message}
          htmlFor={`${idPrefix}-customer-phone`}
        >
          <Input
            id={`${idPrefix}-customer-phone`}
            placeholder={t("crm.customerForm.phonePlaceholder")}
            {...buildOperationalAutofillProps(`${autofillSection} tel-national`)}
            {...register("phone")}
          />
        </Field>
      </div>

      <label
        htmlFor={`${idPrefix}-customer-is-foreign`}
        className="inline-flex cursor-pointer items-center gap-2"
      >
        <input
          id={`${idPrefix}-customer-is-foreign`}
          type="checkbox"
          className="size-3.5 rounded border border-line-strong text-brand focus:ring-2 focus:ring-brand/30"
          {...register("isForeign")}
        />
        <span className="text-xs text-ink-soft">
          {t("crm.customerForm.isForeignLabel")}
        </span>
      </label>

      {isForeign ? (
        <Field
          label={t("crm.customerForm.passportIdLabel")}
          error={errors.passportId?.message}
          htmlFor={`${idPrefix}-customer-passport`}
        >
          <Input
            id={`${idPrefix}-customer-passport`}
            placeholder={t("crm.customerForm.passportIdPlaceholder")}
            {...buildOperationalAutofillProps("off")}
            {...register("passportId")}
          />
        </Field>
      ) : null}

      {ncfTypes.length > 0 ? (
        <Field
          label={t("crm.customerForm.ncfTypeLabel")}
          hint={t("crm.customerForm.ncfTypeHint")}
          htmlFor={`${idPrefix}-customer-ncf-type`}
        >
          <Select
            id={`${idPrefix}-customer-ncf-type`}
            {...buildOperationalAutofillProps("off")}
            {...register("ncfTypeId")}
          >
            <option value="">{t("crm.customerForm.ncfTypeEmpty")}</option>
            {ncfTypes.map((ncfType) => (
              <option key={ncfType.id} value={ncfType.id}>
                {ncfType.code} - {ncfType.label}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.sourceLabel")}
          error={errors.source?.message}
          htmlFor={`${idPrefix}-customer-source`}
        >
          <Select
            id={`${idPrefix}-customer-source`}
            {...buildOperationalAutofillProps("off")}
            {...register("source")}
          >
            {customerSourceValues.map((source) => (
              <option key={source} value={source}>
                {t(getCustomerSourceTranslationKey(source))}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t("crm.customerForm.statusLabel")}
          error={errors.status?.message}
          htmlFor={`${idPrefix}-customer-status`}
        >
          <Select
            id={`${idPrefix}-customer-status`}
            {...buildOperationalAutofillProps("off")}
            {...register("status")}
          >
            {customerStatusValues.map((status) => (
              <option key={status} value={status}>
                {t(`crm.recent.customerStatus.${status}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label={t("crm.customerForm.notesLabel")}
        error={errors.notes?.message}
        htmlFor={`${idPrefix}-customer-notes`}
      >
        <Textarea
          id={`${idPrefix}-customer-notes`}
          placeholder={t("crm.customerForm.notesPlaceholder")}
          {...buildOperationalAutofillProps("off")}
          {...register("notes")}
        />
      </Field>
    </>
  );
}

interface FieldProps {
  children: ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
}

function Field({ children, error, hint, htmlFor, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {!error && hint ? <p className="text-sm text-ink-soft">{hint}</p> : null}
      {error ? <p className="text-sm text-peach-400">{error}</p> : null}
    </div>
  );
}
