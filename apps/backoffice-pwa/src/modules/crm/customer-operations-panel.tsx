import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createCustomerFormSchema,
  customerSourceValues,
  customerStatusValues,
  type CustomerFormValues
} from "@/lib/forms/customer-form-schema";
import type { CustomerSummary } from "@/lib/supabase/backoffice-data";
import { useCustomerMutations } from "@/modules/crm/use-customer-mutations";

const createDefaultValues: CustomerFormValues = {
  customerCode: "",
  displayName: "",
  contactName: "",
  legalName: "",
  email: "",
  whatsapp: "",
  phone: "",
  documentId: "",
  source: "manual",
  status: "active",
  notes: ""
};

interface CustomerOperationsPanelProps {
  customers: CustomerSummary[];
}

export function CustomerOperationsPanel({
  customers
}: CustomerOperationsPanelProps) {
  const { t } = useTranslation("backoffice");
  const { createCustomerMutation, updateCustomerMutation } =
    useCustomerMutations();
  const customerFormSchema = createCustomerFormSchema(t);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const createForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: createDefaultValues
  });

  const updateForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: createDefaultValues
  });

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  useEffect(() => {
    if (!selectedCustomerId && customers[0]) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomer) {
      updateForm.reset(createDefaultValues);
      return;
    }

    updateForm.reset({
      customerCode: selectedCustomer.customerCode ?? "",
      displayName: selectedCustomer.displayName,
      contactName: selectedCustomer.contactName ?? "",
      legalName: selectedCustomer.legalName ?? "",
      email: selectedCustomer.email ?? "",
      whatsapp: selectedCustomer.whatsapp ?? "",
      phone: selectedCustomer.phone ?? "",
      documentId: selectedCustomer.documentId ?? "",
      source: toCustomerSource(selectedCustomer.source),
      status: selectedCustomer.status,
      notes: selectedCustomer.notes ?? ""
    });
  }, [selectedCustomer, updateForm]);

  async function onCreate(values: CustomerFormValues) {
    try {
      await createCustomerMutation.mutateAsync(values);
      toast.success(t("crm.customerForm.createSuccess"));
      createForm.reset(createDefaultValues);
    } catch (error) {
      toast.error(
        t("crm.customerForm.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  async function onUpdate(values: CustomerFormValues) {
    if (!selectedCustomer) {
      toast.error(t("crm.customerForm.noCustomerSelected"));
      return;
    }

    try {
      await updateCustomerMutation.mutateAsync({
        customerId: selectedCustomer.id,
        ...values
      });
      toast.success(t("crm.customerForm.updateSuccess"));
    } catch (error) {
      toast.error(
        t("crm.customerForm.updateError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t("crm.customerForm.createTitle")}</CardTitle>
          <CardDescription>
            {t("crm.customerForm.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreate)}
            noValidate
          >
            <CustomerFormFields form={createForm} idPrefix="create" />

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={createCustomerMutation.isPending}
              >
                {createCustomerMutation.isPending
                  ? t("crm.customerForm.createSubmitting")
                  : t("crm.customerForm.createAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  createForm.reset(createDefaultValues);
                }}
              >
                {t("crm.customerForm.resetAction")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-paper via-paper to-sage-200/50">
        <CardHeader>
          <CardTitle>{t("crm.customerForm.updateTitle")}</CardTitle>
          <CardDescription>
            {t("crm.customerForm.updateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-ink"
              htmlFor="customer-record"
            >
              {t("crm.customerForm.recordLabel")}
            </label>
            <Select
              id="customer-record"
              value={selectedCustomerId}
              onChange={(event) => {
                setSelectedCustomerId(event.target.value);
              }}
            >
              {customers.length === 0 ? (
                <option value="">{t("crm.customerForm.noCustomersOption")}</option>
              ) : (
                customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.displayName}
                  </option>
                ))
              )}
            </Select>
          </div>

          {customers.length === 0 ? (
            <FeedbackBanner tone="neutral">
              {t("crm.customerForm.noCustomersHint")}
            </FeedbackBanner>
          ) : (
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(onUpdate)}
              noValidate
            >
              <CustomerFormFields form={updateForm} idPrefix="update" />

              <Button
                type="submit"
                size="lg"
                disabled={updateCustomerMutation.isPending || !selectedCustomer}
              >
                {updateCustomerMutation.isPending
                  ? t("crm.customerForm.updateSubmitting")
                  : t("crm.customerForm.updateAction")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerFormFields({
  form,
  idPrefix
}: {
  form: ReturnType<typeof useForm<CustomerFormValues>>;
  idPrefix: string;
}) {
  const { t } = useTranslation("backoffice");
  const {
    formState: { errors },
    register
  } = form;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.displayNameLabel")}
          error={errors.displayName?.message}
          htmlFor={`${idPrefix}-customer-display-name`}
        >
          <Input
            id={`${idPrefix}-customer-display-name`}
            placeholder={t("crm.customerForm.displayNamePlaceholder")}
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
            {...register("contactName")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.customerCodeLabel")}
          error={errors.customerCode?.message}
          htmlFor={`${idPrefix}-customer-code`}
        >
          <Input
            id={`${idPrefix}-customer-code`}
            placeholder={t("crm.customerForm.customerCodePlaceholder")}
            {...register("customerCode")}
          />
        </Field>

        <Field
          label={t("crm.customerForm.legalNameLabel")}
          error={errors.legalName?.message}
          htmlFor={`${idPrefix}-customer-legal-name`}
        >
          <Input
            id={`${idPrefix}-customer-legal-name`}
            placeholder={t("crm.customerForm.legalNamePlaceholder")}
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
            {...register("whatsapp")}
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
            {...register("phone")}
          />
        </Field>

        <Field
          label={t("crm.customerForm.documentIdLabel")}
          error={errors.documentId?.message}
          htmlFor={`${idPrefix}-customer-document`}
        >
          <Input
            id={`${idPrefix}-customer-document`}
            placeholder={t("crm.customerForm.documentIdPlaceholder")}
            {...register("documentId")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("crm.customerForm.sourceLabel")}
          error={errors.source?.message}
          htmlFor={`${idPrefix}-customer-source`}
        >
          <Select id={`${idPrefix}-customer-source`} {...register("source")}>
            {customerSourceValues.map((source) => (
              <option key={source} value={source}>
                {t(getSourceTranslationKey(source))}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t("crm.customerForm.statusLabel")}
          error={errors.status?.message}
          htmlFor={`${idPrefix}-customer-status`}
        >
          <Select id={`${idPrefix}-customer-status`} {...register("status")}>
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
          {...register("notes")}
        />
      </Field>
    </>
  );
}

function getSourceTranslationKey(source: string) {
  switch (source) {
    case "manual":
      return "crm.recent.source.manual";
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

function toCustomerSource(source: string): CustomerFormValues["source"] {
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

function FeedbackBanner({
  children,
  tone
}: {
  children: ReactNode;
  tone: "error" | "success" | "neutral";
}) {
  const toneClass =
    tone === "error"
      ? "border-rose-300/80 bg-rose-100/80 text-rose-900"
      : tone === "success"
        ? "border-sage-300/80 bg-sage-100/80 text-ink"
        : "border-line/70 bg-paper/70 text-ink-soft";

  return <p className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{children}</p>;
}

interface FieldProps {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}

function Field({ children, error, htmlFor, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-peach-400">{error}</p> : null}
    </div>
  );
}
