import { Suspense, type ReactNode } from "react";

import { useTranslation } from "@operapyme/i18n";
import {
  Navigate,
  Outlet,
  createBrowserRouter,
  type RouteObject
} from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { RequireGlobalAdmin } from "@/components/guards/require-global-admin";
import { AppShell } from "@/components/layout/app-shell";
import { AuthCallbackPage } from "@/modules/auth/auth-callback-page";
import { AuthPage } from "@/modules/auth/auth-page";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";
import { SetupTenantPage } from "@/modules/setup/setup-tenant-page";

function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-[28px] border border-line/70 bg-paper/90 p-8 text-center shadow-panel">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-ink-muted">
        {t("states.routeNotFoundEyebrow")}
      </p>
      <h1 className="max-w-md text-3xl font-semibold tracking-tight text-ink">
        {t("states.routeNotFoundTitle")}
      </h1>
      <p className="max-w-lg text-sm leading-6 text-ink-soft">
        {t("states.routeNotFoundDescription")}
      </p>
    </div>
  );
}

function RouteLoader() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-full border border-line/70 bg-paper/80 px-4 py-2 text-sm text-ink-soft shadow-panel">
        {t("states.loadingModule")}
      </div>
    </div>
  );
}

function AuthStatusBoundary({ children }: { children: ReactNode }) {
  const { isConfigured, status } = useBackofficeAuth();

  if (!isConfigured || status === "unconfigured") {
    return <UnconfiguredPage />;
  }

  if (status === "loading") {
    return <RouteLoader />;
  }

  return children;
}

function AuthOnlyRoute() {
  const { isBootstrapped, status } = useBackofficeAuth();

  return (
    <AuthStatusBoundary>
      {status === "signed_in" ? (
        <Navigate replace to={isBootstrapped ? "/" : "/setup"} />
      ) : (
        <AuthPage />
      )}
    </AuthStatusBoundary>
  );
}

function RequireSignedIn() {
  const { status } = useBackofficeAuth();

  return (
    <AuthStatusBoundary>
      {status === "signed_in" ? <Outlet /> : <Navigate replace to="/auth" />}
    </AuthStatusBoundary>
  );
}

function RequireBootstrappedShell() {
  const { isBootstrapped, status } = useBackofficeAuth();

  return (
    <AuthStatusBoundary>
      {status === "signed_in" ? (
        isBootstrapped ? (
          <AppShell />
        ) : (
          <Navigate replace to="/setup" />
        )
      ) : (
        <Navigate replace to="/auth" />
      )}
    </AuthStatusBoundary>
  );
}

async function loadDashboardRoute() {
  const { DashboardPage } = await import("@/modules/dashboard/dashboard-page");

  return {
    Component: function DashboardRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <DashboardPage />
        </Suspense>
      );
    }
  };
}

async function loadCrmRoute() {
  const { CrmPage } = await import("@/modules/crm/crm-page");

  return {
    Component: function CrmRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CrmPage />
        </Suspense>
      );
    }
  };
}

async function loadCatalogRoute() {
  const { CatalogPage } = await import("@/modules/catalog/catalog-page");

  return {
    Component: function CatalogRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CatalogPage />
        </Suspense>
      );
    }
  };
}

async function loadQuotesRoute() {
  const { QuotesPage } = await import("@/modules/quotes/quotes-page");

  return {
    Component: function QuotesRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <QuotesPage />
        </Suspense>
      );
    }
  };
}

async function loadSettingsRoute() {
  const { SettingsPage } = await import("@/modules/settings/settings-page");

  return {
    Component: function SettingsRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <SettingsPage />
        </Suspense>
      );
    }
  };
}

async function loadAdminAuditRoute() {
  const { AdminAuditPage } = await import("@/modules/admin/admin-audit-page");

  return {
    Component: function AdminAuditRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <AdminAuditPage />
        </Suspense>
      );
    }
  };
}

async function loadAdminErrorsRoute() {
  const { AdminErrorsPage } = await import("@/modules/admin/admin-errors-page");

  return {
    Component: function AdminErrorsRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <AdminErrorsPage />
        </Suspense>
      );
    }
  };
}

export const appRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthOnlyRoute />
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />
  },
  {
    path: "/setup",
    element: <RequireSignedIn />,
    children: [
      {
        index: true,
        element: <SetupTenantPage />
      }
    ]
  },
  {
    path: "/",
    element: <RequireBootstrappedShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        lazy: loadDashboardRoute
      },
      {
        path: "crm",
        lazy: loadCrmRoute
      },
      {
        path: "catalog",
        lazy: loadCatalogRoute
      },
      {
        path: "quotes",
        lazy: loadQuotesRoute
      },
      {
        path: "admin",
        lazy: async () => {
          const route = await loadAdminAuditRoute();

          return {
            Component: function GuardedAdminAuditRoute() {
              const Component = route.Component;

              return (
                <RequireGlobalAdmin>
                  <Component />
                </RequireGlobalAdmin>
              );
            }
          };
        }
      },
      {
        path: "admin/errors",
        lazy: async () => {
          const route = await loadAdminErrorsRoute();

          return {
            Component: function GuardedAdminErrorsRoute() {
              const Component = route.Component;

              return (
                <RequireGlobalAdmin>
                  <Component />
                </RequireGlobalAdmin>
              );
            }
          };
        }
      },
      {
        path: "settings",
        lazy: loadSettingsRoute
      }
    ]
  }
];

export function createAppRouter() {
  return createBrowserRouter(appRoutes);
}
