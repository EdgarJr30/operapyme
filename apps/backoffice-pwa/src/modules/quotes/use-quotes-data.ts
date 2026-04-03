import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  listQuotesForTenant,
  type QuoteStatus
} from "@/lib/supabase/backoffice-data";

interface QuotesDataOptions {
  enabled?: boolean;
  limit?: number | null;
  statuses?: QuoteStatus[];
}

export function useQuotesData({
  enabled = true,
  limit = 25,
  statuses
}: QuotesDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();
  const statusesKey = statuses?.length ? statuses.join(",") : "all";

  const query = useQuery({
    queryKey: ["quotes", activeTenantId, limit ?? "all", statusesKey],
    queryFn: () =>
      listQuotesForTenant(activeTenantId ?? "", {
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
