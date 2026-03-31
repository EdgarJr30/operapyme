import { type ReactNode, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  createInvoiceFormSchema,
  invoiceStatusValues,
  salesDocumentKindValues,
  type InvoiceFormValues
} from "@/lib/forms/invoice-form-schema";
import { buildOperationalAutofillProps } from "@/lib/forms/autofill";
import type {
  CatalogItemSummary,
  QuoteDetail
} from "@/lib/supabase/backoffice-data";
import { useCatalogItemsData } from "@/modules/catalog/use-catalog-items-data";
import { useInvoicesData } from "@/modules/commercial/use-invoices-data";
import { useInvoiceMutations } from "@/modules/commercial/use-invoice-mutations";
import { useCustomersData } from "@/modules/crm/use-customers-data";
import { useLeadsData } from "@/modules/crm/use-leads-data";
import { useQuoteDetailData } from "@/modules/quotes/use-quote-detail-data";
import { useQuotesData } from "@/modules/quotes/use-quotes-data";

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: currencyCode
  }).format(amount);
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
  const { t } = useTranslation("backoffice");
  const invoiceSchema = createInvoiceFormSchema(t);
  const { data: customers = [] } = useCustomersData();
  const { data: leads = [] } = useLeadsData();
  const { data: quotes = [] } = useQuotesData();
  const { data: catalogItems = [] } = useCatalogItemsData();
  const { data: invoices = [] } = useInvoicesData();
  const { createInvoiceMutation } = useInvoiceMutations();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: buildDefaultValues()
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "lineItems"
  });

  const sourceQuoteId = form.watch("sourceQuoteId");
  const documentKind = form.watch("documentKind");
  const recipientKind = form.watch("recipientKind");
  const selectedQuoteDetail = useQuoteDetailData(
    sourceQuoteId?.trim() ? sourceQuoteId : null
  );

  const catalogOptions = useMemo(
    () => getCatalogOptions(catalogItems, documentKind),
    [catalogItems, documentKind]
  );

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
  }, [catalogItems, form, selectedQuoteDetail.data]);

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
      form.reset(buildDefaultValues());
    } catch (error) {
      toast.error(
        t("commercial.invoices.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="sr-only">{t("commercial.invoices.title")}</h1>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("commercial.invoices.formTitle")}</CardTitle>
            <p className="text-sm leading-6 text-ink-soft">
              {t("commercial.invoices.formDescription")}
            </p>
          </CardHeader>
          <CardContent>
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
                    <Input id="invoice-due-on" type="date" {...form.register("dueOn")} />
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
                    <option value="lead">{t("quotes.form.recipientKinds.lead")}</option>
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
                            {...form.register(`lineItems.${index}.itemDescription` as const)}
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
                              {...form.register(`lineItems.${index}.quantity` as const, {
                                valueAsNumber: true
                              })}
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
                              {...form.register(`lineItems.${index}.unitPrice` as const, {
                                valueAsNumber: true
                              })}
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
                              {...form.register(`lineItems.${index}.discountTotal` as const, {
                                valueAsNumber: true
                              })}
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
                              {...form.register(`lineItems.${index}.taxTotal` as const, {
                                valueAsNumber: true
                              })}
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

                  <Field label={t("quotes.form.notesLabel")} htmlFor="invoice-notes">
                    <Textarea
                      id="invoice-notes"
                      placeholder={t("quotes.form.notesPlaceholder")}
                      {...form.register("notes")}
                    />
                  </Field>
                </div>
              </section>

              <Button
                type="submit"
                size="lg"
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending
                  ? t("commercial.invoices.createSubmitting")
                  : t("commercial.invoices.createAction")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("commercial.invoices.historyTitle")}</CardTitle>
            <p className="text-sm leading-6 text-ink-soft">
              {t("commercial.invoices.historyDescription")}
            </p>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-ink-soft">
                {t("commercial.invoices.historyEmpty")}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("navigation.commercialInvoices")}</TableHead>
                    <TableHead>{t("commercial.invoices.statusLabel")}</TableHead>
                    <TableHead className="text-right">
                      {t("quotes.form.grandTotalLabel")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.slice(0, 10).map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-ink">{invoice.title}</p>
                          <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                            {invoice.invoiceNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`commercial.invoices.statuses.${invoice.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMoney(invoice.grandTotal, invoice.currencyCode)}
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
