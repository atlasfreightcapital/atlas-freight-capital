interface PartnerCandidate {
  id: string;
  buyRateMin: number;
  buyRateMax: number;
  maxInvoiceAmount: number;
  acceptsNewMc: boolean;
  acceptsActiveUcc: boolean;
  avgApprovalHours: number;
  capacityScore: number;
  supportedStates: string[];
}

interface RouteInput {
  invoiceAmount: number;
  state: string;
  isNewMc: boolean;
  hasActiveUcc: boolean;
}

export function choosePartner(candidates: PartnerCandidate[], input: RouteInput) {
  const filtered = candidates.filter((partner) => {
    if (partner.maxInvoiceAmount < input.invoiceAmount) return false;
    if (!partner.supportedStates.includes(input.state)) return false;
    if (input.isNewMc && !partner.acceptsNewMc) return false;
    if (input.hasActiveUcc && !partner.acceptsActiveUcc) return false;
    return true;
  });

  const sorted = filtered.sort((a, b) => {
    const aScore = a.buyRateMin + a.avgApprovalHours / 100 + (100 - a.capacityScore) / 100;
    const bScore = b.buyRateMin + b.avgApprovalHours / 100 + (100 - b.capacityScore) / 100;
    return aScore - bScore;
  });

  return sorted[0] ?? null;
}
