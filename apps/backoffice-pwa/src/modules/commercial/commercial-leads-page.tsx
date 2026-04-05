import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@operapyme/i18n";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildOperationalAutofillProps } from "@/lib/forms/autofill";
import {
  createLeadIntakeSchema,
  type LeadIntakeValues,
  leadSourceValues
} from "@/lib/forms/lead-intake-schema";
import type { LeadSummary } from "@/lib/supabase/backoffice-data";
import { LeadIntakeForm } from "@/modules/crm/lead-intake-form";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { useLeadMutations } from "@/modules/crm/use-lead-mutations";

export function CommercialLeadsPage() {
  const { t } = useTranslation("backoffice");
  const { data: leads = [] } = useLeadsData();
  const { convertLeadToCustomerMutation, updateLeadMutation } = useLeadMutations();
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<LeadSummary | null>(null);
  const leadSchema = createLeadIntakeSchema(t);
  const editForm = useForm<LeadIntakeValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: buildLeadEditDefaults()
  });

  const recentLeads = useMemo(() => leads.slice(0, 6), [leads]);

  useEffect(() => {
    if (!editingLead) {
      return;
    }

    editForm.reset({
      company: editingLead.displayName,
      contactName: editingLead.contactName ?? "",
      email: editingLead.email ?? "",
      whatsapp: editingLead.whatsapp ?? "",
      source: normalizeLeadEditSource(editingLead.source),
      needSummary: editingLead.needSummary ?? ""
    });
  }, [editForm, editingLead]);

  async function handleConvertLead(leadIndex: number) {
    const lead = recentLeads[leadIndex];

    if (!lead || lead.convertedCustomerId) {
      return;
    }

    try {
      setPendingLeadId(lead.id);
      await convertLeadToCustomerMutation.mutateAsync({
        leadId: lead.id
      });

      toast.success(
        t("commercial.leads.convertSuccess", { lead: lead.displayName })
      );
    } catch (error) {
      toast.error(
        t("commercial.leads.convertError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    } finally {
      setPendingLeadId((currentLeadId) =>
        currentLeadId === lead.id ? null : currentLeadId
      );
    }
  }

  async function onEditSubmit(values: LeadIntakeValues) {
    if (!editingLead) {
      return;
    }

    try {
      await updateLeadMutation.mutateAsync({
        leadId: editingLead.id,
        displayName: values.company,
        contactName: values.contactName,
        email: values.email,
        whatsapp: values.whatsapp,
        source: values.source,
        status: editingLead.status,
        needSummary: values.needSummary
      });
      toast.success(
        t("commercial.leads.editSuccess", { lead: values.company })
      );
      closeEditModal();
    } catch (error) {
      toast.error(
        t("commercial.leads.editError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  function closeEditModal() {
    setEditingLead(null);
    editForm.reset(buildLeadEditDefaults());
  }

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("navigation.commercialLeads")}</h1>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
        <LeadIntakeForm />

        <Card>
          <CardHeader>
            <CardTitle>{t("commercial.leads.tableTitle")}</CardTitle>
            <p className="text-sm leading-6 text-ink-soft">
              {t("commercial.leads.tableDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <EmptyState
                title={t("commercial.leads.emptyTitle")}
                description={t("commercial.leads.emptyDescription")}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("navigation.commercialLeads")}</TableHead>
                    <TableHead>{t("quotes.form.recipientContactNameLabel")}</TableHead>
                    <TableHead className="text-right">
                      {t("commercial.leads.convertAction")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.map((lead, index) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-ink">{lead.displayName}</p>
                          <p className="text-xs text-ink-soft">
                            {lead.needSummary ?? t("commercial.leads.noContact")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.contactName ?? lead.email ?? t("commercial.leads.noContact")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingLead(lead);
                            }}
                            disabled={updateLeadMutation.isPending}
                          >
                            {t("commercial.leads.editAction")}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              void handleConvertLead(index);
                            }}
                            disabled={
                              convertLeadToCustomerMutation.isPending ||
                              pendingLeadId === lead.id ||
                              Boolean(lead.convertedCustomerId)
                            }
                          >
                            {pendingLeadId === lead.id
                              ? t("commercial.leads.convertSubmitting")
                              : t("commercial.leads.convertAction")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <Dialog
        open={editingLead !== null}
        onOpenChange={(open) => {
          if (!open && !updateLeadMutation.isPending) {
            closeEditModal();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("commercial.leads.editModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("commercial.leads.editModalDescription")}
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            noValidate
            {...buildOperationalAutofillProps("off")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("crm.form.companyLabel")}
                error={editForm.formState.errors.company?.message}
                htmlFor="edit-lead-company"
              >
                <Input
                  id="edit-lead-company"
                  placeholder={t("crm.form.companyPlaceholder")}
                  {...editForm.register("company")}
                />
              </Field>

              <Field
                label={t("crm.form.contactNameLabel")}
                error={editForm.formState.errors.contactName?.message}
                htmlFor="edit-lead-contact-name"
              >
                <Input
                  id="edit-lead-contact-name"
                  placeholder={t("crm.form.contactNamePlaceholder")}
                  {...editForm.register("contactName")}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("crm.form.emailLabel")}
                error={editForm.formState.errors.email?.message}
                htmlFor="edit-lead-email"
              >
                <Input
                  id="edit-lead-email"
                  type="email"
                  placeholder={t("crm.form.emailPlaceholder")}
                  {...editForm.register("email")}
                />
              </Field>

              <Field
                label={t("crm.form.whatsappLabel")}
                error={editForm.formState.errors.whatsapp?.message}
                htmlFor="edit-lead-whatsapp"
              >
                <Input
                  id="edit-lead-whatsapp"
                  placeholder={t("crm.form.whatsappPlaceholder")}
                  {...editForm.register("whatsapp")}
                />
              </Field>
            </div>

            <Field
              label={t("crm.form.sourceLabel")}
              error={editForm.formState.errors.source?.message}
              htmlFor="edit-lead-source"
            >
              <Select id="edit-lead-source" {...editForm.register("source")}>
                {leadSourceValues.map((source) => (
                  <option key={source} value={source}>
                    {t(`crm.form.source${toSourceTranslationSuffix(source)}`)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label={t("crm.form.needSummaryLabel")}
              error={editForm.formState.errors.needSummary?.message}
              htmlFor="edit-lead-need-summary"
            >
              <Textarea
                id="edit-lead-need-summary"
                placeholder={t("crm.form.needSummaryPlaceholder")}
                {...editForm.register("needSummary")}
              />
            </Field>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={closeEditModal}
                disabled={updateLeadMutation.isPending}
              >
                {t("commercial.leads.editCancelAction")}
              </Button>
              <Button type="submit" disabled={updateLeadMutation.isPending}>
                {updateLeadMutation.isPending
                  ? t("commercial.leads.editSubmitting")
                  : t("commercial.leads.editSaveAction")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildLeadEditDefaults(): LeadIntakeValues {
  return {
    company: "",
    contactName: "",
    email: "",
    whatsapp: "",
    source: "whatsapp",
    needSummary: ""
  };
}

function toSourceTranslationSuffix(source: (typeof leadSourceValues)[number]) {
  switch (source) {
    case "website":
      return "Website";
    case "whatsapp":
      return "Whatsapp";
    case "walk-in":
      return "WalkIn";
    case "repeat":
      return "Repeat";
    default:
      return "Website";
  }
}

function normalizeLeadEditSource(
  source: LeadSummary["source"]
): (typeof leadSourceValues)[number] {
  if (leadSourceValues.includes(source as (typeof leadSourceValues)[number])) {
    return source as (typeof leadSourceValues)[number];
  }

  return "website";
}

function Field({
  children,
  error,
  htmlFor,
  label
}: {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <label className="space-y-2" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error ? <p className="text-sm text-peach-400">{error}</p> : null}
    </label>
  );
}

function EmptyState({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
    </div>
  );
}
