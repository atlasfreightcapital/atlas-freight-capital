import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export type CarrierRecord = {
  id: string;
  legalName: string;
  ownerUserId: string;
};

export type CarrierInvoiceRecord = {
  id: string;
  invoiceNumber: string;
  loadNumber: string;
  broker: string;
  brokerEmail?: string;
  amount: number;
  status: string;
  submittedAt: string;
  expectedPayDate: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  commodity: string;
  advanceAmount: number;
  reserveAmount: number;
  netPayoutEstimate: number;
  carrierRatePercent: number;
  documentStatus: string;
};

export type CarrierInvoiceStage = "processing" | "pending" | "paid" | "needs_attention";

export function carrierInvoiceStage(status: string): {
  key: CarrierInvoiceStage;
  label: string;
  description: string;
} {
  if (["funded", "broker_paid", "closed"].includes(status)) {
    return {
      key: "paid",
      label: "Paid",
      description: "Advance issued or broker payment has been posted.",
    };
  }

  if (["approved_for_advance", "broker_verified"].includes(status)) {
    return {
      key: "pending",
      label: "Pending",
      description: "Approved or verified and waiting on the next payment step.",
    };
  }

  if (["missing_documents", "rejected", "dispute", "chargeback"].includes(status)) {
    return {
      key: "needs_attention",
      label: "Needs Attention",
      description: "Atlas needs an update before this invoice can move forward.",
    };
  }

  return {
    key: "processing",
    label: "Processing",
    description: "Atlas is reviewing paperwork, broker confirmation, or funding approval.",
  };
}

export function groupCarrierInvoices(invoices: CarrierInvoiceRecord[]) {
  return {
    processing: invoices.filter((invoice) => carrierInvoiceStage(invoice.status).key === "processing"),
    pending: invoices.filter((invoice) => carrierInvoiceStage(invoice.status).key === "pending"),
    paid: invoices.filter((invoice) => carrierInvoiceStage(invoice.status).key === "paid"),
    needsAttention: invoices.filter((invoice) => carrierInvoiceStage(invoice.status).key === "needs_attention"),
  };
}

