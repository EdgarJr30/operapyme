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
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { AuthCallbackPage } from "@/modules/auth/auth-callback-page";

const authMocks = vi.hoisted(() => ({
  useBackofficeAuth: vi.fn()
}));

const supabaseMocks = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn()
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
    auth: {
      exchangeCodeForSession: supabaseMocks.exchangeCodeForSession,
      verifyOtp: supabaseMocks.verifyOtp
    }
  }
}));

function renderRoute() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/auth" element={<div>Auth destination</div>} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe("auth callback page", () => {
  const refreshAccessContext = vi.fn();
  const setPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/auth/callback");

    authMocks.useBackofficeAuth.mockReturnValue({
      isBootstrapped: false,
      isConfigured: true,
      refreshAccessContext,
      setPassword,
      status: "signed_out"
    });

    supabaseMocks.exchangeCodeForSession.mockResolvedValue({
      error: null
    });
    supabaseMocks.verifyOtp.mockResolvedValue({
      error: null
    });
  });

  it("exchanges an auth code and refreshes the access context", async () => {
    window.history.replaceState(
      {},
      "",
      "/auth/callback?code=auth-code-123"
    );

    renderRoute();

    await waitFor(() => {
      expect(supabaseMocks.exchangeCodeForSession).toHaveBeenCalledWith(
        "auth-code-123"
      );
    });
    expect(refreshAccessContext).toHaveBeenCalledTimes(1);
    expect(supabaseMocks.verifyOtp).not.toHaveBeenCalled();
  });

  it("verifies token_hash callbacks and refreshes the access context", async () => {
    window.history.replaceState(
      {},
      "",
      "/auth/callback?token_hash=hash-123&type=email"
    );

    renderRoute();

    await waitFor(() => {
      expect(supabaseMocks.verifyOtp).toHaveBeenCalledWith({
        token_hash: "hash-123",
        type: "email"
      });
    });
    expect(refreshAccessContext).toHaveBeenCalledTimes(1);
    expect(supabaseMocks.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("shows an actionable error when the callback payload is unsupported", async () => {
    window.history.replaceState(
      {},
      "",
      "/auth/callback?token_hash=hash-123&type=phone_change"
    );

    renderRoute();

    expect(
      await screen.findByText(
        /El enlace de acceso usa un formato que este backoffice todavía no puede validar/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Solicitar otro enlace/i })
    ).toHaveAttribute("href", "/auth");
    expect(supabaseMocks.exchangeCodeForSession).not.toHaveBeenCalled();
    expect(supabaseMocks.verifyOtp).not.toHaveBeenCalled();
  });

  it("returns to auth when the callback route is opened without auth params", async () => {
    renderRoute();

    expect(await screen.findByText("Auth destination")).toBeInTheDocument();
  });

  it("renders the recovery password form after validating a recovery token", async () => {
    const user = userEvent.setup();

    setPassword.mockResolvedValue(null);
    authMocks.useBackofficeAuth.mockReturnValue({
      isAccessContextLoading: false,
      isBootstrapped: true,
      isConfigured: true,
      refreshAccessContext,
      setPassword,
      status: "signed_in"
    });

    window.history.replaceState(
      {},
      "",
      "/auth/callback?token_hash=hash-123&type=recovery&flow=recovery"
    );

    renderRoute();

    expect(
      await screen.findByRole("heading", { name: /Define una nueva contraseña/i })
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/^Nueva contraseña$/i),
      "NuevaClave123"
    );
    await user.type(
      screen.getByLabelText(/^Confirmar contraseña$/i),
      "NuevaClave123"
    );
    await user.click(
      screen.getByRole("button", { name: /Guardar nueva contraseña/i })
    );

    await waitFor(() => {
      expect(setPassword).toHaveBeenCalledWith("NuevaClave123");
    });
  });
});
