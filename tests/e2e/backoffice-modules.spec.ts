import { expect, test, type Page, type Route } from "@playwright/test";

const tenantId = "tenant-1";
const storageKey = "operapyme.backoffice.auth";

const session = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  token_type: "bearer",
  expires_in: 60 * 60 * 24 * 30,
  expires_at: 4_102_444_800
};

const userPayload = {
  user: {
    id: "user-1",
    aud: "authenticated",
    role: "authenticated",
    email: "owner@operapyme.com",
    email_confirmed_at: "2026-03-27T10:00:00.000Z",
    phone: "",
    confirmed_at: "2026-03-27T10:00:00.000Z",
    last_sign_in_at: "2026-03-27T10:00:00.000Z",
    app_metadata: {
      provider: "email",
      providers: ["email"]
    },
    user_metadata: {
      full_name: "OperaPyme Owner"
    }
  }
};

const accessContext = {
  appUserId: "app-user-1",
  email: "owner@operapyme.com",
  displayName: "OperaPyme Owner",
  isGlobalAdmin: false,
  memberships: [
    {
      membershipId: "membership-1",
      tenantId,
      tenantName: "OperaPyme Demo",
      tenantSlug: "operapyme-demo",
      status: "active",
      tenantRoleKeys: ["tenant_owner"]
    }
  ],
  platformRoleKeys: [],
  platformPermissionKeys: [],
  tenantPermissionKeys: [
    "tenant.read",
    "crm.read",
    "crm.write",
    "catalog.read",
    "catalog.write",
    "quote.read",
    "quote.write",
    "invoice.read",
    "invoice.write"
  ]
};

const customers = [
  {
    id: "customer-1",
    tenant_id: tenantId,
    customer_code: "CLI-001",
    display_name: "Northline Industrial",
    contact_name: "Andrea Castillo",
    legal_name: "Northline Industrial SRL",
    email: "andrea@northline.test",
    whatsapp: "+1 809 555 0186",
    phone: "+1 809 555 0140",
    document_id: "101-5555555-1",
    notes: "Compra recurrente de equipos.",
    source: "manual",
    status: "active",
    updated_at: "2026-03-26T13:00:00.000Z"
  },
  {
    id: "customer-2",
    tenant_id: tenantId,
    customer_code: "CLI-002",
    display_name: "Servicios Delta",
    contact_name: "Luis Mejia",
    legal_name: null,
    email: "luis@delta.test",
    whatsapp: null,
    phone: null,
    document_id: null,
    notes: null,
    source: "website",
    status: "inactive",
    updated_at: "2026-03-25T16:30:00.000Z"
  },
  {
    id: "customer-3",
    tenant_id: tenantId,
    customer_code: "CLI-003",
    display_name: "Grupo Aurora",
    contact_name: "Mariela Pina",
    legal_name: null,
    email: null,
    whatsapp: "+1 829 555 0133",
    phone: null,
    document_id: null,
    notes: null,
    source: "repeat",
    status: "active",
    updated_at: "2026-03-24T11:00:00.000Z"
  }
];

const leads = [
  {
    id: "lead-1",
    tenant_id: tenantId,
    lead_code: "LEA-001",
    display_name: "Hospital Central",
    contact_name: "Raul Estevez",
    email: "raul@hospital.test",
    whatsapp: "+1 809 555 0191",
    phone: null,
    source: "whatsapp",
    status: "qualified",
    need_summary: "Renovar 12 estaciones de trabajo.",
    notes: null,
    updated_at: "2026-03-26T09:15:00.000Z"
  },
  {
    id: "lead-2",
    tenant_id: tenantId,
    lead_code: "LEA-002",
    display_name: "Centro Educativo Nova",
    contact_name: "Paula Ortiz",
    email: "paula@nova.test",
    whatsapp: null,
    phone: null,
    source: "website",
    status: "proposal",
    need_summary: "Cotizar mobiliario y tabletas.",
    notes: null,
    updated_at: "2026-03-25T10:00:00.000Z"
  }
];

