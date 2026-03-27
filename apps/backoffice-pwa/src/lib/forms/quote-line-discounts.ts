export const MAX_QUOTE_LINE_DISCOUNT_PERCENT = 100;

interface QuoteLineDiscountShape {
  discountPercent?: number | null;
  discountTotal?: number | null;
  quantity?: number | null;
  unitPrice?: number | null;
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
