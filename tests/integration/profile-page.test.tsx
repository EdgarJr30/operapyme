import React from "react";
import {
  render,
  screen
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { ProfilePage } from "@/modules/profile/profile-page";

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

function renderRoute() {
  const i18n = setupBackofficeI18n();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

describe("profile page", () => {
  it("saves a password for the authenticated account", async () => {
    const user = userEvent.setup();
    const setPassword = vi.fn().mockResolvedValue(null);

    authMocks.useBackofficeAuth.mockReturnValue({
      accessContext: {
        appUserId: "user-1",
        email: "owner@operapyme.com",
        displayName: "Owner",
        isGlobalAdmin: false,
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
        platformRoleKeys: [],
        platformPermissionKeys: [],
        tenantPermissionKeys: ["tenant.read"]
      },
      activeTenantId: "tenant-1",
      setPassword,
      user: {
        email: "owner@operapyme.com"
      }
    });

    renderRoute();

    await user.type(
      await screen.findByLabelText(/^Nueva contraseña$/i),
      "ClaveSegura123"
    );
    await user.type(
      screen.getByLabelText(/^Confirmar contraseña$/i),
      "ClaveSegura123"
    );
    await user.click(
      screen.getByRole("button", { name: /Guardar contraseña/i })
    );

    expect(setPassword).toHaveBeenCalledWith("ClaveSegura123");
  });
});
