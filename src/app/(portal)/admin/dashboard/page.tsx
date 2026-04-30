import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatCard } from "@/components/ui/stat-card";
import { StatusChip } from "@/components/ui/status-chip";
import { formatCurrency } from "@/lib/utils";

const stats = [
  ["Total applications", "264", "+19 waiting review"],
  ["Active carriers", "143", "29 new MCs monitored"],
  ["Loads today", "37", "14 need broker verification"],
  ["Funded today", formatCurrency(422800), "Avg 3.1 hours"],
  ["Invoice volume", formatCurrency(4860000), "Trailing 30 days"],
  ["Funded volume", formatCurrency(4228000), "87% advance utilization"],
  ["Gross fees", formatCurrency(145200), "3.0% carrier avg"],
  ["Atlas net spread", formatCurrency(52700), "1.08% blended spread"],
] as const;

const queueRows = [
  [
    "LD-90322",
    <Link key="carrier" href="/admin/carriers/mountain-line-express" className="font-semibold text-[#0a7c86]">Mountain Line Express</Link>,
    "Blue River Logistics",
    <RiskBadge key="risk" level="medium" />,
    <StatusChip key="status" status="atlas_review" />,
    <Link key="link" href="/admin/loads" className="font-semibold text-[#0a7c86]">Open workbench</Link>,
  ],
  [
    "LD-90441",
    <Link key="carrier" href="/admin/carriers/westbound-freight-group" className="font-semibold text-[#0a7c86]">Westbound Freight Group</Link>,
    "Southline Brokers",
    <RiskBadge key="risk" level="high" />,
    <StatusChip key="status" status="broker_verification_pending" />,
    <Link key="link" href="/admin/loads" className="font-semibold text-[#0a7c86]">Verify broker</Link>,
  ],
  [
    "APP-1189",
    <Link key="carrier" href="/admin/carriers/clearwater-reefer" className="font-semibold text-[#0a7c86]">Clearwater Reefer LLC</Link>,
    "New MC applicant",
    <RiskBadge key="risk" level="medium" />,
    <StatusChip key="status" status="ucc_review" />,
    <Link key="link" href="/admin/applications" className="font-semibold text-[#0a7c86]">Review file</Link>,
  ],
];

const agingRows = [
  ["0-15 days", formatCurrency(1265000), "62 invoices", "Healthy"],
  ["16-30 days", formatCurrency(820000), "34 invoices", "Watch"],
  ["31-45 days", formatCurrency(348000), "16 invoices", "Escalate AR"],
  ["46-60 days", formatCurrency(164000), "7 invoices", "Collections"],
  ["60+ days", formatCurrency(89000), "4 invoices", "Chargeback review"],
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Atlas command center"
        title="Factoring operations, underwriting, risk, and funding in one desk."
        description="Run daily carrier approvals, broker verification, partner routing, pricing spread, payments, reserves, disputes, and compliance holds from a single admin cockpit."
        primaryAction={{ label: "Review loads", href: "/admin/loads" }}
        secondaryAction={{ label: "Export reports", href: "/admin/reports" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, note]) => (
          <StatCard key={label} label={label} value={value} note={note} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card title="Live operations queue">
          <AdminTable columns={["File", "Carrier", "Broker / context", "Risk", "Status", "Action"]} rows={queueRows} />
        </Card>
        <Card title="Today's control room">
          <div className="space-y-3 text-sm text-[#1d2a30]">
            {[
              ["Broker verifications", "14 pending", "Send confirmations before 1 PM cutoff"],
              ["Partner routing", "11 unassigned", "Use capacity and buy-rate engine"],
              ["Missing documents", "23 files", "Prioritize POD, W9, insurance"],
              ["UCC release issues", "4 carriers", "Hold onboarding until resolved"],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{label}</p>
                  <p className="text-[#0a7c86]">{value}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#62737a]">{hint}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Receivables aging">
          <AdminTable columns={["Bucket", "Open AR", "Invoices", "Operating action"]} rows={agingRows} />
        </Card>
        <Card title="Margin and spread controls">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Carrier avg rate", "3.00%", "Front-end customer fee"],
              ["Backend buy-rate", "1.75%", "Weighted partner cost"],
              ["Advance utilization", "90%", "Average on funded files"],
              ["Reserve held", formatCurrency(493000), "Pending broker payment"],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4">
                <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#162026]">{value}</p>
                <p className="mt-1 text-xs text-[#62737a]">{hint}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
