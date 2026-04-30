import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";

const reports = [
  ["Carrier volume report", "/api/admin/reports/carrier-volume", "Monthly carrier submissions, funded amount, fees, and reserve balance."],
  ["Partner volume report", "/api/admin/reports/partner-volume", "Assigned loads, approval speed, buy-rate, funded amount, and rejection ratio."],
  ["Broker aging report", "/api/admin/reports/broker-aging", "Open AR by broker, aging bucket, short pay, dispute, and collection status."],
  ["Revenue/spread report", "/api/admin/reports/revenue-spread", "Gross fee, backend cost, Atlas net revenue, and blended spread by load."],
  ["Funded loads report", "/api/admin/reports/funded-loads", "All funded submissions with advance, reserve, partner, and funding date."],
  ["Rejected loads report", "/api/admin/reports/rejected-loads", "Declines by carrier, broker, partner, document issue, or risk reason."],
  ["Dispute report", "/api/admin/reports/disputes", "Open disputes, aging, short pay exposure, and owner assignments."],
  ["Chargeback report", "/api/admin/reports/chargebacks", "Carrier chargeback exposure, reserve offsets, and unrecovered balances."],
  ["Reserve report", "/api/admin/reports/reserves", "Held, released, applied-to-fee, pending release, and chargeback reserve movements."],
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Executive reporting"
        title="CSV-ready reporting for volume, AR, spread, reserves, and risk."
        description="Export finance and operations reports for daily reviews, partner reconciliation, broker aging, management meetings, and investor-level revenue visibility."
        primaryAction={{ label: "Revenue spread CSV", href: "/api/admin/reports/revenue-spread" }}
        secondaryAction={{ label: "Broker aging CSV", href: "/api/admin/reports/broker-aging" }}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map(([report, href, description]) => (
          <Card key={href} className="flex min-h-44 flex-col justify-between">
            <div>
              <p className="text-base font-semibold text-[#162026]">{report}</p>
              <p className="mt-3 text-sm leading-6 text-[#40515a]">{description}</p>
            </div>
            <a
              href={href}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-[#0a7c86] px-4 text-sm font-semibold text-white transition hover:bg-[#08666e]"
            >
              Export CSV
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
