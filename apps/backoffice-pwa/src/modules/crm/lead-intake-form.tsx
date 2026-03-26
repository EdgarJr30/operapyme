import { type ReactNode, useState } from "react";

import { useTranslation } from "@operapyme/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { StatusPill } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import {
  createLeadIntakeSchema,
  type LeadIntakeValues,
  leadSourceValues
} from "@/lib/forms/lead-intake-schema";

const defaultValues: LeadIntakeValues = {
  company: "",
  contactName: "",
  email: "",
  whatsapp: "",
  source: "whatsapp",
  needSummary: ""
};

export function LeadIntakeForm() {
  const { t } = useTranslation("backoffice");
  const [submittedLead, setSubmittedLead] = useState<LeadIntakeValues | null>(
    null
  );

  const leadIntakeSchema = createLeadIntakeSchema(t);

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LeadIntakeValues>({
    resolver: zodResolver(leadIntakeSchema),
    defaultValues
  });

  const draftLead = watch();
  const hasDraft = hasLeadDraft(draftLead);
  const previewLead = hasDraft ? draftLead : submittedLead;
  const previewStatusKey = hasDraft
    ? "crm.form.previewDraftStatus"
    : submittedLead
      ? "crm.form.previewStatus"
      : null;

  const onSubmit = async (values: LeadIntakeValues) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSubmittedLead(values);
    reset(defaultValues);
  };

  const handleClear = () => {
    setSubmittedLead(null);
    reset(defaultValues);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t("crm.form.title")}</CardTitle>
          <CardDescription>
            {t("crm.form.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("crm.form.companyLabel")}
                error={errors.company?.message}
                errorId="company-error"
                htmlFor="company"
              >
                <Input
                  id="company"
                  placeholder={t("crm.form.companyPlaceholder")}
                  autoComplete="organization"
                  aria-describedby={errors.company ? "company-error" : undefined}
                  aria-invalid={Boolean(errors.company)}
                  {...register("company")}
                />
              </Field>

              <Field
                label={t("crm.form.contactNameLabel")}
                error={errors.contactName?.message}
                errorId="contactName-error"
                htmlFor="contactName"
              >
                <Input
                  id="contactName"
                  placeholder={t("crm.form.contactNamePlaceholder")}
                  autoComplete="name"
                  aria-describedby={
                    errors.contactName ? "contactName-error" : undefined
                  }
                  aria-invalid={Boolean(errors.contactName)}
                  {...register("contactName")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("crm.form.emailLabel")}
                error={errors.email?.message}
                errorId="email-error"
                htmlFor="email"
              >
                <Input
                  id="email"
                  type="email"
                  placeholder={t("crm.form.emailPlaceholder")}
                  autoComplete="email"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>

              <Field
                label={t("crm.form.whatsappLabel")}
                error={errors.whatsapp?.message}
                errorId="whatsapp-error"
                htmlFor="whatsapp"
              >
                <Input
                  id="whatsapp"
                  placeholder={t("crm.form.whatsappPlaceholder")}
                  autoComplete="tel"
                  aria-describedby={
                    errors.whatsapp ? "whatsapp-error" : undefined
                  }
                  aria-invalid={Boolean(errors.whatsapp)}
                  {...register("whatsapp")}
                />
              </Field>
            </div>

            <Field
              label={t("crm.form.sourceLabel")}
              error={errors.source?.message}
              errorId="source-error"
              htmlFor="source"
            >
              <Select
                id="source"
                aria-describedby={errors.source ? "source-error" : undefined}
                aria-invalid={Boolean(errors.source)}
                {...register("source")}
              >
                {leadSourceValues.map((source) => (
                  <option key={source} value={source}>
                    {t(`crm.form.source${toSourceTranslationSuffix(source)}`)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label={t("crm.form.needSummaryLabel")}
              error={errors.needSummary?.message}
              errorId="needSummary-error"
              htmlFor="needSummary"
            >
              <Textarea
                id="needSummary"
                placeholder={t("crm.form.needSummaryPlaceholder")}
                aria-describedby={
                  errors.needSummary ? "needSummary-error" : undefined
                }
                aria-invalid={Boolean(errors.needSummary)}
                {...register("needSummary")}
              />
            </Field>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? t("crm.form.submitting") : t("crm.form.submit")}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={handleClear}
              >
                {t("crm.form.clear")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-paper via-paper to-sage-200/50">
        <CardHeader>
          <CardTitle>{t("crm.form.previewTitle")}</CardTitle>
          <CardDescription>
            {t("crm.form.previewDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {previewLead ? (
            <div className="space-y-4" aria-live="polite">
              {previewStatusKey ? (
                <StatusPill tone="success">{t(previewStatusKey)}</StatusPill>
              ) : null}
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-ink-muted">{t("crm.form.previewCompany")}</dt>
                  <dd className="font-medium text-ink">
                    {getPreviewValue(previewLead.company, t)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t("crm.form.previewContact")}</dt>
                  <dd className="font-medium text-ink">
                    {getPreviewValue(previewLead.contactName, t)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t("crm.form.previewChannel")}</dt>
                  <dd className="font-medium text-ink">
                    {t(
                      `crm.form.source${toSourceTranslationSuffix(
                        previewLead.source
                      )}`
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t("crm.form.previewNeed")}</dt>
                  <dd className="leading-6 text-ink-soft">
                    {getPreviewValue(previewLead.needSummary, t)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
              <p className="text-sm font-medium text-ink">
                {t("crm.form.previewEmptyTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("crm.form.previewEmptyDescription")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function toSourceTranslationSuffix(source: LeadIntakeValues["source"]) {
  switch (source) {
    case "website":
      return "Website";
    case "whatsapp":
      return "Whatsapp";
    case "walk-in":
      return "WalkIn";
    case "repeat":
      return "Repeat";
  }
}

interface FieldProps {
  children: ReactNode;
  error?: string;
  errorId?: string;
  htmlFor: string;
  label: string;
}

function Field({ children, error, errorId, htmlFor, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-peach-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function hasLeadDraft(values: LeadIntakeValues) {
  return (
    values.company.trim() !== defaultValues.company ||
    values.contactName.trim() !== defaultValues.contactName ||
    values.email.trim() !== defaultValues.email ||
    values.whatsapp.trim() !== defaultValues.whatsapp ||
    values.source !== defaultValues.source ||
    values.needSummary.trim() !== defaultValues.needSummary
  );
}

function getPreviewValue(
  value: string,
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  return value.trim() || t("crm.form.previewPendingValue");
}
