import { Card } from "@/components/ui/card";
import { PartnerReviewForm } from "@/components/forms/partner-review-form";

export default function PartnerReviewQueuePage() {
  return (
    <div className="space-y-6">
      <Card title="Review queue">
        <div className="space-y-3 text-sm text-[#1d2a30]">
          <div className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
            <p className="font-semibold">INV-448201 | Mountain Line Express | $3,250</p>
            <p className="mt-1 text-[#62737a]">Documents accepted. Broker verification confirmed by Atlas.</p>
          </div>
          <div className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
            <p className="font-semibold">INV-448277 | Westbound Freight Group | $5,900</p>
            <p className="mt-1 text-[#62737a]">Needs partner review. Shared risk note: monitor broker payment history.</p>
          </div>
        </div>
      </Card>
      <PartnerReviewForm />
    </div>
  );
}

