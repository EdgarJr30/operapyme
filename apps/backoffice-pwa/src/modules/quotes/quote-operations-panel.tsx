import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

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
  quoteStatusValues,
  type QuoteFormValues
} from "@/lib/forms/quote-form-schema";
import type {
  CustomerSummary,
  QuoteSummary
} from "@/lib/supabase/backoffice-data";
import { useQuoteMutations } from "@/modules/quotes/use-quote-mutations";

interface QuoteOperationsPanelProps {
  customers: CustomerSummary[];
  quotes: QuoteSummary[];
}

export function QuoteOperationsPanel({
  customers,
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
    defaultValues: buildCreateDefaults(customers)
  });

  const updateForm = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: buildEmptyQuoteDefaults()
  });

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote.id === selectedQuoteId) ?? null,
    [quotes, selectedQuoteId]
  );

  useEffect(() => {
    if (customers[0]) {
      createForm.setValue("customerId", customers[0].id, {
        shouldValidate: true
      });
    }
  }, [createForm, customers]);

  useEffect(() => {
    if (!selectedQuoteId && quotes[0]) {
      setSelectedQuoteId(quotes[0].id);
    }
  }, [quotes, selectedQuoteId]);

  useEffect(() => {
    if (!selectedQuote) {
      updateForm.reset(buildEmptyQuoteDefaults());
      return;
    }

    updateForm.reset({
      customerId: selectedQuote.customerId,
      quoteNumber: selectedQuote.quoteNumber,
      title: selectedQuote.title,
      status: selectedQuote.status,
      currencyCode: selectedQuote.currencyCode,
      subtotal: selectedQuote.subtotal,
      discountTotal: selectedQuote.discountTotal,
      taxTotal: selectedQuote.taxTotal,
      validUntil: selectedQuote.validUntil ?? "",
      notes: selectedQuote.notes ?? ""
    });
  }, [selectedQuote, updateForm]);

  async function onCreate(values: QuoteFormValues) {
    setCreateFeedback(null);

    try {
      await createQuoteMutation.mutateAsync(values);
      setCreateFeedback(t("quotes.form.createSuccess"));
      createForm.reset(buildCreateDefaults(customers));
    } catch (error) {
      setCreateFeedback(
        t("quotes.form.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  async function onUpdate(values: QuoteFormValues) {
    if (!selectedQuote) {
      setUpdateFeedback(t("quotes.form.noQuoteSelected"));
      return;
    }

    setUpdateFeedback(null);

    try {
      await updateQuoteMutation.mutateAsync({
        quoteId: selectedQuote.id,
        version: selectedQuote.version,
        ...values
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
          {customers.length === 0 ? (
            <FeedbackBanner tone="neutral">
              {t("quotes.form.needCustomerHint")}
            </FeedbackBanner>
          ) : (
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(onCreate)}
              noValidate
            >
              <QuoteFormFields
                customers={customers}
                form={createForm}
                idPrefix="create"
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
                    createForm.reset(buildCreateDefaults(customers));
                    setCreateFeedback(null);
                  }}
                >
                  {t("quotes.form.resetAction")}
                </Button>
              </div>
            </form>
          )}
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
          ) : (
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(onUpdate)}
              noValidate
            >
              <QuoteFormFields
                customers={customers}
                form={updateForm}
                idPrefix="update"
              />

              {selectedQuote ? (
                <p className="text-sm text-ink-soft">
                  {t("quotes.form.versionHint", { version: selectedQuote.version })}
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
                disabled={updateQuoteMutation.isPending || !selectedQuote}
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
  customers,
  form,
  idPrefix
}: {
  customers: CustomerSummary[];
  form: UseFormReturn<QuoteFormValues>;
  idPrefix: string;
}) {
  const { t } = useTranslation("backoffice");
  const {
    formState: { errors },
    register,
    watch
  } = form;
  const subtotal = watch("subtotal") ?? 0;
  const discountTotal = watch("discountTotal") ?? 0;
  const taxTotal = watch("taxTotal") ?? 0;
  const grandTotal = Number((subtotal - discountTotal + taxTotal).toFixed(2));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("quotes.form.customerLabel")}
          error={errors.customerId?.message}
          htmlFor={`${idPrefix}-quote-customer`}
        >
          <Select id={`${idPrefix}-quote-customer`} {...register("customerId")}>
            <option value="">{t("quotes.form.customerPlaceholder")}</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.displayName}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t("quotes.form.quoteNumberLabel")}
          error={errors.quoteNumber?.message}
          htmlFor={`${idPrefix}-quote-number`}
        >
          <Input
            id={`${idPrefix}-quote-number`}
            placeholder={t("quotes.form.quoteNumberPlaceholder")}
            {...register("quoteNumber")}
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label={t("quotes.form.subtotalLabel")}
          error={errors.subtotal?.message}
          htmlFor={`${idPrefix}-quote-subtotal`}
        >
          <Input
            id={`${idPrefix}-quote-subtotal`}
            type="number"
            step="0.01"
            min="0"
            {...register("subtotal", { valueAsNumber: true })}
          />
        </Field>

        <Field
          label={t("quotes.form.discountTotalLabel")}
          error={errors.discountTotal?.message}
          htmlFor={`${idPrefix}-quote-discount`}
        >
          <Input
            id={`${idPrefix}-quote-discount`}
            type="number"
            step="0.01"
            min="0"
            {...register("discountTotal", { valueAsNumber: true })}
          />
        </Field>

        <Field
          label={t("quotes.form.taxTotalLabel")}
          error={errors.taxTotal?.message}
          htmlFor={`${idPrefix}-quote-tax`}
        >
          <Input
            id={`${idPrefix}-quote-tax`}
            type="number"
            step="0.01"
            min="0"
            {...register("taxTotal", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div className="rounded-[24px] border border-line/70 bg-paper/70 p-4">
        <p className="text-sm font-semibold text-ink">
          {t("quotes.form.grandTotalLabel")}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          {formatCurrency(grandTotal, watch("currencyCode") || "USD")}
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

function buildCreateDefaults(customers: CustomerSummary[]): QuoteFormValues {
  return {
    customerId: customers[0]?.id ?? "",
    quoteNumber: generateDraftQuoteNumber(),
    title: "",
    status: "draft",
    currencyCode: "USD",
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    validUntil: "",
    notes: ""
  };
}

function buildEmptyQuoteDefaults(): QuoteFormValues {
  return {
    customerId: "",
    quoteNumber: "",
    title: "",
    status: "draft",
    currencyCode: "USD",
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    validUntil: "",
    notes: ""
  };
}

function generateDraftQuoteNumber() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const seed = String(now.getTime()).slice(-6);

  return `COT-${year}-${seed}`;
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
