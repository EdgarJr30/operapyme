import React from "react";
import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { AuthPage } from "@/modules/auth/auth-page";

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

  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    </I18nextProvider>
  );
}

describe("auth page", () => {
  it("renders the email access form when Supabase is configured", async () => {
    authMocks.useBackofficeAuth.mockReturnValue({
      isConfigured: true,
      isBootstrapped: false,
      signInWithOtp: vi.fn(),
      status: "signed_out"
    });

    renderRoute();

    expect(
      await screen.findByRole("heading", {
        name: /Sincronizado en todos tus dispositivos/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Inicia sesión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Crea tu cuenta/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Enviar enlace de acceso/i })
    ).toBeInTheDocument();
  });

  it("redirects signed in users without a bootstrapped tenant to setup", async () => {
    authMocks.useBackofficeAuth.mockReturnValue({
      isConfigured: true,
      isBootstrapped: false,
      signInWithOtp: vi.fn(),
      status: "signed_in"
    });

    const i18n = setupBackofficeI18n();

    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={["/auth"]}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/setup" element={<div>Setup destination</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(await screen.findByText("Setup destination")).toBeInTheDocument();
  });

  it("falls back to the setup warning when Supabase is not configured", async () => {
    authMocks.useBackofficeAuth.mockReturnValue({
      isConfigured: false,
      isBootstrapped: false,
      signInWithOtp: vi.fn(),
      status: "unconfigured"
    });

    renderRoute();

    expect(
      await screen.findByRole("heading", {
        name: /El backoffice necesita conexión a Supabase/i
      })
    ).toBeInTheDocument();
  });
});
