import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { DocumentVault } from "@/components/admin/document-vault";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatCard } from "@/components/ui/stat-card";
import { StatusChip } from "@/components/ui/status-chip";
import { demoCarrierDocuments, demoCarrierLoads, demoCarriers, type DemoDocument } from "@/data/admin-demo";
import { isUuid } from "@/lib/records";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { RiskLevel } from "@/types/domain";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminCarrierProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let carrier = demoCarriers.find((item) => item.id === id);
  let documents: DemoDocument[] = demoCarrierDocuments[id] ?? [];
  let loadRows =
    demoCarrierLoads[id]?.map((load) => [
      load.id,
      load.invoice,
      load.broker,
      formatCurrency(load.amount),
      <RiskBadge key="risk" level={load.risk} />,
      <StatusChip key="status" status={load.status} />,
    ]) ?? [];

  if (isUuid(id)) {
    const { data } = await supabase
      .from("carriers")
      .select(
        "id, legal_name, dba_name, mc_number, dot_number, ein, phone, email, address, entity_type, state, years_in_business, truck_count, estimated_monthly_volume, current_factor, active_ucc, status, risk_score, risk_level",
      )
      .eq("id", id)
      .single();

    if (data) {
      carrier = {
        id: data.id,
        legalName: data.legal_name,
        owner: "Carrier owner",
        email: data.email ?? "Missing email",
        phone: data.phone ?? "Missing phone",
        mc: data.mc_number ?? "Missing MC",
        dot: data.dot_number ?? "Missing DOT",
        ein: data.ein ?? "Missing EIN",
        address: data.address ?? "Missing address",
        entityType: data.entity_type ?? "Entity needed",
        state: data.state ?? "State needed",
        years: data.years_in_business?.toString() ?? "0",
        trucks: data.truck_count?.toString() ?? "0",
        trailerTypes: "Not captured",
        monthlyVolume: Number(data.estimated_monthly_volume ?? 0),
        factoringVolume: Number(data.estimated_monthly_volume ?? 0),
        currentFactor: data.current_factor ?? "None",
        activeUcc: Boolean(data.active_ucc),
        status: data.status ?? "reviewing",
        risk: (data.risk_level ?? "medium") as RiskLevel,
        riskScore: data.risk_score ?? 50,
        reserveBalance: 0,
        availablePayout: 0,
        notes: "Live carrier record from Supabase.",
      };
    }

    const { data: docData } = await supabase
      .from("carrier_documents")
      .select("id, document_type, file_name, storage_bucket, storage_path, status, created_at")
      .eq("carrier_id", id)
      .order("created_at", { ascending: false });

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

    const { data: loadData } = await supabase
      .from("load_submissions")
      .select("load_number, invoice_number, total_invoice_amount, status, risk_level")
      .eq("carrier_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (loadData?.length) {
      loadRows = loadData.map((load) => [
        load.load_number,
        load.invoice_number,
        "Broker file",
        formatCurrency(Number(load.total_invoice_amount ?? 0)),
        <RiskBadge key="risk" level={(load.risk_level ?? "medium") as RiskLevel} />,
        <StatusChip key="status" status={load.status} />,
      ]);
    }
  }

  if (!carrier) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Carrier profile"
        title={carrier.legalName}
        description={`${carrier.owner} · MC ${carrier.mc} · ${carrier.trucks} trucks · ${carrier.address}`}
        primaryAction={{ label: "Submit/review load", href: "/admin/loads" }}
        secondaryAction={{ label: "Back to carriers", href: "/admin/carriers" }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Risk score" value={carrier.riskScore.toString()} note={carrier.risk.toUpperCase()} />
        <StatCard label="Monthly volume" value={formatCurrency(carrier.monthlyVolume)} note="Estimated gross" />
        <StatCard label="Reserve balance" value={formatCurrency(carrier.reserveBalance)} note="Carrier ledger" />
        <StatCard label="Available payout" value={formatCurrency(carrier.availablePayout)} note="Estimated" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <Card title="Company and compliance">
          <dl className="grid gap-3 text-sm text-[#1d2a30]">
            {[
              ["Status", <StatusChip key="status" status={carrier.status} />],
              ["Risk", <RiskBadge key="risk" level={carrier.risk} />],
              ["Email", carrier.email],
              ["Phone", carrier.phone],
              ["DOT", carrier.dot],
              ["EIN", carrier.ein],
              ["Entity", `${carrier.entityType} · ${carrier.state}`],
              ["Years in business", carrier.years],
              ["Trailer types", carrier.trailerTypes],
              ["Current factor", carrier.currentFactor],
              ["Active UCC", carrier.activeUcc ? "Yes - release control needed" : "No"],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between gap-3 border-b border-[#e4ebe8] pb-2">
                <dt className="text-[#62737a]">{label}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-lg bg-[#eef8f7] p-3 text-sm leading-6 text-[#0a5961]">{carrier.notes}</p>
        </Card>

        <Card title="Private carrier document vault">
          <DocumentVault documents={documents} />
        </Card>
      </div>

      <Card title="Loads, invoices, and funding activity">
        <AdminTable columns={["Load", "Invoice", "Broker", "Amount", "Risk", "Status"]} rows={loadRows} />
      </Card>

      <Card title="Admin actions">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/payments" className="rounded-md bg-[#0a7c86] px-4 py-2 text-sm font-semibold text-white">
            Record payment
          </Link>
          <Link href="/admin/reserves" className="rounded-md border border-[#b9c6c2] bg-white px-4 py-2 text-sm font-semibold text-[#1d2a30]">
            Manage reserves
          </Link>
          <Link href="/admin/compliance" className="rounded-md border border-[#b9c6c2] bg-white px-4 py-2 text-sm font-semibold text-[#1d2a30]">
            Add compliance review
          </Link>
        </div>
      </Card>
    </div>
  );
}
