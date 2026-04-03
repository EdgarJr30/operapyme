import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  catalogItemKindValues,
  catalogItemPricingModeValues,
  catalogItemStatusValues,
  catalogItemVisibilityValues,
  createCatalogItemFormSchema,
  type CatalogItemFormValues
} from "@/lib/forms/catalog-item-form-schema";
import type { CatalogItemSummary } from "@/lib/supabase/backoffice-data";
import { useCatalogMutations } from "@/modules/catalog/use-catalog-mutations";

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

interface CatalogOperationsPanelProps {
  items: CatalogItemSummary[];
}

export function CatalogOperationsPanel({
  items
}: CatalogOperationsPanelProps) {
  const { t } = useTranslation("backoffice");
  const { createCatalogItemMutation, updateCatalogItemMutation } =
    useCatalogMutations();
  const catalogItemFormSchema = createCatalogItemFormSchema(t);
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const createForm = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemFormSchema),
    defaultValues: createDefaultValues
  });

  const updateForm = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemFormSchema),
    defaultValues: createDefaultValues
  });

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );
  const createPricingMode = createForm.watch("pricingMode");
  const updatePricingMode = updateForm.watch("pricingMode");

  useEffect(() => {
    if (!selectedItemId && items[0]) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  useEffect(() => {
    if (!selectedItem) {
      updateForm.reset(createDefaultValues);
      return;
    }

    updateForm.reset({
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
  }, [selectedItem, updateForm]);

  useEffect(() => {
    if (createPricingMode === "on_request") {
      createForm.setValue("unitPrice", null, { shouldValidate: true });
    }
  }, [createForm, createPricingMode]);

  useEffect(() => {
    if (updatePricingMode === "on_request") {
      updateForm.setValue("unitPrice", null, { shouldValidate: true });
    }
  }, [updateForm, updatePricingMode]);

  async function onCreate(values: CatalogItemFormValues) {
    try {
      await createCatalogItemMutation.mutateAsync(values);
      toast.success(t("catalog.form.createSuccess"));
      createForm.reset(createDefaultValues);
    } catch (error) {
      toast.error(
        t("catalog.form.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  async function onUpdate(values: CatalogItemFormValues) {
    if (!selectedItem) {
      toast.error(t("catalog.form.noItemSelected"));
      return;
    }

    try {
      await updateCatalogItemMutation.mutateAsync({
        itemId: selectedItem.id,
        ...values
      });
      toast.success(t("catalog.form.updateSuccess"));
    } catch (error) {
      toast.error(
        t("catalog.form.updateError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t("catalog.form.createTitle")}</CardTitle>
          <CardDescription>
            {t("catalog.form.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreate)}
            noValidate
          >
            <CatalogItemFormFields
              form={createForm}
              idPrefix="create"
              pricingMode={createPricingMode}
            />

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={createCatalogItemMutation.isPending}
              >
                {createCatalogItemMutation.isPending
                  ? t("catalog.form.createSubmitting")
                  : t("catalog.form.createAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  createForm.reset(createDefaultValues);
                }}
              >
                {t("catalog.form.resetAction")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-paper">
        <CardHeader>
          <CardTitle>{t("catalog.form.updateTitle")}</CardTitle>
          <CardDescription>
            {t("catalog.form.updateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-ink"
              htmlFor="catalog-record"
            >
              {t("catalog.form.recordLabel")}
            </label>
            <Select
              id="catalog-record"
              value={selectedItemId}
              onChange={(event) => {
                setSelectedItemId(event.target.value);
              }}
            >
              {items.length === 0 ? (
                <option value="">{t("catalog.form.noItemsOption")}</option>
              ) : (
                items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </Select>
          </div>

          {items.length === 0 ? (
            <FeedbackBanner tone="neutral">
              {t("catalog.form.noItemsHint")}
            </FeedbackBanner>
          ) : (
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(onUpdate)}
              noValidate
            >
              <CatalogItemFormFields
                form={updateForm}
                idPrefix="update"
                pricingMode={updatePricingMode}
              />

              <Button
                type="submit"
                size="lg"
                disabled={updateCatalogItemMutation.isPending || !selectedItem}
              >
                {updateCatalogItemMutation.isPending
                  ? t("catalog.form.updateSubmitting")
                  : t("catalog.form.updateAction")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function CatalogItemFormFields({
  form,
  idPrefix,
  pricingMode
}: {
  form: ReturnType<typeof useForm<CatalogItemFormValues>>;
  idPrefix: string;
  pricingMode: CatalogItemFormValues["pricingMode"];
}) {
  const { t } = useTranslation("backoffice");
  const {
    formState: { errors },
    register
  } = form;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("catalog.form.nameLabel")}
          error={errors.name?.message}
          htmlFor={`${idPrefix}-catalog-name`}
        >
          <Input
            id={`${idPrefix}-catalog-name`}
            placeholder={t("catalog.form.namePlaceholder")}
            {...register("name")}
          />
        </Field>

        <Field
          label={t("catalog.form.itemCodeLabel")}
          error={errors.itemCode?.message}
          htmlFor={`${idPrefix}-catalog-code`}
        >
          <Input
            id={`${idPrefix}-catalog-code`}
            placeholder={t("catalog.form.itemCodePlaceholder")}
            {...register("itemCode")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("catalog.form.categoryLabel")}
          error={errors.category?.message}
          htmlFor={`${idPrefix}-catalog-category`}
        >
          <Input
            id={`${idPrefix}-catalog-category`}
            placeholder={t("catalog.form.categoryPlaceholder")}
            {...register("category")}
          />
        </Field>

        <Field
          label={t("catalog.form.kindLabel")}
          error={errors.kind?.message}
          htmlFor={`${idPrefix}-catalog-kind`}
        >
          <Select id={`${idPrefix}-catalog-kind`} {...register("kind")}>
            {catalogItemKindValues.map((kind) => (
              <option key={kind} value={kind}>
                {t(`catalog.kind.${kind}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label={t("catalog.form.descriptionLabel")}
        error={errors.description?.message}
        htmlFor={`${idPrefix}-catalog-description`}
      >
        <Textarea
          id={`${idPrefix}-catalog-description`}
          placeholder={t("catalog.form.descriptionPlaceholder")}
          {...register("description")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("catalog.form.visibilityLabel")}
          error={errors.visibility?.message}
          htmlFor={`${idPrefix}-catalog-visibility`}
        >
          <Select
            id={`${idPrefix}-catalog-visibility`}
            {...register("visibility")}
          >
            {catalogItemVisibilityValues.map((visibility) => (
              <option key={visibility} value={visibility}>
                {t(`catalog.visibility.${visibility}`)}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t("catalog.form.statusLabel")}
          error={errors.status?.message}
          htmlFor={`${idPrefix}-catalog-status`}
        >
          <Select id={`${idPrefix}-catalog-status`} {...register("status")}>
            {catalogItemStatusValues.map((status) => (
              <option key={status} value={status}>
                {t(`catalog.status.${status}`)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("catalog.form.pricingModeLabel")}
          error={errors.pricingMode?.message}
          htmlFor={`${idPrefix}-catalog-pricing-mode`}
        >
          <Select
            id={`${idPrefix}-catalog-pricing-mode`}
            {...register("pricingMode")}
          >
            {catalogItemPricingModeValues.map((pricingModeOption) => (
              <option key={pricingModeOption} value={pricingModeOption}>
                {t(`catalog.pricingMode.${pricingModeOption}`)}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t("catalog.form.currencyCodeLabel")}
          error={errors.currencyCode?.message}
          htmlFor={`${idPrefix}-catalog-currency`}
        >
          <Input
            id={`${idPrefix}-catalog-currency`}
            placeholder={t("catalog.form.currencyCodePlaceholder")}
            {...register("currencyCode")}
          />
        </Field>
      </div>

      <Field
        label={t("catalog.form.unitPriceLabel")}
        error={errors.unitPrice?.message}
        htmlFor={`${idPrefix}-catalog-price`}
      >
        <Input
          id={`${idPrefix}-catalog-price`}
          type="number"
          step="1"
          min="0"
          inputMode="decimal"
          placeholder={t("catalog.form.unitPricePlaceholder")}
          disabled={pricingMode === "on_request"}
          {...register("unitPrice", {
            setValueAs: (value) =>
              value === "" || value === undefined ? null : Number(value)
          })}
        />
      </Field>

      <Field
        label={t("catalog.form.notesLabel")}
        error={errors.notes?.message}
        htmlFor={`${idPrefix}-catalog-notes`}
      >
        <Textarea
          id={`${idPrefix}-catalog-notes`}
          placeholder={t("catalog.form.notesPlaceholder")}
          {...register("notes")}
        />
      </Field>
    </>
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

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>
      {children}
    </p>
  );
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
