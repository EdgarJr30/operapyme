import { useEffect, useMemo, useState } from "react";

import { Check, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { CustomerSummary } from "@/lib/supabase/backoffice-data";
import { cn } from "@/lib/utils";

interface CustomerSearchSelectProps {
  customers: CustomerSummary[];
  emptySearchMessage: string;
  id: string;
  noCustomersMessage: string;
  onBlur?: () => void;
  onChange: (customerId: string) => void;
  searchPlaceholder: string;
  selectedHint: string;
  value: string;
}

function normalizeSearchValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function getCustomerSearchText(customer: CustomerSummary) {
  return [
    customer.displayName,
    customer.legalName,
    customer.contactName,
    customer.documentId,
    customer.customerCode,
    customer.email,
    customer.whatsapp,
    customer.phone
  ]
    .filter(Boolean)
    .join(" ");
}

export function CustomerSearchSelect({
  customers,
  emptySearchMessage,
  id,
  noCustomersMessage,
  onBlur,
  onChange,
  searchPlaceholder,
  selectedHint,
  value
}: CustomerSearchSelectProps) {
  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === value) ?? null,
    [customers, value]
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(selectedCustomer?.displayName ?? "");
  }, [selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    if (!normalizedQuery) {
      return customers.slice(0, 8);
    }

    return customers
      .filter((customer) =>
        normalizeSearchValue(getCustomerSearchText(customer)).includes(normalizedQuery)
      )
      .slice(0, 8);
  }, [customers, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <Input
          id={id}
          value={query}
          placeholder={searchPlaceholder}
          className="pl-10 pr-11"
          autoComplete="off"
          onBlur={onBlur}
          onChange={(event) => {
            const nextQuery = event.target.value;

            setQuery(nextQuery);

            if (selectedCustomer && nextQuery.trim() !== selectedCustomer.displayName) {
              onChange("");
            }
          }}
        />
        {query ? (
          <button
            type="button"
            aria-label={searchPlaceholder}
            className="absolute right-3 top-1/2 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-muted transition hover:bg-sand/70 hover:text-ink"
            onClick={() => {
              setQuery("");
              onChange("");
            }}
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>

      {customers.length === 0 ? (
        <p className="text-sm text-ink-soft">{noCustomersMessage}</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line/70 bg-paper/65 px-4 py-3 text-sm text-ink-soft">
          {emptySearchMessage}
        </p>
      ) : (
        <div className="max-h-64 overflow-y-auto rounded-2xl border border-line/70 bg-paper/70 p-2">
          <div className="space-y-1">
            {filteredCustomers.map((customer) => {
              const isSelected = customer.id === value;

              return (
                <button
                  key={customer.id}
                  type="button"
                  className={cn(
                    "flex w-full cursor-pointer items-start justify-between gap-3 rounded-2xl px-3 py-2 text-left transition",
                    isSelected
                      ? "bg-brand/10 text-ink"
                      : "hover:bg-sand/50 text-ink"
                  )}
                  onClick={() => {
                    setQuery(customer.displayName);
                    onChange(customer.id);
                  }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{customer.displayName}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {customer.documentId?.trim() || customer.legalName?.trim() || "—"}
                    </p>
                  </div>
                  {isSelected ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCustomer ? (
        <p className="text-sm text-ink-soft">
          {selectedHint} {selectedCustomer.displayName}
          {selectedCustomer.documentId ? ` · ${selectedCustomer.documentId}` : ""}
        </p>
      ) : null}
    </div>
  );
}
