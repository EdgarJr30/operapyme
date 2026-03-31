import { expect, test, type Page } from "@playwright/test";

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
    id: "user-setup-1",
    aud: "authenticated",
    role: "authenticated",
    email: "owner@operapyme.com",
    email_confirmed_at: "2026-03-31T10:00:00.000Z",
    phone: "",
    confirmed_at: "2026-03-31T10:00:00.000Z",
    last_sign_in_at: "2026-03-31T10:00:00.000Z",
    app_metadata: {
      provider: "email",
      providers: ["email"]
    },
    user_metadata: {
      full_name: "OperaPyme Owner"
    }
  }
};

const emptyAccessContext = {
  appUserId: "app-user-setup-1",
  email: "owner@operapyme.com",
  displayName: "OperaPyme Owner",
  isGlobalAdmin: false,
  memberships: [],
  platformRoleKeys: [],
  platformPermissionKeys: [],
  tenantPermissionKeys: []
};

const bootstrappedAccessContext = {
  ...emptyAccessContext,
  memberships: [
    {
      membershipId: "membership-setup-1",
      tenantId: "tenant-setup-1",
      tenantName: "Opera Norte",
      tenantSlug: "opera-norte",
      status: "active",
      tenantRoleKeys: ["tenant_owner"]
    }
  ],
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

async function mockSetupBootstrap(page: Page) {
  let tenantCreated = false;

  await page.addInitScript(
    ({ mainStorageKey, nextSession, nextUser }) => {
      window.localStorage.setItem(mainStorageKey, JSON.stringify(nextSession));
      window.localStorage.setItem(
        `${mainStorageKey}-user`,
        JSON.stringify(nextUser)
      );
      window.localStorage.removeItem("operapyme.backoffice.tenant");
    },
    {
      mainStorageKey: storageKey,
      nextSession: session,
      nextUser: userPayload
    }
  );

  await page.route("**/rest/v1/**", async (route) => {
    const url = new URL(route.request().url());
    const pathname = url.pathname;

    if (pathname.endsWith("/rpc/get_my_access_context")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(tenantCreated ? bootstrappedAccessContext : emptyAccessContext)
      });
      return;
    }

    if (pathname.endsWith("/rpc/is_tenant_slug_available")) {
      const body = route.request().postDataJSON() as { target_slug?: string } | null;
      const targetSlug = body?.target_slug ?? "";
      const isAvailable = targetSlug !== "operapyme-demo";

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(isAvailable)
      });
      return;
    }

    if (pathname.endsWith("/rpc/create_tenant_with_owner")) {
      tenantCreated = true;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          tenantId: "tenant-setup-1",
          membershipId: "membership-setup-1",
          tenantSlug: "opera-norte"
        })
      });
      return;
    }

    await route.continue();
  });
}

test.describe("tenant bootstrap onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await mockSetupBootstrap(page);
  });

  test("guides a new account through the setup wizard and enters the app", async ({
    page
  }, testInfo) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Crea el primer espacio operativo/i
      })
    ).toBeVisible();

    await page.getByLabel(/Nombre comercial/i).fill("Opera Norte");
    await expect(page.getByLabel(/Slug del tenant/i)).toHaveValue("opera-norte");
    await expect(page.getByText(/Disponible/i)).toBeVisible();

    await page.getByRole("button", { name: /Continuar/i }).click();
    await expect(
      page.getByRole("heading", { name: /Identidad inicial/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /Continuar/i }).click();
    await expect(
      page.getByRole("heading", { name: /Revision final|Revisión final/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /Crear tenant y continuar/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { name: /Resumen operativo del negocio/i })
    ).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("setup-wizard-success.png"),
      fullPage: true
    });
  });

  test("blocks the flow when the requested tenant slug is already in use", async ({
    page
  }, testInfo) => {
    await page.goto("/");

    await page.getByLabel(/Nombre comercial/i).fill("OperaPyme Demo");
    await expect(page.getByLabel(/Slug del tenant/i)).toHaveValue("operapyme-demo");
    await expect(page.getByText(/Ya esta en uso|Ya está en uso/i)).toBeVisible();

    await page.getByRole("button", { name: /Continuar/i }).click();

    await expect(
      page.getByRole("heading", { name: /Espacio operativo/i })
    ).toBeVisible();
    await expect(page.getByText(/Ya esta en uso|Ya está en uso/i)).toBeVisible();

    await page.screenshot({
      path: testInfo.outputPath("setup-wizard-slug-taken.png"),
      fullPage: true
    });
  });
});
