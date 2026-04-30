import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PaymentRecordForm } from "@/components/admin/admin-action-forms";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const paymentRows = [
  ["INV-448201", "Blue River Logistics", "Expected May 14", formatCurrency(4200), <StatusChip key="status" status="submitted" />, "ACH pending"],
  ["INV-447921", "Northstar Retail Freight", "Received Apr 29", formatCurrency(6100), <StatusChip key="status" status="funded" />, "Apply reserve release"],
  ["INV-447800", "Southline Brokers", "Past due", formatCurrency(7800), <StatusChip key="status" status="dispute" />, "Short-pay investigation"],
];

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("id, expected_payment_date, actual_payment_date, payment_amount, status, payment_reference")
    .order("created_at", { ascending: false })
    .limit(12);
  const rows =
    data && data.length > 0
      ? data.map((payment) => [
          payment.id.slice(0, 8),
          "Broker file",
          payment.actual_payment_date
            ? `Received ${payment.actual_payment_date}`
            : payment.expected_payment_date
              ? `Expected ${payment.expected_payment_date}`
              : "Date needed",
          formatCurrency(Number(payment.payment_amount ?? 0)),
          <StatusChip key="status" status={payment.status} />,
          payment.payment_reference ?? "Reconcile",
        ])
      : paymentRows;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Receivables and cash application"
        title="Track broker payments, short pays, disputes, and reserve releases."
        description="Post expected and actual broker payments, reconcile short pays, close invoices, trigger reserve releases, and keep AR aging accurate."
        primaryAction={{ label: "Reserve ledger", href: "/admin/reserves" }}
        secondaryAction={{ label: "Aging CSV", href: "/api/admin/reports/broker-aging" }}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Payment and AR queue">
          <AdminTable columns={["Invoice", "Broker", "Due / received", "Amount", "Status", "Action"]} rows={rows} />
        </Card>
        <PaymentRecordForm />
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {[
          ["0-15", formatCurrency(1265000)],
          ["16-30", formatCurrency(820000)],
          ["31-45", formatCurrency(348000)],
          ["46-60", formatCurrency(164000)],
          ["60+", formatCurrency(89000)],
        ].map(([bucket, amount]) => (
          <Card key={bucket}>
            <p className="text-xs uppercase tracking-wide text-[#62737a]">{bucket} days</p>
            <p className="mt-2 text-xl font-semibold text-[#162026]">{amount}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
