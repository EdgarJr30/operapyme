import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

export type CustomerStatus = "active" | "inactive" | "archived";
export type LeadStatus =
  | "new"
  | "qualified"
  | "proposal"
  | "won"
  | "lost"
  | "archived";
export type LeadSource =
  | "manual"
  | "website"
  | "whatsapp"
  | "walk-in"
  | "repeat";
export type CatalogItemStatus = "active" | "draft" | "archived";
export type CatalogItemKind = "product" | "service";
export type CatalogItemVisibility = "public" | "private";
export type CatalogItemPricingMode = "fixed" | "on_request";
export type QuoteRecipientKind = "customer" | "lead" | "ad_hoc";
export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "approved"
  | "rejected"
  | "expired";
export type SalesDocumentKind = "items" | "services";
export type InvoiceStatus = "draft" | "issued" | "paid" | "void" | "cancelled";

export interface CustomerSummary {
  id: string;
  customerCode: string | null;
  displayName: string;
  contactName: string | null;
  legalName: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  documentId: string | null;
  notes: string | null;
  source: string;
  status: CustomerStatus;
  updatedAt: string;
}

export interface LeadSummary {
  id: string;
  leadCode: string | null;
  displayName: string;
  contactName: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  source: LeadSource;
  status: LeadStatus;
  needSummary: string | null;
  notes: string | null;
  convertedCustomerId: string | null;
  convertedAt: string | null;
  updatedAt: string;
}

export interface CatalogItemSummary {
  id: string;
  itemCode: string | null;
  name: string;
  description: string | null;
  category: string | null;
  kind: CatalogItemKind;
  visibility: CatalogItemVisibility;
  pricingMode: CatalogItemPricingMode;
  currencyCode: string;
  unitPrice: number | null;
  status: CatalogItemStatus;
  notes: string | null;
  updatedAt: string;
}

export interface QuoteLineItemSummary {
  id: string;
  catalogItemId: string | null;
  sortOrder: number;
  itemName: string;
  itemDescription: string | null;
  quantity: number;
  unitLabel: string | null;
  unitPrice: number;
  discountTotal: number;
  taxTotal: number;
  lineSubtotal: number;
  lineTotal: number;
}

