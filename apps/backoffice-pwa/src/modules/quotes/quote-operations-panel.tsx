import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  useForm,
  type FieldErrors,
  type FieldPath,
  type UseFormReturn
} from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleAlert,
  FileText,
  Layers3,
  type LucideIcon,
  UserRound
} from "lucide-react";

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
import {
  calculateQuoteDocumentDiscountAmountFromPercent,
  calculateQuoteDocumentDiscountBase,
  calculateQuoteDocumentDiscountPercentFromAmount,
  calculateQuoteDocumentDiscountTotalFromCombinedDiscount,
  calculateQuoteLineDiscountAmountFromPercent,
  calculateQuoteLineDiscountTotal,
  calculateQuoteLineDiscountPercentFromAmount
} from "@/lib/forms/quote-line-discounts";
import { buildOperationalAutofillProps } from "@/lib/forms/autofill";
import type {
  CatalogItemSummary,
  CustomerSummary,
  LeadSummary,
  QuoteDetail,
  QuoteRecipientKind,
  QuoteSummary
} from "@/lib/supabase/backoffice-data";
import { cn } from "@/lib/utils";
import { useQuoteDetailData } from "@/modules/quotes/use-quote-detail-data";
import { useQuoteMutations } from "@/modules/quotes/use-quote-mutations";

type QuoteWorkflowMode = "create" | "update";
type QuoteFormStepKey = "recipient" | "document" | "items" | "review";
type QuoteFieldPath = FieldPath<QuoteFormValues>;

interface QuoteOperationsPanelProps {
  customers: CustomerSummary[];
  leads: LeadSummary[];
  catalogItems: CatalogItemSummary[];
  quotes: QuoteSummary[];
}

const quoteFormSteps: QuoteFormStepKey[] = [
  "recipient",
  "document",
  "items",
  "review"
];

const quoteFormStepIcons: Record<QuoteFormStepKey, LucideIcon> = {
  recipient: UserRound,
  document: FileText,
  items: Layers3,
  review: BadgeCheck
};

interface ValidationIssue {
  field?: QuoteFieldPath;
  key: string;
  label: string;
  message: string;
  step: QuoteFormStepKey;
}

export function QuoteOperationsPanel(props: QuoteOperationsPanelProps) {
  return <QuoteCreateWorkspace {...props} />;
}

