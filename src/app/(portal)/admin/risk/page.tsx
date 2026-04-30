import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatusChip } from "@/components/ui/status-chip";

const riskRows = [
  ["Duplicate invoice", "INV-448201", "Invoice number seen within 30 days", <RiskBadge key="risk" level="high" />, <StatusChip key="status" status="reviewing" />],
  ["Broker email domain", "LD-90441", "Free email used for broker confirmation", <RiskBadge key="risk" level="medium" />, <StatusChip key="status" status="broker_verification_pending" />],
  ["Missing POD", "LD-90488", "BOL uploaded but POD not signed", <RiskBadge key="risk" level="medium" />, <StatusChip key="status" status="need_documents" />],
  ["Manual fraud flag", "APP-1188", "Owner ID and EIN mismatch", <RiskBadge key="risk" level="high" />, <StatusChip key="status" status="reviewing" />],
];

export default function AdminRiskPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Risk engine"
        title="Carrier, broker, document, fraud, and funding risk controls."
        description="Score files from 0-100 using new MC status, active UCC, document quality, invoice amount, broker risk, duplicate detection, disputes, chargebacks, missing POD, and broker verification status."
        primaryAction={{ label: "Broker controls", href: "/admin/brokers" }}
        secondaryAction={{ label: "Compliance holds", href: "/admin/compliance" }}
      />
      <Card title="Risk and fraud exceptions">
        <AdminTable columns={["Signal", "Entity", "Why it matters", "Severity", "Status"]} rows={riskRows} />
      </Card>
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Scoring inputs", "New MC, active UCC, broker risk, invoice size, missing POD, duplicate invoice/load number, and prior dispute behavior."],
          ["Override governance", "Admins can override risk with a reason. All overrides should be preserved in audit logs for compliance review."],
          ["Fraud prevention", "Duplicate invoice detection, duplicate load number checks, same-file upload warnings, email-domain warnings, and manual fraud flags."],
        ].map(([title, body]) => (
          <Card key={title} title={title}>
            <p className="text-sm leading-6 text-[#40515a]">{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
