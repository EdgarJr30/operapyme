import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { getQuoteDetail } from "@/lib/supabase/backoffice-data";

export function useQuoteDetailData(quoteId: string | null) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  return useQuery({
    queryKey: ["quote-detail", activeTenantId, quoteId],
    queryFn: () => getQuoteDetail(activeTenantId ?? "", quoteId ?? ""),
    enabled: Boolean(
      isConfigured && status === "signed_in" && activeTenantId && quoteId
    )
  });
}