const catalogItems = [
  {
    id: "item-1",
    tenant_id: tenantId,
    item_code: "CAT-001",
    name: "Kit de mantenimiento preventivo",
    description: "Visita tecnica y repuestos base.",
    category: "Servicios tecnicos",
    kind: "service",
    visibility: "public",
    pricing_mode: "fixed",
    currency_code: "USD",
    unit_price: 1890,
    status: "active",
    notes: null,
    updated_at: "2026-03-26T12:30:00.000Z"
  },
  {
    id: "item-2",
    tenant_id: tenantId,
    item_code: "CAT-002",
    name: "Paquete de tablets rugerizadas",
    description: "Equipos con accesorios y configuracion inicial.",
    category: "Equipos",
    kind: "product",
    visibility: "private",
    pricing_mode: "on_request",
    currency_code: "USD",
    unit_price: null,
    status: "active",
    notes: null,
    updated_at: "2026-03-25T08:00:00.000Z"
  }
];

const quoteRows = [
  {
    id: "quote-1",
    tenant_id: tenantId,
    customer_id: "customer-1",
    lead_id: null,
    recipient_kind: "customer",
    recipient_display_name: "Northline Industrial",
    recipient_contact_name: "Andrea Castillo",
    recipient_email: "andrea@northline.test",
    recipient_whatsapp: "+1 809 555 0186",
    recipient_phone: null,
    quote_number: "COT-2026-000210",
    title: "Propuesta Northline",
    currency_code: "USD",
    subtotal: 12000,
    discount_total: 200,
    tax_total: 1040,
    grand_total: 12840,
    status: "sent",
    version: 2,
    valid_until: "2026-04-05",
    notes: "Entrega en 48 horas.",
    created_at: "2026-03-26T12:00:00.000Z",
    updated_at: "2026-03-26T12:00:00.000Z"
  },
  {
    id: "quote-2",
    tenant_id: tenantId,
    customer_id: null,
    lead_id: "lead-1",
    recipient_kind: "lead",
    recipient_display_name: "Hospital Central",
    recipient_contact_name: "Raul Estevez",
    recipient_email: "raul@hospital.test",
    recipient_whatsapp: null,
    recipient_phone: null,
    quote_number: "COT-2026-000211",
    title: "Propuesta Hospital Central",
    currency_code: "USD",
    subtotal: 8600,
    discount_total: 0,
    tax_total: 0,
    grand_total: 8600,
    status: "draft",
    version: 1,
    valid_until: "2026-04-02",
    notes: null,
    created_at: "2026-03-25T15:00:00.000Z",
    updated_at: "2026-03-26T09:00:00.000Z"
  },
  {
    id: "quote-3",
    tenant_id: tenantId,
    customer_id: "customer-3",
    lead_id: null,
    recipient_kind: "customer",
    recipient_display_name: "Grupo Aurora",
    recipient_contact_name: "Mariela Pina",
    recipient_email: null,
    recipient_whatsapp: "+1 829 555 0133",
    recipient_phone: null,
    quote_number: "COT-2026-000212",
    title: "Renovacion Aurora",
    currency_code: "USD",
    subtotal: 5400,
    discount_total: 200,
    tax_total: 0,
    grand_total: 5200,
    status: "approved",
    version: 3,
    valid_until: "2026-03-30",
    notes: null,
    created_at: "2026-03-24T10:00:00.000Z",
    updated_at: "2026-03-26T07:30:00.000Z"
  }
];

const quoteDetail = {
  ...quoteRows[0],
  line_items: [
    {
      id: "line-1",
      catalog_item_id: "item-1",
      sort_order: 0,
      item_name: "Kit de mantenimiento preventivo",
      item_description: "Cobertura trimestral para equipos principales.",
      quantity: 4,
      unit_label: "servicio",
      unit_price: 3000,
      discount_total: 200,
      tax_total: 1040,
      line_subtotal: 12000,
      line_total: 12840
    }
  ]
};

