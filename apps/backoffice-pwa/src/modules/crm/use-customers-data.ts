import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listCustomersForTenant } from "@/lib/supabase/backoffice-data";

interface CustomersDataOptions {
  enabled?: boolean;
}

export function useCustomersData({
  enabled = true
}: CustomersDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["customers", activeTenantId],
    queryFn: () => listCustomersForTenant(activeTenantId ?? "", 25),
    enabled: Boolean(
      enabled && isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