export interface QuoteSummary {
  id: string;
  customerId: string | null;
  leadId: string | null;
  recipientKind: QuoteRecipientKind;
  recipientDisplayName: string;
  recipientContactName: string | null;
  recipientEmail: string | null;
  recipientWhatsApp: string | null;
  recipientPhone: string | null;
  quoteNumber: string;
  title: string;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: QuoteStatus;
  version: number;
  validUntil: string | null;
  cancellationReason: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteDetail extends QuoteSummary {
  lineItems: QuoteLineItemSummary[];
}

export interface InvoiceSummary {
  id: string;
  sourceQuoteId: string | null;
  customerId: string | null;
  leadId: string | null;
  recipientKind: QuoteRecipientKind;
  recipientDisplayName: string;
  recipientContactName: string | null;
  recipientEmail: string | null;
  recipientWhatsApp: string | null;
  recipientPhone: string | null;
  invoiceNumber: string;
  title: string;
  documentKind: SalesDocumentKind;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: InvoiceStatus;
  issuedOn: string | null;
  dueOn: string | null;
  voidReason: string | null;
  notes: string | null;
  reversalOfInvoiceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceDetail extends InvoiceSummary {
  lineItems: QuoteLineItemSummary[];
}

export interface CustomerTransactionSummary {
  customerId: string;
  currencyCode: string;
  lastPaidAt: string | null;
  lastOpenAt: string | null;
  lastOpenStatus: Extract<InvoiceStatus, "draft" | "issued"> | null;
  paidAmount: number;
  openAmount: number;
}

export interface DashboardSnapshot {
  customerCount: number;
  activeCustomerCount: number;
  quoteCount: number;
  openQuoteCount: number;
  customerTransactions: CustomerTransactionSummary[];
  recentCustomers: CustomerSummary[];
  recentQuotes: QuoteSummary[];
}

interface CountResult {
  count: number | null;
}

interface RawCustomerRow {
  id: string;
  customer_code: string | null;
  display_name: string;
  contact_name: string | null;
  legal_name: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  document_id: string | null;
  notes: string | null;
  source: string;
  status: CustomerStatus;
  updated_at: string;
}

interface RawLeadRow {
  id: string;
  lead_code: string | null;
  display_name: string;
  contact_name: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  source: LeadSource;
  status: LeadStatus;
  need_summary: string | null;
  notes: string | null;
  converted_customer_id: string | null;
  converted_at: string | null;
  updated_at: string;
}

export interface CustomerListOptions {
  limit?: number | null;
  statuses?: CustomerStatus[];
}

export interface LeadListOptions {
  limit?: number | null;
  statuses?: LeadStatus[];
}

export interface QuoteListOptions {
  limit?: number | null;
  statuses?: QuoteStatus[];
}

interface RawCatalogItemRow {
  id: string;
  item_code: string | null;
  name: string;
  description: string | null;
  category: string | null;
  kind: CatalogItemKind;
  visibility: CatalogItemVisibility;
  pricing_mode: CatalogItemPricingMode;
  currency_code: string;
  unit_price: number | string | null;
  status: CatalogItemStatus;
  notes: string | null;
  updated_at: string;
}

interface RawQuoteLineRow {
  id: string;
  catalog_item_id: string | null;
  sort_order: number;
  item_name: string;
  item_description: string | null;
  quantity: number | string;
  unit_label: string | null;
  unit_price: number | string;
  discount_total: number | string;
  tax_total: number | string;
  line_subtotal: number | string;
  line_total: number | string;
}

interface RawQuoteRow {
  id: string;
  customer_id: string | null;
  lead_id: string | null;
  recipient_kind: QuoteRecipientKind;
  recipient_display_name: string;
  recipient_contact_name: string | null;
  recipient_email: string | null;
  recipient_whatsapp: string | null;
  recipient_phone: string | null;
  quote_number: string;
  title: string;
  currency_code: string;
  subtotal: number | string;
  discount_total: number | string;
  tax_total: number | string;
  grand_total: number | string;
  status: QuoteStatus;
  version: number;
  valid_until: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  line_items?: RawQuoteLineRow[] | null;
}

interface RawInvoiceRow {
  id: string;
  source_quote_id: string | null;
  customer_id: string | null;
  lead_id: string | null;
  recipient_kind: QuoteRecipientKind;
  recipient_display_name: string;
  recipient_contact_name: string | null;
  recipient_email: string | null;
  recipient_whatsapp: string | null;
  recipient_phone: string | null;
  invoice_number: string;
  title: string;
  document_kind: SalesDocumentKind;
  currency_code: string;
  subtotal: number | string;
  discount_total: number | string;
  tax_total: number | string;
  grand_total: number | string;
  status: InvoiceStatus;
  issued_on: string | null;
  due_on: string | null;
  void_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  reversal_of_invoice_id: string | null;
  line_items?: RawQuoteLineRow[] | null;
}

export interface CreateCustomerInput {
  tenantId: string;
  customerCode?: string | null;
  displayName: string;
  contactName: string;
  legalName?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  documentId?: string | null;
  source: string;
  status: CustomerStatus;
  notes?: string | null;
}

export interface UpdateCustomerInput {
  tenantId: string;
  customerId: string;
  customerCode?: string | null;
  displayName: string;
  contactName: string;
  legalName?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  documentId?: string | null;
  source: string;
  status: CustomerStatus;
  notes?: string | null;
}

export interface ArchiveCustomerInput {
  tenantId: string;
  customerId: string;
}

export interface CreateLeadInput {
  tenantId: string;
  leadCode?: string | null;
  displayName: string;
  contactName?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  source: LeadSource;
  status: LeadStatus;
  needSummary?: string | null;
  notes?: string | null;
}

export interface UpdateLeadInput extends CreateLeadInput {
  leadId: string;
}

export interface ConvertLeadToCustomerInput {
  tenantId: string;
  leadId: string;
}

export interface CreateCatalogItemInput {
  tenantId: string;
  itemCode?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
  kind: CatalogItemKind;
  visibility: CatalogItemVisibility;
  pricingMode: CatalogItemPricingMode;
  currencyCode: string;
  unitPrice?: number | null;
  status: CatalogItemStatus;
  notes?: string | null;
}

export interface UpdateCatalogItemInput extends CreateCatalogItemInput {
  itemId: string;
}

export interface QuoteLineInput {
  catalogItemId?: string | null;
  itemName: string;
  itemDescription?: string | null;
  quantity: number;
  unitLabel?: string | null;
  unitPrice: number;
  discountTotal: number;
  taxTotal: number;
}

export interface CreateQuoteInput {
  tenantId: string;
  customerId?: string | null;
  leadId?: string | null;
  recipientKind: QuoteRecipientKind;
  recipientDisplayName: string;
  recipientContactName?: string | null;
  recipientEmail?: string | null;
  recipientWhatsApp?: string | null;
  recipientPhone?: string | null;
  title: string;
  status: QuoteStatus;
  currencyCode: string;
  documentDiscountTotal: number;
  notes?: string | null;
  validUntil?: string | null;
  lineItems: QuoteLineInput[];
}

export interface UpdateQuoteInput extends CreateQuoteInput {
  quoteId: string;
  version: number;
}

export interface MoveQuoteStatusInput {
  tenantId: string;
  quoteId: string;
  version: number;
  status: QuoteStatus;
  cancellationReason?: string;
}

export interface CreateInvoiceInput {
  tenantId: string;
  sourceQuoteId?: string | null;
  customerId?: string | null;
  leadId?: string | null;
  recipientKind: QuoteRecipientKind;
  recipientDisplayName: string;
  recipientContactName?: string | null;
  recipientEmail?: string | null;
  recipientWhatsApp?: string | null;
  recipientPhone?: string | null;
  title: string;
  documentKind: SalesDocumentKind;
  status: InvoiceStatus;
  currencyCode: string;
  documentDiscountTotal: number;
  notes?: string | null;
  issuedOn?: string | null;
  dueOn?: string | null;
  lineItems: QuoteLineInput[];
}

export interface MoveInvoiceStatusInput {
  tenantId: string;
  invoiceId: string;
  status: InvoiceStatus;
  voidReason?: string;
}

export interface UpdateInvoiceInput {
  tenantId: string;
  invoiceId: string;
  title: string;
  documentKind: SalesDocumentKind;
  currencyCode: string;
  recipientKind: QuoteRecipientKind;
  customerId?: string | null;
  leadId?: string | null;
  recipientDisplayName: string;
  recipientContactName?: string | null;
  recipientEmail?: string | null;
  recipientWhatsApp?: string | null;
  recipientPhone?: string | null;
  documentDiscountTotal: number;
  issuedOn?: string | null;
  dueOn?: string | null;
  notes?: string | null;
  lineItems: QuoteLineInput[];
}

export interface CancelInvoiceInput {
  tenantId: string;
  invoiceId: string;
  cancelReason: string;
}

export interface CancelInvoiceResult {
  cancelledInvoiceId: string;
  reversalInvoiceId: string;
  reversalInvoiceNumber: string;
}

const customerSelectFields =
  "id, customer_code, display_name, contact_name, legal_name, email, whatsapp, phone, document_id, notes, source, status, updated_at";

const leadSelectFields =
  "id, lead_code, display_name, contact_name, email, whatsapp, phone, source, status, need_summary, notes, converted_customer_id, converted_at, updated_at";

const catalogItemSelectFields =
  "id, item_code, name, description, category, kind, visibility, pricing_mode, currency_code, unit_price, status, notes, updated_at";

const quoteLineSelectFields =
  "id, catalog_item_id, sort_order, item_name, item_description, quantity, unit_label, unit_price, discount_total, tax_total, line_subtotal, line_total";

const quoteSelectFields =
  "id, customer_id, lead_id, recipient_kind, recipient_display_name, recipient_contact_name, recipient_email, recipient_whatsapp, recipient_phone, quote_number, title, currency_code, subtotal, discount_total, tax_total, grand_total, status, version, valid_until, cancellation_reason, notes, created_at, updated_at";

const quoteDetailSelectFields = `${quoteSelectFields}, line_items:quote_line_items(${quoteLineSelectFields})`;

const invoiceSelectFields =
  "id, source_quote_id, customer_id, lead_id, recipient_kind, recipient_display_name, recipient_contact_name, recipient_email, recipient_whatsapp, recipient_phone, invoice_number, title, document_kind, currency_code, subtotal, discount_total, tax_total, grand_total, status, issued_on, due_on, void_reason, notes, reversal_of_invoice_id, created_at, updated_at";

const invoiceDetailSelectFields = `${invoiceSelectFields}, line_items:invoice_line_items(${quoteLineSelectFields})`;

function requireSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error("Supabase is not configured for this environment.");
  }

