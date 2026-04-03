import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Search } from "lucide-react";
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
import {
  createCatalogItemFormSchema,
  type CatalogItemFormValues
} from "@/lib/forms/catalog-item-form-schema";
import type {
  CatalogItemPricingMode,
  CatalogItemStatus,
  CatalogItemSummary
} from "@/lib/supabase/backoffice-data";
import { CatalogItemFormFields } from "@/modules/catalog/catalog-operations-panel";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useCatalogMutations } from "@/modules/catalog/use-catalog-mutations";

type CatalogModalMode = "create" | "edit" | null;
type CatalogTableFilter = "all" | "active" | "inactive";

const catalogStatusesByFilter: Record<
  CatalogTableFilter,
  CatalogItemStatus[] | undefined
> = {
  all: undefined,
  active: ["active"],
  inactive: ["draft", "archived"]
};

const createDefaultValues: CatalogItemFormValues = {
  itemCode: "",
  name: "",
  category: "",
  description: "",
  kind: "product",
  visibility: "public",
  pricingMode: "fixed",
  currencyCode: "USD",
  unitPrice: 0,
  status: "active",
  notes: ""
};

export function CatalogPage() {
  const { t } = useTranslation("backoffice");
  const [searchValue, setSearchValue] = useState("");
  const [tableFilter, setTableFilter] = useState<CatalogTableFilter>("all");
  const [modalMode, setModalMode] = useState<CatalogModalMode>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const catalogItemFormSchema = createCatalogItemFormSchema(t);

  const {
    data: items = [],
    error,
    hasTenantContext,
    isError,
    isLoading,
    refetch
  } = useCatalogItemsData();

  const { createCatalogItemMutation, updateCatalogItemMutation } =
    useCatalogMutations();

  const form = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemFormSchema),
    defaultValues: createDefaultValues
  });

  const pricingMode = form.watch("pricingMode");

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  useEffect(() => {
    if (pricingMode === "on_request") {
      form.setValue("unitPrice", null, { shouldValidate: true });
    }
  }, [form, pricingMode]);

  useEffect(() => {
    if (modalMode !== "edit" || !selectedItem) {
      return;
    }

    form.reset({
      itemCode: selectedItem.itemCode ?? "",
      name: selectedItem.name,
      category: selectedItem.category ?? "",
      description: selectedItem.description ?? "",
      kind: selectedItem.kind,
      visibility: selectedItem.visibility,
      pricingMode: selectedItem.pricingMode,
      currencyCode: selectedItem.currencyCode,
      unitPrice:
        selectedItem.pricingMode === "fixed"
          ? (selectedItem.unitPrice ?? 0)
          : null,
      status: selectedItem.status,
      notes: selectedItem.notes ?? ""
    });
  }, [modalMode, selectedItem, form]);

  const filteredItems = useMemo(() => {
    const statusFilter = catalogStatusesByFilter[tableFilter];
    const normalizedQuery = searchValue.trim().toLowerCase();

    let result = statusFilter
      ? items.filter((item) => statusFilter.includes(item.status))
      : items;

    if (normalizedQuery) {
      result = result.filter((item) =>
        [item.name, item.itemCode, item.category, item.description]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery))
      );
    }

    return result;
  }, [items, searchValue, tableFilter]);

  function openCreateModal() {
    setSelectedItemId(null);
    form.reset(createDefaultValues);
    setModalMode("create");
  }

  function openEditModal(item: CatalogItemSummary) {
    setSelectedItemId(item.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedItemId(null);
  }

  async function onSubmit(values: CatalogItemFormValues) {
    try {
      if (modalMode === "edit" && selectedItem) {
        await updateCatalogItemMutation.mutateAsync({
          itemId: selectedItem.id,
          ...values
        });
        toast.success(t("catalog.form.updateSuccess"));
      } else {
        await createCatalogItemMutation.mutateAsync(values);
        toast.success(t("catalog.form.createSuccess"));
      }

      closeModal();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "";

      if (modalMode === "edit") {
        toast.error(t("catalog.form.updateError", { message }));
      } else {
        toast.error(t("catalog.form.createError", { message }));
      }
    }
  }

  const isMutating =
    createCatalogItemMutation.isPending || updateCatalogItemMutation.isPending;

  const modalTitle =
    modalMode === "edit"
      ? t("catalog.form.updateTitle")
      : t("catalog.form.createTitle");

  const modalDescription =
    modalMode === "edit"
      ? t("catalog.form.updateDescription")
      : t("catalog.form.createDescription");

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("catalog.list.title")}</h1>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>{t("catalog.list.title")}</CardTitle>
              <CardDescription>{t("catalog.list.description")}</CardDescription>
            </div>

            <Button
              type="button"
              size="lg"
              className="gap-2"
              onClick={openCreateModal}
            >
              <Plus className="size-4" />
              {t("catalog.form.createAction")}
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
                placeholder={t("catalog.search.placeholder")}
                className="pl-10"
              />
            </label>

            <Select
              value={tableFilter}
              onChange={(event) => {
                setTableFilter(event.target.value as CatalogTableFilter);
              }}
            >
              <option value="all">{t("catalog.filters.all")}</option>
              <option value="active">{t("catalog.filters.active")}</option>
              <option value="inactive">{t("catalog.filters.inactive")}</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {!hasTenantContext ? (
            <TableState
              title={t("catalog.list.noTenantTitle")}
              description={t("catalog.list.noTenantDescription")}
            />
          ) : isLoading ? (
            <TableState
              title={t("catalog.list.loadingTitle")}
              description={t("catalog.list.loadingDescription")}
            />
          ) : isError ? (
            <TableState
              title={t("catalog.list.errorTitle")}
              description={t("catalog.list.errorDescription", {
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
                  {t("catalog.list.retryAction")}
                </Button>
              }
            />
          ) : filteredItems.length === 0 ? (
            <TableState
              title={
                items.length === 0
                  ? t("catalog.list.emptyTitle")
                  : t("catalog.list.searchEmptyTitle")
              }
              description={
                items.length === 0
                  ? t("catalog.list.emptyDescription")
                  : t("catalog.list.searchEmptyDescription")
              }
            />
          ) : (
            <Table className="min-w-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">
                    {t("catalog.table.nameLabel")}
                  </TableHead>
                  <TableHead>{t("catalog.table.categoryLabel")}</TableHead>
                  <TableHead>{t("catalog.table.kindLabel")}</TableHead>
                  <TableHead>{t("catalog.table.visibilityLabel")}</TableHead>
                  <TableHead>{t("catalog.table.pricingLabel")}</TableHead>
                  <TableHead>{t("catalog.table.statusLabel")}</TableHead>
                  <TableHead className="pr-0 text-right">
                    {t("catalog.table.actionsLabel")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-0">
                      <div className="space-y-1">
                        <p className="font-medium text-ink">{item.name}</p>
                        <p className="text-sm text-ink-soft">
                          {item.itemCode ?? t("catalog.list.noCode")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-ink">
                        {item.category ?? t("catalog.list.noCategory")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone="info">
                        {t(`catalog.kind.${item.kind}`)}
                      </StatusPill>
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        tone={item.visibility === "public" ? "success" : "neutral"}
                      >
                        {t(`catalog.visibility.${item.visibility}`)}
                      </StatusPill>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={getPricingTone(item.pricingMode)}>
                        {formatCatalogPrice(item, t)}
                      </StatusPill>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={getStatusTone(item.status)}>
                        {t(`catalog.status.${item.status}`)}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="pr-0">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            openEditModal(item);
                          }}
                        >
                          <Pencil className="size-4" />
                          {t("catalog.table.editAction")}
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
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open && !isMutating) {
            closeModal();
          }
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription>{modalDescription}</DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <CatalogItemFormFields
              form={form}
              idPrefix="modal"
              pricingMode={pricingMode}
            />

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isMutating}
              >
                {isMutating
                  ? modalMode === "edit"
                    ? t("catalog.form.updateSubmitting")
                    : t("catalog.form.createSubmitting")
                  : modalMode === "edit"
                    ? t("catalog.form.updateAction")
                    : t("catalog.form.createAction")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TableState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-paper/70 p-5">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p>
      {action}
    </div>
  );
}

function getStatusTone(status: CatalogItemStatus) {
  switch (status) {
    case "active":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "neutral";
  }
}

function getPricingTone(pricingMode: CatalogItemPricingMode) {
  return pricingMode === "fixed" ? "success" : "warning";
}

function formatCatalogPrice(
  item: CatalogItemSummary,
  t: ReturnType<typeof useTranslation<"backoffice">>["t"]
) {
  if (item.pricingMode === "on_request" || item.unitPrice === null) {
    return t("catalog.pricing.onRequest");
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: item.currencyCode,
      maximumFractionDigits: 2
    }).format(item.unitPrice);
  } catch {
    return `${item.currencyCode} ${item.unitPrice.toFixed(2)}`;
  }
}