export function QuoteCreateWorkspace({
  customers,
  leads,
  catalogItems
}: QuoteOperationsPanelProps) {
  const { t } = useTranslation("backoffice");
  const { createQuoteMutation } = useQuoteMutations();
  const quoteFormSchema = createQuoteFormSchema(t);
  const [currentStep, setCurrentStep] = useState<QuoteFormStepKey>("recipient");

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: buildCreateDefaults(customers, leads),
    reValidateMode: "onChange"
  });

  const handleInvalidSubmit = (errors: FieldErrors<QuoteFormValues>) => {
    guideToFirstInvalidField({
      errors,
      form,
      setCurrentStep,
      t
    });
  };

  const handleAdvanceStep = async () => {
    const fieldsToValidate = getFieldsForStep(
      currentStep,
      form.getValues("lineItems")?.length ?? 0
    );
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });

    if (!isValid) {
      guideToFirstInvalidField({
        errors: form.formState.errors,
        form,
        setCurrentStep,
        t
      });
      return;
    }

    const currentIndex = quoteFormSteps.indexOf(currentStep);

    if (currentIndex < quoteFormSteps.length - 1) {
      setCurrentStep(quoteFormSteps[currentIndex + 1]!);
    }
  };

  async function onSubmit(values: QuoteFormValues) {
    try {
      const createdQuote = await createQuoteMutation.mutateAsync(toQuotePayload(values));
      toast.success(
        t("quotes.form.createSuccess", { quoteNumber: createdQuote.quoteNumber })
      );
      form.reset(buildCreateDefaults(customers, leads));
      setCurrentStep("recipient");
    } catch (error) {
      toast.error(
        t("quotes.form.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  return (
    <QuoteWorkflowLayout
      mode="create"
      title={t("quotes.form.createTitle")}
      description={t("quotes.form.createDescription")}
      form={form}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      summaryLabel={t("quotes.form.newDraftLabel")}
      footer={
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={() => {
              form.reset(buildCreateDefaults(customers, leads));
              setCurrentStep("recipient");
            }}
          >
            {t("quotes.form.resetAction")}
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={createQuoteMutation.isPending}
          >
            {createQuoteMutation.isPending
              ? t("quotes.form.createSubmitting")
              : t("quotes.form.createAction")}
          </Button>
        </div>
      }
      onNextStep={handleAdvanceStep}
      onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
    >
      <QuoteFormFields
        catalogItems={catalogItems}
        customers={customers}
        leads={leads}
        form={form}
        idPrefix="create"
        quoteNumber={null}
        step={currentStep}
      />
    </QuoteWorkflowLayout>
  );
}

export function QuoteManageWorkspace({
  customers,
  leads,
  catalogItems,
  quotes
}: QuoteOperationsPanelProps) {
  const { t } = useTranslation("backoffice");
  const { updateQuoteMutation } = useQuoteMutations();
  const quoteFormSchema = createQuoteFormSchema(t);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<QuoteFormStepKey>("recipient");

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: buildEmptyQuoteDefaults(),
    reValidateMode: "onChange"
  });

  const handleInvalidSubmit = (errors: FieldErrors<QuoteFormValues>) => {
    guideToFirstInvalidField({
      errors,
      form,
      setCurrentStep,
      t
    });
  };

  const handleAdvanceStep = async () => {
    const fieldsToValidate = getFieldsForStep(
      currentStep,
      form.getValues("lineItems")?.length ?? 0
    );
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });

    if (!isValid) {
      guideToFirstInvalidField({
        errors: form.formState.errors,
        form,
        setCurrentStep,
        t
      });
      return;
    }

    const currentIndex = quoteFormSteps.indexOf(currentStep);

    if (currentIndex < quoteFormSteps.length - 1) {
      setCurrentStep(quoteFormSteps[currentIndex + 1]!);
    }
  };

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

    form.reset(buildUpdateDefaults(selectedQuoteDetail));
  }, [form, selectedQuoteDetail]);

  useEffect(() => {
    if (quotes.length === 0) {
      form.reset(buildEmptyQuoteDefaults());
      return;
    }

    if (!selectedQuoteSummary) {
      return;
    }

    if (!selectedQuoteDetailQuery.isLoading && !selectedQuoteDetail) {
      form.reset(buildEmptyQuoteDefaults());
    }
  }, [
    form,
    quotes.length,
    selectedQuoteDetail,
    selectedQuoteDetailQuery.isLoading,
    selectedQuoteSummary
  ]);

  async function onSubmit(values: QuoteFormValues) {
    if (!selectedQuoteDetail) {
      toast.error(t("quotes.form.noQuoteSelected"));
      return;
    }

    try {
      await updateQuoteMutation.mutateAsync({
        quoteId: selectedQuoteDetail.id,
        version: selectedQuoteDetail.version,
        ...toQuotePayload(values)
      });
      toast.success(t("quotes.form.updateSuccess"));
    } catch (error) {
      toast.error(
        t("quotes.form.updateError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("quotes.form.updateTitle")}</CardTitle>
          <CardDescription>
            {t("quotes.form.updateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackBanner tone="neutral">
            {t("quotes.form.noQuotesHint")}
          </FeedbackBanner>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <Card className="h-fit">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle>{t("quotes.manage.selectorTitle")}</CardTitle>
          <CardDescription>
            {t("quotes.manage.selectorDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="quote-record">
              {t("quotes.form.recordLabel")}
            </label>
            <Select
              id="quote-record"
              value={selectedQuoteId}
              {...buildOperationalAutofillProps("off")}
              onChange={(event) => {
                setSelectedQuoteId(event.target.value);
                setCurrentStep("recipient");
              }}
            >
              {quotes.map((quote) => (
                <option key={quote.id} value={quote.id}>
                  {quote.quoteNumber}
                </option>
              ))}
            </Select>
          </div>

          {quotes.map((quote) => (
            <button
              key={quote.id}
              type="button"
              onClick={() => {
                setSelectedQuoteId(quote.id);
                setCurrentStep("recipient");
              }}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left transition",
                quote.id === selectedQuoteId
                  ? "border-brand/50 bg-brand/10 shadow-panel"
                  : "border-line/70 bg-paper hover:bg-sand/60"
              )}
            >
              <p className="text-sm font-semibold text-ink">{quote.quoteNumber}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {quote.recipientDisplayName}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ink-muted">
                {t(`quotes.list.status.${quote.status}`)}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      {selectedQuoteDetailQuery.isLoading ? (
        <Card>
          <CardContent className="p-6">
            <FeedbackBanner tone="neutral">
              {t("quotes.form.loadingDetailHint")}
            </FeedbackBanner>
          </CardContent>
        </Card>
      ) : selectedQuoteDetailQuery.isError ? (
        <Card>
          <CardContent className="p-6">
            <FeedbackBanner tone="error">
              {t("quotes.form.loadingDetailError", {
                message:
                  selectedQuoteDetailQuery.error instanceof Error
                    ? selectedQuoteDetailQuery.error.message
                    : ""
              })}
            </FeedbackBanner>
          </CardContent>
        </Card>
      ) : (
        <QuoteWorkflowLayout
          mode="update"
          title={t("quotes.form.updateTitle")}
          description={t("quotes.form.updateDescription")}
          form={form}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          summaryLabel={selectedQuoteDetail?.quoteNumber ?? t("quotes.form.updateTitle")}
          badge={
            selectedQuoteDetail ? (
              <span className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                {t("quotes.form.versionHint", {
                  version: selectedQuoteDetail.version
                })}
              </span>
            ) : null
          }
          footer={
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={updateQuoteMutation.isPending || !selectedQuoteDetail}
              >
                {updateQuoteMutation.isPending
                  ? t("quotes.form.updateSubmitting")
                  : t("quotes.form.updateAction")}
              </Button>
            </div>
          }
          onNextStep={handleAdvanceStep}
          onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
        >
          <QuoteFormFields
            catalogItems={catalogItems}
            customers={customers}
            leads={leads}
            form={form}
            idPrefix="update"
            quoteNumber={selectedQuoteDetail?.quoteNumber ?? null}
            step={currentStep}
          />
        </QuoteWorkflowLayout>
      )}
    </div>
  );
}

function QuoteWorkflowLayout({
  badge,
  children,
  currentStep,
  description,
  footer,
  form,
  mode,
  onNextStep,
  onStepChange,
  onSubmit,
  summaryLabel,
  title
}: {
  badge?: ReactNode;
  children: ReactNode;
  currentStep: QuoteFormStepKey;
  description: string;
  footer: ReactNode;
  form: UseFormReturn<QuoteFormValues>;
  mode: QuoteWorkflowMode;
  onNextStep: () => void | Promise<void>;
  onStepChange: (step: QuoteFormStepKey) => void;
  onSubmit: () => void;
  summaryLabel: string;
  title: string;
}) {
  const { t } = useTranslation("backoffice");
  const {
    watch,
    formState: { errors }
  } = form;
  const values = watch();
  const currencyCode = values.currencyCode || "USD";
  const lineItems = values.lineItems ?? [];
  const validationIssues = useMemo(
    () => collectValidationIssues(errors, t),
    [errors, t]
  );
  const subtotal = lineItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const lineDiscountTotal = calculateQuoteLineDiscountTotal(lineItems);
  const documentDiscountTotal = Number(values.documentDiscountTotal) || 0;
  const discountTotal = Number(
    (lineDiscountTotal + documentDiscountTotal).toFixed(2)
  );
  const taxTotal = lineItems.reduce(
    (total, item) => total + (Number(item.taxTotal) || 0),
    0
  );
  const grandTotal = Number((subtotal - discountTotal + taxTotal).toFixed(2));
  const currentStepIndex = quoteFormSteps.indexOf(currentStep);
  const issuesByStep = validationIssues.reduce<Record<QuoteFormStepKey, number>>(
    (result, issue) => {
      result[issue.step] += 1;
      return result;
    },
    {
      recipient: 0,
      document: 0,
      items: 0,
      review: 0
    }
  );
  const hasValidationIssues = validationIssues.length > 0;

  return (
    <form
      className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"
      noValidate
      onSubmit={onSubmit}
      {...buildOperationalAutofillProps("off")}
    >
      <Card>
        <CardHeader className="space-y-4 pb-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-8 items-center rounded-full border border-line/70 bg-paper/80 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {mode === "create"
                  ? t("quotes.form.createBadge")
                  : t("quotes.form.updateBadge")}
              </span>
              {badge}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-[28px] leading-tight">{title}</CardTitle>
              <CardDescription className="text-sm leading-6">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {quoteFormSteps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = step === currentStep;
              const isComplete = index < currentStepIndex;
              const StepIcon = quoteFormStepIcons[step];
              const stepIssueCount = issuesByStep[step];

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => onStepChange(step)}
                  className={cn(
                    "rounded-3xl border px-4 py-3 text-left transition",
                    isActive
                      ? "border-brand/40 bg-brand/10 shadow-soft"
                      : stepIssueCount > 0
                        ? "border-peach-300/70 bg-peach-100/55"
                        : isComplete
                          ? "border-sage-300/70 bg-sage-100/60"
                          : "border-line/70 bg-paper hover:bg-sand/60"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                        {t("quotes.form.stepNumber", { count: stepNumber })}
                      </p>
                      <div className="flex items-center gap-2">
                        <StepIcon className="size-4 text-ink-soft" />
                        <p className="text-sm font-semibold text-ink">
                          {t(`quotes.form.steps.${step}.title`)}
                        </p>
                      </div>
                    </div>

                    {stepIssueCount > 0 ? (
                      <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full border border-peach-300/80 bg-paper px-2 text-xs font-semibold text-peach-700">
                        {stepIssueCount}
                      </span>
                    ) : isComplete ? (
                      <CheckCircle2 className="size-4.5 text-sage-700" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {hasValidationIssues ? (
            <div className="rounded-3xl border border-peach-300/80 bg-peach-100/65 p-4">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 size-5 shrink-0 text-peach-700" />
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {t("quotes.form.validationSummaryTitle")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">
                      {t("quotes.form.validationSummaryPendingDetailed", {
                        count: validationIssues.length
                      })}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {validationIssues.map((issue) => (
                      <button
                        key={issue.key}
                        type="button"
                        onClick={() => onStepChange(issue.step)}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-peach-200/80 bg-paper/85 px-3 py-3 text-left transition hover:bg-paper"
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                            {t(`quotes.form.steps.${issue.step}.title`)}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink">
                            {issue.label}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-ink-soft">
                            {issue.message}
                          </p>
                        </div>
                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-ink-soft" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {children}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
            <Button
              type="button"
              variant="ghost"
              disabled={currentStepIndex === 0}
              onClick={() =>
                onStepChange(quoteFormSteps[Math.max(currentStepIndex - 1, 0)]!)
              }
            >
              {t("quotes.form.backStepAction")}
            </Button>

            {currentStepIndex < quoteFormSteps.length - 1 ? (
              <Button
                type="button"
                className="gap-2"
                onClick={onNextStep}
              >
                {t("quotes.form.nextStepAction")}
                <ArrowRight className="size-4" />
              </Button>
            ) : null}
          </div>

          <div className="space-y-3">{footer}</div>
        </CardContent>
      </Card>

      <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <Card className="bg-paper">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-lg">{t("quotes.form.summaryTitle")}</CardTitle>
            <CardDescription>{summaryLabel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryMetric
              label={t("quotes.form.summaryRecipient")}
              value={values.recipientDisplayName || t("quotes.form.pendingSummaryValue")}
            />
            <SummaryMetric
              label={t("quotes.form.summaryStatus")}
              value={t(`quotes.list.status.${values.status}`)}
            />
            <SummaryMetric
              label={t("quotes.form.summaryLineItems")}
              value={String(lineItems.length)}
            />

            <div className="rounded-2xl border border-line/70 bg-paper/85 p-4">
              <p className="text-sm font-semibold text-ink">
                {t("quotes.form.grandTotalLabel")}
              </p>
              <div className="mt-3 space-y-2 text-sm text-ink-soft">
                <p>
                  {t("quotes.form.subtotalSummaryLabel")}:{" "}
                  {formatCurrency(subtotal, currencyCode)}
                </p>
                <p>
                  {t("quotes.form.lineDiscountSummaryLabel")}:{" "}
                  {formatCurrency(lineDiscountTotal, currencyCode)}
                </p>
                <p>
                  {t("quotes.form.documentDiscountSummaryLabel")}:{" "}
                  {formatCurrency(documentDiscountTotal, currencyCode)}
                </p>
                <p>
                  {t("quotes.form.taxSummaryLabel")}:{" "}
                  {formatCurrency(taxTotal, currencyCode)}
                </p>
              </div>
              <p className="mt-4 text-xl font-semibold text-ink">
                {formatCurrency(grandTotal, currencyCode)}
              </p>
            </div>

            {hasValidationIssues && (
              <div className="space-y-2">
                {validationIssues.map((issue) => (
                  <button
                    key={`summary-${issue.key}`}
                    type="button"
                    onClick={() => onStepChange(issue.step)}
                    className="w-full rounded-2xl border border-line/70 bg-paper/80 px-3 py-3 text-left transition hover:bg-paper"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                      {t(`quotes.form.steps.${issue.step}.title`)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">{issue.label}</p>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">
                      {issue.message}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

function RecipientKindPicker({
  currentKind,
  onSelect
}: {
  currentKind: QuoteRecipientKind;
  onSelect: (kind: QuoteRecipientKind) => void;
}) {
  const { t } = useTranslation("backoffice");

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {quoteRecipientKindValues.map((kind) => {
        const isActive = kind === currentKind;
        const StepIcon =
          kind === "customer"
            ? UserRound
            : kind === "lead"
              ? Layers3
              : BadgeCheck;

        return (
          <button
            key={kind}
            type="button"
            onClick={() => onSelect(kind)}
            className={cn(
              "rounded-3xl border px-4 py-4 text-left transition",
              isActive
                ? "border-brand/40 bg-brand/10 shadow-soft"
                : "border-line/70 bg-paper hover:bg-sand/60"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-paper/85 text-ink-soft shadow-panel">
                <StepIcon className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {t(`quotes.form.recipientKinds.${kind}`)}
                </p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  {t(`quotes.form.recipientKindDescriptions.${kind}`)}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function QuoteFormFields({
  catalogItems,
  customers,
  leads,
  form,
  idPrefix,
  quoteNumber,
  step
}: {
  catalogItems: CatalogItemSummary[];
  customers: CustomerSummary[];
  leads: LeadSummary[];
  form: UseFormReturn<QuoteFormValues>;
  idPrefix: string;
  quoteNumber?: string | null;
  step: QuoteFormStepKey;
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
  const documentDiscountPercent = watch("documentDiscountPercent") ?? 0;
  const lineItems = watch("lineItems") ?? [];
  const documentDiscountBase = calculateQuoteDocumentDiscountBase(lineItems);

  const syncLineItemDiscounts = ({
    discountPercent,
    discountTotal,
    index,
    quantity,
    source,
    unitPrice
  }: {
    discountPercent?: number;
    discountTotal?: number;
    index: number;
    quantity?: number;
    source: "amount" | "percent";
    unitPrice?: number;
  }) => {
    const currentLineItem = lineItems[index];

    if (!currentLineItem) {
      return;
    }

    const nextLineItem = {
      ...currentLineItem,
      ...(typeof discountPercent === "number" ? { discountPercent } : {}),
      ...(typeof quantity === "number" ? { quantity } : {}),
      ...(typeof discountTotal === "number" ? { discountTotal } : {}),
      ...(typeof unitPrice === "number" ? { unitPrice } : {})
    };

    const nextDiscountTotal =
      source === "percent"
        ? calculateQuoteLineDiscountAmountFromPercent(nextLineItem)
        : normalizeFieldNumber(nextLineItem.discountTotal);
    const nextDiscountPercent =
      source === "amount"
        ? calculateQuoteLineDiscountPercentFromAmount(nextLineItem)
        : normalizeFieldNumber(nextLineItem.discountPercent);

    setValue(`lineItems.${index}.discountPercent`, nextDiscountPercent, {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue(`lineItems.${index}.discountTotal`, nextDiscountTotal, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const syncDocumentDiscounts = ({
    discountPercent,
    discountTotal,
    source
  }: {
    discountPercent?: number;
    discountTotal?: number;
    source: "amount" | "percent";
  }) => {
    const nextLineItems = [...lineItems];
    const nextDocumentDiscountTotal =
      source === "percent"
        ? calculateQuoteDocumentDiscountAmountFromPercent({
            discountPercent,
            lineItems: nextLineItems
          })
        : normalizeFieldNumber(discountTotal);
    const nextDocumentDiscountPercent =
      source === "amount"
        ? calculateQuoteDocumentDiscountPercentFromAmount({
            discountTotal,
            lineItems: nextLineItems
          })
        : normalizeFieldNumber(discountPercent);

    setValue("documentDiscountPercent", nextDocumentDiscountPercent, {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue("documentDiscountTotal", nextDocumentDiscountTotal, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  useEffect(() => {
    setValue(
      "documentDiscountTotal",
      Number(
        (
          (documentDiscountBase * normalizeFieldNumber(documentDiscountPercent)) /
          100
        ).toFixed(2)
      ),
      {
        shouldValidate: true
      }
    );
  }, [documentDiscountBase, documentDiscountPercent, setValue]);

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

  if (step === "recipient") {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-line/70 bg-paper/72 p-4">
          <p className="text-sm font-semibold text-ink">
            {t("quotes.form.recipientSelectorTitle")}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            {t("quotes.form.recipientSelectorDescription")}
          </p>
          <div className="mt-4">
            <RecipientKindPicker
              currentKind={recipientKind}
              onSelect={(nextKind) => {
                setValue("recipientKind", nextKind, { shouldValidate: true });

                if (nextKind !== "customer") {
                  setValue("customerId", "");
                }

                if (nextKind !== "lead") {
                  setValue("leadId", "");
                }
              }}
            />
          </div>
        </div>

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
              {...buildOperationalAutofillProps("off")}
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
            <output
              id={`${idPrefix}-quote-number`}
              aria-live="polite"
              className="flex min-h-12 w-full items-center rounded-xl border border-line bg-paper/90 px-3 text-sm text-ink sm:min-h-11"
            >
              {
                quoteNumber && quoteNumber.trim().length > 0
                  ? quoteNumber
                  : t("quotes.form.generatedNumberPlaceholder")
              }
            </output>
            <p className="text-sm text-ink-soft">{t("quotes.form.generatedNumberHint")}</p>
          </Field>
        </div>

        {recipientKind === "customer" ? (
          <div className="rounded-3xl border border-line/70 bg-sand/35 p-4">
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
                {...buildOperationalAutofillProps("off")}
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
              ) : (
                <p className="text-sm text-ink-soft">
                  {t("quotes.form.customerSelectedHint")}
                </p>
              )}
            </Field>
          </div>
        ) : recipientKind === "lead" ? (
          <div className="rounded-3xl border border-line/70 bg-sand/35 p-4">
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
                {...buildOperationalAutofillProps("off")}
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
              ) : (
                <p className="text-sm text-ink-soft">
                  {t("quotes.form.leadSelectedHint")}
                </p>
              )}
            </Field>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-line/70 bg-paper p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-paper/85 text-ink-soft shadow-panel">
                <BadgeCheck className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {t("quotes.form.quickRecipientTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("quotes.form.quickRecipientDescription")}
                </p>
              </div>
            </div>
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
              {...buildOperationalAutofillProps("section-quote-recipient organization")}
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
              {...buildOperationalAutofillProps("section-quote-recipient name")}
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
              {...buildOperationalAutofillProps("section-quote-recipient email")}
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
              {...buildOperationalAutofillProps("section-quote-recipient tel")}
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
              {...buildOperationalAutofillProps("section-quote-recipient tel-national")}
              {...register("recipientPhone")}
            />
          </Field>
        </div>
      </div>
    );
  }

  if (step === "document") {
    const documentDiscountPercentField = register("documentDiscountPercent", {
      valueAsNumber: true
    });
    const documentDiscountTotalField = register("documentDiscountTotal", {
      onChange: (event) => {
        syncDocumentDiscounts({
          discountTotal: event.target.valueAsNumber,
          source: "amount"
        });
      },
      valueAsNumber: true
    });
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("quotes.form.titleLabel")}
            error={errors.title?.message}
            htmlFor={`${idPrefix}-quote-title`}
          >
            <Input
              id={`${idPrefix}-quote-title`}
              placeholder={t("quotes.form.titlePlaceholder")}
              {...buildOperationalAutofillProps("off")}
              {...register("title")}
            />
          </Field>

          <Field
            label={t("quotes.form.statusLabel")}
            error={errors.status?.message}
            htmlFor={`${idPrefix}-quote-status`}
          >
            <Select
              id={`${idPrefix}-quote-status`}
              {...buildOperationalAutofillProps("off")}
              {...register("status")}
            >
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
              {...buildOperationalAutofillProps("off")}
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
              {...buildOperationalAutofillProps("off")}
              {...register("validUntil")}
            />
          </Field>
        </div>

        <div className="rounded-3xl border border-line/70 bg-paper/72 p-4">
          <p className="text-sm font-semibold text-ink">
            {t("quotes.form.documentDiscountTitle")}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            {t("quotes.form.documentDiscountDescription")}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label={t("quotes.form.documentDiscountPercentLabel")}
              error={errors.documentDiscountPercent?.message}
              htmlFor={`${idPrefix}-quote-document-discount-percent`}
            >
              <Input
                id={`${idPrefix}-quote-document-discount-percent`}
                type="number"
                step="1"
                min="0"
                max="100"
                inputMode="decimal"
                {...buildOperationalAutofillProps("off")}
                {...documentDiscountPercentField}
              />
            </Field>

            <Field
              label={t("quotes.form.documentDiscountAmountLabel")}
              error={errors.documentDiscountTotal?.message}
              htmlFor={`${idPrefix}-quote-document-discount-amount`}
            >
              <Input
                id={`${idPrefix}-quote-document-discount-amount`}
                type="number"
                step="1"
                min="0"
                inputMode="decimal"
                {...buildOperationalAutofillProps("off")}
                {...documentDiscountTotalField}
              />
            </Field>
          </div>

          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {t("quotes.form.documentDiscountHint", {
              amount: formatCurrency(documentDiscountBase, currencyCode)
            })}
          </p>
        </div>
      </div>
    );
  }

  if (step === "items") {
    return (
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
          const quantityField = register(`lineItems.${index}.quantity`, {
            onChange: (event) => {
              syncLineItemDiscounts({
                discountPercent: lineItems[index]?.discountPercent ?? 0,
                index,
                quantity: event.target.valueAsNumber,
                source: "percent"
              });
            },
            valueAsNumber: true
          });
          const unitPriceField = register(`lineItems.${index}.unitPrice`, {
            onChange: (event) => {
              syncLineItemDiscounts({
                discountPercent: lineItems[index]?.discountPercent ?? 0,
                index,
                source: "percent",
                unitPrice: event.target.valueAsNumber
              });
            },
            valueAsNumber: true
          });
          const discountPercentField = register(
            `lineItems.${index}.discountPercent`,
            {
              onChange: (event) => {
                syncLineItemDiscounts({
                  discountPercent: event.target.valueAsNumber,
                  index,
                  source: "percent"
                });
              },
              valueAsNumber: true
            }
          );
          const discountTotalField = register(
            `lineItems.${index}.discountTotal`,
            {
              onChange: (event) => {
                syncLineItemDiscounts({
                  discountTotal: event.target.valueAsNumber,
                  index,
                  source: "amount"
                });
              },
              valueAsNumber: true
            }
          );

          return (
            <div
              key={field.id}
              className="space-y-4 rounded-3xl border border-line/70 bg-paper/85 p-4"
            >
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
                  {...buildOperationalAutofillProps("off")}
                  onChange={(event) => {
                    catalogField.onChange(event);
                    setValue(`lineItems.${index}.catalogItemId`, event.target.value);
                    hydrateLineItemFromCatalog({
                      catalogItems,
                      discountPercent: lineItems[index]?.discountPercent ?? 0,
                      index,
                      itemId: event.target.value,
                      quantity: lineItems[index]?.quantity ?? 1,
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
                    {...buildOperationalAutofillProps("off")}
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
                    {...buildOperationalAutofillProps("off")}
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
                  {...buildOperationalAutofillProps("off")}
                  {...register(`lineItems.${index}.itemDescription`)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <Field
                  label={t("quotes.form.quantityLabel")}
                  error={errors.lineItems?.[index]?.quantity?.message}
                  htmlFor={`${idPrefix}-line-item-quantity-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-quantity-${index}`}
                    type="number"
                    step="1"
                    min="0"
                    inputMode="decimal"
                    {...buildOperationalAutofillProps("off")}
                    {...quantityField}
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
                    step="1"
                    min="0"
                    inputMode="decimal"
                    {...buildOperationalAutofillProps("off")}
                    {...unitPriceField}
                  />
                </Field>

                <Field
                  label={t("quotes.form.discountPercentLabel")}
                  error={errors.lineItems?.[index]?.discountPercent?.message}
                  htmlFor={`${idPrefix}-line-item-discount-percent-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-discount-percent-${index}`}
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    inputMode="decimal"
                    {...buildOperationalAutofillProps("off")}
                    {...discountPercentField}
                  />
                </Field>

                <Field
                  label={t("quotes.form.discountAmountLabel")}
                  error={errors.lineItems?.[index]?.discountTotal?.message}
                  htmlFor={`${idPrefix}-line-item-discount-${index}`}
                >
                  <Input
                    id={`${idPrefix}-line-item-discount-${index}`}
                    type="number"
                    step="1"
                    min="0"
                    inputMode="decimal"
                    {...buildOperationalAutofillProps("off")}
                    {...discountTotalField}
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
                    step="1"
                    min="0"
                    inputMode="decimal"
                    {...buildOperationalAutofillProps("off")}
                    {...register(`lineItems.${index}.taxTotal`, {
                      valueAsNumber: true
                    })}
                  />
                </Field>
              </div>

              <p className="text-sm leading-6 text-ink-soft">
                {t("quotes.form.discountSyncHint")}
              </p>

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
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
        <p className="text-sm font-semibold text-ink">
          {t("quotes.form.reviewChecklistTitle")}
        </p>
        <div className="mt-3 grid gap-2 text-sm text-ink-soft">
          <p>{t("quotes.form.reviewChecklistRecipient")}</p>
          <p>{t("quotes.form.reviewChecklistDocument")}</p>
          <p>{t("quotes.form.reviewChecklistItems")}</p>
        </div>
      </div>

      <Field
        label={t("quotes.form.notesLabel")}
        error={errors.notes?.message}
        htmlFor={`${idPrefix}-quote-notes`}
      >
        <Textarea
          id={`${idPrefix}-quote-notes`}
          placeholder={t("quotes.form.notesPlaceholder")}
          {...buildOperationalAutofillProps("off")}
          {...register("notes")}
        />
      </Field>
    </div>
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
      documentDiscountPercent: 0,
      documentDiscountTotal: 0,
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
      documentDiscountPercent: 0,
      documentDiscountTotal: 0,
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
    discountPercent: 0,
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
    documentDiscountPercent: 0,
    documentDiscountTotal: 0,
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
    documentDiscountPercent: calculateQuoteDocumentDiscountPercentFromAmount({
      discountTotal: calculateQuoteDocumentDiscountTotalFromCombinedDiscount({
        lineItems: quote.lineItems,
        totalDiscount: quote.discountTotal
      }),
      lineItems: quote.lineItems
    }),
    documentDiscountTotal: calculateQuoteDocumentDiscountTotalFromCombinedDiscount({
      lineItems: quote.lineItems,
      totalDiscount: quote.discountTotal
    }),
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
            discountPercent: calculateQuoteLineDiscountPercentFromAmount({
              discountTotal: lineItem.discountTotal,
              quantity: lineItem.quantity,
              unitPrice: lineItem.unitPrice
            }),
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
    documentDiscountTotal: values.documentDiscountTotal,
    validUntil: values.validUntil,
    notes: values.notes,
    lineItems: values.lineItems.map(({ discountPercent: _discountPercent, ...lineItem }) => lineItem)
  };
}

function hydrateLineItemFromCatalog({
  catalogItems,
  discountPercent,
  index,
  itemId,
  quantity,
  setValue,
  t
}: {
  catalogItems: CatalogItemSummary[];
  discountPercent: number;
  index: number;
  itemId: string;
  quantity: number;
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
  setValue(
    `lineItems.${index}.discountTotal`,
    calculateQuoteLineDiscountAmountFromPercent({
      discountPercent,
      quantity,
      unitPrice: selectedItem.unitPrice ?? 0
    }),
    {
      shouldDirty: true,
      shouldValidate: true
    }
  );
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

function normalizeFieldNumber(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function guideToFirstInvalidField({
  errors,
  form,
  setCurrentStep,
  t
}: {
  errors: UseFormReturn<QuoteFormValues>["formState"]["errors"];
  form: UseFormReturn<QuoteFormValues>;
  setCurrentStep: (step: QuoteFormStepKey) => void;
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  const issues = collectValidationIssues(errors, t);
  const primaryIssue = issues[0];

  if (!primaryIssue) {
    return;
  }

  setCurrentStep(primaryIssue.step);

  const scheduleFocus =
    typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? window.requestAnimationFrame.bind(window)
      : (callback: FrameRequestCallback) => setTimeout(callback, 0);

  scheduleFocus(() => {
    if (primaryIssue.field) {
      form.setFocus(primaryIssue.field);
    }
  });

  toast.error(
    t("quotes.form.validationToast", {
      count: issues.length,
      label: primaryIssue.label
    })
  );
}

function getFieldsForStep(
  step: QuoteFormStepKey,
  lineItemCount: number
) {
  if (step === "recipient") {
    return [
      "recipientKind",
      "customerId",
      "leadId",
      "recipientDisplayName",
      "recipientContactName",
      "recipientEmail",
      "recipientWhatsApp",
      "recipientPhone"
    ] satisfies QuoteFieldPath[];
  }

  if (step === "document") {
    return [
      "title",
      "status",
      "currencyCode",
      "documentDiscountPercent",
      "documentDiscountTotal",
      "validUntil"
    ] satisfies QuoteFieldPath[];
  }

  if (step === "review") {
    return ["notes"] satisfies QuoteFieldPath[];
  }

  const lineItemFields: QuoteFieldPath[] = [];

  for (let index = 0; index < lineItemCount; index += 1) {
    lineItemFields.push(
      `lineItems.${index}.catalogItemId` as QuoteFieldPath,
      `lineItems.${index}.itemName` as QuoteFieldPath,
      `lineItems.${index}.itemDescription` as QuoteFieldPath,
      `lineItems.${index}.quantity` as QuoteFieldPath,
      `lineItems.${index}.unitLabel` as QuoteFieldPath,
      `lineItems.${index}.unitPrice` as QuoteFieldPath,
      `lineItems.${index}.discountPercent` as QuoteFieldPath,
      `lineItems.${index}.discountTotal` as QuoteFieldPath,
      `lineItems.${index}.taxTotal` as QuoteFieldPath
    );
  }

  return lineItemFields.length > 0
    ? lineItemFields
    : (["lineItems"] satisfies QuoteFieldPath[]);
}

function collectValidationIssues(
  errors: UseFormReturn<QuoteFormValues>["formState"]["errors"],
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  const issues: ValidationIssue[] = [];

  appendValidationIssues({
    errors,
    issues,
    parentPath: "",
    t
  });

  const uniqueIssues = new Map<string, ValidationIssue>();

  for (const issue of issues) {
    if (!uniqueIssues.has(issue.key)) {
      uniqueIssues.set(issue.key, issue);
    }
  }

  return [...uniqueIssues.values()];
}

function appendValidationIssues({
  errors,
  issues,
  parentPath,
  t
}: {
  errors: FieldErrors<QuoteFormValues> | Record<string, unknown>;
  issues: ValidationIssue[];
  parentPath: string;
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  for (const [fieldName, fieldValue] of Object.entries(errors)) {
    if (!fieldValue) {
      continue;
    }

    const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((nestedValue, index) => {
        if (!nestedValue) {
          return;
        }

        appendValidationIssues({
          errors: nestedValue as Record<string, unknown>,
          issues,
          parentPath: `${fieldPath}.${index}`,
          t
        });
      });
      continue;
    }

    if (
      typeof fieldValue === "object" &&
      "message" in fieldValue &&
      typeof fieldValue.message === "string"
    ) {
      const normalizedFieldPath = fieldPath as QuoteFieldPath;

      issues.push({
        field: normalizedFieldPath,
        key: fieldPath,
        label: getFieldLabel(fieldPath, t),
        message: fieldValue.message,
        step: getStepForField(fieldPath)
      });
      continue;
    }

    if (typeof fieldValue === "object") {
      appendValidationIssues({
        errors: fieldValue as Record<string, unknown>,
        issues,
        parentPath: fieldPath,
        t
      });
    }
  }
}

function getStepForField(fieldPath: string): QuoteFormStepKey {
  if (fieldPath.startsWith("lineItems")) {
    return "items";
  }

  if (
    fieldPath === "title" ||
    fieldPath === "status" ||
    fieldPath === "currencyCode" ||
    fieldPath === "documentDiscountPercent" ||
    fieldPath === "documentDiscountTotal" ||
    fieldPath === "validUntil"
  ) {
    return "document";
  }

  if (fieldPath === "notes") {
    return "review";
  }

  return "recipient";
}

function getFieldLabel(
  fieldPath: string,
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  const lineItemMatch = /^lineItems\.(\d+)\.(.+)$/.exec(fieldPath);

  if (lineItemMatch) {
    const lineIndex = Number(lineItemMatch[1] ?? 0) + 1;
    const lineField = lineItemMatch[2];
    const lineItemLabel = t("quotes.form.lineItemLabel", { index: lineIndex });

    const lineFieldLabels: Record<string, string> = {
      catalogItemId: t("quotes.form.catalogItemLabel"),
      itemName: t("quotes.form.lineItemNameLabel"),
      itemDescription: t("quotes.form.lineItemDescriptionLabel"),
      quantity: t("quotes.form.quantityLabel"),
      unitLabel: t("quotes.form.unitLabelLabel"),
      unitPrice: t("quotes.form.unitPriceLabel"),
      discountPercent: t("quotes.form.discountPercentLabel"),
      discountTotal: t("quotes.form.discountAmountLabel"),
      taxTotal: t("quotes.form.taxTotalLabel")
    };

    return `${lineItemLabel} · ${lineFieldLabels[lineField] ?? lineField}`;
  }

  const labels: Record<string, string> = {
    recipientKind: t("quotes.form.recipientKindLabel"),
    customerId: t("quotes.form.customerLabel"),
    leadId: t("quotes.form.leadLabel"),
    recipientDisplayName: t("quotes.form.recipientDisplayNameLabel"),
    recipientContactName: t("quotes.form.recipientContactNameLabel"),
    recipientEmail: t("quotes.form.recipientEmailLabel"),
    recipientWhatsApp: t("quotes.form.recipientWhatsAppLabel"),
    recipientPhone: t("quotes.form.recipientPhoneLabel"),
    title: t("quotes.form.titleLabel"),
    status: t("quotes.form.statusLabel"),
    currencyCode: t("quotes.form.currencyCodeLabel"),
    documentDiscountPercent: t("quotes.form.documentDiscountPercentLabel"),
    documentDiscountTotal: t("quotes.form.documentDiscountAmountLabel"),
    validUntil: t("quotes.form.validUntilLabel"),
    notes: t("quotes.form.notesLabel")
  };

  return labels[fieldPath] ?? fieldPath;
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper/75 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
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