export const demoCarrierInvoices: CarrierInvoiceRecord[] = [
  {
    id: "inv-448201",
    invoiceNumber: "INV-448201",
    loadNumber: "LD-90322",
    broker: "Blue River Logistics",
    brokerEmail: "ap@blueriver.example.com",
    amount: 4200,
    status: "atlas_review",
    submittedAt: "Apr 28, 2026",
    expectedPayDate: "May 28, 2026",
    origin: "Fresno, CA",
    destination: "Phoenix, AZ",
    pickupDate: "Apr 27, 2026",
    deliveryDate: "Apr 28, 2026",
    commodity: "Dry goods",
    advanceAmount: 3780,
    reserveAmount: 420,
    netPayoutEstimate: 3654,
    carrierRatePercent: 3,
    documentStatus: "Paperwork is under review",
  },
  {
    id: "inv-448355",
    invoiceNumber: "INV-448355",
    loadNumber: "LD-90490",
    broker: "Blue River Logistics",
    brokerEmail: "ap@blueriver.example.com",
    amount: 7200,
    status: "approved_for_advance",
    submittedAt: "Apr 29, 2026",
    expectedPayDate: "May 29, 2026",
    origin: "Bakersfield, CA",
    destination: "Salt Lake City, UT",
    pickupDate: "Apr 28, 2026",
    deliveryDate: "Apr 29, 2026",
    commodity: "Packaged food",
    advanceAmount: 6480,
    reserveAmount: 720,
    netPayoutEstimate: 6264,
    carrierRatePercent: 3,
    documentStatus: "Approved for advance",
  },
  {
    id: "inv-447911",
    invoiceNumber: "INV-447911",
    loadNumber: "LD-90288",
    broker: "Northstar Retail Freight",
    brokerEmail: "ap@northstar.example.com",
    amount: 6100,
    status: "funded",
    submittedAt: "Apr 25, 2026",
    expectedPayDate: "May 25, 2026",
    origin: "Stockton, CA",
    destination: "Las Vegas, NV",
    pickupDate: "Apr 24, 2026",
    deliveryDate: "Apr 25, 2026",
    commodity: "Retail freight",
    advanceAmount: 5490,
    reserveAmount: 610,
    netPayoutEstimate: 5307,
    carrierRatePercent: 3,
    documentStatus: "Accepted",
  },
  {
    id: "inv-448010",
    invoiceNumber: "INV-448010",
    loadNumber: "LD-90402",
    broker: "Delta Produce Network",
    brokerEmail: "payables@deltaproduce.example.com",
    amount: 9800,
    status: "broker_paid",
    submittedAt: "Apr 22, 2026",
    expectedPayDate: "May 13, 2026",
    origin: "Yuma, AZ",
    destination: "Dallas, TX",
    pickupDate: "Apr 21, 2026",
    deliveryDate: "Apr 22, 2026",
    commodity: "Produce",
    advanceAmount: 8820,
    reserveAmount: 980,
    netPayoutEstimate: 8526,
    carrierRatePercent: 3,
    documentStatus: "Broker payment posted",
  },
  {
    id: "inv-448099",
    invoiceNumber: "INV-448099",
    loadNumber: "LD-90418",
    broker: "Northstar Retail Freight",
    brokerEmail: "ap@northstar.example.com",
    amount: 5300,
    status: "missing_documents",
    submittedAt: "Apr 27, 2026",
    expectedPayDate: "Pending",
    origin: "Modesto, CA",
    destination: "Reno, NV",
    pickupDate: "Apr 26, 2026",
    deliveryDate: "Apr 27, 2026",
    commodity: "General freight",
    advanceAmount: 4770,
    reserveAmount: 530,
    netPayoutEstimate: 4611,
    carrierRatePercent: 3,
    documentStatus: "Signed POD needed",
  },
];

export const demoBrokerDirectory = [
  {
    id: "blue-river-logistics",
    broker_name: "Blue River Logistics",
    broker_mc: "443991",
    email: "ap@blueriver.example.com",
    phone: "(312) 555-7800",
    address: "1800 W Fulton Market, Chicago, IL 60612",
    payment_terms: "Net 30",
  },
  {
    id: "delta-produce-network",
    broker_name: "Delta Produce Network",
    broker_mc: "701882",
    email: "payables@deltaproduce.example.com",
    phone: "(972) 555-0190",
    address: "1160 Market Center Blvd, Dallas, TX 75207",
    payment_terms: "Net 21",
  },
  {
    id: "northstar-retail-freight",
    broker_name: "Northstar Retail Freight",
    broker_mc: "300118",
    email: "ap@northstar.example.com",
    phone: "(888) 555-3011",
    address: "500 Market St, Denver, CO 80202",
    payment_terms: "Net 30",
  },
];

