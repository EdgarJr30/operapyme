import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listCatalogItemsForTenant } from "@/lib/supabase/backoffice-data";

interface CatalogItemsDataOptions {
  enabled?: boolean;
}

export function useCatalogItemsData({
  enabled = true
}: CatalogItemsDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["catalog-items", activeTenantId],
    queryFn: () => listCatalogItemsForTenant(activeTenantId ?? "", 25),
    enabled: Boolean(
      enabled && isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
