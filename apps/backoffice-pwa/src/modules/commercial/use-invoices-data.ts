import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listInvoicesForTenant } from "@/lib/supabase/backoffice-data";

interface InvoicesDataOptions {
  enabled?: boolean;
}

export function useInvoicesData({
  enabled = true
}: InvoicesDataOptions = {}) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: ["invoices", activeTenantId],
    queryFn: () => listInvoicesForTenant(activeTenantId ?? "", 25),
    enabled: Boolean(
      enabled && isConfigured && status === "signed_in" && activeTenantId
    )
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