export async function resolveCarrierForUser(userId: string) {
  const supabase = await createClient();
  const { data: carrier } = await supabase
    .from("carriers")
    .select("id, legal_name, owner_user_id")
    .eq("owner_user_id", userId)
    .maybeSingle();

  if (carrier) {
    return {
      id: carrier.id,
      legalName: carrier.legal_name,
      ownerUserId: carrier.owner_user_id,
    } satisfies CarrierRecord;
  }

  const { data: staff } = await supabase
    .from("carrier_staff")
    .select("carrier_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!staff?.carrier_id) return null;

  const { data: staffCarrier } = await supabase
    .from("carriers")
    .select("id, legal_name, owner_user_id")
    .eq("id", staff.carrier_id)
    .maybeSingle();

  return staffCarrier
    ? {
        id: staffCarrier.id,
        legalName: staffCarrier.legal_name,
        ownerUserId: staffCarrier.owner_user_id,
      }
    : null;
}

export async function getCarrierInvoices(carrierId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("load_submissions")
    .select(
      "id, load_number, invoice_number, total_invoice_amount, status, created_at, origin, destination, pickup_date, delivery_date, commodity, brokers(broker_name,email), load_pricing(advance_amount,reserve_amount,net_payout_estimate,carrier_rate_percent)",
    )
    .eq("carrier_id", carrierId)
    .order("created_at", { ascending: false });

  if (!data?.length) return demoCarrierInvoices;

  return data.map((load) => {
    const pricing = Array.isArray(load.load_pricing) ? load.load_pricing[0] : load.load_pricing;
    const broker = Array.isArray(load.brokers) ? load.brokers[0] : load.brokers;
    const amount = Number(load.total_invoice_amount ?? 0);
    return {
      id: load.id,
      invoiceNumber: load.invoice_number,
      loadNumber: load.load_number,
      broker: broker?.broker_name ?? "Broker pending",
      brokerEmail: broker?.email ?? undefined,
      amount,
      status: load.status,
      submittedAt: new Date(load.created_at).toLocaleDateString(),
      expectedPayDate: load.delivery_date
        ? new Date(new Date(load.delivery_date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        : "Pending",
      origin: load.origin ?? "Origin pending",
      destination: load.destination ?? "Destination pending",
      pickupDate: load.pickup_date ?? "Pending",
      deliveryDate: load.delivery_date ?? "Pending",
      commodity: load.commodity ?? "Not provided",
      advanceAmount: Number(pricing?.advance_amount ?? amount * 0.9),
      reserveAmount: Number(pricing?.reserve_amount ?? amount * 0.1),
      netPayoutEstimate: Number(pricing?.net_payout_estimate ?? amount * 0.87),
      carrierRatePercent: Number(pricing?.carrier_rate_percent ?? 3),
      documentStatus: load.status === "missing_documents" ? "Additional paperwork needed" : "Paperwork received",
    } satisfies CarrierInvoiceRecord;
  });
}

export function invoiceMetrics(invoices: CarrierInvoiceRecord[]) {
  const groups = groupCarrierInvoices(invoices);
  const openInvoices = [...groups.processing, ...groups.pending, ...groups.needsAttention];
  const openInvoiceAmount = openInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const fundedAmount = groups.paid.reduce((sum, invoice) => sum + invoice.advanceAmount, 0);
  const reserveHeld = invoices.reduce((sum, invoice) => sum + invoice.reserveAmount, 0);
  const estimatedFees = invoices.reduce((sum, invoice) => sum + (invoice.amount * invoice.carrierRatePercent) / 100, 0);

  return {
    pendingInvoices: groups.pending,
    processingInvoices: groups.processing,
    paidInvoices: groups.paid,
    needsAttentionInvoices: groups.needsAttention,
    openInvoices,
    openInvoiceAmount,
    fundedAmount,
    reserveHeld,
    estimatedFees,
    totalSubmitted: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    pendingAdvance: [...groups.processing, ...groups.pending].reduce((sum, invoice) => sum + invoice.netPayoutEstimate, 0),
  };
}

export function brokerExposure(invoices: CarrierInvoiceRecord[]) {
  const colors = ["#0a7c86", "#0d5c83", "#d98b2b", "#176b45", "#6b7280"];
  const grouped = new Map<string, number>();
  invoices.forEach((invoice) => {
    grouped.set(invoice.broker, (grouped.get(invoice.broker) ?? 0) + invoice.amount);
  });

  return Array.from(grouped.entries()).map(([broker, amount], index) => ({
    broker,
    amount,
    color: colors[index % colors.length],
  }));
}

export function carrierInvoiceSummary(invoice: CarrierInvoiceRecord) {
  return [
    ["Invoice amount", formatCurrency(invoice.amount)],
    ["Estimated advance", formatCurrency(invoice.advanceAmount)],
    ["Reserve held", formatCurrency(invoice.reserveAmount)],
    ["Estimated payout", formatCurrency(invoice.netPayoutEstimate)],
    ["Factoring rate", `${invoice.carrierRatePercent.toFixed(2)}%`],
    ["Document status", invoice.documentStatus],
  ] as const;
}