const quoteDetailsById = {
  "quote-1": quoteDetail,
  "quote-2": {
    ...quoteRows[1],
    line_items: [
      {
        id: "line-2",
        catalog_item_id: "item-1",
        sort_order: 0,
        item_name: "Kit de mantenimiento preventivo",
        item_description: "Levantamiento inicial del caso.",
        quantity: 2,
        unit_label: "servicio",
        unit_price: 4300,
        discount_total: 0,
        tax_total: 0,
        line_subtotal: 8600,
        line_total: 8600
      }
    ]
  },
  "quote-3": {
    ...quoteRows[2],
    line_items: [
      {
        id: "line-3",
        catalog_item_id: "item-2",
        sort_order: 0,
        item_name: "Paquete de tablets rugerizadas",
        item_description: "Entrega con configuracion inicial.",
        quantity: 3,
        unit_label: "unidad",
        unit_price: 1800,
        discount_total: 200,
        tax_total: 0,
        line_subtotal: 5400,
        line_total: 5200
      }
    ]
  }
};

const invoiceRows = [
  {
    id: "invoice-1",
    tenant_id: tenantId,
    source_quote_id: "quote-1",
    customer_id: "customer-1",
    lead_id: null,
    recipient_kind: "customer",
    recipient_display_name: "Northline Industrial",
    recipient_contact_name: "Andrea Castillo",
    recipient_email: "andrea@northline.test",
    recipient_whatsapp: "+1 809 555 0186",
    recipient_phone: null,
    invoice_number: "FAC-2026-000041",
    title: "Factura Northline marzo",
    document_kind: "services",
    currency_code: "USD",
    subtotal: 12000,
    discount_total: 200,
    tax_total: 1040,
    grand_total: 12840,
    status: "issued",
    issued_on: "2026-03-27",
    due_on: "2026-04-03",
    notes: "Factura documental interna.",
    created_at: "2026-03-27T12:00:00.000Z",
    updated_at: "2026-03-27T12:00:00.000Z"
  }
];

const invoiceDetailsById = {
  "invoice-1": {
    ...invoiceRows[0],
    line_items: quoteDetail.line_items
  }
};

async function mockBackoffice(page: Page) {
  const mutableQuotes = structuredClone(quoteRows);
  const mutableQuoteDetails = structuredClone(quoteDetailsById);
  const mutableInvoices = structuredClone(invoiceRows);
  const mutableInvoiceDetails = structuredClone(invoiceDetailsById);

  await page.addInitScript(
    ({ mainStorageKey, nextSession, nextUser, nextTenantId }) => {
      window.localStorage.setItem(mainStorageKey, JSON.stringify(nextSession));
      window.localStorage.setItem(
        `${mainStorageKey}-user`,
        JSON.stringify(nextUser)
      );
      window.localStorage.setItem("operapyme.backoffice.tenant", nextTenantId);
    },
    {
      mainStorageKey: storageKey,
      nextSession: session,
      nextUser: userPayload,
      nextTenantId: tenantId
    }
  );

  await page.route("**/rest/v1/**", async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;

    if (pathname.endsWith("/rpc/get_my_access_context")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(accessContext)
      });
      return;
    }

    if (pathname.endsWith("/rpc/move_quote_status")) {
      const payload = JSON.parse(route.request().postData() ?? "{}");
      const quote = mutableQuotes.find((entry) => entry.id === payload.target_quote_id);

      if (quote) {
        quote.status = payload.target_status;
        quote.version += 1;
        quote.updated_at = "2026-03-31T12:00:00.000Z";
        mutableQuoteDetails[quote.id as keyof typeof mutableQuoteDetails].status =
          payload.target_status;
        mutableQuoteDetails[quote.id as keyof typeof mutableQuoteDetails].version =
          quote.version;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(quote?.id ?? null)
      });
      return;
    }

    if (pathname.endsWith("/rpc/move_invoice_status")) {
      const payload = JSON.parse(route.request().postData() ?? "{}");
      const invoice = mutableInvoices.find(
        (entry) => entry.id === payload.target_invoice_id
      );

      if (invoice) {
        invoice.status = payload.target_status;
        invoice.updated_at = "2026-03-31T12:00:00.000Z";
        if (payload.target_status === "issued" && !invoice.issued_on) {
          invoice.issued_on = "2026-03-31";
        }
        mutableInvoiceDetails[invoice.id as keyof typeof mutableInvoiceDetails].status =
          payload.target_status;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(invoice?.id ?? null)
      });
      return;
    }

    if (pathname.endsWith("/customers")) {
      await fulfillTableRoute(route, customers);
      return;
    }

    if (pathname.endsWith("/leads")) {
      await fulfillTableRoute(route, leads);
      return;
    }

    if (pathname.endsWith("/catalog_items")) {
      await fulfillTableRoute(route, catalogItems);
      return;
    }

    if (pathname.endsWith("/quotes")) {
      await fulfillTableRoute(route, mutableQuotes, (filteredRows) => {
        const row = filteredRows[0];

        return row
          ? mutableQuoteDetails[
              row.id as keyof typeof mutableQuoteDetails
            ] ?? row
          : null;
      });
      return;
    }

    if (pathname.endsWith("/invoices")) {
      await fulfillTableRoute(route, mutableInvoices, (filteredRows) => {
        const row = filteredRows[0];

        return row
          ? mutableInvoiceDetails[
              row.id as keyof typeof mutableInvoiceDetails
            ] ?? row
          : null;
      });
      return;
    }

    await route.continue();
  });
}

