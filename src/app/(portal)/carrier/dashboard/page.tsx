import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { StatusChip } from "@/components/ui/status-chip";
import { formatCurrency } from "@/lib/utils";

export default function CarrierDashboardPage() {
  const stats = [
    { label: "Total submitted volume", value: formatCurrency(184250) },
    { label: "Total funded volume", value: formatCurrency(162700) },
    { label: "Pending funding", value: formatCurrency(26110) },
    { label: "Open invoice balance", value: formatCurrency(35780) },
    { label: "Estimated fees", value: formatCurrency(5420) },
    { label: "Reserve balance", value: formatCurrency(15440) },
    { label: "Average days to fund", value: "1.6 days" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Application status">
          <StatusChip status="reviewing" />
          <p className="mt-3 text-sm text-[#40515a]">Compliance review in progress. Two documents need replacement.</p>
        </Card>
        <Card title="Missing documents">
          <ul className="space-y-2 text-sm text-[#40515a]">
            <li>Owner ID replacement</li>
            <li>Updated certificate of insurance</li>
          </ul>
        </Card>
      </div>
      <Card title="Load timeline">
        <Timeline
          events={[
            { label: "Submitted", status: "submitted", timestamp: "2026-04-28 08:30 PT" },
            { label: "Documents reviewed", status: "reviewing", timestamp: "2026-04-28 10:20 PT" },
            { label: "Broker verified", status: "approved", timestamp: "2026-04-28 11:55 PT" },
            { label: "Funded", status: "funded", timestamp: "2026-04-28 14:10 PT" },
          ]}
        />
      </Card>
    </div>
  );
}

