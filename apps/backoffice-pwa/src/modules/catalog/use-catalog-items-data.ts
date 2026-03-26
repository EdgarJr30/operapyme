import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listCatalogItemsForTenant } from "@/lib/supabase/backoffice-data";

export function useCatalogItemsData() {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["catalog-items", activeTenantId],
    queryFn: () => listCatalogItemsForTenant(activeTenantId ?? "", 25),
    enabled: Boolean(
      isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
