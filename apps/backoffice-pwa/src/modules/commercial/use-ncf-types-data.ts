import { useQuery } from "@tanstack/react-query";

import { listNcfTypes } from "@/lib/supabase/backoffice-data";

export function useNcfTypesData() {
  return useQuery({
    queryKey: ["ncf-types"],
    queryFn: listNcfTypes,
    staleTime: 1000 * 60 * 60 // 1 hour — this list rarely changes
  });
}
