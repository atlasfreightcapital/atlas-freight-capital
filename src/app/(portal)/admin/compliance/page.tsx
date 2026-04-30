import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ComplianceReviewForm } from "@/components/admin/admin-action-forms";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";

const complianceRows = [
  ["Mountain Line Express", "Insurance", "COI expires soon", <StatusChip key="status" status="need_documents" />, "Request updated certificate"],
  ["Westbound Freight Group", "UCC", "Existing factor lien", <StatusChip key="status" status="reviewing" />, "Hold until release letter"],
  ["Iron Ridge Transport", "Identity", "Owner ID mismatch", <StatusChip key="status" status="reviewing" />, "Manual verification"],
  ["Clearwater Reefer LLC", "Authority", "MC active and insurance clear", <StatusChip key="status" status="approved" />, "Clear to onboard"],
];

export default function AdminCompliancePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Compliance center"
        title="Document control, UCC release tracking, fraud flags, and carrier holds."
        description="Review required carrier documents, monitor expiring insurance, handle release letters, record identity/fraud concerns, and stop risky carriers before funding."
        primaryAction={{ label: "Application queue", href: "/admin/applications" }}
        secondaryAction={{ label: "Risk engine", href: "/admin/risk" }}
      />
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="Compliance exceptions">
          <AdminTable columns={["Carrier", "Area", "Issue", "Status", "Required action"]} rows={complianceRows} />
        </Card>
        <ComplianceReviewForm />
      </div>
      <div className="grid gap-5 lg:grid-cols-4">
        {[
          ["Missing W9", "11 files"],
          ["Insurance expiring", "7 carriers"],
          ["UCC release needed", "4 carriers"],
          ["Fraud flags", "3 open"],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#162026]">{value}</p>
            <p className="mt-2 text-sm text-[#40515a]">Action required before approval or funding.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
