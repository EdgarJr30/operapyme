import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";

export type CustomerStatus = "active" | "inactive" | "archived";
export type QuoteStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "approved"
  | "rejected"
  | "expired";

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

export interface QuoteSummary {
  id: string;
  customerId: string;
  quoteNumber: string;
  title: string;
  customerName: string;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: QuoteStatus;
  version: number;
  validUntil: string | null;
  notes: string | null;
  updatedAt: string;
}

export interface DashboardSnapshot {
  customerCount: number;
  activeCustomerCount: number;
  quoteCount: number;
  openQuoteCount: number;
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

interface RawQuoteCustomer {
  display_name?: string | null;
}

interface RawQuoteRow {
  id: string;
  customer_id: string;
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
  notes: string | null;
  updated_at: string;
  customer: RawQuoteCustomer | RawQuoteCustomer[] | null;
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

export interface CreateQuoteInput {
  tenantId: string;
  customerId: string;
  title: string;
  status: QuoteStatus;
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  notes?: string | null;
  validUntil?: string | null;
}

export interface UpdateQuoteInput extends CreateQuoteInput {
  quoteId: string;
  version: number;
}

function requireSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error("Supabase is not configured for this environment.");
  }

  return supabase;
}

function unwrapCount(result: CountResult | null) {
  return typeof result?.count === "number" ? result.count : 0;
}

function getCustomerName(customer: RawQuoteRow["customer"]) {
  if (Array.isArray(customer)) {
    return customer[0]?.display_name ?? "";
  }

  return customer?.display_name ?? "";
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

function mapQuote(row: RawQuoteRow): QuoteSummary {
  return {
    id: row.id,
    customerId: row.customer_id,
    quoteNumber: row.quote_number,
    title: row.title,
    customerName: getCustomerName(row.customer),
    currencyCode: row.currency_code,
    subtotal: Number(row.subtotal ?? 0),
    discountTotal: Number(row.discount_total ?? 0),
    taxTotal: Number(row.tax_total ?? 0),
    grandTotal: Number(row.grand_total ?? 0),
    status: row.status,
    version: row.version,
    validUntil: row.valid_until,
    notes: row.notes,
    updatedAt: row.updated_at
  };
}

export async function listCustomersForTenant(
  tenantId: string,
  limit = 6
): Promise<CustomerSummary[]> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from("customers")
    .select(
      "id, customer_code, display_name, contact_name, legal_name, email, whatsapp, phone, document_id, notes, source, status, updated_at"
    )
    .eq("tenant_id", tenantId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawCustomerRow[]).map(mapCustomer);
}

export async function listQuotesForTenant(
  tenantId: string,
  limit = 6
): Promise<QuoteSummary[]> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from("quotes")
    .select(
      "id, customer_id, quote_number, title, currency_code, subtotal, discount_total, tax_total, grand_total, status, version, valid_until, notes, updated_at, customer:customers!quotes_customer_id_fkey(display_name)"
    )
    .eq("tenant_id", tenantId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RawQuoteRow[]).map(mapQuote);
}

export async function getDashboardSnapshot(
  tenantId: string
): Promise<DashboardSnapshot> {
  const client = requireSupabaseClient();

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
      .eq("tenant_id", tenantId),
    client
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),
    client
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    client
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .in("status", ["draft", "sent", "viewed"]),
    listCustomersForTenant(tenantId, 3),
    listQuotesForTenant(tenantId, 3)
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

  return {
    customerCount: unwrapCount(customerCountResult),
    activeCustomerCount: unwrapCount(activeCustomerCountResult),
    quoteCount: unwrapCount(quoteCountResult),
    openQuoteCount: unwrapCount(openQuoteCountResult),
    recentCustomers,
    recentQuotes
  };
}

function normalizeOptionalValue(value: string | null | undefined) {
  const nextValue = value?.trim();

  return nextValue ? nextValue : null;
}

export async function createCustomer(input: CreateCustomerInput) {
  const client = requireSupabaseClient();
  const payload = {
    tenant_id: input.tenantId,
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
    .select(
      "id, customer_code, display_name, contact_name, legal_name, email, whatsapp, phone, document_id, notes, source, status, updated_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomer(data as RawCustomerRow);
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const client = requireSupabaseClient();
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
    .eq("tenant_id", input.tenantId)
    .eq("id", input.customerId)
    .select(
      "id, customer_code, display_name, contact_name, legal_name, email, whatsapp, phone, document_id, notes, source, status, updated_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCustomer(data as RawCustomerRow);
}

export async function createQuote(input: CreateQuoteInput) {
  const client = requireSupabaseClient();
  const { data: quoteId, error } = await client.rpc("create_quote", {
    target_tenant_id: input.tenantId,
    target_customer_id: input.customerId,
    target_title: input.title.trim(),
    target_status: input.status,
    target_currency_code: input.currencyCode.trim().toUpperCase(),
    target_subtotal: input.subtotal,
    target_discount_total: input.discountTotal,
    target_tax_total: input.taxTotal,
    target_valid_until: normalizeOptionalValue(input.validUntil),
    target_notes: normalizeOptionalValue(input.notes)
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("quotes")
    .select(
      "id, customer_id, quote_number, title, currency_code, subtotal, discount_total, tax_total, grand_total, status, version, valid_until, notes, updated_at, customer:customers!quotes_customer_id_fkey(display_name)"
    )
    .eq("tenant_id", input.tenantId)
    .eq("id", quoteId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapQuote(data as RawQuoteRow);
}

export async function updateQuote(input: UpdateQuoteInput) {
  const client = requireSupabaseClient();
  const { data: quoteId, error } = await client.rpc("update_quote", {
    target_tenant_id: input.tenantId,
    target_quote_id: input.quoteId,
    expected_version: input.version,
    target_customer_id: input.customerId,
    target_title: input.title.trim(),
    target_status: input.status,
    target_currency_code: input.currencyCode.trim().toUpperCase(),
    target_subtotal: input.subtotal,
    target_discount_total: input.discountTotal,
    target_tax_total: input.taxTotal,
    target_valid_until: normalizeOptionalValue(input.validUntil),
    target_notes: normalizeOptionalValue(input.notes)
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: fetchError } = await client
    .from("quotes")
    .select(
      "id, customer_id, quote_number, title, currency_code, subtotal, discount_total, tax_total, grand_total, status, version, valid_until, notes, updated_at, customer:customers!quotes_customer_id_fkey(display_name)"
    )
    .eq("tenant_id", input.tenantId)
    .eq("id", quoteId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return mapQuote(data as RawQuoteRow);
}
