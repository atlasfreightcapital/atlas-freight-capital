export interface PricingInput {
  invoiceAmount: number;
  carrierRatePercent: number;
  backendBuyRatePercent: number;
  advancePercent: number;
  feeTiming: "upfront" | "after_payment";
}

export interface PricingOutput {
  grossFee: number;
  backendCost: number;
  atlasSpread: number;
  advanceAmount: number;
  reserveAmount: number;
  netPayoutEstimate: number;
}

function pct(amount: number, rate: number) {
  return (amount * rate) / 100;
}

export function calculatePricing(input: PricingInput): PricingOutput {
  const grossFee = pct(input.invoiceAmount, input.carrierRatePercent);
  const backendCost = pct(input.invoiceAmount, input.backendBuyRatePercent);
  const atlasSpread = grossFee - backendCost;
  const advanceAmount = pct(input.invoiceAmount, input.advancePercent);
  const reserveAmount = input.invoiceAmount - advanceAmount;

  const netPayoutEstimate = input.feeTiming === "upfront" ? advanceAmount - grossFee : advanceAmount;

  return {
    grossFee,
    backendCost,
    atlasSpread,
    advanceAmount,
    reserveAmount,
    netPayoutEstimate,
  };
}
