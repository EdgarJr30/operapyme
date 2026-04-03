import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  listCustomersForTenant,
  type CustomerStatus
} from "@/lib/supabase/backoffice-data";

interface CustomersDataOptions {
  enabled?: boolean;
  limit?: number | null;
  statuses?: CustomerStatus[];
}

export function useCustomersData({
  enabled = true,
  limit = 25,
  statuses = ["active", "inactive"]
}: CustomersDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();
  const statusesKey = statuses.join(",");

  const query = useQuery({
    queryKey: ["customers", activeTenantId, limit ?? "all", statusesKey],
    queryFn: () =>
      listCustomersForTenant(activeTenantId ?? "", {
        limit,
        statuses
      }),
    enabled: Boolean(
      enabled && isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
