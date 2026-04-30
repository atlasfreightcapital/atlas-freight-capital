import { BrokerCreditCheckForm } from "@/components/forms/broker-credit-check-form";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";

export default function CarrierBrokerChecksPage() {
  return (
    <div className="space-y-6">
      <BrokerCreditCheckForm />
      <Card title="Recent broker check requests">
        <div className="space-y-3 text-sm text-[#1d2a30]">
          <div className="flex items-center justify-between rounded-lg border border-[#d1dad6] bg-[#fbfcfa] px-3 py-2">
            <p>Blue River Logistics (MC 103998)</p>
            <StatusChip status="approved" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[#d1dad6] bg-[#fbfcfa] px-3 py-2">
            <p>North Point Brokerage (MC 998832)</p>
            <StatusChip status="reviewing" />
          </div>
        </div>
      </Card>
    </div>
  );
}

