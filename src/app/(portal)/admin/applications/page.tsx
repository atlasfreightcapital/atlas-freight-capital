import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { ApplicationStatusForm } from "@/components/admin/admin-action-forms";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatusChip } from "@/components/ui/status-chip";
import { createClient } from "@/lib/supabase/server";

const applicationRows = [
  ["APP-1187", "Mountain Line Express LLC", "MC-884210", "8 trucks", <RiskBadge key="risk" level="medium" />, <StatusChip key="status" status="under_atlas_review" />, "Insurance expires in 21 days"],
  ["APP-1188", "Westbound Freight Group", "MC-772099", "2 trucks", <RiskBadge key="risk" level="high" />, <StatusChip key="status" status="more_info_needed" />, "Release letter and voided check needed"],
  ["APP-1189", "Iron Ridge Transport", "MC-991470", "1 truck", <RiskBadge key="risk" level="medium" />, <StatusChip key="status" status="ucc_review" />, "Existing UCC found"],
  ["APP-1190", "Clearwater Reefer LLC", "MC-551892", "12 trucks", <RiskBadge key="risk" level="low" />, <StatusChip key="status" status="partner_review" />, "Ready for backend partner"],
];

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("carrier_applications")
    .select("id, legal_business_name, mc_number, number_of_trucks, active_ucc, status, notes")
    .order("created_at", { ascending: false })
    .limit(12);
  const rows =
    data && data.length > 0
      ? data.map((application) => [
          application.id.slice(0, 8),
          application.legal_business_name,
          application.mc_number ?? "Missing MC",
          application.number_of_trucks ? `${application.number_of_trucks} trucks` : "Fleet size needed",
          <RiskBadge key="risk" level={application.active_ucc === "yes" ? "high" : "medium"} />,
          <StatusChip key="status" status={application.status} />,
          application.notes ?? "Open carrier file",
        ])
      : applicationRows;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Carrier onboarding"
        title="Application review, compliance, UCC, and onboarding decisions."
        description="Move carriers through Atlas review, compliance review, release letter handling, partner review, approval, and final onboarding without exposing backend funding partners to the carrier."
        primaryAction={{ label: "Open compliance", href: "/admin/compliance" }}
        secondaryAction={{ label: "Review partners", href: "/admin/partners" }}
      />
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="Application pipeline">
          <AdminTable
            columns={["ID", "Carrier", "MC", "Fleet", "Risk", "Status", "Next action"]}
            rows={rows}
          />
        </Card>
        <ApplicationStatusForm />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Documents", "W9, MC authority, COI, articles, owner ID, voided check, release letters, and optional factoring agreements are tracked as private files."],
          ["UCC control", "Applications with active UCC are automatically treated as release-sensitive and can be held before onboarding or partner review."],
          ["White-label flow", "Carrier sees Atlas status only. Partner names, buy-rates, and routing logic stay hidden unless Super Admin settings allow visibility."],
        ].map(([title, body]) => (
          <Card key={title} title={title}>
            <p className="text-sm leading-6 text-[#40515a]">{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
