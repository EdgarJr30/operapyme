import type { ReactNode } from "react";

import { isGlobalAuditVisible } from "@operapyme/domain";

import { useBackofficeAuth } from "@/app/auth-provider";
import { AccessDeniedPage } from "@/modules/auth/access-denied-page";

interface RequireGlobalAdminProps {
  children: ReactNode;
}

export function RequireGlobalAdmin({ children }: RequireGlobalAdminProps) {
  const { accessContext } = useBackofficeAuth();

  if (!isGlobalAuditVisible(accessContext)) {
    return <AccessDeniedPage />;
  }

  return children;
}