  return supabase;
}

function requireTenantScope(tenantId: string) {
  const normalizedTenantId = tenantId.trim();

  if (!normalizedTenantId) {
    throw new Error(
      "An active tenant is required for tenant-scoped operations."
    );
  }

  return normalizedTenantId;
}

function requireRecordId(value: string, label: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`${label} is required.`);
  }

  return normalizedValue;
}

function unwrapCount(result: CountResult | null) {
  return typeof result?.count === "number" ? result.count : 0;
}

function normalizeOptionalValue(value: string | null | undefined) {
  const nextValue = value?.trim();

  return nextValue ? nextValue : null;
}

function normalizeCatalogPrice(
  pricingMode: CatalogItemPricingMode,
  unitPrice: number | null | undefined
) {
  if (pricingMode === "on_request") {
    return null;
  }

  return typeof unitPrice === "number" ? unitPrice : 0;
}

function normalizeQuoteLineItems(lineItems: QuoteLineInput[]) {
  return lineItems.map((lineItem) => ({
    catalogItemId: normalizeOptionalValue(lineItem.catalogItemId ?? null),
    itemName: lineItem.itemName.trim(),
    itemDescription: normalizeOptionalValue(lineItem.itemDescription),
    quantity: lineItem.quantity,
    unitLabel: normalizeOptionalValue(lineItem.unitLabel),
    unitPrice: lineItem.unitPrice,
    discountTotal: lineItem.discountTotal,
    taxTotal: lineItem.taxTotal
  }));
}

function mapCustomer(row: RawCustomerRow): CustomerSummary {
  return {
    id: row.id,
    customerCode: row.customer_code,
    displayName: row.display_name,
    contactName: row.contact_name,
    legalName: row.legal_name,
    email: row.email,
    whatsapp: row.whatsapp,
    phone: row.phone,
    documentId: row.document_id,
    notes: row.notes,
    source: row.source,
    status: row.status,
    updatedAt: row.updated_at
  };
}

