import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";

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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createQuoteFormSchema,
  quoteRecipientKindValues,
  quoteStatusValues,
  type QuoteFormValues
} from "@/lib/forms/quote-form-schema";
import type {
  CatalogItemSummary,
  CustomerSummary,
  LeadSummary,
  QuoteDetail,
  QuoteRecipientKind,
  QuoteSummary
} from "@/lib/supabase/backoffice-data";
import { useQuoteDetailData } from "@/modules/quotes/use-quote-detail-data";
import { useQuoteMutations } from "@/modules/quotes/use-quote-mutations";

interface QuoteOperationsPanelProps {
  customers: CustomerSummary[];
  leads: LeadSummary[];
  catalogItems: CatalogItemSummary[];
  quotes: QuoteSummary[];
}

export function QuoteOperationsPanel({
  customers,
  leads,
  catalogItems,
  quotes
}: QuoteOperationsPanelProps) {
  const { t } = useTranslation("backoffice");
  const { createQuoteMutation, updateQuoteMutation } = useQuoteMutations();
  const quoteFormSchema = createQuoteFormSchema(t);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [createFeedback, setCreateFeedback] = useState<string | null>(null);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  const createForm = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: buildCreateDefaults(customers, leads)
  });

  const updateForm = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: buildEmptyQuoteDefaults()
  });

  const selectedQuoteSummary = useMemo(
    () => quotes.find((quote) => quote.id === selectedQuoteId) ?? null,
    [quotes, selectedQuoteId]
  );

  const selectedQuoteDetailQuery = useQuoteDetailData(selectedQuoteId || null);
  const selectedQuoteDetail = selectedQuoteDetailQuery.data ?? null;

  useEffect(() => {
    if (!selectedQuoteId && quotes[0]) {
      setSelectedQuoteId(quotes[0].id);
    }
  }, [quotes, selectedQuoteId]);

  useEffect(() => {
    if (!selectedQuoteDetail) {
      return;
    }

    updateForm.reset(buildUpdateDefaults(selectedQuoteDetail));
  }, [selectedQuoteDetail, updateForm]);

  useEffect(() => {
    if (quotes.length === 0) {
      updateForm.reset(buildEmptyQuoteDefaults());
      return;
    }

    if (!selectedQuoteSummary) {
      return;
    }

    if (!selectedQuoteDetailQuery.isLoading && !selectedQuoteDetail) {
      updateForm.reset(buildEmptyQuoteDefaults());
    }
  }, [
    quotes.length,
    selectedQuoteDetail,
    selectedQuoteDetailQuery.isLoading,
    selectedQuoteSummary,
    updateForm
  ]);

  async function onCreate(values: QuoteFormValues) {
    setCreateFeedback(null);

    try {
      const createdQuote = await createQuoteMutation.mutateAsync(toQuotePayload(values));
      setCreateFeedback(
        t("quotes.form.createSuccess", { quoteNumber: createdQuote.quoteNumber })
      );
      createForm.reset(buildCreateDefaults(customers, leads));
      setSelectedQuoteId(createdQuote.id);
    } catch (error) {
      setCreateFeedback(
        t("quotes.form.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  async function onUpdate(values: QuoteFormValues) {
    if (!selectedQuoteDetail) {
      setUpdateFeedback(t("quotes.form.noQuoteSelected"));
      return;
    }

    setUpdateFeedback(null);

    try {
      await updateQuoteMutation.mutateAsync({
        quoteId: selectedQuoteDetail.id,
        version: selectedQuoteDetail.version,
        ...toQuotePayload(values)
      });
      setUpdateFeedback(t("quotes.form.updateSuccess"));
    } catch (error) {
      setUpdateFeedback(
        t("quotes.form.updateError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t("quotes.form.createTitle")}</CardTitle>
          <CardDescription>
            {t("quotes.form.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreate)}
            noValidate
          >
            <QuoteFormFields
              catalogItems={catalogItems}
              customers={customers}
              leads={leads}
              form={createForm}
              idPrefix="create"
              quoteNumber={null}
            />

            {createFeedback ? (
              <FeedbackBanner
                tone={createQuoteMutation.isError ? "error" : "success"}
              >
                {createFeedback}
              </FeedbackBanner>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={createQuoteMutation.isPending}
              >
                {createQuoteMutation.isPending
                  ? t("quotes.form.createSubmitting")
                  : t("quotes.form.createAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  createForm.reset(buildCreateDefaults(customers, leads));
                  setCreateFeedback(null);
                }}
              >
                {t("quotes.form.resetAction")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-paper via-paper to-butter-200/65">
        <CardHeader>
          <CardTitle>{t("quotes.form.updateTitle")}</CardTitle>
          <CardDescription>
            {t("quotes.form.updateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="quote-record">
              {t("quotes.form.recordLabel")}
            </label>
            <Select
              id="quote-record"
              value={selectedQuoteId}
              onChange={(event) => {
                setSelectedQuoteId(event.target.value);
                setUpdateFeedback(null);
              }}
            >
              {quotes.length === 0 ? (
                <option value="">{t("quotes.form.noQuotesOption")}</option>
              ) : (
                quotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.quoteNumber}
                  </option>
                ))
              )}
            </Select>
          </div>

          {quotes.length === 0 ? (
            <FeedbackBanner tone="neutral">
              {t("quotes.form.noQuotesHint")}
            </FeedbackBanner>
          ) : selectedQuoteDetailQuery.isLoading ? (
            <FeedbackBanner tone="neutral">
              {t("quotes.form.loadingDetailHint")}
            </FeedbackBanner>
          ) : selectedQuoteDetailQuery.isError ? (
            <FeedbackBanner tone="error">
              {t("quotes.form.loadingDetailError", {
                message:
                  selectedQuoteDetailQuery.error instanceof Error
                    ? selectedQuoteDetailQuery.error.message
                    : ""
              })}
            </FeedbackBanner>
          ) : (
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(onUpdate)}
              noValidate
            >
              <QuoteFormFields
                catalogItems={catalogItems}
                customers={customers}
                leads={leads}
                form={updateForm}
                idPrefix="update"
                quoteNumber={selectedQuoteDetail?.quoteNumber ?? null}
              />

              {selectedQuoteDetail ? (
                <p className="text-sm text-ink-soft">
                  {t("quotes.form.versionHint", {
                    version: selectedQuoteDetail.version
                  })}
                </p>
              ) : null}

              {updateFeedback ? (
                <FeedbackBanner
                  tone={updateQuoteMutation.isError ? "error" : "success"}
                >
                  {updateFeedback}
                </FeedbackBanner>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={updateQuoteMutation.isPending || !selectedQuoteDetail}
              >
                {updateQuoteMutation.isPending
                  ? t("quotes.form.updateSubmitting")
                  : t("quotes.form.updateAction")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuoteFormFields({
  catalogItems,
  customers,
  leads,
  form,
  idPrefix,
  quoteNumber
}: {
  catalogItems: CatalogItemSummary[];
  customers: CustomerSummary[];
  leads: LeadSummary[];
  form: UseFormReturn<QuoteFormValues>;
  idPrefix: string;
  quoteNumber?: string | null;
}) {
  const { t } = useTranslation("backoffice");
  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems"
  });

  const recipientKind = watch("recipientKind");
  const customerId = watch("customerId");
  const leadId = watch("leadId");
  const currencyCode = watch("currencyCode") || "USD";
  const lineItems = watch("lineItems") ?? [];

  const subtotal = lineItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountTotal = lineItems.reduce(
    (total, item) => total + (Number(item.discountTotal) || 0),
    0
  );
  const taxTotal = lineItems.reduce(
    (total, item) => total + (Number(item.taxTotal) || 0),
    0
  );
  const grandTotal = Number((subtotal - discountTotal + taxTotal).toFixed(2));

  useEffect(() => {
    if (recipientKind !== "customer") {
      return;
    }

    const customer = customers.find((candidate) => candidate.id === customerId);

    if (!customer) {
      return;
    }

    setValue("recipientDisplayName", customer.displayName, { shouldValidate: true });
    setValue("recipientContactName", customer.contactName ?? "");
    setValue("recipientEmail", customer.email ?? "");
    setValue("recipientWhatsApp", customer.whatsapp ?? "");
    setValue("recipientPhone", customer.phone ?? "");
  }, [customerId, customers, recipientKind, setValue]);

  useEffect(() => {
    if (recipientKind !== "lead") {
      return;
    }

    const lead = leads.find((candidate) => candidate.id === leadId);

    if (!lead) {
      return;
    }

    setValue("recipientDisplayName", lead.displayName, { shouldValidate: true });
    setValue("recipientContactName", lead.contactName ?? "");
    setValue("recipientEmail", lead.email ?? "");
    setValue("recipientWhatsApp", lead.whatsapp ?? "");
    setValue("recipientPhone", lead.phone ?? "");
  }, [leadId, leads, recipientKind, setValue]);

  const recipientKindField = register("recipientKind");
  const customerField = register("customerId");
  const leadField = register("leadId");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("quotes.form.recipientKindLabel")}
          error={errors.recipientKind?.message}
          htmlFor={`${idPrefix}-recipient-kind`}
        >
          <Select
            id={`${idPrefix}-recipient-kind`}
            name={recipientKindField.name}
            onBlur={recipientKindField.onBlur}
            ref={recipientKindField.ref}
            value={recipientKind}
            onChange={(event) => {
              const nextKind = event.target.value as QuoteRecipientKind;

              recipientKindField.onChange(event);
              setValue("recipientKind", nextKind, { shouldValidate: true });

              if (nextKind !== "customer") {
                setValue("customerId", "");
              }

              if (nextKind !== "lead") {
                setValue("leadId", "");
              }
            }}
          >
            {quoteRecipientKindValues.map((kind) => (
              <option key={kind} value={kind}>
                {t(`quotes.form.recipientKinds.${kind}`)}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t("quotes.form.quoteNumberLabel")}
          htmlFor={`${idPrefix}-quote-number`}
        >
          <Input
            id={`${idPrefix}-quote-number`}
            value={
              quoteNumber && quoteNumber.trim().length > 0
                ? quoteNumber
                : t("quotes.form.generatedNumberPlaceholder")
            }
            readOnly
            disabled
          />
          <p className="text-sm text-ink-soft">{t("quotes.form.generatedNumberHint")}</p>
        </Field>
      </div>

      {recipientKind === "customer" ? (
        <Field
          label={t("quotes.form.customerLabel")}
          error={errors.customerId?.message}
          htmlFor={`${idPrefix}-quote-customer`}
        >
          <Select
            id={`${idPrefix}-quote-customer`}
            name={customerField.name}
            onBlur={customerField.onBlur}
            ref={customerField.ref}
            value={customerId ?? ""}
            onChange={(event) => {
              customerField.onChange(event);
              setValue("customerId", event.target.value, { shouldValidate: true });
            }}
          >
            <option value="">{t("quotes.form.customerPlaceholder")}</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.displayName}
              </option>
            ))}
          </Select>
          {customers.length === 0 ? (
            <p className="text-sm text-ink-soft">{t("quotes.form.noCustomersHint")}</p>
          ) : null}
        </Field>
      ) : recipientKind === "lead" ? (
        <Field
          label={t("quotes.form.leadLabel")}
          error={errors.leadId?.message}
          htmlFor={`${idPrefix}-quote-lead`}
        >
          <Select
            id={`${idPrefix}-quote-lead`}
            name={leadField.name}
            onBlur={leadField.onBlur}
            ref={leadField.ref}
            value={leadId ?? ""}
            onChange={(event) => {
              leadField.onChange(event);
              setValue("leadId", event.target.value, { shouldValidate: true });
            }}
          >
            <option value="">{t("quotes.form.leadPlaceholder")}</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.displayName}
              </option>
            ))}
          </Select>
          {leads.length === 0 ? (
            <p className="text-sm text-ink-soft">{t("quotes.form.noLeadsHint")}</p>
          ) : null}
        </Field>
      ) : (
        <div className="rounded-3xl border border-dashed border-line/70 bg-paper/70 p-4">
          <p className="text-sm font-semibold text-ink">
            {t("quotes.form.quickRecipientTitle")}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {t("quotes.form.quickRecipientDescription")}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("quotes.form.recipientDisplayNameLabel")}
          error={errors.recipientDisplayName?.message}
          htmlFor={`${idPrefix}-recipient-display-name`}
        >
          <Input
            id={`${idPrefix}-recipient-display-name`}
            placeholder={t("quotes.form.recipientDisplayNamePlaceholder")}
            {...register("recipientDisplayName")}
          />
        </Field>

        <Field
          label={t("quotes.form.recipientContactNameLabel")}
          error={errors.recipientContactName?.message}
          htmlFor={`${idPrefix}-recipient-contact-name`}
        >
          <Input
            id={`${idPrefix}-recipient-contact-name`}
            placeholder={t("quotes.form.recipientContactNamePlaceholder")}
            {...register("recipientContactName")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label={t("quotes.form.recipientEmailLabel")}
          error={errors.recipientEmail?.message}
          htmlFor={`${idPrefix}-recipient-email`}
        >
          <Input
            id={`${idPrefix}-recipient-email`}
            type="email"
            placeholder={t("quotes.form.recipientEmailPlaceholder")}
            {...register("recipientEmail")}
          />
        </Field>

        <Field
          label={t("quotes.form.recipientWhatsAppLabel")}
          error={errors.recipientWhatsApp?.message}
          htmlFor={`${idPrefix}-recipient-whatsapp`}
        >
          <Input
            id={`${idPrefix}-recipient-whatsapp`}
            placeholder={t("quotes.form.recipientWhatsAppPlaceholder")}
            {...register("recipientWhatsApp")}
          />
        </Field>

        <Field
          label={t("quotes.form.recipientPhoneLabel")}
          error={errors.recipientPhone?.message}
          htmlFor={`${idPrefix}-recipient-phone`}
        >
          <Input
            id={`${idPrefix}-recipient-phone`}
            placeholder={t("quotes.form.recipientPhonePlaceholder")}
            {...register("recipientPhone")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("quotes.form.titleLabel")}
          error={errors.title?.message}
          htmlFor={`${idPrefix}-quote-title`}
        >
          <Input
            id={`${idPrefix}-quote-title`}
            placeholder={t("quotes.form.titlePlaceholder")}
            {...register("title")}
          />
        </Field>

        <Field
          label={t("quotes.form.statusLabel")}
          error={errors.status?.message}
          htmlFor={`${idPrefix}-quote-status`}
        >
          <Select id={`${idPrefix}-quote-status`} {...register("status")}>
            {quoteStatusValues.map((status) => (
              <option key={status} value={status}>
                {t(`quotes.list.status.${status}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("quotes.form.currencyCodeLabel")}
          error={errors.currencyCode?.message}
          htmlFor={`${idPrefix}-quote-currency`}
        >
          <Input
            id={`${idPrefix}-quote-currency`}
            placeholder={t("quotes.form.currencyCodePlaceholder")}
            maxLength={3}
            {...register("currencyCode")}
          />
        </Field>

        <Field
          label={t("quotes.form.validUntilLabel")}
          error={errors.validUntil?.message}
          htmlFor={`${idPrefix}-quote-valid-until`}
        >
          <Input
            id={`${idPrefix}-quote-valid-until`}
            type="date"
            {...register("validUntil")}
          />
        </Field>
      </div>

      <div className="space-y-4 rounded-3xl border border-line/70 bg-paper/72 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              {t("quotes.form.lineItemsTitle")}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-soft">
              {t("quotes.form.lineItemsDescription")}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append(buildEmptyLineItem())}
          >
            {t("quotes.form.addLineItemAction")}
          </Button>
        </div>

        {fields.map((field, index) => {
          const catalogField = register(`lineItems.${index}.catalogItemId`);

          return (
            <div key={field.id} className="space-y-4 rounded-3xl border border-line/70 bg-paper/85 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">
                  {t("quotes.form.lineItemLabel", { index: index + 1 })}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  {t("quotes.form.removeLineItemAction")}
                </Button>
              </div>

              <Field
                label={t("quotes.form.catalogItemLabel")}
                htmlFor={`${idPrefix}-catalog-item-${index}`}
              >
                <Select
                  id={`${idPrefix}-catalog-item-${index}`}
                  name={catalogField.name}
                  onBlur={catalogField.onBlur}
                  ref={catalogField.ref}
                  value={lineItems[index]?.catalogItemId ?? ""}
                  onChange={(event) => {
                    catalogField.onChange(event);
                    setValue(`lineItems.${index}.catalogItemId`, event.target.value);
                    hydrateLineItemFromCatalog({
                      catalogItems,
                      index,
                      itemId: event.target.value,
                      setValue,
                      t
                    });
                  }}
                >
                  <option value="">{t("quotes.form.catalogItemPlaceholder")}</option>
                  {catalogItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {buildCatalogOptionLabel(item, t)}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("quotes.form.lineItemNameLabel")}
                  error={errors.lineItems?.[index]?.itemName?.message}
                  htmlFor={`${idPrefix}-line-item-name-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-name-${index}`}
                    placeholder={t("quotes.form.lineItemNamePlaceholder")}
                    {...register(`lineItems.${index}.itemName`)}
                  />
                </Field>

                <Field
                  label={t("quotes.form.unitLabelLabel")}
                  error={errors.lineItems?.[index]?.unitLabel?.message}
                  htmlFor={`${idPrefix}-line-item-unit-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-unit-${index}`}
                    placeholder={t("quotes.form.unitLabelPlaceholder")}
                    {...register(`lineItems.${index}.unitLabel`)}
                  />
                </Field>
              </div>

              <Field
                label={t("quotes.form.lineItemDescriptionLabel")}
                error={errors.lineItems?.[index]?.itemDescription?.message}
                htmlFor={`${idPrefix}-line-item-description-${index}`}
              >
                <Textarea
                  id={`${idPrefix}-line-item-description-${index}`}
                  placeholder={t("quotes.form.lineItemDescriptionPlaceholder")}
                  {...register(`lineItems.${index}.itemDescription`)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-4">
                <Field
                  label={t("quotes.form.quantityLabel")}
                  error={errors.lineItems?.[index]?.quantity?.message}
                  htmlFor={`${idPrefix}-line-item-quantity-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-quantity-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`lineItems.${index}.quantity`, {
                      valueAsNumber: true
                    })}
                  />
                </Field>

                <Field
                  label={t("quotes.form.unitPriceLabel")}
                  error={errors.lineItems?.[index]?.unitPrice?.message}
                  htmlFor={`${idPrefix}-line-item-price-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-price-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`lineItems.${index}.unitPrice`, {
                      valueAsNumber: true
                    })}
                  />
                </Field>

                <Field
                  label={t("quotes.form.discountTotalLabel")}
                  error={errors.lineItems?.[index]?.discountTotal?.message}
                  htmlFor={`${idPrefix}-line-item-discount-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-discount-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`lineItems.${index}.discountTotal`, {
                      valueAsNumber: true
                    })}
                  />
                </Field>

                <Field
                  label={t("quotes.form.taxTotalLabel")}
                  error={errors.lineItems?.[index]?.taxTotal?.message}
                  htmlFor={`${idPrefix}-line-item-tax-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-tax-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`lineItems.${index}.taxTotal`, {
                      valueAsNumber: true
                    })}
                  />
                </Field>
              </div>

              <p className="text-sm leading-6 text-ink-soft">
                {t("quotes.form.lineItemTotalLabel")}:{" "}
                {formatCurrency(
                  (Number(lineItems[index]?.quantity) || 0) *
                    (Number(lineItems[index]?.unitPrice) || 0) -
                    (Number(lineItems[index]?.discountTotal) || 0) +
                    (Number(lineItems[index]?.taxTotal) || 0),
                  currencyCode
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
        <p className="text-sm font-semibold text-ink">
          {t("quotes.form.grandTotalLabel")}
        </p>
        <div className="mt-3 grid gap-2 text-sm text-ink-soft">
          <p>
            {t("quotes.form.subtotalSummaryLabel")}:{" "}
            {formatCurrency(subtotal, currencyCode)}
          </p>
          <p>
            {t("quotes.form.discountSummaryLabel")}:{" "}
            {formatCurrency(discountTotal, currencyCode)}
          </p>
          <p>
            {t("quotes.form.taxSummaryLabel")}:{" "}
            {formatCurrency(taxTotal, currencyCode)}
          </p>
        </div>
        <p className="mt-3 text-base font-semibold text-ink">
          {formatCurrency(grandTotal, currencyCode)}
        </p>
      </div>

      <Field
        label={t("quotes.form.notesLabel")}
        error={errors.notes?.message}
        htmlFor={`${idPrefix}-quote-notes`}
      >
        <Textarea
          id={`${idPrefix}-quote-notes`}
          placeholder={t("quotes.form.notesPlaceholder")}
          {...register("notes")}
        />
      </Field>
    </>
  );
}

function buildCreateDefaults(
  customers: CustomerSummary[],
  leads: LeadSummary[]
): QuoteFormValues {
  if (customers[0]) {
    return {
      recipientKind: "customer",
      customerId: customers[0].id,
      leadId: "",
      recipientDisplayName: customers[0].displayName,
      recipientContactName: customers[0].contactName ?? "",
      recipientEmail: customers[0].email ?? "",
      recipientWhatsApp: customers[0].whatsapp ?? "",
      recipientPhone: customers[0].phone ?? "",
      title: "",
      status: "draft",
      currencyCode: "USD",
      validUntil: "",
      notes: "",
      lineItems: [buildEmptyLineItem()]
    };
  }

  if (leads[0]) {
    return {
      recipientKind: "lead",
      customerId: "",
      leadId: leads[0].id,
      recipientDisplayName: leads[0].displayName,
      recipientContactName: leads[0].contactName ?? "",
      recipientEmail: leads[0].email ?? "",
      recipientWhatsApp: leads[0].whatsapp ?? "",
      recipientPhone: leads[0].phone ?? "",
      title: "",
      status: "draft",
      currencyCode: "USD",
      validUntil: "",
      notes: "",
      lineItems: [buildEmptyLineItem()]
    };
  }

  return buildEmptyQuoteDefaults();
}

function buildEmptyLineItem() {
  return {
    catalogItemId: "",
    itemName: "",
    itemDescription: "",
    quantity: 1,
    unitLabel: "",
    unitPrice: 0,
    discountTotal: 0,
    taxTotal: 0
  };
}

function buildEmptyQuoteDefaults(): QuoteFormValues {
  return {
    recipientKind: "ad_hoc",
    customerId: "",
    leadId: "",
    recipientDisplayName: "",
    recipientContactName: "",
    recipientEmail: "",
    recipientWhatsApp: "",
    recipientPhone: "",
    title: "",
    status: "draft",
    currencyCode: "USD",
    validUntil: "",
    notes: "",
    lineItems: [buildEmptyLineItem()]
  };
}

function buildUpdateDefaults(quote: QuoteDetail): QuoteFormValues {
  return {
    recipientKind: quote.recipientKind,
    customerId: quote.customerId ?? "",
    leadId: quote.leadId ?? "",
    recipientDisplayName: quote.recipientDisplayName,
    recipientContactName: quote.recipientContactName ?? "",
    recipientEmail: quote.recipientEmail ?? "",
    recipientWhatsApp: quote.recipientWhatsApp ?? "",
    recipientPhone: quote.recipientPhone ?? "",
    title: quote.title,
    status: quote.status,
    currencyCode: quote.currencyCode,
    validUntil: quote.validUntil ?? "",
    notes: quote.notes ?? "",
    lineItems:
      quote.lineItems.length > 0
        ? quote.lineItems.map((lineItem) => ({
            catalogItemId: lineItem.catalogItemId ?? "",
            itemName: lineItem.itemName,
            itemDescription: lineItem.itemDescription ?? "",
            quantity: lineItem.quantity,
            unitLabel: lineItem.unitLabel ?? "",
            unitPrice: lineItem.unitPrice,
            discountTotal: lineItem.discountTotal,
            taxTotal: lineItem.taxTotal
          }))
        : [buildEmptyLineItem()]
  };
}

function toQuotePayload(values: QuoteFormValues) {
  return {
    recipientKind: values.recipientKind,
    customerId: values.recipientKind === "customer" ? values.customerId : null,
    leadId: values.recipientKind === "lead" ? values.leadId : null,
    recipientDisplayName: values.recipientDisplayName,
    recipientContactName: values.recipientContactName,
    recipientEmail: values.recipientEmail,
    recipientWhatsApp: values.recipientWhatsApp,
    recipientPhone: values.recipientPhone,
    title: values.title,
    status: values.status,
    currencyCode: values.currencyCode,
    validUntil: values.validUntil,
    notes: values.notes,
    lineItems: values.lineItems
  };
}

function hydrateLineItemFromCatalog({
  catalogItems,
  index,
  itemId,
  setValue,
  t
}: {
  catalogItems: CatalogItemSummary[];
  index: number;
  itemId: string;
  setValue: UseFormReturn<QuoteFormValues>["setValue"];
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  const selectedItem = catalogItems.find((item) => item.id === itemId);

  if (!selectedItem) {
    return;
  }

  setValue(`lineItems.${index}.itemName`, selectedItem.name, {
    shouldValidate: true
  });
  setValue(`lineItems.${index}.itemDescription`, selectedItem.description ?? "");
  setValue(`lineItems.${index}.unitLabel`, getDefaultUnitLabel(selectedItem, t));
  setValue(`lineItems.${index}.unitPrice`, selectedItem.unitPrice ?? 0);
}

function getDefaultUnitLabel(
  item: CatalogItemSummary,
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  if (item.kind === "service") {
    return t("quotes.form.defaultServiceUnit");
  }

  return t("quotes.form.defaultProductUnit");
}

function buildCatalogOptionLabel(
  item: CatalogItemSummary,
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  const priceLabel =
    item.pricingMode === "on_request" || item.unitPrice === null
      ? t("quotes.form.catalogItemOnRequest")
      : formatCurrency(item.unitPrice, item.currencyCode);

  return `${item.name} · ${priceLabel}`;
}

function formatCurrency(value: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${currencyCode.toUpperCase()} ${value.toFixed(2)}`;
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
