import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Search } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createInvoiceFormSchema,
  invoiceStatusValues,
  salesDocumentKindValues,
  type InvoiceFormValues
} from "@/lib/forms/invoice-form-schema";
import { buildOperationalAutofillProps } from "@/lib/forms/autofill";
import type {
  CatalogItemSummary,
  InvoiceStatus,
  InvoiceSummary,
  QuoteDetail
} from "@/lib/supabase/backoffice-data";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { InvoicePdfDownloadButton } from "@/modules/commercial/invoice-pdf-download-button";
import { useInvoiceDetailData } from "@/modules/commercial/use-invoice-detail-data";
import { useInvoicesData } from "@/modules/commercial/use-invoices-data";
import { useInvoiceMutations } from "@/modules/commercial/use-invoice-mutations";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { useQuoteDetailData } from "@/modules/quotes/use-quote-detail-data";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

type InvoiceTableFilter = "operational" | "paid" | "void" | "all";

const invoiceStatusesByFilter: Record<InvoiceTableFilter, InvoiceStatus[]> = {
  operational: ["draft", "issued"],
  paid: ["paid"],
  void: ["void"],
  all: []
};

function getNextInvoiceStatuses(status: InvoiceStatus): InvoiceStatus[] {
  switch (status) {
    case "draft":
      return ["issued", "void"];
    case "issued":
      return ["paid", "void"];
    case "paid":
    case "void":
    case "cancelled":
      return [];
    default:
      return [];
  }
}

function getInvoiceIsEditable(status: InvoiceStatus): boolean {
  return status === "draft" || status === "issued";
}

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: currencyCode
  }).format(amount);
}