function mapLead(row: RawLeadRow): LeadSummary {
  return {
    id: row.id,
    leadCode: row.lead_code,
    displayName: row.display_name,
    contactName: row.contact_name,
    email: row.email,
    whatsapp: row.whatsapp,
    phone: row.phone,
    source: row.source,
    status: row.status,
    needSummary: row.need_summary,
    notes: row.notes,
    convertedCustomerId: row.converted_customer_id,
    convertedAt: row.converted_at,
    updatedAt: row.updated_at
  };
}

function normalizeCustomerListOptions(
  limitOrOptions: number | CustomerListOptions | undefined
): CustomerListOptions {
  if (typeof limitOrOptions === "number") {
    return { limit: limitOrOptions };
  }

  return limitOrOptions ?? {};
}

function normalizeLeadListOptions(
  limitOrOptions: number | LeadListOptions | undefined
): LeadListOptions {
  if (typeof limitOrOptions === "number") {
    return { limit: limitOrOptions };
  }

  return limitOrOptions ?? {};
}

function normalizeQuoteListOptions(
  limitOrOptions: number | QuoteListOptions | undefined
): QuoteListOptions {
  if (typeof limitOrOptions === "number") {
    return { limit: limitOrOptions };
  }

  return limitOrOptions ?? {};
}

function mapCatalogItem(row: RawCatalogItemRow): CatalogItemSummary {
  return {
    id: row.id,
    itemCode: row.item_code,
    name: row.name,
    description: row.description,
    category: row.category,
    kind: row.kind,
    visibility: row.visibility,
    pricingMode: row.pricing_mode,
    currencyCode: row.currency_code,
    unitPrice: row.unit_price === null ? null : Number(row.unit_price),
    status: row.status,
    notes: row.notes,
    updatedAt: row.updated_at
  };
}

function mapQuoteLine(row: RawQuoteLineRow): QuoteLineItemSummary {
  return {
    id: row.id,
    catalogItemId: row.catalog_item_id,
    sortOrder: row.sort_order,
    itemName: row.item_name,
    itemDescription: row.item_description,
    quantity: Number(row.quantity ?? 0),
    unitLabel: row.unit_label,
    unitPrice: Number(row.unit_price ?? 0),
    discountTotal: Number(row.discount_total ?? 0),
    taxTotal: Number(row.tax_total ?? 0),
    lineSubtotal: Number(row.line_subtotal ?? 0),
    lineTotal: Number(row.line_total ?? 0)
  };
}

function mapQuote(row: RawQuoteRow): QuoteSummary {
  return {
    id: row.id,
    customerId: row.customer_id,
    leadId: row.lead_id,
    recipientKind: row.recipient_kind,
    recipientDisplayName: row.recipient_display_name,
    recipientContactName: row.recipient_contact_name,
    recipientEmail: row.recipient_email,
    recipientWhatsApp: row.recipient_whatsapp,
    recipientPhone: row.recipient_phone,
    quoteNumber: row.quote_number,
    title: row.title,
    currencyCode: row.currency_code,
    subtotal: Number(row.subtotal ?? 0),
    discountTotal: Number(row.discount_total ?? 0),
    taxTotal: Number(row.tax_total ?? 0),
    grandTotal: Number(row.grand_total ?? 0),
    status: row.status,
    version: row.version,
    validUntil: row.valid_until,
    cancellationReason: row.cancellation_reason ?? null,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapQuoteDetail(row: RawQuoteRow): QuoteDetail {
  return {
    ...mapQuote(row),
    lineItems: (row.line_items ?? []).map(mapQuoteLine)
  };
}

function mapInvoice(row: RawInvoiceRow): InvoiceSummary {
  return {
    id: row.id,
    sourceQuoteId: row.source_quote_id,
    customerId: row.customer_id,
    leadId: row.lead_id,
    recipientKind: row.recipient_kind,
    recipientDisplayName: row.recipient_display_name,
    recipientContactName: row.recipient_contact_name,
    recipientEmail: row.recipient_email,
    recipientWhatsApp: row.recipient_whatsapp,
    recipientPhone: row.recipient_phone,
    invoiceNumber: row.invoice_number,
    title: row.title,
    documentKind: row.document_kind,
    currencyCode: row.currency_code,
    subtotal: Number(row.subtotal ?? 0),
    discountTotal: Number(row.discount_total ?? 0),
    taxTotal: Number(row.tax_total ?? 0),
    grandTotal: Number(row.grand_total ?? 0),
    status: row.status,
    issuedOn: row.issued_on,
    dueOn: row.due_on,
    voidReason: row.void_reason ?? null,
    notes: row.notes,
    reversalOfInvoiceId: row.reversal_of_invoice_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapInvoiceDetail(row: RawInvoiceRow): InvoiceDetail {
  return {
    ...mapInvoice(row),
    lineItems: (row.line_items ?? []).map(mapQuoteLine)
  };
}

export async function listCustomersForTenant(
  tenantId: string,
  limitOrOptions: number | CustomerListOptions = 6
): Promise<CustomerSummary[]> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const { limit, statuses } = normalizeCustomerListOptions(limitOrOptions);
  let query = client
    .from("customers")
    .select(customerSelectFields)
    .eq("tenant_id", scopedTenantId)
    .order("updated_at", { ascending: false });

  if (statuses?.length) {
    query = query.in("status", statuses);
  }

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawCustomerRow[]).map(mapCustomer);
}

export async function listLeadsForTenant(
  tenantId: string,
  limitOrOptions: number | LeadListOptions = 25
): Promise<LeadSummary[]> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const { limit, statuses } = normalizeLeadListOptions(limitOrOptions);
  let query = client
    .from("leads")
    .select(leadSelectFields)
    .eq("tenant_id", scopedTenantId)
    .order("updated_at", { ascending: false });

  if (statuses?.length) {
    query = query.in("status", statuses);
  }

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawLeadRow[]).map(mapLead);
}

