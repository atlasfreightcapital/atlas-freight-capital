import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { DocumentVault } from "@/components/admin/document-vault";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusChip } from "@/components/ui/status-chip";
import { demoPartners, type DemoDocument } from "@/data/admin-demo";
import { isUuid } from "@/lib/records";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminPartnerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  let partner = demoPartners.find((item) => item.id === id);

  if (isUuid(id)) {
    const { data } = await supabase
      .from("funding_partners")
      .select("id, company_name, contact_name, email, phone, status, buy_rate_min, buy_rate_max, max_invoice_amount, supported_states, accepts_new_mc, accepts_active_ucc, avg_approval_hours")
      .eq("id", id)
      .single();

    if (data) {
      partner = {
        id: data.id,
        name: data.company_name,
        contact: data.contact_name ?? "Contact needed",
        email: data.email ?? "Missing email",
        phone: data.phone ?? "Missing phone",
        status: data.status ?? "active",
        buyRate: `${data.buy_rate_min ?? 0}% - ${data.buy_rate_max ?? 0}%`,
        maxInvoice: Number(data.max_invoice_amount ?? 0),
        states: Array.isArray(data.supported_states) ? data.supported_states.join(", ") : "Coverage needed",
        newMc: Boolean(data.accepts_new_mc),
        activeUcc: Boolean(data.accepts_active_ucc),
        approvalHours: data.avg_approval_hours ?? 0,
        notes: "Live partner record from Supabase.",
      };
    }
  }

  if (!partner) notFound();

  const documents: DemoDocument[] = [
    { id: "master-agreement", name: "Partner Master Services Agreement.pdf", type: "Agreement", status: "accepted", uploadedAt: "Apr 20, 2026" },
    { id: "wiring", name: "Partner Funding Instructions.pdf", type: "Funding instructions", status: "accepted", uploadedAt: "Apr 21, 2026" },
    { id: "sla", name: "Underwriting SLA.pdf", type: "SLA", status: "uploaded", uploadedAt: "Apr 24, 2026" },
  ];

  const assignedRows = [
    ["LD-90477", "Clearwater Reefer LLC", "Delta Produce Network", formatCurrency(6150), <StatusChip key="s1" status="partner_review" />],
    ["LD-90211", "Mountain Line Express", "Blue River Logistics", formatCurrency(4200), <StatusChip key="s2" status="funded" />],
    ["LD-90088", "Iron Ridge Transport", "Northstar Retail Freight", formatCurrency(3850), <StatusChip key="s3" status="broker_paid" />],
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Funding partner profile"
        title={partner.name}
        description={`${partner.contact} · ${partner.buyRate} buy-rate · Max invoice ${formatCurrency(partner.maxInvoice)} · ${partner.states}`}
        primaryAction={{ label: "Back to partners", href: "/admin/partners" }}
        secondaryAction={{ label: "Route loads", href: "/admin/loads" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Max invoice" value={formatCurrency(partner.maxInvoice)} note="Per submission" />
        <StatCard label="Buy-rate" value={partner.buyRate} note="Backend cost" />
        <StatCard label="Approval speed" value={`${partner.approvalHours} hrs`} note="Average SLA" />
        <StatCard label="Status" value={partner.status} note="Routing availability" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card title="Partner controls">
          <dl className="space-y-3 text-sm text-[#1d2a30]">
            {[
              ["Email", partner.email],
              ["Phone", partner.phone],
              ["Accepts new MC", partner.newMc ? "Yes" : "No"],
              ["Accepts active UCC", partner.activeUcc ? "Yes" : "No"],
              ["Supported states", partner.states],
              ["Carrier visibility", "Hidden by default"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 border-b border-[#e4ebe8] pb-2">
                <dt className="text-[#62737a]">{label}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-lg bg-[#eef8f7] p-3 text-sm leading-6 text-[#0a5961]">{partner.notes}</p>
        </Card>
        <Card title="Private partner documents">
          <DocumentVault documents={documents} />
        </Card>
      </div>

      <Card title="Assigned submissions">
        <AdminTable columns={["Load", "Carrier", "Broker", "Invoice amount", "Status"]} rows={assignedRows} />
      </Card>
    </div>
  );
}
