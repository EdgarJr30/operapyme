import { type ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Pencil, Plus, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { QuoteStatus, QuoteSummary } from "@/lib/supabase/backoffice-data";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { QuoteEditorWorkspace } from "@/modules/quotes/quote-operations-panel";
import { QuotePdfDownloadButton } from "@/modules/quotes/quote-pdf-download-button";
import { useQuoteMutations } from "@/modules/quotes/use-quote-mutations";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

type QuoteModalMode = "create" | "edit" | null;
type QuoteTableFilter = "operational" | "approved" | "closed" | "all";

const quoteStatusesByFilter: Record<QuoteTableFilter, QuoteStatus[] | undefined> = {
  operational: ["draft", "sent", "viewed"],
  approved: ["approved"],
  closed: ["rejected", "expired"],
  all: undefined
};

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

function getNextQuoteStatuses(status: QuoteStatus): QuoteStatus[] {
  switch (status) {
    case "draft":
      return ["sent"];
    case "sent":
      return ["viewed", "approved", "rejected", "expired"];
    case "viewed":
      return ["approved", "rejected", "expired"];
    case "approved":
      return [];
    case "rejected":
      return ["draft"];
    case "expired":
      return ["draft"];
  }
}

export function CommercialQuotesPage() {
  const { t, i18n } = useTranslation("backoffice");
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [tableFilter, setTableFilter] =
    useState<QuoteTableFilter>("operational");
  const [modalMode, setModalMode] = useState<QuoteModalMode>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [pendingReasonMove, setPendingReasonMove] = useState<{
    quote: QuoteSummary;
    targetStatus: QuoteStatus;
  } | null>(null);
  const [reasonValue, setReasonValue] = useState("");
  const [reasonError, setReasonError] = useState("");
  const statuses = quoteStatusesByFilter[tableFilter];
  const {
    data: quotes = [],
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useQuotesData({
    limit: null,
    statuses
  });
  const { data: customers = [] } = useCustomersData({ limit: null });
  const { data: leads = [] } = useLeadsData({ limit: null });
  const { data: catalogItems = [] } = useCatalogItemsData();
  const { moveQuoteStatusMutation } = useQuoteMutations();

  const filteredQuotes = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    if (!normalizedQuery) {
      return quotes;
    }

    return quotes.filter((quote) =>
      [
        quote.title,
        quote.quoteNumber,
        quote.recipientDisplayName,
        quote.recipientContactName,
        quote.recipientEmail,
        quote.recipientWhatsApp
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    );
  }, [quotes, searchValue]);

  function closeModal() {
    setModalMode(null);
    setSelectedQuoteId(null);
  }

  function openCreateModal() {
    setSelectedQuoteId(null);
    setModalMode("create");
  }

  function openEditModal(quote: QuoteSummary) {
    setSelectedQuoteId(quote.id);
    setModalMode("edit");
  }

  function requestMoveQuoteStatus(quote: QuoteSummary, status: QuoteStatus) {
    if (status === "rejected" || status === "expired") {
      setReasonValue("");
      setReasonError("");
      setPendingReasonMove({ quote, targetStatus: status });
      return;
    }

    void executeMoveQuoteStatus(quote, status, undefined);
  }

  function closeReasonModal() {
    setPendingReasonMove(null);
    setReasonValue("");
    setReasonError("");
  }

  async function handleConfirmWithReason() {
    if (!pendingReasonMove) {
      return;
    }

    const trimmed = reasonValue.trim();

    if (!trimmed) {
      setReasonError(t("commercial.documents.reasonRequiredError"));
      return;
    }

    await executeMoveQuoteStatus(
      pendingReasonMove.quote,
      pendingReasonMove.targetStatus,
      trimmed
    );
    closeReasonModal();
  }

  async function executeMoveQuoteStatus(
    quote: QuoteSummary,
    status: QuoteStatus,
    cancellationReason: string | undefined
  ) {
    const pendingKey = `${quote.id}:${status}`;
    setPendingMove(pendingKey);

    try {
      await moveQuoteStatusMutation.mutateAsync({
        quoteId: quote.id,
        status,
        version: quote.version,
        cancellationReason
      });
      toast.success(
        t("commercial.documents.moveSuccess", {
          document: quote.quoteNumber,
          status: t(`quotes.list.status.${status}`)
        })
      );
    } catch (moveError) {
      toast.error(
        t("commercial.documents.moveError", {
          message: moveError instanceof Error ? moveError.message : ""
        })
      );
    } finally {
      setPendingMove(null);
    }
  }

  const modalTitle =
    modalMode === "edit"
      ? t("commercial.quotes.editModalTitle")
      : t("commercial.quotes.createModalTitle");
  const modalDescription =
    modalMode === "edit"
      ? t("commercial.quotes.editModalDescription")
      : t("commercial.quotes.createModalDescription");

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("navigation.commercialQuotes")}</h1>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>{t("commercial.quotes.pageTitle")}</CardTitle>
              <CardDescription>
                {t("commercial.quotes.pageDescription")}
              </CardDescription>
            </div>

            <Button
              type="button"
              size="lg"
              className="gap-2"
              onClick={openCreateModal}
            >
              <Plus className="size-4" />
              {t("commercial.quotes.createAction")}
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
                placeholder={t("commercial.quotes.searchPlaceholder")}
                className="pl-10"
              />
            </label>

            <Select
              value={tableFilter}
              onChange={(event) => {
                setTableFilter(event.target.value as QuoteTableFilter);
              }}
            >
              <option value="operational">
                {t("commercial.quotes.filters.operational")}
              </option>
              <option value="approved">
                {t("commercial.quotes.filters.approved")}
              </option>
              <option value="closed">
                {t("commercial.quotes.filters.closed")}
              </option>
              <option value="all">{t("commercial.quotes.filters.all")}</option>
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
              title={t("commercial.quotes.loadingTitle")}
              description={t("commercial.quotes.loadingDescription")}
            />
          ) : isError ? (
            <TableState
              title={t("commercial.quotes.errorTitle")}
              description={t("commercial.quotes.errorDescription", {
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
          ) : filteredQuotes.length === 0 ? (
            <TableState
              title={
                quotes.length === 0
                  ? t("commercial.quotes.emptyTitle")
                  : t("commercial.quotes.emptySearchTitle")
              }
              description={
                quotes.length === 0
                  ? t("commercial.quotes.emptyDescription")
                  : t("commercial.quotes.emptySearchDescription")
              }
            />
          ) : (
            <Table className="min-w-245">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">
                    {t("navigation.commercialQuotes")}
                  </TableHead>
                  <TableHead>{t("commercial.quotes.recipientLabel")}</TableHead>
                  <TableHead>{t("commercial.quotes.validUntilLabel")}</TableHead>
                  <TableHead>{t("commercial.quotes.statusLabel")}</TableHead>
                  <TableHead>{t("commercial.quotes.totalLabel")}</TableHead>
                  <TableHead className="pr-0 text-right">
                    {t("commercial.quotes.actionsLabel")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="pl-0">
                      <div className="space-y-1">
                        <p className="font-medium text-ink">{quote.title}</p>
                        <p className="text-sm text-ink-soft">{quote.quoteNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-ink">
                          {quote.recipientDisplayName}
                        </p>
                        <p className="text-sm text-ink-soft">
                          {quote.recipientContactName ??
                            quote.recipientEmail ??
                            quote.recipientWhatsApp ??
                            t("quotes.list.customerPending")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(quote.validUntil, i18n.language)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <StatusPill tone={getQuoteTone(quote.status)}>
                          {t(`quotes.list.status.${quote.status}`)}
                        </StatusPill>
                        {quote.cancellationReason ? (
                          <p className="text-xs text-ink-soft">
                            {t("commercial.quotes.cancellationReasonLabel")}:{" "}
                            {quote.cancellationReason}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatMoney(quote.grandTotal, quote.currencyCode)}
                    </TableCell>
                    <TableCell className="pr-0">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            openEditModal(quote);
                          }}
                        >
                          <Pencil className="size-4" />
                          {t("commercial.quotes.editAction")}
                        </Button>

                        {getNextQuoteStatuses(quote.status).length > 0 ? (
                          <div className="w-36">
                            <Select
                              value=""
                              onChange={(event) => {
                                requestMoveQuoteStatus(
                                  quote,
                                  event.target.value as QuoteStatus
                                );
                              }}
                              disabled={
                                moveQuoteStatusMutation.isPending &&
                                pendingMove?.startsWith(quote.id)
                              }
                              className="h-9! text-xs sm:h-9!"
                            >
                              <option value="" disabled>
                                {t("commercial.documents.movePipelinePlaceholder")}
                              </option>
                              {getNextQuoteStatuses(quote.status).map(
                                (targetStatus) => (
                                  <option key={targetStatus} value={targetStatus}>
                                    {t(`quotes.list.status.${targetStatus}`)}
                                  </option>
                                )
                              )}
                            </Select>
                          </div>
                        ) : null}

                        {quote.status === "approved" ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              navigate(
                                `/commercial/invoices?sourceQuoteId=${quote.id}`
                              );
                            }}
                          >
                            {t("commercial.quotes.createInvoiceAction")}
                          </Button>
                        ) : null}

                        <QuotePdfDownloadButton
                          quoteId={quote.id}
                          quoteNumber={quote.quoteNumber}
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
        open={pendingReasonMove !== null}
        onOpenChange={(open) => {
          if (!open && !moveQuoteStatusMutation.isPending) {
            closeReasonModal();
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
                htmlFor="quote-cancel-reason"
              >
                {t("commercial.documents.reasonLabel")}
              </label>
              <Textarea
                id="quote-cancel-reason"
                placeholder={t("commercial.documents.reasonPlaceholder")}
                value={reasonValue}
                onChange={(event) => {
                  setReasonValue(event.target.value);
                  if (reasonError) {
                    setReasonError("");
                  }
                }}
              />
              {reasonError ? (
                <p className="text-sm text-peach-400">{reasonError}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={closeReasonModal}
                disabled={moveQuoteStatusMutation.isPending}
              >
                {t("commercial.documents.cancelMoveAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={moveQuoteStatusMutation.isPending}
                onClick={() => {
                  void handleConfirmWithReason();
                }}
              >
                {moveQuoteStatusMutation.isPending
                  ? t("commercial.documents.moving")
                  : t("commercial.documents.confirmMoveAction")}
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
        <DialogContent
          closeLabel={t("shared.closeDialog")}
          className="max-w-6xl"
        >
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription>{modalDescription}</DialogDescription>
          </DialogHeader>

          {modalMode ? (
            <QuoteEditorWorkspace
              catalogItems={catalogItems}
              customers={customers}
              leads={leads}
              mode={modalMode}
              quoteId={selectedQuoteId}
              onCancel={closeModal}
              onSuccess={closeModal}
            />
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

function getQuoteTone(status: QuoteStatus) {
  switch (status) {
    case "draft":
      return "neutral";
    case "sent":
      return "info";
    case "viewed":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
    case "expired":
      return "warning";
  }
}
