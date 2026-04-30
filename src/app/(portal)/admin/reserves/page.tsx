import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ReserveRecordForm } from "@/components/admin/admin-action-forms";
import { AdminTable } from "@/components/admin/admin-table";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const reserveRows = [
  ["Mountain Line Express", "INV-448201", formatCurrency(420), <StatusChip key="status" status="submitted" />, "Held until broker payment"],
  ["Clearwater Reefer LLC", "INV-447921", formatCurrency(610), <StatusChip key="status" status="approved" />, "Pending release"],
  ["Westbound Freight Group", "INV-447800", formatCurrency(780), <StatusChip key="status" status="dispute" />, "May apply to chargeback"],
];

export default async function AdminReservesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reserves")
    .select("id, amount, status, release_date, notes")
    .order("created_at", { ascending: false })
    .limit(12);
  const rows =
    data && data.length > 0
      ? data.map((reserve) => [
          reserve.id.slice(0, 8),
          reserve.release_date ?? "Release date pending",
          formatCurrency(Number(reserve.amount ?? 0)),
          <StatusChip key="status" status={reserve.status} />,
          reserve.notes ?? "Ledger action",
        ])
      : reserveRows;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Reserve ledger"
        title="Carrier reserve balances, release workflow, fees, and chargeback offsets."
        description="Manage reserve held by invoice, release eligibility after broker payment, fee offsets, chargeback applications, and carrier-visible reserve history."
        primaryAction={{ label: "Post payment", href: "/admin/payments" }}
        secondaryAction={{ label: "Reserve CSV", href: "/api/admin/reports/reserves" }}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Reserve positions">
          <AdminTable columns={["Carrier", "Invoice", "Amount", "Status", "Rule"]} rows={rows} />
        </Card>
        <ReserveRecordForm />
      </div>
      <div className="grid gap-5 lg:grid-cols-4">
        {[
          ["Current reserve", formatCurrency(493000), "Across active carriers"],
          ["Pending release", formatCurrency(88000), "Broker payment confirmed"],
          ["Applied to fees", formatCurrency(17400), "Month to date"],
          ["Chargeback exposure", formatCurrency(32200), "Open risk"],
        ].map(([label, value, note]) => (
          <Card key={label}>
            <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#162026]">{value}</p>
            <p className="mt-2 text-sm text-[#40515a]">{note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
