import type { RiskLevel } from "@/types/domain";

export interface RiskInputs {
  newMc: boolean;
  activeUcc: boolean;
  lowDocumentationQuality: boolean;
  highInvoiceAmount: boolean;
  brokerRiskHigh: boolean;
  disputes: number;
  chargebacks: number;
  missingPod: boolean;
  brokerNotVerified: boolean;
}

export function computeRiskScore(input: RiskInputs) {
  let score = 0;
  if (input.newMc) score += 14;
  if (input.activeUcc) score += 18;
  if (input.lowDocumentationQuality) score += 10;
  if (input.highInvoiceAmount) score += 12;
  if (input.brokerRiskHigh) score += 16;
  score += Math.min(input.disputes * 5, 15);
  score += Math.min(input.chargebacks * 9, 18);
  if (input.missingPod) score += 10;
  if (input.brokerNotVerified) score += 12;

  const normalized = Math.max(0, Math.min(100, score));
  const level: RiskLevel = normalized >= 80 ? "blocked" : normalized >= 60 ? "high" : normalized >= 35 ? "medium" : "low";

  return { score: normalized, level };
}
