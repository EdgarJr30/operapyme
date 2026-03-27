import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn()
}));

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: supabaseMocks.from,
    rpc: supabaseMocks.rpc
  }
}));

import {
  createCatalogItem,
  createCustomer,
  createQuote,
  getDashboardSnapshot,
  listCatalogItemsForTenant,
  listCustomersForTenant,
  updateCatalogItem,
  updateQuote
} from "@/lib/supabase/backoffice-data";

function createThenableBuilder<TResult>(result: TResult) {
  const builder = {
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    in: vi.fn(() => builder),
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    single: vi.fn(() => builder),
    then: (onFulfilled?: (value: TResult) => unknown, onRejected?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(onFulfilled, onRejected)
  };

  return builder;
}

describe("backoffice data access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps live customers for the active tenant", async () => {
    const customerQuery = createThenableBuilder({
      data: [
        {
          id: "customer-1",
          customer_code: "CLI-001",
          display_name: "Northline Industrial",
          contact_name: "Andrea Castillo",
          legal_name: "Northline Industrial SRL",
          email: "sales@northline.test",
          whatsapp: "+1 809 555 0186",
          phone: "+1 809 555 0140",
          document_id: "101-5555555-1",
          notes: "Cliente clave",
          source: "manual",
          status: "active",
          updated_at: "2026-03-26T00:00:00.000Z"
        }
      ],
      error: null
    });

    supabaseMocks.from.mockReturnValueOnce(customerQuery);

    const customers = await listCustomersForTenant("tenant-1", 10);

    expect(supabaseMocks.from).toHaveBeenCalledWith("customers");
    expect(customerQuery.select).toHaveBeenCalled();
    expect(customerQuery.eq).toHaveBeenCalledWith("tenant_id", "tenant-1");
    expect(customerQuery.order).toHaveBeenCalledWith("updated_at", {
      ascending: false
    });
    expect(customerQuery.limit).toHaveBeenCalledWith(10);
    expect(customers).toEqual([
      {
        id: "customer-1",
        customerCode: "CLI-001",
        displayName: "Northline Industrial",
        contactName: "Andrea Castillo",
        legalName: "Northline Industrial SRL",
        email: "sales@northline.test",
        whatsapp: "+1 809 555 0186",
        phone: "+1 809 555 0140",
        documentId: "101-5555555-1",
        notes: "Cliente clave",
        source: "manual",
        status: "active",
        updatedAt: "2026-03-26T00:00:00.000Z"
      }
    ]);
  });

  it("maps live catalog items for the active tenant", async () => {
    const catalogQuery = createThenableBuilder({
      data: [
        {
          id: "item-1",
          item_code: "CAT-001",
          name: "Kit de mantenimiento preventivo",
          description: "Visita y repuestos base",
          category: "Servicios tecnicos",
          kind: "service",
          visibility: "private",
          pricing_mode: "on_request",
          currency_code: "USD",
          unit_price: null,
          status: "active",
          notes: "Incluye visita inicial",
          updated_at: "2026-03-26T00:00:00.000Z"
        }
      ],
      error: null
    });

    supabaseMocks.from.mockReturnValueOnce(catalogQuery);

    const items = await listCatalogItemsForTenant("tenant-1", 10);

    expect(supabaseMocks.from).toHaveBeenCalledWith("catalog_items");
    expect(catalogQuery.eq).toHaveBeenCalledWith("tenant_id", "tenant-1");
    expect(catalogQuery.limit).toHaveBeenCalledWith(10);
    expect(items).toEqual([
      {
        id: "item-1",
        itemCode: "CAT-001",
        name: "Kit de mantenimiento preventivo",
        description: "Visita y repuestos base",
        category: "Servicios tecnicos",
        kind: "service",
        visibility: "private",
        pricingMode: "on_request",
        currencyCode: "USD",
        unitPrice: null,
        status: "active",
        notes: "Incluye visita inicial",
        updatedAt: "2026-03-26T00:00:00.000Z"
      }
    ]);
  });

  it("aggregates dashboard counts with recent customers and quotes", async () => {
    const customerCountQuery = createThenableBuilder({
      count: 5,
      data: null,
      error: null
    });
    const activeCustomerCountQuery = createThenableBuilder({
      count: 4,
      data: null,
      error: null
    });
    const quoteCountQuery = createThenableBuilder({
      count: 3,
      data: null,
      error: null
    });
    const openQuoteCountQuery = createThenableBuilder({
      count: 2,
      data: null,
      error: null
    });
    const recentCustomersQuery = createThenableBuilder({
      data: [
        {
          id: "customer-1",
          customer_code: "CLI-001",
          display_name: "Northline Industrial",
          contact_name: "Andrea Castillo",
          legal_name: null,
          email: "sales@northline.test",
          whatsapp: null,
          phone: null,
          document_id: null,
          notes: null,
          source: "manual",
          status: "active",
          updated_at: "2026-03-26T00:00:00.000Z"
        }
      ],
      error: null
    });
    const recentQuotesQuery = createThenableBuilder({
      data: [
        {
          id: "quote-1",
          customer_id: "customer-1",
          lead_id: null,
          recipient_kind: "customer",
          recipient_display_name: "Northline Industrial",
          recipient_contact_name: "Andrea Castillo",
          recipient_email: "sales@northline.test",
          recipient_whatsapp: null,
          recipient_phone: null,
          quote_number: "COT-2026-000210",
          title: "Propuesta Northline",
          currency_code: "USD",
          subtotal: "12000.00",
          discount_total: "200.00",
          tax_total: "1040.00",
          grand_total: "12840.00",
          status: "sent",
          version: 2,
          valid_until: null,
          notes: null,
          created_at: "2026-03-25T00:00:00.000Z",
          updated_at: "2026-03-26T00:00:00.000Z",
          line_items: []
        }
      ],
      error: null
    });

    supabaseMocks.from
      .mockReturnValueOnce(customerCountQuery)
      .mockReturnValueOnce(activeCustomerCountQuery)
      .mockReturnValueOnce(quoteCountQuery)
      .mockReturnValueOnce(openQuoteCountQuery)
      .mockReturnValueOnce(recentCustomersQuery)
      .mockReturnValueOnce(recentQuotesQuery);

    const snapshot = await getDashboardSnapshot("tenant-1");

    expect(snapshot).toEqual({
      customerCount: 5,
      activeCustomerCount: 4,
      quoteCount: 3,
      openQuoteCount: 2,
      recentCustomers: [
        expect.objectContaining({
          id: "customer-1",
          displayName: "Northline Industrial"
        })
      ],
      recentQuotes: [
        expect.objectContaining({
          id: "quote-1",
          quoteNumber: "COT-2026-000210",
          version: 2,
          grandTotal: 12840
        })
      ]
    });
    expect(openQuoteCountQuery.in).toHaveBeenCalledWith("status", [
      "draft",
      "sent",
      "viewed"
    ]);
  });

  it("normalizes optional customer fields before inserting them", async () => {
    const customerInsertQuery = createThenableBuilder({
      data: {
        id: "customer-1",
        customer_code: null,
        display_name: "Northline Industrial",
        contact_name: "Andrea Castillo",
        legal_name: null,
        email: null,
        whatsapp: null,
        phone: null,
        document_id: null,
        notes: null,
        source: "manual",
        status: "active",
        updated_at: "2026-03-26T00:00:00.000Z"
      },
      error: null
    });

    supabaseMocks.from.mockReturnValueOnce(customerInsertQuery);

    await createCustomer({
      tenantId: "tenant-1",
      customerCode: "   ",
      displayName: "  Northline Industrial  ",
      contactName: "  Andrea Castillo  ",
      legalName: " ",
      email: " ",
      whatsapp: undefined,
      phone: "",
      documentId: " ",
      source: "manual",
      status: "active",
      notes: ""
    });

    expect(customerInsertQuery.insert).toHaveBeenCalledWith({
      tenant_id: "tenant-1",
      customer_code: null,
      display_name: "Northline Industrial",
      contact_name: "Andrea Castillo",
      legal_name: null,
      email: null,
      whatsapp: null,
      phone: null,
      document_id: null,
      source: "manual",
      status: "active",
      notes: null
    });
  });

  it("normalizes catalog optional fields before inserting them", async () => {
    const catalogInsertQuery = createThenableBuilder({
      data: {
        id: "item-1",
        item_code: null,
        name: "Kit de mantenimiento preventivo",
        description: null,
        category: null,
        kind: "service",
        visibility: "private",
        pricing_mode: "on_request",
        currency_code: "USD",
        unit_price: null,
        status: "active",
        notes: null,
        updated_at: "2026-03-26T00:00:00.000Z"
      },
      error: null
    });

    supabaseMocks.from.mockReturnValueOnce(catalogInsertQuery);

    await createCatalogItem({
      tenantId: "tenant-1",
      itemCode: "   ",
      name: "  Kit de mantenimiento preventivo  ",
      description: " ",
      category: "",
      kind: "service",
      visibility: "private",
      pricingMode: "on_request",
      currencyCode: " usd ",
      unitPrice: 1890,
      status: "active",
      notes: ""
    });

    expect(catalogInsertQuery.insert).toHaveBeenCalledWith({
      tenant_id: "tenant-1",
      item_code: null,
      name: "Kit de mantenimiento preventivo",
      description: null,
      category: null,
      kind: "service",
      visibility: "private",
      pricing_mode: "on_request",
      currency_code: "USD",
      unit_price: null,
      status: "active",
      notes: null
    });
  });

  it("updates catalog items with normalized payloads", async () => {
    const catalogUpdateQuery = createThenableBuilder({
      data: {
        id: "item-1",
        item_code: "CAT-001",
        name: "Kit enterprise",
        description: "Cobertura extendida",
        category: "Servicios tecnicos",
        kind: "service",
        visibility: "public",
        pricing_mode: "fixed",
        currency_code: "USD",
        unit_price: "2490.00",
        status: "draft",
        notes: null,
        updated_at: "2026-03-26T00:00:00.000Z"
      },
      error: null
    });

    supabaseMocks.from.mockReturnValueOnce(catalogUpdateQuery);

    await updateCatalogItem({
      tenantId: "tenant-1",
      itemId: "item-1",
      itemCode: " CAT-001 ",
      name: "  Kit enterprise  ",
      description: "  Cobertura extendida ",
      category: " Servicios tecnicos ",
      kind: "service",
      visibility: "public",
      pricingMode: "fixed",
      currencyCode: " usd ",
      unitPrice: 2490,
      status: "draft",
      notes: " "
    });

    expect(catalogUpdateQuery.update).toHaveBeenCalledWith({
      item_code: "CAT-001",
      name: "Kit enterprise",
      description: "Cobertura extendida",
      category: "Servicios tecnicos",
      kind: "service",
      visibility: "public",
      pricing_mode: "fixed",
      currency_code: "USD",
      unit_price: 2490,
      status: "draft",
      notes: null
    });
    expect(catalogUpdateQuery.eq).toHaveBeenNthCalledWith(1, "tenant_id", "tenant-1");
    expect(catalogUpdateQuery.eq).toHaveBeenNthCalledWith(2, "id", "item-1");
  });

  it("creates quotes through the database RPC and fetches the persisted record", async () => {
    const quoteFetchQuery = createThenableBuilder({
      data: {
        id: "quote-1",
        customer_id: "customer-1",
        lead_id: null,
        recipient_kind: "customer",
        recipient_display_name: "Northline Industrial",
        recipient_contact_name: "Andrea Castillo",
        recipient_email: "sales@northline.test",
        recipient_whatsapp: null,
        recipient_phone: null,
        quote_number: "COT-2026-000001",
        title: "Propuesta Northline",
        currency_code: "USD",
        subtotal: "150.00",
        discount_total: "10.00",
        tax_total: "25.20",
        grand_total: "165.20",
        status: "draft",
        version: 1,
        valid_until: "2026-04-30",
        notes: "temporary qa check",
        created_at: "2026-03-25T00:00:00.000Z",
        updated_at: "2026-03-26T00:00:00.000Z",
        line_items: []
      },
      error: null
    });

    supabaseMocks.rpc.mockResolvedValueOnce({
      data: "quote-1",
      error: null
    });
    supabaseMocks.from.mockReturnValueOnce(quoteFetchQuery);

    const quote = await createQuote({
      tenantId: "tenant-1",
      recipientKind: "customer",
      customerId: "customer-1",
      leadId: null,
      recipientDisplayName: "Northline Industrial",
      recipientContactName: "Andrea Castillo",
      recipientEmail: "sales@northline.test",
      recipientWhatsApp: "",
      recipientPhone: "",
      title: "  Propuesta Northline  ",
      status: "draft",
      currencyCode: "usd",
      validUntil: "2026-04-30",
      notes: " temporary qa check ",
      lineItems: [
        {
          catalogItemId: "item-1",
          itemName: "Mantenimiento preventivo",
          itemDescription: "Visita tecnica trimestral",
          quantity: 1,
          unitLabel: "servicio",
          unitPrice: 150,
          discountTotal: 10,
          taxTotal: 25.2
        }
      ]
    });

    expect(supabaseMocks.rpc).toHaveBeenCalledWith("create_quote", {
      target_tenant_id: "tenant-1",
      target_title: "Propuesta Northline",
      target_status: "draft",
      target_currency_code: "USD",
      target_recipient_kind: "customer",
      target_line_items: [
        {
          catalogItemId: "item-1",
          itemName: "Mantenimiento preventivo",
          itemDescription: "Visita tecnica trimestral",
          quantity: 1,
          unitLabel: "servicio",
          unitPrice: 150,
          discountTotal: 10,
          taxTotal: 25.2
        }
      ],
      target_customer_id: "customer-1",
      target_lead_id: null,
      target_recipient_display_name: "Northline Industrial",
      target_recipient_contact_name: "Andrea Castillo",
      target_recipient_email: "sales@northline.test",
      target_recipient_whatsapp: null,
      target_recipient_phone: null,
      target_valid_until: "2026-04-30",
      target_notes: "temporary qa check"
    });
    expect(quote).toEqual(
      expect.objectContaining({
        quoteNumber: "COT-2026-000001",
        currencyCode: "USD",
        grandTotal: 165.2,
        version: 1
      })
    );
  });

  it("sends fast lead quotes without linked customer or lead ids", async () => {
    const quoteFetchQuery = createThenableBuilder({
      data: {
        id: "quote-2",
        customer_id: null,
        lead_id: null,
        recipient_kind: "ad_hoc",
        recipient_display_name: "Urgent Prospect",
        recipient_contact_name: "Ana Perez",
        recipient_email: "ana@test.dev",
        recipient_whatsapp: null,
        recipient_phone: null,
        quote_number: "COT-2026-000002",
        title: "Cotizacion express",
        currency_code: "USD",
        subtotal: "950.00",
        discount_total: "0.00",
        tax_total: "0.00",
        grand_total: "950.00",
        status: "draft",
        version: 1,
        valid_until: null,
        notes: null,
        created_at: "2026-03-25T00:00:00.000Z",
        updated_at: "2026-03-26T00:00:00.000Z",
        line_items: []
      },
      error: null
    });

    supabaseMocks.rpc.mockResolvedValueOnce({
      data: "quote-2",
      error: null
    });
    supabaseMocks.from.mockReturnValueOnce(quoteFetchQuery);

    await createQuote({
      tenantId: "tenant-1",
      recipientKind: "ad_hoc",
      customerId: "customer-1",
      leadId: "lead-1",
      recipientDisplayName: "Urgent Prospect",
      recipientContactName: "Ana Perez",
      recipientEmail: "ana@test.dev",
      recipientWhatsApp: "",
      recipientPhone: "",
      title: " Cotizacion express ",
      status: "draft",
      currencyCode: "usd",
      validUntil: "",
      notes: "",
      lineItems: [
        {
          catalogItemId: null,
          itemName: "Paquete express",
          itemDescription: "",
          quantity: 1,
          unitLabel: "servicio",
          unitPrice: 950,
          discountTotal: 0,
          taxTotal: 0
        }
      ]
    });

    expect(supabaseMocks.rpc).toHaveBeenCalledWith("create_quote", {
      target_tenant_id: "tenant-1",
      target_title: "Cotizacion express",
      target_status: "draft",
      target_currency_code: "USD",
      target_recipient_kind: "ad_hoc",
      target_line_items: [
        {
          catalogItemId: null,
          itemName: "Paquete express",
          itemDescription: null,
          quantity: 1,
          unitLabel: "servicio",
          unitPrice: 950,
          discountTotal: 0,
          taxTotal: 0
        }
      ],
      target_customer_id: null,
      target_lead_id: null,
      target_recipient_display_name: "Urgent Prospect",
      target_recipient_contact_name: "Ana Perez",
      target_recipient_email: "ana@test.dev",
      target_recipient_whatsapp: null,
      target_recipient_phone: null,
      target_valid_until: null,
      target_notes: null
    });
  });

  it("forwards expected_version to update_quote and returns the incremented version", async () => {
    const quoteFetchQuery = createThenableBuilder({
      data: {
        id: "quote-1",
        customer_id: "customer-1",
        lead_id: null,
        recipient_kind: "customer",
        recipient_display_name: "Northline Industrial",
        recipient_contact_name: "Andrea Castillo",
        recipient_email: "sales@northline.test",
        recipient_whatsapp: null,
        recipient_phone: null,
        quote_number: "COT-2026-000001",
        title: "Propuesta Northline actualizada",
        currency_code: "DOP",
        subtotal: "210.00",
        discount_total: "20.00",
        tax_total: "34.20",
        grand_total: "224.20",
        status: "sent",
        version: 2,
        valid_until: "2026-05-15",
        notes: "temporary qa update",
        created_at: "2026-03-25T00:00:00.000Z",
        updated_at: "2026-03-26T00:00:00.000Z",
        line_items: []
      },
      error: null
    });

    supabaseMocks.rpc.mockResolvedValueOnce({
      data: "quote-1",
      error: null
    });
    supabaseMocks.from.mockReturnValueOnce(quoteFetchQuery);

    const quote = await updateQuote({
      tenantId: "tenant-1",
      quoteId: "quote-1",
      version: 1,
      recipientKind: "customer",
      customerId: "customer-1",
      leadId: null,
      recipientDisplayName: "Northline Industrial",
      recipientContactName: "Andrea Castillo",
      recipientEmail: "sales@northline.test",
      recipientWhatsApp: "",
      recipientPhone: "",
      title: "  Propuesta Northline actualizada  ",
      status: "sent",
      currencyCode: "dop",
      validUntil: "2026-05-15",
      notes: " temporary qa update ",
      lineItems: [
        {
          catalogItemId: "item-1",
          itemName: "Mantenimiento preventivo",
          itemDescription: "Visita tecnica trimestral",
          quantity: 1,
          unitLabel: "servicio",
          unitPrice: 210,
          discountTotal: 20,
          taxTotal: 34.2
        }
      ]
    });

    expect(supabaseMocks.rpc).toHaveBeenCalledWith("update_quote", {
      target_tenant_id: "tenant-1",
      target_quote_id: "quote-1",
      expected_version: 1,
      target_title: "Propuesta Northline actualizada",
      target_status: "sent",
      target_currency_code: "DOP",
      target_recipient_kind: "customer",
      target_line_items: [
        {
          catalogItemId: "item-1",
          itemName: "Mantenimiento preventivo",
          itemDescription: "Visita tecnica trimestral",
          quantity: 1,
          unitLabel: "servicio",
          unitPrice: 210,
          discountTotal: 20,
          taxTotal: 34.2
        }
      ],
      target_customer_id: "customer-1",
      target_lead_id: null,
      target_recipient_display_name: "Northline Industrial",
      target_recipient_contact_name: "Andrea Castillo",
      target_recipient_email: "sales@northline.test",
      target_recipient_whatsapp: null,
      target_recipient_phone: null,
      target_valid_until: "2026-05-15",
      target_notes: "temporary qa update"
    });
    expect(quote).toEqual(
      expect.objectContaining({
        quoteNumber: "COT-2026-000001",
        currencyCode: "DOP",
        grandTotal: 224.2,
        version: 2
      })
    );
  });
});
