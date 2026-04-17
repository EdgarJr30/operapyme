export const MAX_QUOTE_LINE_DISCOUNT_PERCENT = 100;
export const discountApplicationModeValues = [
  "before_tax",
  "after_tax"
] as const;

export type DiscountApplicationMode =
  (typeof discountApplicationModeValues)[number];

interface QuoteLineDiscountShape {
  discountPercent?: number | null;
  discountTotal?: number | null;
  quantity?: number | null;
  unitPrice?: number | null;
  taxTotal?: number | null;
}

interface QuoteDocumentDiscountShape {
  discountPercent?: number | null;
  discountTotal?: number | null;
  lineItems: Pick<QuoteLineDiscountShape, "discountTotal" | "quantity" | "unitPrice">[];
}

function normalizeNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function roundToTwoDecimals(value: number) {
  return Number(value.toFixed(2));
}

function clampToZero(value: number) {
  return Math.max(0, roundToTwoDecimals(value));
}

export function calculateQuoteLineSubtotal({
  quantity,
  unitPrice
}: Pick<QuoteLineDiscountShape, "quantity" | "unitPrice">) {
  return roundToTwoDecimals(
    normalizeNumber(quantity) * normalizeNumber(unitPrice)
  );
}

export function calculateQuoteLineDiscountAmountFromPercent({
  discountPercent,
  quantity,
  unitPrice
}: Pick<
  QuoteLineDiscountShape,
  "discountPercent" | "quantity" | "unitPrice"
>) {
  const lineSubtotal = calculateQuoteLineSubtotal({ quantity, unitPrice });

  return roundToTwoDecimals(
    (lineSubtotal * normalizeNumber(discountPercent)) / 100
  );
}

export function calculateQuoteLineDiscountPercentFromAmount({
  discountTotal,
  quantity,
  unitPrice
}: Pick<
  QuoteLineDiscountShape,
  "discountTotal" | "quantity" | "unitPrice"
>) {
  const lineSubtotal = calculateQuoteLineSubtotal({ quantity, unitPrice });

  if (lineSubtotal <= 0) {
    return 0;
  }

  return roundToTwoDecimals(
    (normalizeNumber(discountTotal) / lineSubtotal) * 100
  );
}

export function calculateQuoteLineDiscountTotal(
  lineItems: Pick<QuoteLineDiscountShape, "discountTotal">[]
) {
  return roundToTwoDecimals(
    lineItems.reduce(
      (total, lineItem) => total + normalizeNumber(lineItem.discountTotal),
      0
    )
  );
}

export function calculateQuoteDocumentDiscountBase(
  lineItems: QuoteDocumentDiscountShape["lineItems"]
) {
  const subtotal = roundToTwoDecimals(
    lineItems.reduce(
      (total, lineItem) =>
        total +
        calculateQuoteLineSubtotal({
          quantity: lineItem.quantity,
          unitPrice: lineItem.unitPrice
        }),
      0
    )
  );

  return roundToTwoDecimals(
    Math.max(0, subtotal - calculateQuoteLineDiscountTotal(lineItems))
  );
}

export function calculateQuoteDocumentDiscountAmountFromPercent({
  discountPercent,
  lineItems
}: Pick<QuoteDocumentDiscountShape, "discountPercent" | "lineItems">) {
  return roundToTwoDecimals(
    (calculateQuoteDocumentDiscountBase(lineItems) *
      normalizeNumber(discountPercent)) /
      100
  );
}

export function calculateQuoteDocumentDiscountPercentFromAmount({
  discountTotal,
  lineItems
}: Pick<QuoteDocumentDiscountShape, "discountTotal" | "lineItems">) {
  const documentDiscountBase = calculateQuoteDocumentDiscountBase(lineItems);

  if (documentDiscountBase <= 0) {
    return 0;
  }

  return roundToTwoDecimals(
    (normalizeNumber(discountTotal) / documentDiscountBase) * 100
  );
}

export function calculateQuoteDocumentDiscountTotalFromCombinedDiscount({
  lineItems,
  totalDiscount
}: {
  lineItems: QuoteDocumentDiscountShape["lineItems"];
  totalDiscount?: number | null;
}) {
  return roundToTwoDecimals(
    Math.max(
      0,
      normalizeNumber(totalDiscount) - calculateQuoteLineDiscountTotal(lineItems)
    )
  );
}

export function calculateQuoteRawTaxTotal(
  lineItems: Pick<QuoteLineDiscountShape, "taxTotal">[]
) {
  return roundToTwoDecimals(
    lineItems.reduce(
      (total, lineItem) => total + normalizeNumber(lineItem.taxTotal),
      0
    )
  );
}

