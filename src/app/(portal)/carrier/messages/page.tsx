import { Card } from "@/components/ui/card";

export default function CarrierMessagesPage() {
  return (
    <Card title="Messages from Atlas">
      <div className="space-y-3 text-sm text-[#1d2a30]">
        <div className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
          <p className="font-semibold">Atlas Operations</p>
          <p className="mt-1 text-[#40515a]">Please upload updated insurance certificate before next funding request.</p>
        </div>
        <div className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
          <p className="font-semibold">Atlas Underwriting</p>
          <p className="mt-1 text-[#40515a]">Broker verification confirmed for your latest invoice.</p>
        </div>
      </div>
    </Card>
  );
}

