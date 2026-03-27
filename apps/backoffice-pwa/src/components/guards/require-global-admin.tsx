import {
  Suspense,
  lazy,
  type ReactNode
} from "react";

import { isGlobalAuditVisible } from "@operapyme/domain";

import { useBackofficeAuth } from "@/app/auth-provider";
import { AppLoadingScreen } from "@/components/layout/app-loading-screen";

const AccessDeniedPage = lazy(async () => {
  const module = await import("@/modules/auth/access-denied-page");

  return { default: module.AccessDeniedPage };
});

interface RequireGlobalAdminProps {
  children: ReactNode;
}

export function RequireGlobalAdmin({ children }: RequireGlobalAdminProps) {
  const { accessContext } = useBackofficeAuth();

  if (!isGlobalAuditVisible(accessContext)) {
    return (
      <Suspense fallback={<AppLoadingScreen variant="module" />}>
        <AccessDeniedPage />
      </Suspense>
    );
  }

  return children;
}
