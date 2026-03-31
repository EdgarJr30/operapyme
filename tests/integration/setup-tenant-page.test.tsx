import React from "react";
import {
  render,
  screen,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";
import { toast } from "sonner";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { BackofficeThemeProvider } from "@/app/theme-provider";
import { SetupTenantPage } from "@/modules/setup/setup-tenant-page";

const authMocks = vi.hoisted(() => ({
  useBackofficeAuth: vi.fn()
}));

const supabaseMocks = vi.hoisted(() => ({
  rpc: vi.fn()
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

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    rpc: supabaseMocks.rpc
  }
}));

function renderRoute() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <BackofficeThemeProvider>
        <MemoryRouter initialEntries={["/setup"]}>
          <Routes>
            <Route path="/setup" element={<SetupTenantPage />} />
            <Route path="/" element={<div>Dashboard destination</div>} />
          </Routes>
        </MemoryRouter>
      </BackofficeThemeProvider>
    </I18nextProvider>
  );
}

describe("setup tenant page", () => {
  const refreshAccessContext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    authMocks.useBackofficeAuth.mockReturnValue({
      isBootstrapped: false,
      isConfigured: true,
      refreshAccessContext,
      status: "signed_in"
    });

    supabaseMocks.rpc.mockImplementation(async (fn: string) => {
      if (fn === "is_tenant_slug_available") {
        return {
          data: true,
          error: null
        };
      }

      return {
        error: null
      };
    });
  });

  it("creates the first tenant and continues to the app", async () => {
    const user = userEvent.setup();

    renderRoute();

    await user.type(
      screen.getByLabelText(/Nombre comercial/i),
      "Opera Norte"
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Slug del tenant/i)).toHaveValue("opera-norte");
    });

    await user.click(screen.getByRole("button", { name: /Continuar/i }));
    expect(
      await screen.findByRole("heading", { name: /Identidad inicial/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Continuar/i }));
    expect(
      await screen.findByRole("heading", { name: /Revisión final/i })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Crear tenant y continuar/i })
    );

    await waitFor(() => {
      expect(supabaseMocks.rpc).toHaveBeenCalledWith("is_tenant_slug_available", {
        target_slug: "opera-norte"
      });
      expect(supabaseMocks.rpc).toHaveBeenCalledWith("create_tenant_with_owner", {
        target_name: "Opera Norte",
        target_slug: "opera-norte"
      });
    });
    expect(refreshAccessContext).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Dashboard destination")).toBeInTheDocument();
  });

  it("blocks the flow when the slug is already taken", async () => {
    const user = userEvent.setup();

    supabaseMocks.rpc.mockImplementation(async (fn: string) => {
      if (fn === "is_tenant_slug_available") {
        return {
          data: false,
          error: null
        };
      }

      return {
        error: null
      };
    });

    renderRoute();

    await user.type(
      screen.getByLabelText(/Nombre comercial/i),
      "Opera Norte"
    );
    await user.click(screen.getByRole("button", { name: /Continuar/i }));

    await waitFor(() => {
      expect(screen.getByText(/ya está en uso/i)).toBeInTheDocument();
      expect(supabaseMocks.rpc).not.toHaveBeenCalledWith(
        "create_tenant_with_owner",
        expect.anything()
      );
    });
  });
});
