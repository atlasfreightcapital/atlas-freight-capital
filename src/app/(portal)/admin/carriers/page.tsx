import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatusChip } from "@/components/ui/status-chip";
import { demoCarriers } from "@/data/admin-demo";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { RiskLevel } from "@/types/domain";

export default async function AdminCarriersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("carriers")
    .select("id, legal_name, mc_number, dot_number, truck_count, estimated_monthly_volume, active_ucc, status, risk_level")
    .order("created_at", { ascending: false })
    .limit(20);

  const rows =
    data && data.length > 0
      ? data.map((carrier) => [
          <Link key="name" href={`/admin/carriers/${carrier.id}`} className="font-semibold text-[#0a7c86]">
            {carrier.legal_name}
          </Link>,
          carrier.mc_number ?? "Missing MC",
          carrier.dot_number ?? "Missing DOT",
          carrier.truck_count?.toString() ?? "Need count",
          formatCurrency(Number(carrier.estimated_monthly_volume ?? 0)),
          carrier.active_ucc ? "Yes" : "No",
          <RiskBadge key="risk" level={(carrier.risk_level ?? "medium") as RiskLevel} />,
          <StatusChip key="status" status={carrier.status ?? "reviewing"} />,
        ])
      : demoCarriers.map((carrier) => [
          <Link key="name" href={`/admin/carriers/${carrier.id}`} className="font-semibold text-[#0a7c86]">
            {carrier.legalName}
          </Link>,
          carrier.mc,
          carrier.dot,
          carrier.trucks,
          formatCurrency(carrier.monthlyVolume),
          carrier.activeUcc ? "Yes" : "No",
          <RiskBadge key="risk" level={carrier.risk} />,
          <StatusChip key="status" status={carrier.status} />,
        ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Carrier relationship desk"
        title="Open carrier profiles, documents, risk, reserves, and funding history."
        description="Atlas owns the carrier relationship here: company profile, compliance documents, active loads, reserve exposure, UCC status, messages, and internal notes."
        primaryAction={{ label: "Applications", href: "/admin/applications" }}
        secondaryAction={{ label: "Load queue", href: "/admin/loads" }}
      />
      <Card title="Carrier portfolio">
        <AdminTable
          columns={["Carrier", "MC", "DOT", "Trucks", "Monthly volume", "Active UCC", "Risk", "Status"]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
