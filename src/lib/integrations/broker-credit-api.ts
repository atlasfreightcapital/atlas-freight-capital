export interface BrokerCreditProviderRequest {
  brokerName: string;
  mcNumber?: string;
  dotNumber?: string;
}

export interface BrokerCreditProviderResponse {
  score: number;
  riskLevel: "low" | "medium" | "high" | "blocked";
  notes?: string;
}

export async function runExternalBrokerCreditCheck(
  request: BrokerCreditProviderRequest,
): Promise<BrokerCreditProviderResponse> {
  void request;
  throw new Error("Broker credit API integration not configured yet.");
}