export async function listCatalogItemsForTenant(
  tenantId: string,
  limit?: number | null
): Promise<CatalogItemSummary[]> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  let query = client
    .from("catalog_items")
    .select(catalogItemSelectFields)
    .eq("tenant_id", scopedTenantId)
    .order("updated_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawCatalogItemRow[]).map(mapCatalogItem);
}

export async function listQuotesForTenant(
  tenantId: string,
  limitOrOptions: number | QuoteListOptions = 6
): Promise<QuoteSummary[]> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const { limit, statuses } = normalizeQuoteListOptions(limitOrOptions);
  let query = client
    .from("quotes")
    .select(quoteSelectFields)
    .eq("tenant_id", scopedTenantId)
    .order("updated_at", { ascending: false });

  if (statuses?.length) {
    query = query.in("status", statuses);
  }

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawQuoteRow[]).map(mapQuote);
}

export async function getQuoteDetail(
  tenantId: string,
  quoteId: string
): Promise<QuoteDetail> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const scopedQuoteId = requireRecordId(quoteId, "Quote id");
  const { data, error } = await client
    .from("quotes")
    .select(quoteDetailSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedQuoteId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapQuoteDetail(data as RawQuoteRow);
}

export async function listInvoicesForTenant(
  tenantId: string,
  limit = 25
): Promise<InvoiceSummary[]> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const { data, error } = await client
    .from("invoices")
    .select(invoiceSelectFields)
    .eq("tenant_id", scopedTenantId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawInvoiceRow[]).map(mapInvoice);
}

export async function getInvoiceDetail(
  tenantId: string,
  invoiceId: string
): Promise<InvoiceDetail> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const scopedInvoiceId = requireRecordId(invoiceId, "Invoice id");
  const { data, error } = await client
    .from("invoices")
    .select(invoiceDetailSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedInvoiceId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapInvoiceDetail(data as RawInvoiceRow);
}

