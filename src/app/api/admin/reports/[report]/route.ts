import { createClient } from "@/lib/supabase/server";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { csvResponse } from "@/lib/csv";

const reportConfig = {
  "carrier-volume": {
    filename: "carrier-volume-report.csv",
    table: "load_submissions",
    select:
      "id, carrier_id, load_number, invoice_number, total_invoice_amount, status, created_at",
  },
  "partner-volume": {
    filename: "partner-volume-report.csv",
    table: "load_submissions",
    select:
      "id, assigned_partner_id, load_number, invoice_number, total_invoice_amount, status, created_at",
  },
  "broker-aging": {
    filename: "broker-aging-report.csv",
    table: "payments",
    select:
      "id, load_submission_id, broker_id, expected_payment_date, actual_payment_date, payment_amount, short_pay_amount, status",
  },
  "revenue-spread": {
    filename: "revenue-spread-report.csv",
    table: "load_pricing",
    select:
      "id, load_submission_id, invoice_amount, gross_fee, backend_cost, atlas_net_revenue, advance_amount, reserve_amount, fee_timing, created_at",
  },
  "funded-loads": {
    filename: "funded-loads-report.csv",
    table: "load_submissions",
    select:
      "id, carrier_id, broker_id, assigned_partner_id, load_number, invoice_number, total_invoice_amount, status, created_at",
    eq: ["status", "funded"],
  },
  "rejected-loads": {
    filename: "rejected-loads-report.csv",
    table: "load_submissions",
    select:
      "id, carrier_id, broker_id, assigned_partner_id, load_number, invoice_number, total_invoice_amount, status, created_at",
    eq: ["status", "rejected"],
  },
  disputes: {
    filename: "dispute-report.csv",
    table: "load_submissions",
    select: "id, carrier_id, broker_id, load_number, invoice_number, total_invoice_amount, status, admin_notes",
    eq: ["status", "dispute"],
  },
  chargebacks: {
    filename: "chargeback-report.csv",
    table: "load_submissions",
    select: "id, carrier_id, broker_id, load_number, invoice_number, total_invoice_amount, status, admin_notes",
    eq: ["status", "chargeback"],
  },
  reserves: {
    filename: "reserve-report.csv",
    table: "reserves",
    select: "id, carrier_id, load_submission_id, amount, status, release_date, notes, created_at",
  },
} as const;

type ReportKey = keyof typeof reportConfig;
type ReportQueryResult = {
  data: Record<string, string | number | boolean | null>[] | null;
  error: { message: string } | null;
};
type ReportQuery = PromiseLike<ReportQueryResult> & {
  eq(column: string, value: string): ReportQuery;
  limit(count: number): ReportQuery;
};
type ReportClient = {
  from(table: string): {
    select(columns: string): ReportQuery;
  };
};

export async function GET(_request: Request, context: { params: Promise<{ report: string }> }) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const { report } = await context.params;
  const config = reportConfig[report as ReportKey];

  if (!config) {
    return Response.json({ error: "Unknown report" }, { status: 404 });
  }

  const supabase = await createClient();
  const reportClient = supabase as unknown as ReportClient;
  let query = reportClient.from(config.table).select(config.select).limit(10000);

  if ("eq" in config) {
    query = query.eq(config.eq[0], config.eq[1]);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "report_exported",
    entity_type: "report",
    entity_id: report,
    metadata: { filename: config.filename },
  });

  return csvResponse(config.filename, data ?? []);
}
