import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";

export default function SuperDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active platform users" value="324" />
        <StatCard label="Funding partners" value="6" />
        <StatCard label="Role change requests" value="3" />
      </div>
      <Card title="Super admin controls">
        <ul className="space-y-2 text-sm text-[#40515a]">
          <li>Manage role assignments and permission boundaries</li>
          <li>Manage partner entities and visibility controls</li>
          <li>Toggle white-label partner visibility for carriers</li>
          <li>Maintain platform settings and audit scope</li>
        </ul>
      </Card>
    </div>
  );
}