function formatDate(value: string | null, locale: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function getInvoiceTone(status: InvoiceStatus) {
  switch (status) {
    case "draft":
      return "neutral";
    case "issued":
      return "info";
    case "paid":
      return "success";
    case "void":
      return "warning";
    case "cancelled":
      return "warning";
    default:
      return "neutral";
  }
}

function buildDefaultValues(): InvoiceFormValues {
  return {
    sourceQuoteId: "",
    recipientKind: "customer",
    customerId: "",
    leadId: "",
    recipientDisplayName: "",
    recipientContactName: "",
    recipientEmail: "",
    recipientWhatsApp: "",
    recipientPhone: "",
    title: "",
    documentKind: "services",
    status: "draft",
    currencyCode: "USD",
    documentDiscountTotal: 0,
    issuedOn: "",
    dueOn: "",
    notes: "",
    lineItems: [
      {
        catalogItemId: "",
        itemName: "",
        itemDescription: "",
        quantity: 1,
        unitLabel: "",
        unitPrice: 0,
        discountTotal: 0,
        taxTotal: 0
      }
    ]
  };
}

function inferDocumentKindFromQuote(
  quoteDetail: QuoteDetail | undefined,
  catalogItems: CatalogItemSummary[]
) {
  if (!quoteDetail || quoteDetail.lineItems.length === 0) {
    return "services" as const;
  }

  const kinds = quoteDetail.lineItems
    .map((lineItem) =>
      catalogItems.find((catalogItem) => catalogItem.id === lineItem.catalogItemId)
    )
    .filter(Boolean)
    .map((catalogItem) => catalogItem!.kind);

  if (kinds.length > 0 && kinds.every((kind) => kind === "product")) {
    return "items" as const;
  }

  return "services" as const;
}

function getCatalogOptions(
  catalogItems: CatalogItemSummary[],
  documentKind: "items" | "services"
) {
  return catalogItems.filter((catalogItem) =>
    documentKind === "items"
      ? catalogItem.kind === "product"
      : catalogItem.kind === "service"
  );
}

export function CommercialInvoicesPage() {
  const { t, i18n } = useTranslation("backoffice");
  const [searchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tableFilter, setTableFilter] = useState<InvoiceTableFilter>("operational");
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [pendingVoidMove, setPendingVoidMove] = useState<InvoiceSummary | null>(null);
  const [voidReasonValue, setVoidReasonValue] = useState("");
  const [voidReasonError, setVoidReasonError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReasonValue, setCancelReasonValue] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState("");
  const importedQuoteIdRef = useRef<string | null>(null);
  const invoiceSchema = createInvoiceFormSchema(t);
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: quotes = [] } = useQuotesData();
  const { data: catalogItems = [] } = useCatalogItemsData();
  const {
    data: invoices = [],
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useInvoicesData();
  const {
    cancelInvoiceMutation,
    createInvoiceMutation,
    moveInvoiceStatusMutation,
    updateInvoiceMutation
  } = useInvoiceMutations();
  const invoiceDetail = useInvoiceDetailData(selectedInvoiceId);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: buildDefaultValues()
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "lineItems"
  });

  const editForm = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: buildDefaultValues()
  });
  const {
    fields: editFields,
    append: editAppend,
    remove: editRemove
  } = useFieldArray({
    control: editForm.control,
    name: "lineItems"
  });
  const editDocumentKind = editForm.watch("documentKind");
  const editRecipientKind = editForm.watch("recipientKind");
  const editCatalogOptions = useMemo(
    () => getCatalogOptions(catalogItems, editDocumentKind),
    [catalogItems, editDocumentKind]
  );

  const sourceQuoteId = form.watch("sourceQuoteId");
  const documentKind = form.watch("documentKind");
  const recipientKind = form.watch("recipientKind");
  const requestedSourceQuoteId = searchParams.get("sourceQuoteId")?.trim() ?? "";
  const selectedQuoteDetail = useQuoteDetailData(
    sourceQuoteId?.trim() ? sourceQuoteId : null
  );

  const catalogOptions = useMemo(
    () => getCatalogOptions(catalogItems, documentKind),
    [catalogItems, documentKind]
  );

  const filteredInvoices = useMemo(() => {
    const statusFilter = invoiceStatusesByFilter[tableFilter];
    const normalizedQuery = searchValue.trim().toLowerCase();

    let result =
      statusFilter.length > 0
        ? invoices.filter((invoice) => statusFilter.includes(invoice.status))
        : invoices;

    if (normalizedQuery) {
      result = result.filter((invoice) =>
        [invoice.invoiceNumber, invoice.title, invoice.recipientDisplayName]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery))
      );
    }

    return result;
  }, [invoices, searchValue, tableFilter]);

  useEffect(() => {
    if (requestedSourceQuoteId) {
      setModalOpen(true);
    }
  }, [requestedSourceQuoteId]);

  useEffect(() => {
    if (!requestedSourceQuoteId) {
      return;
    }

    if (requestedSourceQuoteId === form.getValues("sourceQuoteId")) {
      return;
    }

    form.setValue("sourceQuoteId", requestedSourceQuoteId, {
      shouldDirty: true
    });
  }, [form, requestedSourceQuoteId]);

  useEffect(() => {
    if (!selectedQuoteDetail.data) {
      return;
    }

    const quote = selectedQuoteDetail.data;
    form.setValue("recipientKind", quote.recipientKind);
    form.setValue("customerId", quote.customerId ?? "");
    form.setValue("leadId", quote.leadId ?? "");
    form.setValue("recipientDisplayName", quote.recipientDisplayName);
    form.setValue("recipientContactName", quote.recipientContactName ?? "");
    form.setValue("recipientEmail", quote.recipientEmail ?? "");
    form.setValue("recipientWhatsApp", quote.recipientWhatsApp ?? "");
    form.setValue("recipientPhone", quote.recipientPhone ?? "");
    form.setValue("title", `Factura ${quote.title}`);
    form.setValue("currencyCode", quote.currencyCode);
    form.setValue("documentKind", inferDocumentKindFromQuote(quote, catalogItems));

    if (importedQuoteIdRef.current !== quote.id) {
      replace(
        quote.lineItems.map((lineItem) => ({
          catalogItemId: lineItem.catalogItemId ?? "",
          itemName: lineItem.itemName,
          itemDescription: lineItem.itemDescription ?? "",
          quantity: lineItem.quantity,
          unitLabel: lineItem.unitLabel ?? "",
          unitPrice: lineItem.unitPrice,
          discountTotal: lineItem.discountTotal,
          taxTotal: lineItem.taxTotal
        }))
      );
      importedQuoteIdRef.current = quote.id;
    }
  }, [catalogItems, form, replace, selectedQuoteDetail.data]);

  function importQuoteLines() {
    if (!selectedQuoteDetail.data) {
      return;
    }

    replace(
      selectedQuoteDetail.data.lineItems.map((lineItem) => ({
        catalogItemId: lineItem.catalogItemId ?? "",
        itemName: lineItem.itemName,
        itemDescription: lineItem.itemDescription ?? "",
        quantity: lineItem.quantity,
        unitLabel: lineItem.unitLabel ?? "",
        unitPrice: lineItem.unitPrice,
        discountTotal: lineItem.discountTotal,
        taxTotal: lineItem.taxTotal
      }))
    );
  }

  useEffect(() => {
    const detail = invoiceDetail.data;
    if (!detail || !drawerOpen || !getInvoiceIsEditable(detail.status)) {
      return;
    }

    // Compute document-level discount = total discount - sum of line discounts
    const lineDiscountSum = detail.lineItems.reduce(
      (sum, li) => sum + li.discountTotal,
      0
    );
    const documentDiscountTotal = Math.max(
      0,
      detail.discountTotal - lineDiscountSum
    );

    editForm.reset({
      sourceQuoteId: detail.sourceQuoteId ?? "",
      recipientKind: detail.recipientKind,
      customerId: detail.customerId ?? "",
      leadId: detail.leadId ?? "",
      recipientDisplayName: detail.recipientDisplayName,
      recipientContactName: detail.recipientContactName ?? "",
      recipientEmail: detail.recipientEmail ?? "",
      recipientWhatsApp: detail.recipientWhatsApp ?? "",
      recipientPhone: detail.recipientPhone ?? "",
      title: detail.title,
      documentKind: detail.documentKind,
      status: detail.status as "draft" | "issued",
      currencyCode: detail.currencyCode,
      documentDiscountTotal,
      issuedOn: detail.issuedOn ?? "",
      dueOn: detail.dueOn ?? "",
      notes: detail.notes ?? "",
      lineItems: detail.lineItems.map((li) => ({
        catalogItemId: li.catalogItemId ?? "",
        itemName: li.itemName,
        itemDescription: li.itemDescription ?? "",
        quantity: li.quantity,
        unitLabel: li.unitLabel ?? "",
        unitPrice: li.unitPrice,
        discountTotal: li.discountTotal,
        taxTotal: li.taxTotal
      }))
    });
  }, [drawerOpen, editForm, invoiceDetail.data]);

  function openDrawer(invoiceId: string) {
    setSelectedInvoiceId(invoiceId);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    editForm.reset(buildDefaultValues());
  }

  function openCancelModal() {
    setCancelReasonValue("");
    setCancelReasonError("");
    setCancelModalOpen(true);
  }

  function closeCancelModal() {
    setCancelModalOpen(false);
    setCancelReasonValue("");
    setCancelReasonError("");
  }

  async function handleConfirmCancel() {
    if (!selectedInvoiceId) {
      return;
    }

    const trimmed = cancelReasonValue.trim();

    if (trimmed.length < 10) {
      setCancelReasonError(t("commercial.invoices.cancelReasonMinError"));
      return;
    }

    try {
      const result = await cancelInvoiceMutation.mutateAsync({
        invoiceId: selectedInvoiceId,
        cancelReason: trimmed
      });
      toast.success(
        t("commercial.invoices.cancelSuccess", {
          reversalNumber: result.reversalInvoiceNumber
        })
      );
      closeCancelModal();
      closeDrawer();
    } catch (error) {
      toast.error(
        t("commercial.invoices.cancelError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  async function onEditSubmit(values: InvoiceFormValues) {
    if (!selectedInvoiceId) {
      return;
    }

    try {
      const updated = await updateInvoiceMutation.mutateAsync({
        invoiceId: selectedInvoiceId,
        title: values.title,
        documentKind: values.documentKind,
        currencyCode: values.currencyCode,
        recipientKind: values.recipientKind,
        customerId: values.recipientKind === "customer" ? values.customerId : null,
        leadId: values.recipientKind === "lead" ? values.leadId : null,
        recipientDisplayName: values.recipientDisplayName,
        recipientContactName: values.recipientContactName,
        recipientEmail: values.recipientEmail,
        recipientWhatsApp: values.recipientWhatsApp,
        recipientPhone: values.recipientPhone,
        documentDiscountTotal: values.documentDiscountTotal,
        issuedOn: values.issuedOn,
        dueOn: values.dueOn,
        notes: values.notes,
        lineItems: values.lineItems
      });

      toast.success(
        t("commercial.invoices.saveChangesSuccess", {
          invoiceNumber: updated.invoiceNumber
        })
      );
      closeDrawer();
    } catch (error) {
      toast.error(
        t("commercial.invoices.saveChangesError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  function closeModal() {
    setModalOpen(false);
    form.reset(buildDefaultValues());
    importedQuoteIdRef.current = null;
  }

  async function onSubmit(values: InvoiceFormValues) {
    try {
      const invoice = await createInvoiceMutation.mutateAsync({
        sourceQuoteId: values.sourceQuoteId || null,
        recipientKind: values.recipientKind,
        customerId: values.recipientKind === "customer" ? values.customerId : null,
        leadId: values.recipientKind === "lead" ? values.leadId : null,
        recipientDisplayName: values.recipientDisplayName,
        recipientContactName: values.recipientContactName,
        recipientEmail: values.recipientEmail,
        recipientWhatsApp: values.recipientWhatsApp,
        recipientPhone: values.recipientPhone,
        title: values.title,
        documentKind: values.documentKind,
        status: values.status,
        currencyCode: values.currencyCode,
        documentDiscountTotal: values.documentDiscountTotal,
        notes: values.notes,
        issuedOn: values.issuedOn,
        dueOn: values.dueOn,
        lineItems: values.lineItems
      });

      toast.success(
        t("commercial.invoices.createSuccess", {
          invoiceNumber: invoice.invoiceNumber
        })
      );
      closeModal();
    } catch (error) {
      toast.error(
        t("commercial.invoices.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  function requestMoveInvoiceStatus(invoice: InvoiceSummary, status: InvoiceStatus) {
    if (status === "void") {
      setVoidReasonValue("");
      setVoidReasonError("");
      setPendingVoidMove(invoice);
      return;
    }

    void executeMoveInvoiceStatus(invoice, status, undefined);
  }

  function closeVoidReasonModal() {
    setPendingVoidMove(null);
    setVoidReasonValue("");
    setVoidReasonError("");
  }

  async function handleConfirmVoid() {
    if (!pendingVoidMove) {
      return;
    }

    const trimmed = voidReasonValue.trim();

    if (!trimmed) {
      setVoidReasonError(t("commercial.documents.reasonRequiredError"));
      return;
    }

    await executeMoveInvoiceStatus(pendingVoidMove, "void", trimmed);
    closeVoidReasonModal();
  }

  async function executeMoveInvoiceStatus(
    invoice: InvoiceSummary,
    status: InvoiceStatus,
    voidReason: string | undefined
  ) {
    const pendingKey = `${invoice.id}:${status}`;
    setPendingMove(pendingKey);

    try {
      await moveInvoiceStatusMutation.mutateAsync({
        invoiceId: invoice.id,
        status,
        voidReason
      });
      toast.success(
        t("commercial.documents.moveSuccess", {
          document: invoice.invoiceNumber,
          status: t(`commercial.invoices.statuses.${status}`)
        })
      );
    } catch (error) {
      toast.error(
        t("commercial.documents.moveError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    } finally {
      setPendingMove(null);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("commercial.invoices.title")}</h1>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>{t("commercial.invoices.pageTitle")}</CardTitle>
              <CardDescription>
                {t("commercial.invoices.pageDescription")}
              </CardDescription>
            </div>

            <Button
              type="button"
              size="lg"
              className="gap-2"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <Plus className="size-4" />
              {t("commercial.invoices.newAction")}
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
                placeholder={t("commercial.invoices.searchPlaceholder")}
                className="pl-10"
              />
            </label>

            <Select
              value={tableFilter}
              onChange={(event) => {
                setTableFilter(event.target.value as InvoiceTableFilter);
              }}
            >
              <option value="operational">
                {t("commercial.invoices.filters.operational")}
              </option>
              <option value="paid">
                {t("commercial.invoices.filters.paid")}
              </option>
              <option value="void">
                {t("commercial.invoices.filters.void")}
              </option>
              <option value="all">{t("commercial.invoices.filters.all")}</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {!hasTenantContext ? (
            <TableState
              title={t("quotes.list.noTenantTitle")}
              description={t("quotes.list.noTenantDescription")}
            />
          ) : isLoading ? (
            <TableState
              title={t("commercial.invoices.loadingTitle")}
              description={t("commercial.invoices.loadingDescription")}
            />
          ) : isError ? (
            <TableState
              title={t("commercial.invoices.errorTitle")}
              description={t("commercial.invoices.errorDescription", {
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
                  {t("quotes.list.retryAction")}
                </Button>
              }
            />
          ) : filteredInvoices.length === 0 ? (
            <TableState
              title={
                invoices.length === 0
                  ? t("commercial.invoices.emptyTitle")
                  : t("commercial.invoices.emptySearchTitle")
              }
              description={
                invoices.length === 0
                  ? t("commercial.invoices.emptyDescription")
                  : t("commercial.invoices.emptySearchDescription")
              }
            />
          ) : (
            <Table className="min-w-215">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">
                    {t("commercial.invoices.pageTitle")}
                  </TableHead>
                  <TableHead>{t("commercial.invoices.recipientLabel")}</TableHead>
                  <TableHead>{t("commercial.invoices.issuedOnColumnLabel")}</TableHead>
                  <TableHead>{t("commercial.invoices.statusLabel")}</TableHead>
                  <TableHead>{t("commercial.invoices.totalLabel")}</TableHead>
                  <TableHead className="pr-0 text-right">
                    {t("commercial.invoices.actionsLabel")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="pl-0">
                      <div className="space-y-1">
                        <p className="font-medium text-ink">{invoice.title}</p>
                        <p className="text-sm text-ink-soft">
                          {invoice.invoiceNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-ink">
                          {invoice.recipientDisplayName}
                        </p>
                        {invoice.recipientContactName ? (
                          <p className="text-sm text-ink-soft">
                            {invoice.recipientContactName}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(invoice.issuedOn, i18n.language)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <StatusPill tone={getInvoiceTone(invoice.status)}>
                          {t(`commercial.invoices.statuses.${invoice.status}`)}
                        </StatusPill>
                        {invoice.voidReason ? (
                          <p className="text-xs text-ink-soft">
                            {t("commercial.invoices.voidReasonLabel")}:{" "}
                            {invoice.voidReason}
                          </p>
                        ) : null}
                        {invoice.reversalOfInvoiceId ? (
                          <p className="text-xs text-ink-soft">
                            {t("commercial.invoices.reversalBadge")}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatMoney(invoice.grandTotal, invoice.currencyCode)}
                    </TableCell>
                    <TableCell className="pr-0">
                      <div className="flex items-center justify-end gap-2">
                        {getNextInvoiceStatuses(invoice.status).length > 0 ? (
                          <div className="w-36">
                            <Select
                              value=""
                              onChange={(event) => {
                                requestMoveInvoiceStatus(
                                  invoice,
                                  event.target.value as InvoiceStatus
                                );
                              }}
                              disabled={
                                moveInvoiceStatusMutation.isPending &&
                                pendingMove?.startsWith(invoice.id)
                              }
                              className="h-9! text-xs sm:h-9!"
                            >
                              <option value="" disabled>
                                {t("commercial.documents.movePipelinePlaceholder")}
                              </option>
                              {getNextInvoiceStatuses(invoice.status).map(
                                (targetStatus) => (
                                  <option key={targetStatus} value={targetStatus}>
                                    {t(
                                      `commercial.invoices.statuses.${targetStatus}`
                                    )}
                                  </option>
                                )
                              )}
                            </Select>
                          </div>
                        ) : null}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openDrawer(invoice.id)}
                        >
                          {getInvoiceIsEditable(invoice.status)
                            ? t("commercial.invoices.viewEditAction")
                            : t("commercial.invoices.viewAction")}
                        </Button>

                        <InvoicePdfDownloadButton
                          invoiceId={invoice.id}
                          invoiceNumber={invoice.invoiceNumber}
                        />
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
        open={pendingVoidMove !== null}
        onOpenChange={(open) => {
          if (!open && !moveInvoiceStatusMutation.isPending) {
            closeVoidReasonModal();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("commercial.documents.reasonModalTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("commercial.documents.reasonModalDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-ink"
                htmlFor="invoice-void-reason"
              >
                {t("commercial.documents.reasonLabel")}
              </label>
              <Textarea
                id="invoice-void-reason"
                placeholder={t("commercial.documents.reasonPlaceholder")}
                value={voidReasonValue}
                onChange={(event) => {
                  setVoidReasonValue(event.target.value);
                  if (voidReasonError) {
                    setVoidReasonError("");
                  }
                }}
              />
              {voidReasonError ? (
                <p className="text-sm text-peach-400">{voidReasonError}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={closeVoidReasonModal}
                disabled={moveInvoiceStatusMutation.isPending}
              >
                {t("commercial.documents.cancelMoveAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={moveInvoiceStatusMutation.isPending}
                onClick={() => {
                  void handleConfirmVoid();
                }}
              >
                {moveInvoiceStatusMutation.isPending
                  ? t("commercial.documents.moving")
                  : t("commercial.documents.confirmMoveAction")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open && !createInvoiceMutation.isPending) {
            closeModal();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t("commercial.invoices.createModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("commercial.invoices.createModalDescription")}
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            {...buildOperationalAutofillProps("off")}
          >
            <section className="space-y-4">
              <p className="text-sm font-semibold text-ink">
                {t("commercial.invoices.documentTitle")}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("commercial.invoices.sourceQuoteLabel")}
                  htmlFor="invoice-source-quote"
                >
                  <Select
                    id="invoice-source-quote"
                    {...form.register("sourceQuoteId")}
                  >
                    <option value="">
                      {quotes.length > 0
                        ? t("commercial.invoices.sourceQuotePlaceholder")
                        : t("commercial.invoices.sourceQuoteEmpty")}
                    </option>
                    {quotes.map((quote) => (
                      <option key={quote.id} value={quote.id}>
                        {quote.quoteNumber} · {quote.title}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label={t("commercial.invoices.documentKindLabel")}
                  htmlFor="invoice-document-kind"
                >
                  <Select
                    id="invoice-document-kind"
                    {...form.register("documentKind")}
                  >
                    {salesDocumentKindValues.map((value) => (
                      <option key={value} value={value}>
                        {t(`commercial.invoices.documentKinds.${value}`)}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="flex flex-wrap gap-3">
                <p className="text-sm text-ink-soft">
                  {t("commercial.invoices.sourceQuoteHint")}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={importQuoteLines}
                  disabled={!selectedQuoteDetail.data}
                >
                  {t("commercial.invoices.importQuoteAction")}
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("quotes.form.titleLabel")}
                  htmlFor="invoice-title"
                  error={form.formState.errors.title?.message}
                >
                  <Input
                    id="invoice-title"
                    placeholder={t("quotes.form.titlePlaceholder")}
                    {...form.register("title")}
                  />
                </Field>

                <Field
                  label={t("commercial.invoices.statusLabel")}
                  htmlFor="invoice-status"
                >
                  <Select id="invoice-status" {...form.register("status")}>
                    {invoiceStatusValues.map((value) => (
                      <option key={value} value={value}>
                        {t(`commercial.invoices.statuses.${value}`)}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label={t("quotes.form.currencyCodeLabel")}
                  htmlFor="invoice-currency"
                  error={form.formState.errors.currencyCode?.message}
                >
                  <Input id="invoice-currency" {...form.register("currencyCode")} />
                </Field>

                <Field
                  label={t("commercial.invoices.issuedOnLabel")}
                  htmlFor="invoice-issued-on"
                >
                  <Input
                    id="invoice-issued-on"
                    type="date"
                    {...form.register("issuedOn")}
                  />
                </Field>

                <Field
                  label={t("commercial.invoices.dueOnLabel")}
                  htmlFor="invoice-due-on"
                >
                  <Input
                    id="invoice-due-on"
                    type="date"
                    {...form.register("dueOn")}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-sm font-semibold text-ink">
                {t("commercial.invoices.recipientTitle")}
              </p>

              <Field
                label={t("quotes.form.recipientKindLabel")}
                htmlFor="invoice-recipient-kind"
              >
                <Select
                  id="invoice-recipient-kind"
                  {...form.register("recipientKind")}
                >
                  <option value="customer">
                    {t("quotes.form.recipientKinds.customer")}
                  </option>
                  <option value="lead">
                    {t("quotes.form.recipientKinds.lead")}
                  </option>
                  <option value="ad_hoc">
                    {t("quotes.form.recipientKinds.ad_hoc")}
                  </option>
                </Select>
              </Field>

              {recipientKind === "customer" ? (
                <Field
                  label={t("quotes.form.customerLabel")}
                  htmlFor="invoice-customer"
                  error={form.formState.errors.customerId?.message}
                >
                  <Select id="invoice-customer" {...form.register("customerId")}>
                    <option value="">{t("quotes.form.customerPlaceholder")}</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.displayName}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}

              {recipientKind === "lead" ? (
                <Field
                  label={t("quotes.form.leadLabel")}
                  htmlFor="invoice-lead"
                  error={form.formState.errors.leadId?.message}
                >
                  <Select id="invoice-lead" {...form.register("leadId")}>
                    <option value="">{t("quotes.form.leadPlaceholder")}</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.displayName}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("quotes.form.recipientDisplayNameLabel")}
                  htmlFor="invoice-recipient-name"
                  error={form.formState.errors.recipientDisplayName?.message}
                >
                  <Input
                    id="invoice-recipient-name"
                    placeholder={t("quotes.form.recipientDisplayNamePlaceholder")}
                    {...form.register("recipientDisplayName")}
                  />
                </Field>

                <Field
                  label={t("quotes.form.recipientContactNameLabel")}
                  htmlFor="invoice-contact-name"
                >
                  <Input
                    id="invoice-contact-name"
                    placeholder={t("quotes.form.recipientContactNamePlaceholder")}
                    {...form.register("recipientContactName")}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label={t("quotes.form.recipientEmailLabel")}
                  htmlFor="invoice-email"
                  error={form.formState.errors.recipientEmail?.message}
                >
                  <Input
                    id="invoice-email"
                    placeholder={t("quotes.form.recipientEmailPlaceholder")}
                    {...form.register("recipientEmail")}
                  />
                </Field>
                <Field
                  label={t("quotes.form.recipientWhatsAppLabel")}
                  htmlFor="invoice-whatsapp"
                >
                  <Input
                    id="invoice-whatsapp"
                    placeholder={t("quotes.form.recipientWhatsAppPlaceholder")}
                    {...form.register("recipientWhatsApp")}
                  />
                </Field>
                <Field
                  label={t("quotes.form.recipientPhoneLabel")}
                  htmlFor="invoice-phone"
                >
                  <Input
                    id="invoice-phone"
                    placeholder={t("quotes.form.recipientPhonePlaceholder")}
                    {...form.register("recipientPhone")}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {t("commercial.invoices.linesTitle")}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {t("commercial.invoices.lineHint")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    append({
                      catalogItemId: "",
                      itemName: "",
                      itemDescription: "",
                      quantity: 1,
                      unitLabel: documentKind === "items" ? "unidad" : "servicio",
                      unitPrice: 0,
                      discountTotal: 0,
                      taxTotal: 0
                    });
                  }}
                >
                  {t("quotes.form.addLineItemAction")}
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-3xl border border-line/70 bg-paper/70 p-4"
                  >
                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <Field
                          label={t("quotes.form.catalogItemLabel")}
                          htmlFor={`invoice-line-catalog-${index}`}
                        >
                          <Select
                            id={`invoice-line-catalog-${index}`}
                            {...form.register(`lineItems.${index}.catalogItemId` as const, {
                              onChange: (event) => {
                                const selectedItem = catalogOptions.find(
                                  (catalogItem) =>
                                    catalogItem.id === event.target.value
                                );

                                if (!selectedItem) {
                                  return;
                                }

                                form.setValue(
                                  `lineItems.${index}.itemName`,
                                  selectedItem.name
                                );
                                form.setValue(
                                  `lineItems.${index}.itemDescription`,
                                  selectedItem.description ?? ""
                                );
                                form.setValue(
                                  `lineItems.${index}.unitLabel`,
                                  documentKind === "items" ? "unidad" : "servicio"
                                );
                                form.setValue(
                                  `lineItems.${index}.unitPrice`,
                                  selectedItem.unitPrice ?? 0
                                );
                              }
                            })}
                          >
                            <option value="">
                              {t("quotes.form.catalogItemPlaceholder")}
                            </option>
                            {catalogOptions.map((catalogItem) => (
                              <option key={catalogItem.id} value={catalogItem.id}>
                                {catalogItem.name}
                              </option>
                            ))}
                          </Select>
                        </Field>

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            {t("quotes.form.removeLineItemAction")}
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label={t("quotes.form.lineItemNameLabel")}
                          htmlFor={`invoice-line-name-${index}`}
                          error={
                            form.formState.errors.lineItems?.[index]?.itemName?.message
                          }
                        >
                          <Input
                            id={`invoice-line-name-${index}`}
                            placeholder={t("quotes.form.lineItemNamePlaceholder")}
                            {...form.register(`lineItems.${index}.itemName` as const)}
                          />
                        </Field>

                        <Field
                          label={t("quotes.form.unitLabelLabel")}
                          htmlFor={`invoice-line-unit-${index}`}
                        >
                          <Input
                            id={`invoice-line-unit-${index}`}
                            placeholder={t("quotes.form.unitLabelPlaceholder")}
                            {...form.register(`lineItems.${index}.unitLabel` as const)}
                          />
                        </Field>
                      </div>

                      <Field
                        label={t("quotes.form.lineItemDescriptionLabel")}
                        htmlFor={`invoice-line-description-${index}`}
                      >
                        <Textarea
                          id={`invoice-line-description-${index}`}
                          placeholder={t("quotes.form.lineItemDescriptionPlaceholder")}
                          {...form.register(
                            `lineItems.${index}.itemDescription` as const
                          )}
                        />
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-4">
                        <Field
                          label={t("quotes.form.quantityLabel")}
                          htmlFor={`invoice-line-quantity-${index}`}
                        >
                          <Input
                            id={`invoice-line-quantity-${index}`}
                            type="number"
                            step="1"
                            {...form.register(
                              `lineItems.${index}.quantity` as const,
                              { valueAsNumber: true }
                            )}
                          />
                        </Field>
                        <Field
                          label={t("quotes.form.unitPriceLabel")}
                          htmlFor={`invoice-line-price-${index}`}
                        >
                          <Input
                            id={`invoice-line-price-${index}`}
                            type="number"
                            step="1"
                            {...form.register(
                              `lineItems.${index}.unitPrice` as const,
                              { valueAsNumber: true }
                            )}
                          />
                        </Field>
                        <Field
                          label={t("quotes.form.discountTotalLabel")}
                          htmlFor={`invoice-line-discount-${index}`}
                        >
                          <Input
                            id={`invoice-line-discount-${index}`}
                            type="number"
                            step="1"
                            {...form.register(
                              `lineItems.${index}.discountTotal` as const,
                              { valueAsNumber: true }
                            )}
                          />
                        </Field>
                        <Field
                          label={t("quotes.form.taxTotalLabel")}
                          htmlFor={`invoice-line-tax-${index}`}
                        >
                          <Input
                            id={`invoice-line-tax-${index}`}
                            type="number"
                            step="1"
                            {...form.register(
                              `lineItems.${index}.taxTotal` as const,
                              { valueAsNumber: true }
                            )}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                <Field
                  label={t("quotes.form.documentDiscountAmountLabel")}
                  htmlFor="invoice-discount"
                >
                  <Input
                    id="invoice-discount"
                    type="number"
                    step="1"
                    {...form.register("documentDiscountTotal", {
                      valueAsNumber: true
                    })}
                  />
                </Field>

                <Field
                  label={t("quotes.form.notesLabel")}
                  htmlFor="invoice-notes"
                >
                  <Textarea
                    id="invoice-notes"
                    placeholder={t("quotes.form.notesPlaceholder")}
                    {...form.register("notes")}
                  />
                </Field>
              </div>
            </section>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={closeModal}
                disabled={createInvoiceMutation.isPending}
              >
                {t("commercial.invoices.cancelAction")}
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending
                  ? t("commercial.invoices.createSubmitting")
                  : t("commercial.invoices.createAction")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel invoice confirmation dialog */}
      <Dialog
        open={cancelModalOpen}
        onOpenChange={(open) => {
          if (!open && !cancelInvoiceMutation.isPending) {
            closeCancelModal();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("commercial.invoices.cancelInvoiceModalTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("commercial.invoices.cancelInvoiceModalDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-ink"
                htmlFor="cancel-invoice-reason"
              >
                {t("commercial.invoices.cancelReasonLabel")}
              </label>
              <Textarea
                id="cancel-invoice-reason"
                placeholder={t("commercial.invoices.cancelReasonPlaceholder")}
                value={cancelReasonValue}
                onChange={(event) => {
                  setCancelReasonValue(event.target.value);
                  if (cancelReasonError) {
                    setCancelReasonError("");
                  }
                }}
              />
              {cancelReasonError ? (
                <p className="text-sm text-peach-400">{cancelReasonError}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={closeCancelModal}
                disabled={cancelInvoiceMutation.isPending}
              >
                {t("commercial.documents.cancelMoveAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={cancelInvoiceMutation.isPending}
                onClick={() => {
                  void handleConfirmCancel();
                }}
              >
                {cancelInvoiceMutation.isPending
                  ? t("commercial.invoices.cancelSubmitting")
                  : t("commercial.invoices.cancelInvoiceAction")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice detail / edit modal */}
      <Dialog
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open && !updateInvoiceMutation.isPending) {
            closeDrawer();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-5xl">
          {invoiceDetail.isLoading ? (
            <DialogHeader>
              <DialogTitle>{t("commercial.invoices.loadingTitle")}</DialogTitle>
              <DialogDescription>
                {t("commercial.invoices.loadingDescription")}
              </DialogDescription>
            </DialogHeader>
          ) : invoiceDetail.data ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {getInvoiceIsEditable(invoiceDetail.data.status)
                    ? t("commercial.invoices.editDrawerTitle", {
                        invoiceNumber: invoiceDetail.data.invoiceNumber
                      })
                    : t("commercial.invoices.detailDrawerTitle", {
                        invoiceNumber: invoiceDetail.data.invoiceNumber
                      })}
                </DialogTitle>
                <DialogDescription>
                  {getInvoiceIsEditable(invoiceDetail.data.status)
                    ? t("commercial.invoices.editDrawerDescription")
                    : t("commercial.invoices.detailDrawerDescription")}
                </DialogDescription>
              </DialogHeader>

              {getInvoiceIsEditable(invoiceDetail.data.status) ? (
                <form
                  className="space-y-6"
                  onSubmit={editForm.handleSubmit(onEditSubmit)}
                  noValidate
                  {...buildOperationalAutofillProps("off")}
                >
                  <section className="space-y-4">
                    <p className="text-sm font-semibold text-ink">
                      {t("commercial.invoices.documentTitle")}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label={t("commercial.invoices.documentKindLabel")}
                        htmlFor="edit-invoice-document-kind"
                      >
                        <Select
                          id="edit-invoice-document-kind"
                          {...editForm.register("documentKind")}
                        >
                          {salesDocumentKindValues.map((value) => (
                            <option key={value} value={value}>
                              {t(`commercial.invoices.documentKinds.${value}`)}
                            </option>
                          ))}
                        </Select>
                      </Field>

                      <Field
                        label={t("commercial.invoices.invoiceNumberLabel")}
                        htmlFor="edit-invoice-number"
                      >
                        <Input
                          id="edit-invoice-number"
                          value={invoiceDetail.data.invoiceNumber}
                          readOnly
                          disabled
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label={t("quotes.form.titleLabel")}
                        htmlFor="edit-invoice-title"
                        error={editForm.formState.errors.title?.message}
                      >
                        <Input
                          id="edit-invoice-title"
                          placeholder={t("quotes.form.titlePlaceholder")}
                          {...editForm.register("title")}
                        />
                      </Field>

                      <Field
                        label={t("quotes.form.currencyCodeLabel")}
                        htmlFor="edit-invoice-currency"
                        error={editForm.formState.errors.currencyCode?.message}
                      >
                        <Input
                          id="edit-invoice-currency"
                          {...editForm.register("currencyCode")}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label={t("commercial.invoices.issuedOnLabel")}
                        htmlFor="edit-invoice-issued-on"
                      >
                        <Input
                          id="edit-invoice-issued-on"
                          type="date"
                          {...editForm.register("issuedOn")}
                        />
                      </Field>

                      <Field
                        label={t("commercial.invoices.dueOnLabel")}
                        htmlFor="edit-invoice-due-on"
                      >
                        <Input
                          id="edit-invoice-due-on"
                          type="date"
                          {...editForm.register("dueOn")}
                        />
                      </Field>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <p className="text-sm font-semibold text-ink">
                      {t("commercial.invoices.recipientTitle")}
                    </p>

                    <Field
                      label={t("quotes.form.recipientKindLabel")}
                      htmlFor="edit-invoice-recipient-kind"
                    >
                      <Select
                        id="edit-invoice-recipient-kind"
                        {...editForm.register("recipientKind")}
                      >
                        <option value="customer">
                          {t("quotes.form.recipientKinds.customer")}
                        </option>
                        <option value="lead">
                          {t("quotes.form.recipientKinds.lead")}
                        </option>
                        <option value="ad_hoc">
                          {t("quotes.form.recipientKinds.ad_hoc")}
                        </option>
                      </Select>
                    </Field>

                    {editRecipientKind === "customer" ? (
                      <Field
                        label={t("quotes.form.customerLabel")}
                        htmlFor="edit-invoice-customer"
                        error={editForm.formState.errors.customerId?.message}
                      >
                        <Select
                          id="edit-invoice-customer"
                          {...editForm.register("customerId")}
                        >
                          <option value="">
                            {t("quotes.form.customerPlaceholder")}
                          </option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.displayName}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    ) : null}

                    {editRecipientKind === "lead" ? (
                      <Field
                        label={t("quotes.form.leadLabel")}
                        htmlFor="edit-invoice-lead"
                        error={editForm.formState.errors.leadId?.message}
                      >
                        <Select
                          id="edit-invoice-lead"
                          {...editForm.register("leadId")}
                        >
                          <option value="">
                            {t("quotes.form.leadPlaceholder")}
                          </option>
                          {leads.map((lead) => (
                            <option key={lead.id} value={lead.id}>
                              {lead.displayName}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label={t("quotes.form.recipientDisplayNameLabel")}
                        htmlFor="edit-invoice-recipient-name"
                        error={
                          editForm.formState.errors.recipientDisplayName?.message
                        }
                      >
                        <Input
                          id="edit-invoice-recipient-name"
                          placeholder={t(
                            "quotes.form.recipientDisplayNamePlaceholder"
                          )}
                          {...editForm.register("recipientDisplayName")}
                        />
                      </Field>

                      <Field
                        label={t("quotes.form.recipientContactNameLabel")}
                        htmlFor="edit-invoice-contact-name"
                      >
                        <Input
                          id="edit-invoice-contact-name"
                          placeholder={t(
                            "quotes.form.recipientContactNamePlaceholder"
                          )}
                          {...editForm.register("recipientContactName")}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field
                        label={t("quotes.form.recipientEmailLabel")}
                        htmlFor="edit-invoice-email"
                        error={editForm.formState.errors.recipientEmail?.message}
                      >
                        <Input
                          id="edit-invoice-email"
                          placeholder={t(
                            "quotes.form.recipientEmailPlaceholder"
                          )}
                          {...editForm.register("recipientEmail")}
                        />
                      </Field>
                      <Field
                        label={t("quotes.form.recipientWhatsAppLabel")}
                        htmlFor="edit-invoice-whatsapp"
                      >
                        <Input
                          id="edit-invoice-whatsapp"
                          placeholder={t(
                            "quotes.form.recipientWhatsAppPlaceholder"
                          )}
                          {...editForm.register("recipientWhatsApp")}
                        />
                      </Field>
                      <Field
                        label={t("quotes.form.recipientPhoneLabel")}
                        htmlFor="edit-invoice-phone"
                      >
                        <Input
                          id="edit-invoice-phone"
                          placeholder={t(
                            "quotes.form.recipientPhonePlaceholder"
                          )}
                          {...editForm.register("recipientPhone")}
                        />
                      </Field>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {t("commercial.invoices.linesTitle")}
                        </p>
                        <p className="text-sm text-ink-soft">
                          {t("commercial.invoices.lineHint")}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          editAppend({
                            catalogItemId: "",
                            itemName: "",
                            itemDescription: "",
                            quantity: 1,
                            unitLabel:
                              editDocumentKind === "items" ? "unidad" : "servicio",
                            unitPrice: 0,
                            discountTotal: 0,
                            taxTotal: 0
                          });
                        }}
                      >
                        {t("quotes.form.addLineItemAction")}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {editFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="rounded-3xl border border-line/70 bg-paper/70 p-4"
                        >
                          <div className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                              <Field
                                label={t("quotes.form.catalogItemLabel")}
                                htmlFor={`edit-invoice-line-catalog-${index}`}
                              >
                                <Select
                                  id={`edit-invoice-line-catalog-${index}`}
                                  {...editForm.register(
                                    `lineItems.${index}.catalogItemId` as const,
                                    {
                                      onChange: (event) => {
                                        const selectedItem =
                                          editCatalogOptions.find(
                                            (ci) => ci.id === event.target.value
                                          );
                                        if (!selectedItem) return;
                                        editForm.setValue(
                                          `lineItems.${index}.itemName`,
                                          selectedItem.name
                                        );
                                        editForm.setValue(
                                          `lineItems.${index}.itemDescription`,
                                          selectedItem.description ?? ""
                                        );
                                        editForm.setValue(
                                          `lineItems.${index}.unitLabel`,
                                          editDocumentKind === "items"
                                            ? "unidad"
                                            : "servicio"
                                        );
                                        editForm.setValue(
                                          `lineItems.${index}.unitPrice`,
                                          selectedItem.unitPrice ?? 0
                                        );
                                      }
                                    }
                                  )}
                                >
                                  <option value="">
                                    {t("quotes.form.catalogItemPlaceholder")}
                                  </option>
                                  {editCatalogOptions.map((ci) => (
                                    <option key={ci.id} value={ci.id}>
                                      {ci.name}
                                    </option>
                                  ))}
                                </Select>
                              </Field>

                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => editRemove(index)}
                                  disabled={editFields.length === 1}
                                >
                                  {t("quotes.form.removeLineItemAction")}
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <Field
                                label={t("quotes.form.lineItemNameLabel")}
                                htmlFor={`edit-invoice-line-name-${index}`}
                                error={
                                  editForm.formState.errors.lineItems?.[index]
                                    ?.itemName?.message
                                }
                              >
                                <Input
                                  id={`edit-invoice-line-name-${index}`}
                                  placeholder={t(
                                    "quotes.form.lineItemNamePlaceholder"
                                  )}
                                  {...editForm.register(
                                    `lineItems.${index}.itemName` as const
                                  )}
                                />
                              </Field>

                              <Field
                                label={t("quotes.form.unitLabelLabel")}
                                htmlFor={`edit-invoice-line-unit-${index}`}
                              >
                                <Input
                                  id={`edit-invoice-line-unit-${index}`}
                                  placeholder={t(
                                    "quotes.form.unitLabelPlaceholder"
                                  )}
                                  {...editForm.register(
                                    `lineItems.${index}.unitLabel` as const
                                  )}
                                />
                              </Field>
                            </div>

                            <Field
                              label={t("quotes.form.lineItemDescriptionLabel")}
                              htmlFor={`edit-invoice-line-desc-${index}`}
                            >
                              <Textarea
                                id={`edit-invoice-line-desc-${index}`}
                                placeholder={t(
                                  "quotes.form.lineItemDescriptionPlaceholder"
                                )}
                                {...editForm.register(
                                  `lineItems.${index}.itemDescription` as const
                                )}
                              />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-4">
                              <Field
                                label={t("quotes.form.quantityLabel")}
                                htmlFor={`edit-invoice-line-qty-${index}`}
                              >
                                <Input
                                  id={`edit-invoice-line-qty-${index}`}
                                  type="number"
                                  step="1"
                                  {...editForm.register(
                                    `lineItems.${index}.quantity` as const,
                                    { valueAsNumber: true }
                                  )}
                                />
                              </Field>
                              <Field
                                label={t("quotes.form.unitPriceLabel")}
                                htmlFor={`edit-invoice-line-price-${index}`}
                              >
                                <Input
                                  id={`edit-invoice-line-price-${index}`}
                                  type="number"
                                  step="1"
                                  {...editForm.register(
                                    `lineItems.${index}.unitPrice` as const,
                                    { valueAsNumber: true }
                                  )}
                                />
                              </Field>
                              <Field
                                label={t("quotes.form.discountTotalLabel")}
                                htmlFor={`edit-invoice-line-discount-${index}`}
                              >
                                <Input
                                  id={`edit-invoice-line-discount-${index}`}
                                  type="number"
                                  step="1"
                                  {...editForm.register(
                                    `lineItems.${index}.discountTotal` as const,
                                    { valueAsNumber: true }
                                  )}
                                />
                              </Field>
                              <Field
                                label={t("quotes.form.taxTotalLabel")}
                                htmlFor={`edit-invoice-line-tax-${index}`}
                              >
                                <Input
                                  id={`edit-invoice-line-tax-${index}`}
                                  type="number"
                                  step="1"
                                  {...editForm.register(
                                    `lineItems.${index}.taxTotal` as const,
                                    { valueAsNumber: true }
                                  )}
                                />
                              </Field>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                      <Field
                        label={t("quotes.form.documentDiscountAmountLabel")}
                        htmlFor="edit-invoice-discount"
                      >
                        <Input
                          id="edit-invoice-discount"
                          type="number"
                          step="1"
                          {...editForm.register("documentDiscountTotal", {
                            valueAsNumber: true
                          })}
                        />
                      </Field>

                      <Field
                        label={t("quotes.form.notesLabel")}
                        htmlFor="edit-invoice-notes"
                      >
                        <Textarea
                          id="edit-invoice-notes"
                          placeholder={t("quotes.form.notesPlaceholder")}
                          {...editForm.register("notes")}
                        />
                      </Field>
                    </div>
                  </section>

                  <div className="flex flex-wrap justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={closeDrawer}
                      disabled={updateInvoiceMutation.isPending}
                    >
                      {t("commercial.invoices.cancelAction")}
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={updateInvoiceMutation.isPending}
                    >
                      {updateInvoiceMutation.isPending
                        ? t("commercial.invoices.saveChangesSubmitting")
                        : t("commercial.invoices.saveChangesAction")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-line/70 bg-paper/70 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium text-ink">
                          {invoiceDetail.data.title}
                        </p>
                        <p className="text-sm text-ink-soft">
                          {invoiceDetail.data.invoiceNumber}
                        </p>
                      </div>
                      <StatusPill tone={getInvoiceTone(invoiceDetail.data.status)}>
                        {t(
                          `commercial.invoices.statuses.${invoiceDetail.data.status}`
                        )}
                      </StatusPill>
                    </div>

                    <p className="text-sm text-ink-soft">
                      {t("commercial.invoices.readOnlyNotice", {
                        status: t(
                          `commercial.invoices.statuses.${invoiceDetail.data.status}`
                        )
                      })}
                    </p>

                    <div className="flex items-center justify-between gap-3 border-t border-line/50 pt-3">
                      <p className="text-sm text-ink-soft">
                        {t("commercial.invoices.totalLabel")}
                      </p>
                      <p className="font-semibold text-ink">
                        {formatMoney(
                          invoiceDetail.data.grandTotal,
                          invoiceDetail.data.currencyCode
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-ink">
                      {t("commercial.invoices.recipientLabel")}
                    </p>
                    <p className="text-sm text-ink">
                      {invoiceDetail.data.recipientDisplayName}
                    </p>
                    {invoiceDetail.data.recipientContactName ? (
                      <p className="text-sm text-ink-soft">
                        {invoiceDetail.data.recipientContactName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-ink">
                      {t("commercial.invoices.linesTitle")}
                    </p>
                    <div className="divide-y divide-line/50 rounded-2xl border border-line/70 overflow-hidden">
                      {invoiceDetail.data.lineItems.map((li) => (
                        <div key={li.id} className="flex justify-between gap-3 p-3">
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">
                              {li.itemName}
                            </p>
                            {li.itemDescription ? (
                              <p className="text-xs text-ink-soft">
                                {li.itemDescription}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-sm text-ink whitespace-nowrap">
                            {formatMoney(
                              li.lineTotal,
                              invoiceDetail.data!.currencyCode
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    {invoiceDetail.data.status === "paid" ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={openCancelModal}
                      >
                        {t("commercial.invoices.cancelInvoiceAction")}
                      </Button>
                    ) : (
                      <span />
                    )}
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={closeDrawer}
                      >
                        {t("commercial.invoices.cancelAction")}
                      </Button>
                      <InvoicePdfDownloadButton
                        invoiceId={invoiceDetail.data.id}
                        invoiceNumber={invoiceDetail.data.invoiceNumber}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
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
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-peach-400">{error}</p> : null}
    </div>
  );
}
