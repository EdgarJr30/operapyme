import { useMemo, useState } from "react";

import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LeadIntakeForm } from "@/modules/crm/lead-intake-form";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { useLeadMutations } from "@/modules/crm/use-lead-mutations";

export function CommercialLeadsPage() {
  const { t } = useTranslation("backoffice");
  const { data: leads = [] } = useLeadsData();
  const { convertLeadToCustomerMutation } = useLeadMutations();
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);

  const recentLeads = useMemo(() => leads.slice(0, 6), [leads]);

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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
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
