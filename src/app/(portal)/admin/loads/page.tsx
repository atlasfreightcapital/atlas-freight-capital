import Link from "next/link";
import { AdminLoadWorkbench } from "@/components/forms/admin-load-workbench";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatusChip } from "@/components/ui/status-chip";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const loadRows = [
  [
    "LD-90322",
    "INV-448201",
    <Link key="carrier" href="/admin/carriers/mountain-line-express" className="font-semibold text-[#0a7c86]">Mountain Line Express</Link>,
    <Link key="broker" href="/admin/brokers/blue-river-logistics" className="font-semibold text-[#0a7c86]">Blue River Logistics</Link>,
    formatCurrency(4200),
    <RiskBadge key="risk" level="medium" />,
    <StatusChip key="status" status="atlas_review" />,
    "Docs review",
  ],
  [
    "LD-90441",
    "INV-448277",
    <Link key="carrier" href="/admin/carriers/westbound-freight-group" className="font-semibold text-[#0a7c86]">Westbound Freight Group</Link>,
    <Link key="broker" href="/admin/brokers/southline-brokers" className="font-semibold text-[#0a7c86]">Southline Brokers</Link>,
    formatCurrency(7800),
    <RiskBadge key="risk" level="high" />,
    <StatusChip key="status" status="broker_verification_pending" />,
    "Broker verification",
  ],
  [
    "LD-90477",
    "INV-448290",
    <Link key="carrier" href="/admin/carriers/clearwater-reefer" className="font-semibold text-[#0a7c86]">Clearwater Reefer LLC</Link>,
    <Link key="broker" href="/admin/brokers/delta-produce-network" className="font-semibold text-[#0a7c86]">Delta Produce Network</Link>,
    formatCurrency(6150),
    <RiskBadge key="risk" level="low" />,
    <StatusChip key="status" status="sent_to_funding_partner" />,
    "Partner response",
  ],
];

export default async function AdminLoadsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("load_submissions")
    .select("id, carrier_id, load_number, invoice_number, total_invoice_amount, status, risk_level")
    .order("created_at", { ascending: false })
    .limit(12);
  const rows =
    data && data.length > 0
      ? data.map((load) => [
          load.load_number,
          load.invoice_number,
          <Link key="carrier" href={`/admin/carriers/${load.carrier_id}`} className="font-semibold text-[#0a7c86]">
            {load.carrier_id?.slice(0, 8) ?? "Carrier"}
          </Link>,
          "Open broker file",
          formatCurrency(Number(load.total_invoice_amount ?? 0)),
          <RiskBadge key="risk" level={load.risk_level ?? "medium"} />,
          <StatusChip key="status" status={load.status} />,
          "Open workbench",
        ])
      : loadRows;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Load funding desk"
        title="Review submissions, verify brokers, price deals, and route files to partners."
        description="Operate the complete factoring package: document review, broker verification, partner assignment, advance approval, funding status, pricing/spread, and audit history."
        primaryAction={{ label: "Partner capacity", href: "/admin/partners" }}
        secondaryAction={{ label: "Payment tracking", href: "/admin/payments" }}
      />
      <Card title="Load operations queue">
        <AdminTable
          columns={["Load", "Invoice", "Carrier", "Broker", "Amount", "Risk", "Status", "Next action"]}
          rows={rows}
        />
      </Card>
      <AdminLoadWorkbench />
    </div>
  );
}
