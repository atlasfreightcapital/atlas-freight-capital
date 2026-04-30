import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrokerRiskForm } from "@/components/admin/admin-action-forms";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function AdminBrokersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brokers")
    .select("id, broker_name, broker_mc, broker_dot, payment_terms, average_days_to_pay, credit_score_internal, credit_limit, risk_level, notes")
    .order("updated_at", { ascending: false })
    .limit(12);
  const rows =
    data && data.length > 0
      ? data.map((broker) => [
          <Link key="broker" href={`/admin/brokers/${broker.id}`} className="font-semibold text-[#0a7c86]">
            {broker.broker_name}
          </Link>,
          broker.broker_mc ?? broker.broker_dot ?? "Missing ID",
          broker.payment_terms ?? "Terms needed",
          broker.average_days_to_pay ? `${broker.average_days_to_pay} days` : "No history",
          broker.credit_score_internal?.toString() ?? "Unscored",
          formatCurrency(Number(broker.credit_limit ?? 0)),
          <RiskBadge key="risk" level={(broker.risk_level ?? "medium") as "low" | "medium" | "high" | "blocked"} />,
          broker.notes ?? "Review broker file",
        ])
      : [
          [
            <Link key="broker" href="/admin/brokers/blue-river-logistics" className="font-semibold text-[#0a7c86]">
              Blue River Logistics
            </Link>,
            "MC-443991",
            "Net 30",
            "18 days",
            "82",
            formatCurrency(250000),
            <RiskBadge key="risk" level="low" />,
            "Auto-approve under $45k",
          ],
          [
            <Link key="broker" href="/admin/brokers/southline-brokers" className="font-semibold text-[#0a7c86]">
              Southline Brokers
            </Link>,
            "MC-998832",
            "Net 45",
            "48 days",
            "41",
            formatCurrency(75000),
            <RiskBadge key="risk" level="high" />,
            "Manual review before approval",
          ],
          [
            <Link key="broker" href="/admin/brokers/delta-produce-network" className="font-semibold text-[#0a7c86]">
              Delta Produce Network
            </Link>,
            "DOT-78122",
            "Net 21",
            "22 days",
            "76",
            formatCurrency(185000),
            <RiskBadge key="risk" level="low" />,
            "Reefer claims watch",
          ],
        ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Broker credit desk"
        title="Broker database, credit limits, payment behavior, and block controls."
        description="Control which brokers can be factored, how much Atlas can advance against them, and when a load requires broker verification, caution, or a hard decline."
        primaryAction={{ label: "Open load queue", href: "/admin/loads" }}
        secondaryAction={{ label: "Export aging", href: "/api/admin/reports/broker-aging" }}
      />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Broker risk portfolio">
          <AdminTable
            columns={["Broker", "MC / DOT", "Terms", "Avg pay", "Score", "Limit", "Risk", "Rule"]}
            rows={rows}
          />
        </Card>
        <BrokerRiskForm />
      </div>
      <div className="grid gap-5 lg:grid-cols-4">
        {[
          ["Credit requests", "29", "Carrier broker checks awaiting Atlas decision"],
          ["Blocked brokers", "8", "Do not factor until Super Admin override"],
          ["Short pays", "6", "Open AR deductions needing ops follow-up"],
          ["Disputes", "5", "Broker/carrier service issues under review"],
        ].map(([label, value, note]) => (
          <Card key={label}>
            <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#162026]">{value}</p>
            <p className="mt-2 text-sm text-[#40515a]">{note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
