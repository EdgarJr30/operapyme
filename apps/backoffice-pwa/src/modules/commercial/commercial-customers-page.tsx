import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { createCustomerFormSchema, type CustomerFormValues } from "@/lib/forms/customer-form-schema";
import type { CustomerStatus, CustomerSummary } from "@/lib/supabase/backoffice-data";
import {
  CustomerFormFields,
  customerFormDefaultValues,
  getCustomerSourceTranslationKey,
  mapCustomerToFormValues
} from "@/modules/crm/customer-form-fields";
import { useCustomerMutations } from "@/modules/crm/use-customer-mutations";
import { useCustomersData } from "@/modules/crm/use-customers-data";

type CustomerModalMode = "create" | "edit" | null;
type CustomerTableFilter = "operational" | "archived" | "all";

const customerStatusesByFilter: Record<CustomerTableFilter, CustomerStatus[]> = {
  operational: ["active", "inactive"],
  archived: ["archived"],
  all: []
};

export function CommercialCustomersPage() {
  const { t } = useTranslation("backoffice");
  const [searchValue, setSearchValue] = useState("");
  const [tableFilter, setTableFilter] =
    useState<CustomerTableFilter>("operational");
  const [modalMode, setModalMode] = useState<CustomerModalMode>(null);
  const [pendingArchiveCustomerId, setPendingArchiveCustomerId] = useState<
    string | null
  >(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const statuses = customerStatusesByFilter[tableFilter];
  const {
    data: customers = [],
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useCustomersData({
    limit: null,
    statuses
  });
  const {
    archiveCustomerMutation,
    createCustomerMutation,
    updateCustomerMutation
  } = useCustomerMutations();
  const customerFormSchema = createCustomerFormSchema(t);
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customerFormDefaultValues
  });

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.displayName,
        customer.contactName,
        customer.email,
        customer.whatsapp,
        customer.customerCode
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    );
  }, [customers, searchValue]);

  useEffect(() => {
    if (modalMode === "edit" && selectedCustomer) {
      form.reset(mapCustomerToFormValues(selectedCustomer));
      return;
    }

    if (modalMode === "create") {
      form.reset(customerFormDefaultValues);
    }
  }, [form, modalMode, selectedCustomer]);

  function closeModal() {
    setModalMode(null);
    setSelectedCustomerId(null);
    form.reset(customerFormDefaultValues);
  }

  function closeArchiveDialog() {
    setPendingArchiveCustomerId(null);
  }

  function openCreateModal() {
    setSelectedCustomerId(null);
    setModalMode("create");
  }

  function openEditModal(customer: CustomerSummary) {
    setSelectedCustomerId(customer.id);
    setModalMode("edit");
  }

  function openArchiveDialog(customer: CustomerSummary) {
    if (customer.status === "archived") {
      return;
    }

    setPendingArchiveCustomerId(customer.id);
  }

  async function handleSubmit(values: CustomerFormValues) {
    try {
      if (modalMode === "edit" && selectedCustomer) {
        await updateCustomerMutation.mutateAsync({
          customerId: selectedCustomer.id,
          ...values
        });
        toast.success(t("crm.customerForm.updateSuccess"));
      } else {
        await createCustomerMutation.mutateAsync(values);
        toast.success(t("crm.customerForm.createSuccess"));
      }

      closeModal();
    } catch (submitError) {
      toast.error(
        modalMode === "edit"
          ? t("crm.customerForm.updateError", {
              message: submitError instanceof Error ? submitError.message : ""
            })
          : t("crm.customerForm.createError", {
              message: submitError instanceof Error ? submitError.message : ""
            })
      );
    }
  }

  const pendingArchiveCustomer = useMemo(
    () =>
      customers.find((customer) => customer.id === pendingArchiveCustomerId) ??
      null,
    [customers, pendingArchiveCustomerId]
  );

  async function handleArchiveCustomer() {
    if (!pendingArchiveCustomer || pendingArchiveCustomer.status === "archived") {
      return;
    }

    try {
      await archiveCustomerMutation.mutateAsync({
        customerId: pendingArchiveCustomer.id
      });
      closeArchiveDialog();
      toast.success(
        t("commercial.customers.archiveSuccess", {
          customer: pendingArchiveCustomer.displayName
        })
      );

      if (selectedCustomerId === pendingArchiveCustomer.id) {
        closeModal();
      }
    } catch (archiveError) {
      toast.error(
        t("commercial.customers.archiveError", {
          message: archiveError instanceof Error ? archiveError.message : ""
        })
      );
    }
  }

  const modalTitle =
    modalMode === "edit"
      ? t("commercial.customers.editModalTitle")
      : t("commercial.customers.createModalTitle");
  const modalDescription =
    modalMode === "edit"
      ? t("commercial.customers.editModalDescription")
      : t("commercial.customers.createModalDescription");
  const isSubmitting =
    modalMode === "edit"
      ? updateCustomerMutation.isPending
      : createCustomerMutation.isPending;
  const isArchiving = archiveCustomerMutation.isPending;

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("navigation.commercialCustomers")}</h1>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>{t("commercial.customers.pageTitle")}</CardTitle>
              <CardDescription>
                {t("commercial.customers.pageDescription")}
              </CardDescription>
            </div>

            <Button
              type="button"
              size="lg"
              className="gap-2"
              onClick={openCreateModal}
            >
              <Plus className="size-4" />
              {t("commercial.customers.createAction")}
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <Input
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
                placeholder={t("commercial.customers.searchPlaceholder")}
                className="pl-10"
              />
            </label>

            <Select
              value={tableFilter}
              onChange={(event) => {
                setTableFilter(event.target.value as CustomerTableFilter);
              }}
            >
              <option value="operational">
                {t("commercial.customers.filters.operational")}
              </option>
              <option value="archived">
                {t("commercial.customers.filters.archived")}
              </option>
              <option value="all">{t("commercial.customers.filters.all")}</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {!hasTenantContext ? (
            <TableState
              title={t("crm.recent.noTenantTitle")}
              description={t("crm.recent.noTenantDescription")}
            />
          ) : isLoading ? (
            <TableState
              title={t("commercial.customers.loadingTitle")}
              description={t("commercial.customers.loadingDescription")}
            />
          ) : isError ? (
            <TableState
              title={t("commercial.customers.errorTitle")}
              description={t("commercial.customers.errorDescription", {
                message: error instanceof Error ? error.message : ""
              })}
              action={
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    void refetch();
                  }}
                >
                  {t("crm.recent.retryAction")}
                </Button>
              }
            />
          ) : filteredCustomers.length === 0 ? (
            <TableState
              title={
                customers.length === 0
                  ? t("commercial.customers.emptyTitle")
                  : t("commercial.customers.emptySearchTitle")
              }
              description={
                customers.length === 0
                  ? t("commercial.customers.emptyDescription")
                  : t("commercial.customers.emptySearchDescription")
              }
            />
          ) : (
            <Table className="min-w-190">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">
                    {t("navigation.commercialCustomers")}
                  </TableHead>
                  <TableHead>{t("crm.customerForm.contactNameLabel")}</TableHead>
                  <TableHead>{t("crm.recent.originLabel")}</TableHead>
                  <TableHead>{t("crm.customerForm.statusLabel")}</TableHead>
                  <TableHead className="pr-0 text-right">
                    {t("commercial.customers.actionsLabel")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="pl-0">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-sm font-semibold text-ink">
                          {getCustomerInitials(customer.displayName)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-ink">
                            {customer.displayName}
                          </p>
                          <p className="text-sm text-ink-soft">
                            {customer.email ??
                              customer.whatsapp ??
                              t("commercial.customers.noContact")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.contactName ?? "—"}</TableCell>
                    <TableCell>
                      {t(getCustomerSourceTranslationKey(customer.source))}
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={getCustomerTone(customer.status)}>
                        {t(`crm.recent.customerStatus.${customer.status}`)}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="pr-0 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            openEditModal(customer);
                          }}
                        >
                          <Pencil className="size-4" />
                          {t("commercial.customers.editAction")}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-ink"
                          disabled={
                            isArchiving ||
                            customer.status === "archived"
                          }
                          onClick={() => {
                            openArchiveDialog(customer);
                          }}
                        >
                          <Trash2 className="size-4" />
                          {t("commercial.customers.archiveAction")}
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

      <Dialog
        open={pendingArchiveCustomer !== null}
        onOpenChange={(open) => {
          if (!open && !isArchiving) {
            closeArchiveDialog();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("commercial.customers.archiveConfirmTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("commercial.customers.archiveConfirmDescription", {
                customer: pendingArchiveCustomer?.displayName ?? ""
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="rounded-3xl border border-line/70 bg-sand/35 px-4 py-3 text-sm leading-6 text-ink-soft">
              {t("commercial.customers.archiveConfirmNote")}
            </p>

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={closeArchiveDialog}
                disabled={isArchiving}
              >
                {t("commercial.customers.cancelAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                className="bg-danger text-white hover:bg-danger/90"
                onClick={() => {
                  void handleArchiveCustomer();
                }}
                disabled={isArchiving || pendingArchiveCustomer === null}
              >
                {isArchiving
                  ? t("commercial.customers.archiveSubmitting")
                  : t("commercial.customers.archiveConfirmAction")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")}>
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription>{modalDescription}</DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
          >
            <CustomerFormFields form={form} idPrefix={modalMode ?? "customer"} />

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={closeModal}
              >
                {t("commercial.customers.cancelAction")}
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting
                  ? modalMode === "edit"
                    ? t("crm.customerForm.updateSubmitting")
                    : t("crm.customerForm.createSubmitting")
                  : modalMode === "edit"
                    ? t("crm.customerForm.updateAction")
                    : t("crm.customerForm.createAction")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TableState({
  action,
  description,
  title
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function getCustomerInitials(displayName: string) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

function getCustomerTone(status: CustomerStatus) {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "warning";
    case "archived":
      return "neutral";
  }
}
