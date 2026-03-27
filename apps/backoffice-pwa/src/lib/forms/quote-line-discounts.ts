export const MAX_QUOTE_LINE_DISCOUNT_PERCENT = 100;

interface QuoteLineDiscountShape {
  discountPercent?: number | null;
  discountTotal?: number | null;
  quantity?: number | null;
  unitPrice?: number | null;
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
