import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";

export default function PartnerAssignedLoadsPage() {
  return (
    <Card title="Assigned load packages">
      <div className="space-y-3 text-sm text-[#1d2a30]">
        <div className="flex items-center justify-between rounded-lg border border-[#d1dad6] bg-[#fbfcfa] px-3 py-2">
          <p>INV-448201 | Mountain Line Express | $3,250</p>
          <StatusChip status="reviewing" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-[#d1dad6] bg-[#fbfcfa] px-3 py-2">
          <p>INV-448277 | Westbound Freight Group | $5,900</p>
          <StatusChip status="approved" />
        </div>
      </div>
    </Card>
  );
}

