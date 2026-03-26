import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { getDashboardSnapshot } from "@/lib/supabase/backoffice-data";

export function useDashboardData() {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["dashboard-snapshot", activeTenantId],
    queryFn: () => getDashboardSnapshot(activeTenantId ?? ""),
    enabled: Boolean(
      isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}