export async function getDashboardSnapshot(
  tenantId: string
): Promise<DashboardSnapshot> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(tenantId);
  const [
    customerCountResult,
    activeCustomerCountResult,
    quoteCountResult,
    openQuoteCountResult,
    recentCustomers,
    recentQuotes
  ] = await Promise.all([
    client
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", scopedTenantId),
    client
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", scopedTenantId)
      .eq("status", "active"),
    client
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", scopedTenantId),
    client
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", scopedTenantId)
      .in("status", ["draft", "sent", "viewed"]),
    listCustomersForTenant(scopedTenantId, {
      limit: 3,
      statuses: ["active", "inactive"]
    }),
    listQuotesForTenant(scopedTenantId, 3)
  ]);

  for (const result of [
    customerCountResult,
    activeCustomerCountResult,
    quoteCountResult,
    openQuoteCountResult
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const customerTransactions =
    recentCustomers.length === 0
      ? []
      : await listCustomerTransactionsForDashboard(
          client,
          scopedTenantId,
          recentCustomers
        );

  return {
    customerCount: unwrapCount(customerCountResult),
    activeCustomerCount: unwrapCount(activeCustomerCountResult),
    quoteCount: unwrapCount(quoteCountResult),
    openQuoteCount: unwrapCount(openQuoteCountResult),
    customerTransactions,
    recentCustomers,
    recentQuotes
  };
}

async function listCustomerTransactionsForDashboard(
  client: SupabaseClient,
  tenantId: string,
  customers: CustomerSummary[]
): Promise<CustomerTransactionSummary[]> {
  if (customers.length === 0) {
    return [];
  }

  const { data, error } = await client
    .from("invoices")
    .select(invoiceSelectFields)
    .eq("tenant_id", tenantId)
    .in("status", ["draft", "issued", "paid"])
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return summarizeInvoicesByCustomer(
    (data ?? []) as RawInvoiceRow[],
    customers
  );
}

function summarizeInvoicesByCustomer(
  rows: RawInvoiceRow[],
  customers: CustomerSummary[]
): CustomerTransactionSummary[] {
  const summaryByCustomer = new Map<string, CustomerTransactionSummary>();
  const customerIdByNormalizedName = new Map(
    customers.map((customer) => [
      normalizeDashboardRecipientName(customer.displayName),
      customer.id
    ])
  );
  const validCustomerIds = new Set(customers.map((customer) => customer.id));

  for (const row of rows) {
    const customerId =
      row.customer_id && validCustomerIds.has(row.customer_id)
        ? row.customer_id
        : customerIdByNormalizedName.get(
            normalizeDashboardRecipientName(row.recipient_display_name)
          ) ?? null;

    if (!customerId) {
      continue;
    }

    const invoice = mapInvoice(row);
    const current = summaryByCustomer.get(customerId);
    const invoiceAmount = invoice.status === "void" ? 0 : invoice.grandTotal;

    if (!current) {
      summaryByCustomer.set(customerId, {
        customerId,
        currencyCode: invoice.currencyCode,
        lastPaidAt: invoice.status === "paid" ? invoice.updatedAt : null,
        lastOpenAt:
          invoice.status === "draft" || invoice.status === "issued"
            ? invoice.updatedAt
            : null,
        lastOpenStatus:
          invoice.status === "draft" || invoice.status === "issued"
            ? invoice.status
            : null,
        paidAmount: invoice.status === "paid" ? invoiceAmount : 0,
        openAmount:
          invoice.status === "draft" || invoice.status === "issued"
            ? invoiceAmount
            : 0
      });
      continue;
    }

    if (invoice.currencyCode !== current.currencyCode) {
      continue;
    }

    if (invoice.status === "paid") {
      current.paidAmount += invoiceAmount;

      if (!current.lastPaidAt) {
        current.lastPaidAt = invoice.updatedAt;
      }
    }

    if (invoice.status === "draft" || invoice.status === "issued") {
      current.openAmount += invoiceAmount;

      if (!current.lastOpenAt) {
        current.lastOpenAt = invoice.updatedAt;
        current.lastOpenStatus = invoice.status;
      }
    }
  }

  return Array.from(summaryByCustomer.values());
}

function normalizeDashboardRecipientName(value: string | null | undefined) {
  return (value ?? "").trim().toLocaleLowerCase();
}

export async function createCustomer(input: CreateCustomerInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const payload = {
    tenant_id: scopedTenantId,
    customer_code: normalizeOptionalValue(input.customerCode),
    display_name: input.displayName.trim(),
    contact_name: input.contactName.trim(),
    legal_name: normalizeOptionalValue(input.legalName),
    email: normalizeOptionalValue(input.email),
    whatsapp: normalizeOptionalValue(input.whatsapp),
    phone: normalizeOptionalValue(input.phone),
    document_id: normalizeOptionalValue(input.documentId),
    source: input.source,
    status: input.status,
    notes: normalizeOptionalValue(input.notes)
  };

  const { data, error } = await client
    .from("customers")
    .insert(payload)
    .select(customerSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomer(data as RawCustomerRow);
}

export async function createLead(input: CreateLeadInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const payload = {
    tenant_id: scopedTenantId,
    lead_code: normalizeOptionalValue(input.leadCode),
    display_name: input.displayName.trim(),
    contact_name: normalizeOptionalValue(input.contactName),
    email: normalizeOptionalValue(input.email),
    whatsapp: normalizeOptionalValue(input.whatsapp),
    phone: normalizeOptionalValue(input.phone),
    source: input.source,
    status: input.status,
    need_summary: normalizeOptionalValue(input.needSummary),
    notes: normalizeOptionalValue(input.notes)
  };

  const { data, error } = await client
    .from("leads")
    .insert(payload)
    .select(leadSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapLead(data as RawLeadRow);
}

export async function updateLead(input: UpdateLeadInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedLeadId = requireRecordId(input.leadId, "Lead id");
  const payload = {
    lead_code: normalizeOptionalValue(input.leadCode),
    display_name: input.displayName.trim(),
    contact_name: normalizeOptionalValue(input.contactName),
    email: normalizeOptionalValue(input.email),
    whatsapp: normalizeOptionalValue(input.whatsapp),
    phone: normalizeOptionalValue(input.phone),
    source: input.source,
    status: input.status,
    need_summary: normalizeOptionalValue(input.needSummary),
    notes: normalizeOptionalValue(input.notes)
  };

  const { data, error } = await client
    .from("leads")
    .update(payload)
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedLeadId)
    .select(leadSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapLead(data as RawLeadRow);
}

export async function createCatalogItem(input: CreateCatalogItemInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const payload = {
    tenant_id: scopedTenantId,
    item_code: normalizeOptionalValue(input.itemCode),
    name: input.name.trim(),
    description: normalizeOptionalValue(input.description),
    category: normalizeOptionalValue(input.category),
    kind: input.kind,
    visibility: input.visibility,
    pricing_mode: input.pricingMode,
    currency_code: input.currencyCode.trim().toUpperCase(),
    unit_price: normalizeCatalogPrice(input.pricingMode, input.unitPrice),
    status: input.status,
    notes: normalizeOptionalValue(input.notes)
  };

  const { data, error } = await client
    .from("catalog_items")
    .insert(payload)
    .select(catalogItemSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCatalogItem(data as RawCatalogItemRow);
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedCustomerId = requireRecordId(input.customerId, "Customer id");
  const payload = {
    customer_code: normalizeOptionalValue(input.customerCode),
    display_name: input.displayName.trim(),
    contact_name: input.contactName.trim(),
    legal_name: normalizeOptionalValue(input.legalName),
    email: normalizeOptionalValue(input.email),
    whatsapp: normalizeOptionalValue(input.whatsapp),
    phone: normalizeOptionalValue(input.phone),
    document_id: normalizeOptionalValue(input.documentId),
    source: input.source,
    status: input.status,
    notes: normalizeOptionalValue(input.notes)
  };

  const { data, error } = await client
    .from("customers")
    .update(payload)
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedCustomerId)
    .select(customerSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomer(data as RawCustomerRow);
}

export async function archiveCustomer(input: ArchiveCustomerInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedCustomerId = requireRecordId(input.customerId, "Customer id");

  const { data, error } = await client
    .from("customers")
    .update({ status: "archived" })
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedCustomerId)
    .select(customerSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomer(data as RawCustomerRow);
}

export async function updateCatalogItem(input: UpdateCatalogItemInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedItemId = requireRecordId(input.itemId, "Catalog item id");
  const payload = {
    item_code: normalizeOptionalValue(input.itemCode),
    name: input.name.trim(),
    description: normalizeOptionalValue(input.description),
    category: normalizeOptionalValue(input.category),
    kind: input.kind,
    visibility: input.visibility,
    pricing_mode: input.pricingMode,
    currency_code: input.currencyCode.trim().toUpperCase(),
    unit_price: normalizeCatalogPrice(input.pricingMode, input.unitPrice),
    status: input.status,
    notes: normalizeOptionalValue(input.notes)
  };

  const { data, error } = await client
    .from("catalog_items")
    .update(payload)
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedItemId)
    .select(catalogItemSelectFields)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCatalogItem(data as RawCatalogItemRow);
}

export async function createQuote(input: CreateQuoteInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const normalizedCustomerId =
    input.recipientKind === "customer" ? input.customerId ?? null : null;
  const normalizedLeadId =
    input.recipientKind === "lead" ? input.leadId ?? null : null;

  const { data: quoteId, error } = await client.rpc("create_quote", {
    target_tenant_id: scopedTenantId,
    target_title: input.title.trim(),
    target_status: input.status,
    target_currency_code: input.currencyCode.trim().toUpperCase(),
    target_recipient_kind: input.recipientKind,
    target_line_items: normalizeQuoteLineItems(input.lineItems),
    target_document_discount_total: input.documentDiscountTotal,
    target_customer_id: normalizedCustomerId,
    target_lead_id: normalizedLeadId,
    target_recipient_display_name: normalizeOptionalValue(
      input.recipientDisplayName
    ),
    target_recipient_contact_name: normalizeOptionalValue(
      input.recipientContactName
    ),
    target_recipient_email: normalizeOptionalValue(input.recipientEmail),
    target_recipient_whatsapp: normalizeOptionalValue(input.recipientWhatsApp),
    target_recipient_phone: normalizeOptionalValue(input.recipientPhone),
    target_valid_until: normalizeOptionalValue(input.validUntil),
    target_notes: normalizeOptionalValue(input.notes)
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("quotes")
    .select(quoteSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", quoteId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapQuote(data as RawQuoteRow);
}

export async function convertLeadToCustomer(
  input: ConvertLeadToCustomerInput
) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedLeadId = requireRecordId(input.leadId, "Lead id");

  const { data, error } = await client.rpc("convert_lead_to_customer", {
    target_tenant_id: scopedTenantId,
    target_lead_id: scopedLeadId
  });

  if (error) {
    throw new Error(error.message);
  }

  return requireRecordId((data as string | null) ?? "", "Customer id");
}

export async function updateQuote(input: UpdateQuoteInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedQuoteId = requireRecordId(input.quoteId, "Quote id");
  const normalizedCustomerId =
    input.recipientKind === "customer" ? input.customerId ?? null : null;
  const normalizedLeadId =
    input.recipientKind === "lead" ? input.leadId ?? null : null;

  const { data: quoteId, error } = await client.rpc("update_quote", {
    target_tenant_id: scopedTenantId,
    target_quote_id: scopedQuoteId,
    expected_version: input.version,
    target_title: input.title.trim(),
    target_status: input.status,
    target_currency_code: input.currencyCode.trim().toUpperCase(),
    target_recipient_kind: input.recipientKind,
    target_line_items: normalizeQuoteLineItems(input.lineItems),
    target_document_discount_total: input.documentDiscountTotal,
    target_customer_id: normalizedCustomerId,
    target_lead_id: normalizedLeadId,
    target_recipient_display_name: normalizeOptionalValue(
      input.recipientDisplayName
    ),
    target_recipient_contact_name: normalizeOptionalValue(
      input.recipientContactName
    ),
    target_recipient_email: normalizeOptionalValue(input.recipientEmail),
    target_recipient_whatsapp: normalizeOptionalValue(input.recipientWhatsApp),
    target_recipient_phone: normalizeOptionalValue(input.recipientPhone),
    target_valid_until: normalizeOptionalValue(input.validUntil),
    target_notes: normalizeOptionalValue(input.notes)
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("quotes")
    .select(quoteSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", quoteId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapQuote(data as RawQuoteRow);
}

export async function moveQuoteStatus(input: MoveQuoteStatusInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedQuoteId = requireRecordId(input.quoteId, "Quote id");

  const { data: quoteId, error } = await client.rpc("move_quote_status", {
    target_tenant_id: scopedTenantId,
    target_quote_id: scopedQuoteId,
    expected_version: input.version,
    target_status: input.status,
    p_cancellation_reason: input.cancellationReason ?? null
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("quotes")
    .select(quoteSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", quoteId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapQuote(data as RawQuoteRow);
}

export async function createInvoice(input: CreateInvoiceInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const normalizedCustomerId =
    input.recipientKind === "customer" ? input.customerId ?? null : null;
  const normalizedLeadId =
    input.recipientKind === "lead" ? input.leadId ?? null : null;

  const { data: invoiceId, error } = await client.rpc("create_invoice", {
    target_tenant_id: scopedTenantId,
    target_title: input.title.trim(),
    target_status: input.status,
    target_document_kind: input.documentKind,
    target_currency_code: input.currencyCode.trim().toUpperCase(),
    target_recipient_kind: input.recipientKind,
    target_line_items: normalizeQuoteLineItems(input.lineItems),
    target_document_discount_total: input.documentDiscountTotal,
    target_source_quote_id: normalizeOptionalValue(input.sourceQuoteId),
    target_customer_id: normalizedCustomerId,
    target_lead_id: normalizedLeadId,
    target_recipient_display_name: normalizeOptionalValue(
      input.recipientDisplayName
    ),
    target_recipient_contact_name: normalizeOptionalValue(
      input.recipientContactName
    ),
    target_recipient_email: normalizeOptionalValue(input.recipientEmail),
    target_recipient_whatsapp: normalizeOptionalValue(input.recipientWhatsApp),
    target_recipient_phone: normalizeOptionalValue(input.recipientPhone),
    target_issued_on: normalizeOptionalValue(input.issuedOn),
    target_due_on: normalizeOptionalValue(input.dueOn),
    target_notes: normalizeOptionalValue(input.notes)
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("invoices")
    .select(invoiceSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", invoiceId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapInvoice(data as RawInvoiceRow);
}

export async function updateInvoice(input: UpdateInvoiceInput): Promise<InvoiceSummary> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedInvoiceId = requireRecordId(input.invoiceId, "Invoice id");

  const { error } = await client.rpc("update_invoice", {
    target_tenant_id: scopedTenantId,
    target_invoice_id: scopedInvoiceId,
    target_title: input.title,
    target_document_kind: input.documentKind,
    target_currency_code: input.currencyCode,
    target_recipient_kind: input.recipientKind,
    target_line_items: input.lineItems,
    target_document_discount_total: input.documentDiscountTotal ?? 0,
    target_customer_id: input.customerId ?? null,
    target_lead_id: input.leadId ?? null,
    target_recipient_display_name: input.recipientDisplayName ?? null,
    target_recipient_contact_name: input.recipientContactName ?? null,
    target_recipient_email: input.recipientEmail ?? null,
    target_recipient_whatsapp: input.recipientWhatsApp ?? null,
    target_recipient_phone: input.recipientPhone ?? null,
    target_issued_on: input.issuedOn ?? null,
    target_due_on: input.dueOn ?? null,
    target_notes: input.notes ?? null
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("invoices")
    .select(invoiceSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", scopedInvoiceId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapInvoice(data as RawInvoiceRow);
}

export async function moveInvoiceStatus(input: MoveInvoiceStatusInput) {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedInvoiceId = requireRecordId(input.invoiceId, "Invoice id");

  const { data: invoiceId, error } = await client.rpc("move_invoice_status", {
    target_tenant_id: scopedTenantId,
    target_invoice_id: scopedInvoiceId,
    target_status: input.status,
    p_void_reason: input.voidReason ?? null
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("invoices")
    .select(invoiceSelectFields)
    .eq("tenant_id", scopedTenantId)
    .eq("id", invoiceId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapInvoice(data as RawInvoiceRow);
}

export async function cancelInvoice(
  input: CancelInvoiceInput
): Promise<CancelInvoiceResult> {
  const client = requireSupabaseClient();
  const scopedTenantId = requireTenantScope(input.tenantId);
  const scopedInvoiceId = requireRecordId(input.invoiceId, "Invoice id");

  const { data, error } = await client.rpc("cancel_invoice", {
    target_tenant_id: scopedTenantId,
    target_invoice_id: scopedInvoiceId,
    p_cancel_reason: input.cancelReason
  });

  if (error) {
    throw new Error(error.message);
  }

  const rawResult = Array.isArray(data) ? data[0] : data;

  if (!rawResult) {
    throw new Error("Cancellation did not return reversal note details.");
  }

  const result = rawResult as {
    cancelled_invoice_id: string;
    reversal_invoice_id: string;
    reversal_invoice_number: string;
  };

  return {
    cancelledInvoiceId: result.cancelled_invoice_id,
    reversalInvoiceId: result.reversal_invoice_id,
    reversalInvoiceNumber: result.reversal_invoice_number
  };
}