export function calculateDocumentTaxTotalForMode({
  lineItems,
  documentDiscountTotal,
  discountApplicationMode
}: {
  lineItems: Pick<
    QuoteLineDiscountShape,
    "discountTotal" | "quantity" | "unitPrice" | "taxTotal"
  >[];
  documentDiscountTotal?: number | null;
  discountApplicationMode: DiscountApplicationMode;
}) {
  const rawTaxTotal = calculateQuoteRawTaxTotal(lineItems);

  if (discountApplicationMode === "after_tax") {
    return rawTaxTotal;
  }

  const documentBase = calculateQuoteDocumentDiscountBase(lineItems);

  if (documentBase <= 0 || rawTaxTotal <= 0) {
    return rawTaxTotal;
  }

  const effectiveBase = clampToZero(
    documentBase - normalizeNumber(documentDiscountTotal)
  );

  return roundToTwoDecimals((rawTaxTotal * effectiveBase) / documentBase);
}

export function calculateDocumentGrandTotalForMode({
  lineItems,
  documentDiscountTotal,
  discountApplicationMode
}: {
  lineItems: Pick<
    QuoteLineDiscountShape,
    "discountTotal" | "quantity" | "unitPrice" | "taxTotal"
  >[];
  documentDiscountTotal?: number | null;
  discountApplicationMode: DiscountApplicationMode;
}) {
  const subtotal = lineItems.reduce(
    (total, lineItem) =>
      total +
      calculateQuoteLineSubtotal({
        quantity: lineItem.quantity,
        unitPrice: lineItem.unitPrice
      }),
    0
  );
  const lineDiscountTotal = calculateQuoteLineDiscountTotal(lineItems);
  const normalizedDocumentDiscountTotal = clampToZero(
    normalizeNumber(documentDiscountTotal)
  );
  const taxTotal = calculateDocumentTaxTotalForMode({
    lineItems,
    documentDiscountTotal: normalizedDocumentDiscountTotal,
    discountApplicationMode
  });

  return roundToTwoDecimals(
    subtotal - lineDiscountTotal - normalizedDocumentDiscountTotal + taxTotal
  );
}

export interface DocumentCalculationBreakdown {
  subtotal: number;
  lineDiscountTotal: number;
  documentDiscountBase: number;
  documentDiscountTotal: number;
  documentDiscountPercent: number;
  rawTaxTotal: number;
  taxTotal: number;
  baseImponible: number;
  totalBeforeDocumentDiscount: number;
  total: number;
  discountApplicationMode: DiscountApplicationMode;
}

export function calculateDocumentCalculationBreakdown({
  lineItems,
  documentDiscountTotal,
  discountApplicationMode
}: {
  lineItems: Pick<
    QuoteLineDiscountShape,
    "discountTotal" | "quantity" | "unitPrice" | "taxTotal"
  >[];
  documentDiscountTotal?: number | null;
  discountApplicationMode: DiscountApplicationMode;
}) : DocumentCalculationBreakdown {
  const subtotal = roundToTwoDecimals(
    lineItems.reduce(
      (total, lineItem) =>
        total +
        calculateQuoteLineSubtotal({
          quantity: lineItem.quantity,
          unitPrice: lineItem.unitPrice
        }),
      0
    )
  );
  const lineDiscountTotal = calculateQuoteLineDiscountTotal(lineItems);
  const documentDiscountBase = calculateQuoteDocumentDiscountBase(lineItems);
  const normalizedDocumentDiscountTotal = clampToZero(
    Math.min(
      normalizeNumber(documentDiscountTotal),
      documentDiscountBase
    )
  );
  const documentDiscountPercent = calculateQuoteDocumentDiscountPercentFromAmount(
    {
      discountTotal: normalizedDocumentDiscountTotal,
      lineItems
    }
  );
  const rawTaxTotal = calculateQuoteRawTaxTotal(lineItems);
  const taxTotal = calculateDocumentTaxTotalForMode({
    lineItems,
    documentDiscountTotal: normalizedDocumentDiscountTotal,
    discountApplicationMode
  });
  const baseImponible = clampToZero(
    documentDiscountBase - normalizedDocumentDiscountTotal
  );
  const totalBeforeDocumentDiscount = roundToTwoDecimals(
    subtotal - lineDiscountTotal + rawTaxTotal
  );

  return {
    subtotal,
    lineDiscountTotal,
    documentDiscountBase,
    documentDiscountTotal: normalizedDocumentDiscountTotal,
    documentDiscountPercent,
    rawTaxTotal,
    taxTotal,
    baseImponible,
    totalBeforeDocumentDiscount,
    total: calculateDocumentGrandTotalForMode({
      lineItems,
      documentDiscountTotal: normalizedDocumentDiscountTotal,
      discountApplicationMode
    }),
    discountApplicationMode
  };
}
