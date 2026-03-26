import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { RequireGlobalAdmin } from "@/components/guards/require-global-admin";

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

function renderGuard() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <RequireGlobalAdmin>
          <div>Admin content</div>
        </RequireGlobalAdmin>
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe("require global admin guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks admin surfaces when the user lacks global permissions", async () => {
    authMocks.useBackofficeAuth.mockReturnValue({
      accessContext: {
        appUserId: "user-1",
        email: "operator@operapyme.com",
        displayName: "Operator",
        isGlobalAdmin: false,
        memberships: [],
        platformRoleKeys: [],
        platformPermissionKeys: [],
        tenantPermissionKeys: ["tenant.read"]
      }
    });

    renderGuard();

    expect(
      await screen.findByRole("heading", {
        name: /Esta superficie no está disponible para tu contexto actual/i
      })
    ).toBeInTheDocument();
    expect(screen.queryByText("Admin content")).not.toBeInTheDocument();
  });

  it("allows admin surfaces when the user is global_admin", async () => {
    authMocks.useBackofficeAuth.mockReturnValue({
      accessContext: {
        appUserId: "user-1",
        email: "admin@operapyme.com",
        displayName: "Admin",
        isGlobalAdmin: true,
        memberships: [],
        platformRoleKeys: ["global_admin"],
        platformPermissionKeys: ["audit.read.global", "error.read.global"],
        tenantPermissionKeys: []
      }
    });

    renderGuard();

    expect(await screen.findByText("Admin content")).toBeInTheDocument();
  });
});
