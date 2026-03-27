import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listLeadsForTenant } from "@/lib/supabase/backoffice-data";

export function useLeadsData() {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["leads", activeTenantId],
    queryFn: () => listLeadsForTenant(activeTenantId ?? "", 25),
    enabled: Boolean(
      isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
