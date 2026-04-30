import Link from "next/link";
import { BrokerExposureDonut } from "@/components/carrier/broker-exposure-donut";
import { InvoiceStatusTable } from "@/components/carrier/invoice-status-table";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusChip } from "@/components/ui/status-chip";
import { Timeline } from "@/components/ui/timeline";
import { requireCarrierRole } from "@/lib/auth";
import { brokerExposure, getCarrierInvoices, groupCarrierInvoices, invoiceMetrics, resolveCarrierForUser } from "@/lib/carrier-data";
import { formatCurrency } from "@/lib/utils";

export default async function CarrierDashboardPage() {
  const profile = await requireCarrierRole();
  const carrier = await resolveCarrierForUser(profile.userId);
  const invoices = carrier ? await getCarrierInvoices(carrier.id) : [];
  const metrics = invoiceMetrics(invoices);
  const grouped = groupCarrierInvoices(invoices);
  const activeRows = [...grouped.needsAttention, ...grouped.processing, ...grouped.pending].slice(0, 5);

  const stats = [
    { label: "Processing invoices", value: grouped.processing.length.toString(), note: "Paperwork and broker confirmation in progress" },
    { label: "Pending payment", value: grouped.pending.length.toString(), note: "Approved or verified invoices awaiting payment" },
    { label: "Paid invoices", value: grouped.paid.length.toString(), note: "Advances issued or broker payment posted" },
    { label: "Needs attention", value: grouped.needsAttention.length.toString(), note: "Action needed before funding can continue" },
    { label: "Open invoice amount", value: formatCurrency(metrics.openInvoiceAmount), note: "Invoices not yet fully closed" },
    { label: "Estimated next payout", value: formatCurrency(metrics.pendingAdvance), note: "Projected carrier payout" },
    { label: "Reserve balance", value: formatCurrency(metrics.reserveHeld), note: "Held until broker payment clears" },
    { label: "Paid advances", value: formatCurrency(metrics.fundedAmount), note: "Advance payments issued" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#10243d] bg-[#071426] p-6 text-white">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65d8e1]">Carrier workspace</p>
            <h1 className="mt-3 text-3xl font-semibold">Invoice factoring dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c7d4df]">
              Track invoices from submission through review, approval, payment, and reserve release with clear status
              updates and document requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/carrier/loads/new" className="rounded-md bg-[#0a7c86] px-4 py-2 text-sm font-semibold text-white">
              Submit invoice
            </Link>
            <Link href="/carrier/broker-checks" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#162026]">
              Check broker
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} note={stat.note} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card title="Active invoice queue">
          <InvoiceStatusTable
            invoices={activeRows.map((invoice) => ({
              id: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              loadNumber: invoice.loadNumber,
              broker: invoice.broker,
              amount: invoice.amount,
              status: invoice.status,
              submittedAt: invoice.submittedAt,
              expectedPayDate: invoice.expectedPayDate,
            }))}
          />
        </Card>
        <Card title="Broker balance by invoice amount">
          <BrokerExposureDonut exposures={brokerExposure(invoices)} />
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Account and paperwork status">
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip status="approved" />
            <span className="text-sm font-semibold text-[#162026]">{carrier?.legalName ?? "Carrier account"}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#40515a]">
            Your Atlas carrier profile is active. Keep insurance, W9, authority, and banking documents current to help
            prevent funding delays.
          </p>
          <div className="mt-4 grid gap-2 text-sm text-[#40515a]">
            <p>Required for each invoice: signed BOL/POD, invoice, and rate confirmation.</p>
            <p>Helpful when applicable: lumper receipts, detention proof, and broker email approval.</p>
          </div>
        </Card>
        <Card title="Typical invoice flow">
          <Timeline
            events={[
              { label: "Invoice submitted", status: "processing", timestamp: "Step 1" },
              { label: "Paperwork reviewed", status: "processing", timestamp: "Step 2" },
              { label: "Broker confirmation", status: "pending", timestamp: "Step 3" },
              { label: "Payment issued", status: "paid", timestamp: "Step 4" },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