async function fulfillTableRoute(
  route: Route,
  rows: Record<string, unknown>[],
  singleRow?:
    | Record<string, unknown>
    | ((filteredRows: Record<string, unknown>[]) => Record<string, unknown> | null)
) {
  const request = route.request();
  const url = new URL(request.url());
  const filteredRows = applyQueryFilters(rows, url);
  const limitedRows = applyLimit(filteredRows, url);
  const isSingleObjectRequest =
    request.headers().accept?.includes("application/vnd.pgrst.object+json") ?? false;

  if (request.method() === "HEAD") {
    await route.fulfill({
      status: 200,
      headers: {
        "content-range": buildContentRange(filteredRows.length),
        "content-type": "application/json"
      }
    });
    return;
  }

  await route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: {
      "content-range": buildContentRange(filteredRows.length)
    },
    body: JSON.stringify(
      isSingleObjectRequest
        ? typeof singleRow === "function"
          ? singleRow(filteredRows)
          : singleRow ?? limitedRows[0] ?? null
        : limitedRows
    )
  });
}

function applyLimit(
  rows: Record<string, unknown>[],
  url: URL
): Record<string, unknown>[] {
  const limit = Number(url.searchParams.get("limit"));

  if (Number.isNaN(limit) || limit <= 0) {
    return rows;
  }

  return rows.slice(0, limit);
}

function applyQueryFilters(
  rows: Record<string, unknown>[],
  url: URL
): Record<string, unknown>[] {
  let filteredRows = [...rows];

  for (const [key, value] of url.searchParams.entries()) {
    if (key === "select" || key === "order" || key === "limit") {
      continue;
    }

    if (value.startsWith("eq.")) {
      const expectedValue = value.slice(3);
      filteredRows = filteredRows.filter(
        (row) => String(row[key] ?? "") === expectedValue
      );
      continue;
    }

    if (value.startsWith("in.(") && value.endsWith(")")) {
      const allowedValues = value
        .slice(4, -1)
        .split(",")
        .map((entry) => entry.trim());
      filteredRows = filteredRows.filter((row) =>
        allowedValues.includes(String(row[key] ?? ""))
      );
    }
  }

  return filteredRows;
}

function buildContentRange(total: number) {
  if (total === 0) {
    return "0-0/0";
  }

  return `0-${Math.max(total - 1, 0)}/${total}`;
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(async () => {
      return page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - window.innerWidth;
      });
    })
    .toBeLessThanOrEqual(1);
}

