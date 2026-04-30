import { InvoiceStatusTable } from "@/components/carrier/invoice-status-table";
import { Card } from "@/components/ui/card";
import { requireCarrierRole } from "@/lib/auth";
import { getCarrierInvoices, groupCarrierInvoices, resolveCarrierForUser, type CarrierInvoiceRecord } from "@/lib/carrier-data";

function invoiceRows(invoices: CarrierInvoiceRecord[]) {
  return invoices.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    loadNumber: invoice.loadNumber,
    broker: invoice.broker,
    amount: invoice.amount,
    status: invoice.status,
    submittedAt: invoice.submittedAt,
    expectedPayDate: invoice.expectedPayDate,
  }));
}

function InvoiceSection({
  title,
  description,
  invoices,
}: {
  title: string;
  description: string;
  invoices: CarrierInvoiceRecord[];
}) {
  return (
    <Card title={`${title} (${invoices.length})`}>
      <p className="mb-4 text-sm leading-6 text-[#40515a]">{description}</p>
      {invoices.length > 0 ? (
        <InvoiceStatusTable invoices={invoiceRows(invoices)} />
      ) : (
        <div className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-5 text-sm text-[#40515a]">
          No invoices in this stage right now.
        </div>
      )}
    </Card>
  );
}

export default async function CarrierInvoicesPage() {
  const profile = await requireCarrierRole();
  const carrier = await resolveCarrierForUser(profile.userId);
  const invoices = carrier ? await getCarrierInvoices(carrier.id) : [];
  const grouped = groupCarrierInvoices(invoices);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#10243d] bg-[#071426] p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65d8e1]">Invoice center</p>
        <h1 className="mt-3 text-3xl font-semibold">Invoice activity</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c7d4df]">
          Review every invoice by stage. Open any invoice to see broker details, paperwork status, estimated payout,
          reserve, timeline, and payment information.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Processing", grouped.processing.length, "Review in progress"],
          ["Pending", grouped.pending.length, "Waiting on payment step"],
          ["Paid", grouped.paid.length, "Payment completed"],
          ["Needs Attention", grouped.needsAttention.length, "Action required"],
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#162026]">{value}</p>
            <p className="mt-1 text-xs text-[#62737a]">{note}</p>
          </div>
        ))}
      </div>

      <InvoiceSection
        title="Needs Attention"
        description="Invoices that need paperwork, clarification, or another action before Atlas can continue."
        invoices={grouped.needsAttention}
      />
      <InvoiceSection
        title="Processing"
        description="Invoices currently being reviewed, verified with the broker, or prepared for approval."
        invoices={grouped.processing}
      />
      <InvoiceSection
        title="Pending"
        description="Invoices that have been verified or approved and are waiting for the next payment step."
        invoices={grouped.pending}
      />
      <InvoiceSection
        title="Paid"
        description="Invoices where the advance has been issued or broker payment has been posted."
        invoices={grouped.paid}
      />
    </div>
  );
}
