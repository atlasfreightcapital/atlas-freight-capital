import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

const auditRows = [
  ["10:35 AM", "atlas_admin", "load_status_updated", "LD-90322", "Atlas review -> Broker verification pending"],
  ["10:21 AM", "atlas_admin", "pricing_saved", "LD-90477", "Carrier rate 3.00%, backend buy-rate 1.75%"],
  ["9:58 AM", "atlas_underwriter", "compliance_review_recorded", "APP-1188", "Hold: release letter required"],
  ["9:42 AM", "atlas_operations", "broker_upserted", "Southline Brokers", "Risk set high, manual review required"],
  ["9:10 AM", "atlas_admin", "partner_assigned", "LD-90477", "Manual route to Keystone Capital Desk"],
];

export default async function AdminAuditPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("created_at, role, action, entity_type, entity_id, metadata")
    .order("created_at", { ascending: false })
    .limit(20);
  const rows =
    data && data.length > 0
      ? data.map((entry) => [
          new Date(entry.created_at).toLocaleString(),
          entry.role ?? "system",
          entry.action,
          entry.entity_id ?? entry.entity_type ?? "record",
          JSON.stringify(entry.metadata ?? {}),
        ])
      : auditRows;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Audit trail"
        title="Operational history for status changes, pricing, routing, documents, and compliance."
        description="Every important admin action should leave a searchable record with user, role, entity, timestamp, and metadata so Atlas can reconstruct decisions and satisfy partner/compliance reviews."
        primaryAction={{ label: "Reports", href: "/admin/reports" }}
        secondaryAction={{ label: "Risk engine", href: "/admin/risk" }}
      />
      <Card title="Recent activity">
        <AdminTable columns={["Time", "Role", "Action", "Entity", "Metadata"]} rows={rows} />
      </Card>
    </div>
  );
}
