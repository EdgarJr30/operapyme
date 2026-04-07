import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Eye, Link2, Paperclip, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
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
import {
  deleteCustomerAttachment,
  getCustomerAttachmentSignedUrl,
  getCustomerBalanceSummary,
  type CustomerBalanceSummary,
  type CustomerStatus,
  type CustomerSummary,
  uploadCustomerAttachment
} from "@/lib/supabase/backoffice-data";
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
  const { activeTenantId } = useBackofficeAuth();
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
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null);
  const [attachmentDraftFile, setAttachmentDraftFile] = useState<File | null>(
    null
  );
  const [isAttachmentMarkedForRemoval, setIsAttachmentMarkedForRemoval] =
    useState(false);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
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
  const detailCustomer = useMemo(
    () => customers.find((customer) => customer.id === detailCustomerId) ?? null,
    [customers, detailCustomerId]
  );
  const attachmentPreviewName =
    attachmentDraftFile?.name ??
    (isAttachmentMarkedForRemoval ? null : selectedCustomer?.attachmentName ?? null);
  const editAttachmentQuery = useQuery({
    queryKey: ["customer-attachment", selectedCustomer?.attachmentPath ?? "none"],
    queryFn: () => getCustomerAttachmentSignedUrl(selectedCustomer?.attachmentPath),
    enabled: Boolean(modalMode === "edit" && selectedCustomer?.attachmentPath && !attachmentDraftFile && !isAttachmentMarkedForRemoval)
  });
  const detailAttachmentQuery = useQuery({
    queryKey: ["customer-attachment", detailCustomer?.attachmentPath ?? "none"],
    queryFn: () => getCustomerAttachmentSignedUrl(detailCustomer?.attachmentPath),
    enabled: Boolean(detailCustomer?.attachmentPath)
  });
  const detailBalanceQuery = useQuery({
    queryKey: ["customer-balance", activeTenantId, detailCustomerId],
    queryFn: () =>
      getCustomerBalanceSummary(activeTenantId ?? "", detailCustomerId ?? ""),
    enabled: Boolean(activeTenantId && detailCustomerId)
  });

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
        customer.customerCode,
        customer.documentId,
        customer.passportId,
        customer.websiteUrl
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    );
  }, [customers, searchValue]);

  useEffect(() => {
    if (modalMode === "edit" && selectedCustomer) {
      form.reset(mapCustomerToFormValues(selectedCustomer));
      setAttachmentDraftFile(null);
      setIsAttachmentMarkedForRemoval(false);
      return;
    }

    if (modalMode === "create") {
      form.reset(customerFormDefaultValues);
      setAttachmentDraftFile(null);
      setIsAttachmentMarkedForRemoval(false);
    }
  }, [form, modalMode, selectedCustomer]);

  function closeModal() {
    setModalMode(null);
    setSelectedCustomerId(null);
    setAttachmentDraftFile(null);
    setIsAttachmentMarkedForRemoval(false);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
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

  function closeDetailSheet() {
    setDetailCustomerId(null);
  }

  function openDetailSheet(customer: CustomerSummary) {
    setDetailCustomerId(customer.id);
  }

  function handleAttachmentChange(fileList: FileList | null) {
    const nextFile = fileList?.[0] ?? null;

    setAttachmentDraftFile(nextFile);
    setIsAttachmentMarkedForRemoval(false);
  }

  function removeDraftAttachment() {
    setAttachmentDraftFile(null);
    setIsAttachmentMarkedForRemoval(true);

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  async function handleSubmit(values: CustomerFormValues) {
    const tenantId = activeTenantId?.trim() ?? "";
    let uploadedAttachmentPath: string | null = null;

    try {
      let nextAttachmentPath =
        modalMode === "edit" && !isAttachmentMarkedForRemoval
          ? selectedCustomer?.attachmentPath ?? null
          : null;
      let nextAttachmentName =
        modalMode === "edit" && !isAttachmentMarkedForRemoval
          ? selectedCustomer?.attachmentName ?? null
          : null;

      if (attachmentDraftFile) {
        uploadedAttachmentPath = await uploadCustomerAttachment(
          tenantId,
          attachmentDraftFile
        );
        nextAttachmentPath = uploadedAttachmentPath;
        nextAttachmentName = attachmentDraftFile.name;
      } else if (isAttachmentMarkedForRemoval) {
        nextAttachmentPath = null;
        nextAttachmentName = null;
      }

      if (modalMode === "edit" && selectedCustomer) {
        await updateCustomerMutation.mutateAsync({
          customerId: selectedCustomer.id,
          ...values,
          attachmentName: nextAttachmentName,
          attachmentPath: nextAttachmentPath
        });

        if (
          selectedCustomer.attachmentPath &&
          selectedCustomer.attachmentPath !== nextAttachmentPath
        ) {
          void deleteCustomerAttachment(selectedCustomer.attachmentPath).catch(
            () => undefined
          );
        }

        toast.success(t("crm.customerForm.updateSuccess"));
      } else {
        await createCustomerMutation.mutateAsync({
          ...values,
          attachmentName: nextAttachmentName,
          attachmentPath: nextAttachmentPath
        });
        toast.success(t("crm.customerForm.createSuccess"));
      }

      closeModal();
    } catch (submitError) {
      if (uploadedAttachmentPath) {
        void deleteCustomerAttachment(uploadedAttachmentPath).catch(
          () => undefined
        );
      }

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
                  <TableHead>{t("crm.customerForm.customerCodeLabel")}</TableHead>
                  <TableHead>{t("crm.customerForm.contactNameLabel")}</TableHead>
                  <TableHead>{t("crm.customerForm.documentIdLabel")}</TableHead>
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
                          <button
                            type="button"
                            className="cursor-pointer text-left font-medium text-ink transition hover:text-brand"
                            onClick={() => {
                              openDetailSheet(customer);
                            }}
                          >
                            {customer.displayName}
                          </button>
                          <p className="text-sm text-ink-soft">
                            {customer.email ??
                              customer.whatsapp ??
                              t("commercial.customers.noContact")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.customerCode ?? "—"}</TableCell>
                    <TableCell>{customer.contactName ?? "—"}</TableCell>
                    <TableCell>
                      {customer.isForeign
                        ? customer.passportId ?? "—"
                        : customer.documentId ?? "—"}
                    </TableCell>
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
                            openDetailSheet(customer);
                          }}
                        >
                          <Eye className="size-4" />
                          {t("commercial.customers.viewAction")}
                        </Button>
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

          <input
            ref={attachmentInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
            className="sr-only"
            onChange={(event) => {
              handleAttachmentChange(event.target.files);
            }}
            aria-label={t("crm.customerForm.attachmentUploadAction")}
          />

          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
          >
            <CustomerFormFields
              form={form}
              idPrefix={modalMode ?? "customer"}
              customerCode={selectedCustomer?.customerCode ?? null}
            />

            <div className="space-y-3 rounded-3xl border border-line/70 bg-paper/75 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-ink">
                  {t("crm.customerForm.attachmentLabel")}
                </p>
                <p className="text-sm leading-6 text-ink-soft">
                  {t("crm.customerForm.attachmentHint")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    attachmentInputRef.current?.click();
                  }}
                >
                  {attachmentPreviewName
                    ? t("crm.customerForm.attachmentReplaceAction")
                    : t("crm.customerForm.attachmentUploadAction")}
                </Button>
                {editAttachmentQuery.data ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => {
                      window.open(editAttachmentQuery.data ?? undefined, "_blank", "noreferrer");
                    }}
                  >
                    <ExternalLink className="size-4" />
                    {t("crm.customerForm.attachmentOpenAction")}
                  </Button>
                ) : null}
                {attachmentPreviewName ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={removeDraftAttachment}
                  >
                    {t("crm.customerForm.attachmentRemoveAction")}
                  </Button>
                ) : null}
              </div>

              <p className="text-sm text-ink-soft">
                {attachmentPreviewName ??
                  t("crm.customerForm.attachmentEmpty")}
              </p>
            </div>

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

      <Sheet
        open={detailCustomer !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDetailSheet();
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-line/70 bg-paper px-5 py-6 sm:max-w-xl"
        >
          {detailCustomer ? (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle>{detailCustomer.displayName}</SheetTitle>
                <SheetDescription>
                  {t("commercial.customers.detailDescription")}
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailCard
                  label={t("crm.customerForm.customerCodeLabel")}
                  value={detailCustomer.customerCode ?? "—"}
                />
                <DetailCard
                  label={t("crm.customerForm.statusLabel")}
                  value={t(`crm.recent.customerStatus.${detailCustomer.status}`)}
                />
                <DetailCard
                  label={t("crm.customerForm.documentIdLabel")}
                  value={detailCustomer.documentId ?? "—"}
                />
                {detailCustomer.isForeign ? (
                  <DetailCard
                    label={t("crm.customerForm.passportIdLabel")}
                    value={detailCustomer.passportId ?? "—"}
                  />
                ) : null}
              </div>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {t("commercial.customers.detailBalanceTitle")}
                </h2>

                {detailBalanceQuery.isLoading ? (
                  <p className="rounded-3xl border border-dashed border-line/70 bg-paper/65 px-4 py-3 text-sm text-ink-soft">
                    {t("commercial.customers.detailBalanceLoading")}
                  </p>
                ) : detailBalanceQuery.isError ? (
                  <p className="rounded-3xl border border-dashed border-line/70 bg-paper/65 px-4 py-3 text-sm text-peach-400">
                    {t("commercial.customers.detailBalanceError")}
                  </p>
                ) : (detailBalanceQuery.data ?? []).length === 0 ? (
                  <p className="rounded-3xl border border-dashed border-line/70 bg-paper/65 px-4 py-3 text-sm text-ink-soft">
                    {t("commercial.customers.detailBalanceEmpty")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(detailBalanceQuery.data ?? []).map((balance) => (
                      <BalanceCard
                        key={balance.currencyCode}
                        balance={balance}
                        t={t}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {t("commercial.customers.detailProfileTitle")}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard
                    label={t("crm.customerForm.contactNameLabel")}
                    value={detailCustomer.contactName ?? "—"}
                  />
                  <DetailCard
                    label={t("crm.customerForm.legalNameLabel")}
                    value={detailCustomer.legalName ?? "—"}
                  />
                  <DetailCard
                    label={t("crm.customerForm.emailLabel")}
                    value={detailCustomer.email ?? "—"}
                  />
                  <DetailCard
                    label={t("crm.customerForm.whatsappLabel")}
                    value={detailCustomer.whatsapp ?? "—"}
                  />
                  <DetailCard
                    label={t("crm.customerForm.phoneLabel")}
                    value={detailCustomer.phone ?? "—"}
                  />
                  <DetailCard
                    label={t("crm.customerForm.isForeignLabel")}
                    value={
                      detailCustomer.isForeign
                        ? t("commercial.customers.detailBooleanYes")
                        : t("commercial.customers.detailBooleanNo")
                    }
                  />
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {t("commercial.customers.detailExtraTitle")}
                </h2>
                <div className="space-y-3 rounded-3xl border border-line/70 bg-paper/70 p-4">
                  <div className="flex items-start gap-3">
                    <Link2 className="mt-1 size-4 text-ink-muted" />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-ink">
                        {t("crm.customerForm.websiteUrlLabel")}
                      </p>
                      {detailCustomer.websiteUrl ? (
                        <a
                          href={detailCustomer.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 break-all text-sm text-brand hover:underline"
                        >
                          {detailCustomer.websiteUrl}
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <p className="text-sm text-ink-soft">—</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Paperclip className="mt-1 size-4 text-ink-muted" />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-ink">
                        {t("crm.customerForm.attachmentLabel")}
                      </p>
                      {detailCustomer.attachmentPath &&
                      detailAttachmentQuery.data ? (
                        <a
                          href={detailAttachmentQuery.data}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 break-all text-sm text-brand hover:underline"
                        >
                          {detailCustomer.attachmentName ??
                            t("crm.customerForm.attachmentOpenAction")}
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <p className="text-sm text-ink-soft">
                          {t("crm.customerForm.attachmentEmpty")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-ink">
                      {t("crm.customerForm.notesLabel")}
                    </p>
                    <p className="rounded-3xl border border-line/70 bg-sand/30 px-4 py-3 text-sm leading-6 text-ink-soft">
                      {detailCustomer.notes?.trim() ||
                        t("commercial.customers.detailCommentsEmpty")}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
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

function DetailCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}

function BalanceCard({
  balance,
  t
}: {
  balance: CustomerBalanceSummary;
  t: ReturnType<typeof useTranslation<"backoffice">>["t"];
}) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{balance.currencyCode}</p>
        <p className="text-sm text-ink-soft">
          {t("commercial.customers.detailBalancePaidLabel")}{" "}
          {formatMoney(balance.paidAmount, balance.currencyCode)}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        {formatMoney(balance.openAmount, balance.currencyCode)}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        {t("commercial.customers.detailBalanceOpenLabel")}
      </p>
    </div>
  );
}

function formatMoney(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: currencyCode.toUpperCase()
    }).format(amount);
  } catch {
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
