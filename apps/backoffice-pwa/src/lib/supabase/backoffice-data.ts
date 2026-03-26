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
  email: string | null;
  whatsapp: string | null;
  source: string;
  status: CustomerStatus;
  updatedAt: string;
}

export interface QuoteSummary {
  id: string;
  quoteNumber: string;
  title: string;
  customerName: string;
  currencyCode: string;
  grandTotal: number;
  status: QuoteStatus;
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
  email: string | null;
  whatsapp: string | null;
  source: string;
  status: CustomerStatus;
  updated_at: string;
}

interface RawQuoteCustomer {
  display_name?: string | null;
}

interface RawQuoteRow {
  id: string;
  quote_number: string;
  title: string;
  currency_code: string;
  grand_total: number | string;
  status: QuoteStatus;
  updated_at: string;
  customer: RawQuoteCustomer | RawQuoteCustomer[] | null;
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
    email: row.email,
    whatsapp: row.whatsapp,
    source: row.source,
    status: row.status,
    updatedAt: row.updated_at
  };
}

function mapQuote(row: RawQuoteRow): QuoteSummary {
  return {
    id: row.id,
    quoteNumber: row.quote_number,
    title: row.title,
    customerName: getCustomerName(row.customer),
    currencyCode: row.currency_code,
    grandTotal: Number(row.grand_total ?? 0),
    status: row.status,
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
      "id, customer_code, display_name, email, whatsapp, source, status, updated_at"
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
      "id, quote_number, title, currency_code, grand_total, status, updated_at, customer:customers!quotes_customer_id_fkey(display_name)"
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
