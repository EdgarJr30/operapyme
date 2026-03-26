import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listQuotesForTenant } from "@/lib/supabase/backoffice-data";

export function useQuotesData() {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["quotes", activeTenantId],
    queryFn: () => listQuotesForTenant(activeTenantId ?? "", 6),
    enabled: Boolean(
      isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
