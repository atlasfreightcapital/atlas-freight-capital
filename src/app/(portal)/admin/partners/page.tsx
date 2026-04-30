import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PartnerCreateForm } from "@/components/admin/admin-action-forms";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("funding_partners")
    .select("id, company_name, buy_rate_min, buy_rate_max, max_invoice_amount, supported_states, accepts_new_mc, accepts_active_ucc, avg_approval_hours, status")
    .order("created_at", { ascending: false })
    .limit(12);
  const rows =
    data && data.length > 0
      ? data.map((partner) => [
          <Link key="partner" href={`/admin/partners/${partner.id}`} className="font-semibold text-[#0a7c86]">
            {partner.company_name}
          </Link>,
          `${partner.buy_rate_min ?? 0}% - ${partner.buy_rate_max ?? 0}%`,
          formatCurrency(Number(partner.max_invoice_amount ?? 0)),
          Array.isArray(partner.supported_states) && partner.supported_states.length > 0
            ? `${partner.supported_states.length} states`
            : "Coverage needed",
          `${partner.accepts_new_mc ? "New MC yes" : "New MC no"} / ${partner.accepts_active_ucc ? "UCC yes" : "UCC no"}`,
          partner.avg_approval_hours ? `${partner.avg_approval_hours} hrs` : "No SLA",
          <StatusChip key="status" status={partner.status ?? "reviewing"} />,
        ])
      : [
          [
            <Link key="partner" href="/admin/partners/keystone-capital-desk" className="font-semibold text-[#0a7c86]">
              Keystone Capital Desk
            </Link>,
            "1.50% - 2.15%",
            formatCurrency(50000),
            "22 states",
            "New MC yes",
            "6 hrs",
            <StatusChip key="status" status="approved" />,
          ],
          [
            <Link key="partner" href="/admin/partners/harbor-receivables-group" className="font-semibold text-[#0a7c86]">
              Harbor Receivables Group
            </Link>,
            "1.75% - 2.45%",
            formatCurrency(125000),
            "Nationwide",
            "UCC no",
            "10 hrs",
            <StatusChip key="status" status="reviewing" />,
          ],
          [
            <Link key="partner" href="/admin/partners/summit-freight-finance" className="font-semibold text-[#0a7c86]">
              Summit Freight Finance
            </Link>,
            "1.35% - 1.95%",
            formatCurrency(30000),
            "Midwest",
            "New MC no",
            "4 hrs",
            <StatusChip key="status" status="approved" />,
          ],
        ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Funding partner routing"
        title="Partner capacity, buy-rates, underwriting appetite, and white-label controls."
        description="Route loads by carrier, broker risk, invoice amount, state, partner capacity, rate, approval speed, or manual override while keeping Atlas as the carrier-facing brand."
        primaryAction={{ label: "Open load routing", href: "/admin/loads" }}
        secondaryAction={{ label: "Partner report", href: "/api/admin/reports/partner-volume" }}
      />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Partner capacity board">
          <AdminTable
            columns={["Partner", "Buy-rate", "Max invoice", "Coverage", "Appetite", "Avg approval", "Status"]}
            rows={rows}
          />
        </Card>
        <PartnerCreateForm />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Routing rules", "Carrier-specific routes, broker risk thresholds, invoice caps, supported states, capacity, buy-rate, and approval-speed rules."],
          ["White-label protection", "Carrier-facing portal shows Atlas branding only; assigned_partner_id controls partner visibility and file access."],
          ["Partner notes", "Partners can add private underwriting notes visible only to Atlas and the assigned partner, never the carrier."],
        ].map(([title, body]) => (
          <Card key={title} title={title}>
            <p className="text-sm leading-6 text-[#40515a]">{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