test.describe("backoffice modules", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackoffice(page);
  });

  test("renders the main desktop routes with mock tenant data", async ({
    page
  }, testInfo) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Resumen operativo del negocio/i })
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("dashboard-desktop.png"),
      fullPage: true
    });

    await page.goto("/commercial");
    await expect(
      page.getByRole("heading", { name: /Gestion Comercial/i })
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("commercial-desktop.png"),
      fullPage: true
    });

    await page.goto("/commercial/quotes?tab=create");
    await expect(
      page.getByRole("heading", { name: /Crear cotizacion/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Activar tema oscuro/i })
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("quotes-create-desktop.png"),
      fullPage: true
    });

    await page.goto("/commercial/quotes?tab=manage");
    await expect(
      page.getByRole("heading", { name: /Gestionar cotizaciones/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Pipeline de cotizaciones/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Descargar PDF/i }).first()
    ).toBeVisible();
    await page
      .getByRole("button", { name: /Mover a Vista/i })
      .first()
      .click();
    await expect(
      page.getByText(/COT-2026-000210 ahora esta en Vista\./i)
    ).toBeVisible();
    await page.getByRole("button", { name: /Pasar a factura/i }).click();
    await expect(page).toHaveURL(/\/commercial\/invoices\?sourceQuoteId=quote-3/);
    await expect(page.locator("#invoice-source-quote")).toHaveValue("quote-3");
    await page.screenshot({
      path: testInfo.outputPath("quotes-manage-desktop.png"),
      fullPage: true
    });

    await page.goto("/commercial/invoices");
    await expect(
      page.getByRole("heading", { name: /^Facturas$/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Descargar PDF/i }).first()
    ).toBeVisible();
    await page.getByRole("button", { name: /Mover a Pagada/i }).click();
    await expect(
      page.getByText(/FAC-2026-000041 ahora esta en Pagada\./i)
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("invoices-desktop.png"),
      fullPage: true
    });

    await page.goto("/settings");
    await expect(
      page.getByText(/Paleta propia/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Paleta activa/i).first()
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("settings-desktop.png"),
      fullPage: true
    });
  });

  test("keeps the quotes module usable on mobile", async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }
    });
    const page = await context.newPage();

    await mockBackoffice(page);
    await page.goto("/commercial/quotes");

    await expect(
      page.getByRole("heading", { name: /Cotizaciones/i }).last()
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: /Navegacion movil/i })
    ).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("quotes-mobile.png"),
      fullPage: true
    });

    await page.getByRole("tab", { name: /Nueva/i }).click();
    await expect(
      page.getByRole("heading", { name: /Crear cotizacion/i })
    ).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("quotes-create-mobile.png"),
      fullPage: true
    });

    await context.close();
  });

  test("keeps the mobile more menu accessible and stable when opening commercial navigation", async ({
    browser
  }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }
    });
    const page = await context.newPage();
    const dialogTitleErrors: string[] = [];

    page.on("console", (message) => {
      const text = message.text();

      if (text.includes("requires a `DialogTitle`")) {
        dialogTitleErrors.push(text);
      }
    });

    await mockBackoffice(page);
    await page.goto("/catalog");

    await expect(
      page.getByRole("heading", { name: /Catalogo/i }).last()
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const mobileNavigation = page.getByRole("navigation", {
      name: /Navegacion movil/i
    });

    await mobileNavigation.getByRole("button", {
      name: /Abrir menu principal/i
    }).click();
    const moreDialog = page.getByRole("dialog", { name: /Menu principal/i });
    await expect(moreDialog).toBeVisible();
    await expect(moreDialog.getByRole("button", { name: /Gestion Comercial/i })).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("mobile-more-menu.png"),
      fullPage: true
    });

    await moreDialog.getByRole("button", { name: /Gestion Comercial/i }).click();
    await expect(page).toHaveURL(/\/commercial$/);
    await expect(
      page.getByRole("heading", { name: /Pipeline activo/i })
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await mobileNavigation.getByRole("button", {
      name: /Abrir menu principal/i
    }).click();
    const commercialDialog = page.getByRole("dialog", { name: /Menu principal/i });
    await expect(commercialDialog).toBeVisible();
    await commercialDialog.getByRole("button", { name: /Gestion Comercial/i }).click();
    await expect(commercialDialog.getByRole("link", { name: /Leads/i })).toBeVisible();
    await expect(commercialDialog.getByRole("link", { name: /Clientes/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    expect(dialogTitleErrors).toEqual([]);

    await page.screenshot({
      path: testInfo.outputPath("commercial-mobile-drawer-expanded.png"),
      fullPage: true
    });

    await context.close();
  });
});
