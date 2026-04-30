import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Timeline } from "@/components/ui/timeline";
import { requireCarrierRole } from "@/lib/auth";
import { carrierInvoiceStage, carrierInvoiceSummary, getCarrierInvoices, resolveCarrierForUser } from "@/lib/carrier-data";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export default async function CarrierInvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const profile = await requireCarrierRole();
  const carrier = await resolveCarrierForUser(profile.userId);
  const invoices = carrier ? await getCarrierInvoices(carrier.id) : [];
  const invoice = invoices.find((item) => item.id === id);

  if (!invoice) notFound();

  const stage = carrierInvoiceStage(invoice.status);
  const stageVariant =
    stage.key === "paid"
      ? "success"
      : stage.key === "needs_attention"
        ? "warning"
        : stage.key === "pending"
          ? "info"
          : "default";

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#10243d] bg-[#071426] p-6 text-white">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65d8e1]">Invoice detail</p>
            <h1 className="mt-3 text-3xl font-semibold">{invoice.invoiceNumber}</h1>
            <p className="mt-3 text-sm leading-6 text-[#c7d4df]">
              {invoice.loadNumber} | {invoice.broker} | {invoice.origin} to {invoice.destination}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant={stageVariant}>{stage.label}</Badge>
              <span className="text-sm text-[#c7d4df]">{stage.description}</span>
            </div>
          </div>
          <Link href="/carrier/invoices" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#162026]">
            Back to invoices
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Invoice amount" value={formatCurrency(invoice.amount)} />
        <StatCard label="Advance amount" value={formatCurrency(invoice.advanceAmount)} />
        <StatCard label="Reserve held" value={formatCurrency(invoice.reserveAmount)} />
        <StatCard label="Payout estimate" value={formatCurrency(invoice.netPayoutEstimate)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card title="Invoice summary">
          <dl className="grid gap-3 text-sm text-[#1d2a30]">
            {carrierInvoiceSummary(invoice).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-b border-[#e4ebe8] pb-2">
                <dt className="text-[#62737a]">{label}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 border-b border-[#e4ebe8] pb-2">
              <dt className="text-[#62737a]">Current stage</dt>
              <dd>
                <Badge variant={stageVariant}>{stage.label}</Badge>
              </dd>
            </div>
          </dl>
        </Card>
        <Card title="Broker and lane">
          <div className="grid gap-3 text-sm text-[#1d2a30] md:grid-cols-2">
            {[
              ["Broker", invoice.broker],
              ["Broker email", invoice.brokerEmail ?? "Pending"],
              ["Pickup", invoice.pickupDate],
              ["Delivery", invoice.deliveryDate],
              ["Origin", invoice.origin],
              ["Destination", invoice.destination],
              ["Commodity", invoice.commodity],
              ["Expected broker payment", invoice.expectedPayDate],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4">
                <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
                <p className="mt-2 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Paperwork checklist">
          <div className="space-y-3 text-sm">
            {[
              ["Rate confirmation", "Uploaded"],
              ["Invoice", "Uploaded"],
              ["BOL / POD", invoice.documentStatus],
              ["Broker confirmation", stage.key === "paid" || stage.key === "pending" ? "Completed" : "In progress"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-3">
                <span className="font-semibold text-[#162026]">{label}</span>
                <span className="text-[#40515a]">{status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Invoice timeline">
          <Timeline
            events={[
              { label: "Invoice submitted", status: "processing", timestamp: invoice.submittedAt },
              {
                label: "Paperwork review",
                status: stage.key === "needs_attention" ? "needs_attention" : "processing",
                timestamp: invoice.documentStatus,
              },
              {
                label: "Broker confirmation",
                status: stage.key === "processing" ? "processing" : "pending",
                timestamp: stage.key === "processing" ? "In progress" : "Completed",
              },
              { label: "Payment status", status: stage.key, timestamp: stage.description },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
