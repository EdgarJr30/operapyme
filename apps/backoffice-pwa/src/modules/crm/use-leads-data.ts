import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  listLeadsForTenant,
  type LeadStatus
} from "@/lib/supabase/backoffice-data";

interface LeadsDataOptions {
  enabled?: boolean;
  limit?: number | null;
  statuses?: LeadStatus[];
}

export function useLeadsData({
  enabled = true,
  limit = 25,
  statuses = ["new", "qualified", "proposal"]
}: LeadsDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();
  const statusesKey = statuses.join(",");

  const query = useQuery({
    queryKey: ["leads", activeTenantId, limit ?? "all", statusesKey],
    queryFn: () =>
      listLeadsForTenant(activeTenantId ?? "", {
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
