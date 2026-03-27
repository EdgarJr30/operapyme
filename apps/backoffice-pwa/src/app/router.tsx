import { Suspense, lazy, type ReactNode } from "react";

import { useTranslation } from "@operapyme/i18n";
import {
  Navigate,
  Outlet,
  createBrowserRouter,
  type RouteObject
} from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { RequireGlobalAdmin } from "@/components/guards/require-global-admin";
import { AppLoadingScreen } from "@/components/layout/app-loading-screen";

const AuthCallbackPage = lazy(async () => {
  const module = await import("@/modules/auth/auth-callback-page");

  return { default: module.AuthCallbackPage };
});

const AuthPage = lazy(async () => {
  const module = await import("@/modules/auth/auth-page");

  return { default: module.AuthPage };
});

const UnconfiguredPage = lazy(async () => {
  const module = await import("@/modules/auth/unconfigured-page");

  return { default: module.UnconfiguredPage };
});

const SetupTenantPage = lazy(async () => {
  const module = await import("@/modules/setup/setup-tenant-page");

  return { default: module.SetupTenantPage };
});

const BackofficeDataProvider = lazy(async () => {
  const module = await import("@/app/backoffice-data-provider");

  return { default: module.BackofficeDataProvider };
});

const AppShell = lazy(async () => {
  const module = await import("@/components/layout/app-shell");

  return { default: module.AppShell };
});

function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-3xl border border-line/70 bg-paper p-8 text-center shadow-panel">
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
  return <AppLoadingScreen variant="module" />;
}

function AuthStatusBoundary({ children }: { children: ReactNode }) {
  const { isAccessContextLoading, isConfigured, status } = useBackofficeAuth();

  if (!isConfigured || status === "unconfigured") {
    return (
      <Suspense fallback={<AppLoadingScreen variant="workspace" />}>
        <UnconfiguredPage />
      </Suspense>
    );
  }

  if (status === "loading") {
    return <AppLoadingScreen variant="workspace" />;
  }

  if (status === "signed_in" && isAccessContextLoading) {
    return <AppLoadingScreen variant="workspace" />;
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
        <Suspense fallback={<AppLoadingScreen variant="workspace" />}>
          <AuthPage />
        </Suspense>
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
          <Suspense fallback={<AppLoadingScreen variant="workspace" />}>
            <BackofficeDataProvider>
              <AppShell />
            </BackofficeDataProvider>
          </Suspense>
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

async function loadQuotesCreateRoute() {
  const { QuotesCreatePage } = await import("@/modules/quotes/quotes-create-page");

  return {
    Component: function QuotesCreateRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <QuotesCreatePage />
        </Suspense>
      );
    }
  };
}

async function loadQuotesManageRoute() {
  const { QuotesManagePage } = await import("@/modules/quotes/quotes-manage-page");

  return {
    Component: function QuotesManageRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <QuotesManagePage />
        </Suspense>
      );
    }
  };
}

async function loadLearningRoute() {
  const { LearningPage } = await import("@/modules/learning/learning-page");

  return {
    Component: function LearningRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <LearningPage />
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
    element: (
      <Suspense fallback={<AppLoadingScreen variant="workspace" />}>
        <AuthCallbackPage />
      </Suspense>
    )
  },
  {
    path: "/setup",
    element: <RequireSignedIn />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AppLoadingScreen variant="workspace" />}>
            <SetupTenantPage />
          </Suspense>
        )
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
        path: "quotes/new",
        lazy: loadQuotesCreateRoute
      },
      {
        path: "quotes/manage",
        lazy: loadQuotesManageRoute
      },
      {
        path: "learning",
        lazy: loadLearningRoute
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
