import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listLeadsForTenant } from "@/lib/supabase/backoffice-data";

interface LeadsDataOptions {
  enabled?: boolean;
}

export function useLeadsData({
  enabled = true
}: LeadsDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["leads", activeTenantId],
    queryFn: () => listLeadsForTenant(activeTenantId ?? "", 25),
    enabled: Boolean(
      enabled && isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
