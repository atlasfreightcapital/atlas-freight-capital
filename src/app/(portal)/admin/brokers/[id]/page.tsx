import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { BrokerBanButton } from "@/components/admin/broker-ban-button";
import { DocumentVault } from "@/components/admin/document-vault";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatCard } from "@/components/ui/stat-card";
import { StatusChip } from "@/components/ui/status-chip";
import { demoBrokers, type DemoDocument } from "@/data/admin-demo";
import { isUuid } from "@/lib/records";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { RiskLevel } from "@/types/domain";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminBrokerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  let broker = demoBrokers.find((item) => item.id === id);
  let documents: DemoDocument[] = [
    { id: "broker-verification", name: "Broker Verification Thread.pdf", type: "Verification", status: "uploaded", uploadedAt: "Apr 28, 2026" },
    { id: "payment-instructions", name: "Payment Assignment Confirmation.pdf", type: "Payment instructions", status: "accepted", uploadedAt: "Apr 28, 2026" },
    { id: "rate-confirmation", name: "Related Rate Confirmation.pdf", type: "Rate confirmation", status: "sent_to_partner", uploadedAt: "Apr 29, 2026" },
  ];

  if (isUuid(id)) {
    const { data } = await supabase
      .from("brokers")
      .select(
        "id, broker_name, broker_mc, broker_dot, email, phone, address, payment_terms, average_days_to_pay, credit_score_internal, credit_limit, total_invoices_submitted, total_paid, disputes_count, chargebacks_count, risk_level, notes",
      )
      .eq("id", id)
      .single();

    if (data) {
      broker = {
        id: data.id,
        name: data.broker_name,
        mc: data.broker_mc ?? "Missing MC",
        dot: data.broker_dot ?? "Missing DOT",
        email: data.email ?? "Missing email",
        phone: data.phone ?? "Missing phone",
        address: data.address ?? "Missing address",
        terms: data.payment_terms ?? "Terms needed",
        avgDays: data.average_days_to_pay ?? 0,
        score: data.credit_score_internal ?? 50,
        limit: Number(data.credit_limit ?? 0),
        totalInvoices: data.total_invoices_submitted ?? 0,
        totalPaid: Number(data.total_paid ?? 0),
        disputes: data.disputes_count ?? 0,
        chargebacks: data.chargebacks_count ?? 0,
        risk: (data.risk_level ?? "medium") as RiskLevel,
        notes: data.notes ?? "Live broker record from Supabase.",
      };
    }

    const { data: loadData } = await supabase.from("load_submissions").select("id").eq("broker_id", id).limit(20);
    const loadIds = loadData?.map((load) => load.id) ?? [];
    if (loadIds.length > 0) {
      const { data: docData } = await supabase
        .from("load_documents")
        .select("id, document_type, file_name, storage_bucket, storage_path, status, created_at")
        .in("load_submission_id", loadIds)
        .order("created_at", { ascending: false })
        .limit(12);

      if (docData?.length) {
        documents = docData.map((document) => ({
          id: document.id,
          name: document.file_name ?? document.document_type,
          type: document.document_type,
          status: document.status,
          uploadedAt: new Date(document.created_at).toLocaleDateString(),
          bucket: document.storage_bucket,
          path: document.storage_path,
        }));
      }
    }
  }

  if (!broker) notFound();

  const loadRows = [
    ["LD-90322", "Mountain Line Express", "INV-448201", formatCurrency(4200), <StatusChip key="s1" status="atlas_review" />],
    ["LD-90288", "Clearwater Reefer LLC", "INV-447911", formatCurrency(6100), <StatusChip key="s2" status="funded" />],
    ["LD-90172", "Iron Ridge Transport", "INV-447400", formatCurrency(3850), <StatusChip key="s3" status="broker_paid" />],
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Broker profile"
        title={broker.name}
        description={`MC ${broker.mc} · ${broker.terms} · Average ${broker.avgDays} days to pay · ${broker.address}`}
        primaryAction={{ label: "Back to brokers", href: "/admin/brokers" }}
        secondaryAction={{ label: "Broker aging CSV", href: "/api/admin/reports/broker-aging" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Internal score" value={broker.score.toString()} note="0-100 broker risk" />
        <StatCard label="Credit limit" value={formatCurrency(broker.limit)} note="Max open exposure" />
        <StatCard label="Total paid" value={formatCurrency(broker.totalPaid)} note={`${broker.totalInvoices} invoices`} />
        <StatCard label="Disputes / chargebacks" value={`${broker.disputes} / ${broker.chargebacks}`} note="Lifetime tracked" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card title="Risk and credit controls">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4">
              <span className="text-sm font-semibold text-[#40515a]">Current risk</span>
              <RiskBadge level={broker.risk} />
            </div>
            <dl className="space-y-3 text-sm text-[#1d2a30]">
              {[
                ["Email", broker.email],
                ["Phone", broker.phone],
                ["DOT", broker.dot],
                ["Payment terms", broker.terms],
                ["Average pay", `${broker.avgDays} days`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-b border-[#e4ebe8] pb-2">
                  <dt className="text-[#62737a]">{label}</dt>
                  <dd className="text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <BrokerBanButton brokerId={broker.id} brokerName={broker.name} enabled={isUuid(broker.id)} />
          </div>
        </Card>

        <Card title="Broker intelligence">
          <p className="rounded-lg bg-[#eef8f7] p-4 text-sm leading-6 text-[#0a5961]">{broker.notes}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Verification rule", broker.risk === "high" || broker.risk === "blocked" ? "Manual verification required" : "Standard verification"],
              ["Carrier-visible result", broker.risk === "blocked" ? "Not approved for factoring" : broker.risk === "high" ? "Use caution" : "Approved"],
              ["Payment instruction", "Confirm payment assignment before funding"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4">
                <p className="text-xs uppercase tracking-wide text-[#62737a]">{label}</p>
                <p className="mt-2 text-sm font-semibold text-[#162026]">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Broker load history">
        <AdminTable columns={["Load", "Carrier", "Invoice", "Amount", "Status"]} rows={loadRows} />
      </Card>

      <Card title="Related load and verification documents">
        <DocumentVault documents={documents} />
      </Card>
    </div>
  );
}
