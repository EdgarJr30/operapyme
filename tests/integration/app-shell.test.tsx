import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";
import { vi } from "vitest";

import { setupBackofficeI18n } from "@/app/i18n";
import { AppProviders } from "@/app/providers";
import { AppShell } from "@/components/layout/app-shell";
import { AdminAuditPage } from "@/modules/admin/admin-audit-page";
import { AdminErrorsPage } from "@/modules/admin/admin-errors-page";

const authMocks = vi.hoisted(() => ({
  useBackofficeAuth: vi.fn()
}));

vi.mock("@/app/auth-provider", async () => {
  const actual = await vi.importActual<typeof import("@/app/auth-provider")>(
    "@/app/auth-provider"
  );

  return {
    ...actual,
    useBackofficeAuth: authMocks.useBackofficeAuth
  };
});

function renderRoute(route: string) {
  const i18n = setupBackofficeI18n();

  return render(
    <AppProviders i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<div>Dashboard stub</div>} />
            <Route path="commercial" element={<div>Commercial summary stub</div>} />
            <Route path="commercial/leads" element={<div>Commercial leads stub</div>} />
            <Route path="commercial/customers" element={<div>Commercial customers stub</div>} />
            <Route path="commercial/quotes" element={<div>Commercial quotes stub</div>} />
            <Route path="commercial/invoices" element={<div>Commercial invoices stub</div>} />
            <Route path="learning" element={<div>Learning stub</div>} />
            <Route path="quotes" element={<div>Quotes overview stub</div>} />
            <Route path="quotes/new" element={<div>Quotes new stub</div>} />
            <Route path="quotes/manage" element={<div>Quotes manage stub</div>} />
            <Route path="admin" element={<AdminAuditPage />} />
            <Route path="admin/errors" element={<AdminErrorsPage />} />
            <Route path="profile" element={<div>Profile stub</div>} />
            <Route path="settings" element={<div>Settings stub</div>} />
            <Route path="settings/general" element={<div>Settings general stub</div>} />
            <Route path="settings/tenant" element={<div>Settings tenant stub</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AppProviders>
  );
}

describe("backoffice shell", () => {
  beforeEach(() => {
    window.localStorage.clear();

    authMocks.useBackofficeAuth.mockReturnValue({
      accessContext: {
        appUserId: "user-1",
        email: "owner@operapyme.com",
        displayName: "Owner",
        isGlobalAdmin: true,
        memberships: [
          {
            membershipId: "membership-1",
            tenantId: "tenant-1",
            tenantName: "OperaPyme Demo",
            tenantSlug: "operapyme-demo",
            status: "active",
            tenantRoleKeys: ["tenant_owner"]
          }
        ],
        platformRoleKeys: ["global_admin"],
        platformPermissionKeys: ["audit.read.global", "error.read.global"],
        tenantPermissionKeys: ["tenant.read"]
      },
      activeTenantId: "tenant-1",
      signOut: vi.fn(),
      user: {
        email: "owner@operapyme.com"
      }
    });
  });

  it("renders the new admin route and its reserved content", async () => {
    renderRoute("/admin");

    expect(
      await screen.findByRole("heading", {
        name: /Centro de auditoria y trazabilidad/i
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/global_admin/i).length).toBeGreaterThan(0);
  });

  it("keeps the admin entry visible in the primary navigation", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("link", { name: /^Admin$/i })
    ).toBeInTheDocument();
  });

  it("shows the learning module in the extended navigation", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("link", { name: /^Aprendizaje$/i })
    ).toBeInTheDocument();
  });

  it("shows quote subroutes when the quotes module is active", async () => {
    renderRoute("/commercial/quotes");

    expect(
      await screen.findByRole("link", { name: /^Resumen$/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /^Cotizaciones$/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /^Facturas$/i })
    ).toBeInTheDocument();
  });

  it("hides the admin entry while keeping catalog and settings for tenant users", async () => {
    authMocks.useBackofficeAuth.mockReturnValue({
      accessContext: {
        appUserId: "user-2",
        email: "seller@operapyme.com",
        displayName: "Seller",
        isGlobalAdmin: false,
        memberships: [
          {
            membershipId: "membership-2",
            tenantId: "tenant-1",
            tenantName: "OperaPyme Demo",
            tenantSlug: "operapyme-demo",
            status: "active",
            tenantRoleKeys: ["sales_rep"]
          }
        ],
        platformRoleKeys: [],
        platformPermissionKeys: [],
        tenantPermissionKeys: ["tenant.read", "crm.read", "quote.read"]
      },
      activeTenantId: "tenant-1",
      signOut: vi.fn(),
      user: {
        email: "seller@operapyme.com"
      }
    });

    renderRoute("/settings/general");

    expect(screen.queryByRole("link", { name: /^Admin$/i })).not.toBeInTheDocument();
    expect((await screen.findAllByRole("link", { name: /^Catalogo$/i })).length).toBeGreaterThan(0);
    expect(await screen.findByText("Settings general stub")).toBeInTheDocument();
    expect(
      (
        await screen.findAllByRole("button", {
          name: /Abrir menu principal|Open main menu/i
        })
      ).length
    ).toBeGreaterThan(0);
  });

  it("switches the shell copy and navigation labels between spanish and english", async () => {
    const user = userEvent.setup();

    renderRoute("/");

    await user.click(
      await screen.findByRole("button", {
        name: /Abrir menu del usuario|Open user menu/i
      })
    );

    const languageSelect = await screen.findByLabelText(/^Idioma$/i);

    expect(
      await screen.findByRole("navigation", { name: /^Navegacion movil$/i })
    ).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("es");

    await user.selectOptions(languageSelect, "en");

    expect(await screen.findByLabelText(/^Language$/i)).toBeInTheDocument();
    expect(
      await screen.findByRole("navigation", { name: /^Mobile navigation$/i })
    ).toBeInTheDocument();
    expect(
      (await screen.findAllByRole("link", { name: /^Home$/i })).length
    ).toBeGreaterThan(0);
    expect(
      (await screen.findAllByRole("button", { name: /Open main menu/i })).length
    ).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe("en");
  });

  it("opens the profile route from the user menu", async () => {
    const user = userEvent.setup();

    renderRoute("/");

    await user.click(
      await screen.findByRole("button", {
        name: /Abrir menu del usuario|Open user menu/i
      })
    );

    await user.click(
      await screen.findByRole("button", {
        name: /Abrir perfil|Open profile/i
      })
    );

    expect(await screen.findByText("Profile stub")).toBeInTheDocument();
  });
});
