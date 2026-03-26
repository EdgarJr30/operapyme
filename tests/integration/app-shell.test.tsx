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
            <Route path="admin" element={<AdminAuditPage />} />
            <Route path="admin/errors" element={<AdminErrorsPage />} />
            <Route path="settings" element={<div>Settings stub</div>} />
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

    expect((await screen.findAllByRole("link", { name: /^Admin$/i })).length).toBe(
      2
    );
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

    renderRoute("/");

    expect(screen.queryByRole("link", { name: /^Admin$/i })).not.toBeInTheDocument();
    expect((await screen.findAllByRole("link", { name: /^Catalogo$/i })).length).toBe(
      2
    );
    expect(
      (await screen.findAllByRole("link", { name: /^Configuracion$/i })).length
    ).toBe(2);
  });

  it("switches the shell copy and navigation labels between spanish and english", async () => {
    const user = userEvent.setup();

    renderRoute("/");

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
    expect((await screen.findAllByRole("link", { name: /^Home$/i })).length).toBe(2);
    expect(
      (await screen.findAllByRole("link", { name: /^Settings$/i })).length
    ).toBe(2);
    expect(document.documentElement.lang).toBe("en");
  });
});
