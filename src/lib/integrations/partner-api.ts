export interface PartnerApiPayload {
  loadSubmissionId: string;
  carrierName: string;
  brokerName: string;
  invoiceAmount: number;
  documents: Array<{ type: string; signedUrl: string }>;
}

export interface PartnerApiClient {
  sendSubmission(payload: PartnerApiPayload): Promise<{ externalId: string; status: string }>;
  getSubmissionStatus(externalId: string): Promise<{ status: string; note?: string }>;
}

export function createPartnerApiClient(): PartnerApiClient {
  return {
    async sendSubmission() {
      throw new Error("Partner API integration not configured yet.");
    },
    async getSubmissionStatus() {
      throw new Error("Partner API integration not configured yet.");
    },
  };
}
