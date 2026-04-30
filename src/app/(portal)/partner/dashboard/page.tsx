import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils";

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Assigned submissions" value="18" />
        <StatCard label="Approved this week" value="11" />
        <StatCard label="Funded amount" value={formatCurrency(742000)} />
      </div>
      <Card title="Partner workflow">
        <p className="text-sm text-[#40515a]">
          Review assigned submissions, request missing documents, enter advance amount, buy-rate, and funding date.
        </p>
      </Card>
    </div>
  );
}

