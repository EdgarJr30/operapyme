import { useMemo } from "react";

import { useTranslation } from "@operapyme/i18n";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { CustomerOperationsPanel } from "@/modules/crm/customer-operations-panel";
import { useCustomersData } from "@/modules/crm/use-customers-data";

export function CommercialCustomersPage() {
  const { t } = useTranslation("backoffice");
  const { data: customers = [] } = useCustomersData();
  const recentCustomers = useMemo(() => customers.slice(0, 8), [customers]);

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("navigation.commercialCustomers")}</h1>

      <section className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("commercial.customers.tableTitle")}</CardTitle>
            <p className="text-sm leading-6 text-ink-soft">
              {t("commercial.customers.tableDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {recentCustomers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
                <p className="text-sm font-medium text-ink">
                  {t("commercial.customers.emptyTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("commercial.customers.emptyDescription")}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("navigation.commercialCustomers")}</TableHead>
                    <TableHead>{t("crm.customerForm.contactNameLabel")}</TableHead>
                    <TableHead>{t("crm.recent.originLabel")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-ink">{customer.displayName}</p>
                          <p className="text-xs text-ink-soft">
                            {customer.email ?? customer.whatsapp ?? "—"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.contactName ?? "—"}</TableCell>
                      <TableCell>
                        {t(
                          `crm.recent.source.${customer.source === "walk-in" ? "walkIn" : customer.source}`
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <CustomerOperationsPanel customers={customers} />
      </section>
    </div>
  );
}
