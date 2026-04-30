import { NextResponse } from "next/server";
import { partnerApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";
import { partnerReviewSchema } from "@/lib/validation";

const statusByDecision = {
  approve: "approved_for_advance",
  reject: "rejected",
  need_info: "missing_documents",
  funded: "funded",
  broker_paid: "broker_paid",
} as const;

export async function POST(request: Request) {
  const auth = await requireApiRole(partnerApiRoles);
  if (auth.error) return auth.error;

  const parsed = partnerReviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: partnerUser } = await supabase
    .from("partner_users")
    .select("partner_id")
    .eq("user_id", auth.profile.userId)
    .single();

  if (!partnerUser) {
    return NextResponse.json({ error: "Partner account not found" }, { status: 403 });
  }

  const { data: load } = await supabase
    .from("load_submissions")
    .select("assigned_partner_id, status")
    .eq("id", parsed.data.load_submission_id)
    .single();

  if (!load || load.assigned_partner_id !== partnerUser.partner_id) {
    return NextResponse.json({ error: "Submission is not assigned to this partner" }, { status: 403 });
  }

  const nextStatus = statusByDecision[parsed.data.decision];
  const { error } = await supabase
    .from("load_submissions")
    .update({ status: nextStatus })
    .eq("id", parsed.data.load_submission_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (parsed.data.partner_note || parsed.data.rejection_reason) {
    await supabase.from("messages").insert({
      partner_id: partnerUser.partner_id,
      load_submission_id: parsed.data.load_submission_id,
      message_type: "partner",
      body: parsed.data.partner_note ?? parsed.data.rejection_reason,
      created_by: auth.profile.userId,
    });
  }

  await supabase.from("load_status_history").insert({
    load_submission_id: parsed.data.load_submission_id,
    old_status: load.status,
    new_status: nextStatus,
    changed_by: auth.profile.userId,
    changed_by_role: auth.profile.role,
    note: parsed.data.partner_note ?? parsed.data.rejection_reason ?? `Partner marked ${parsed.data.decision}`,
  });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "partner_submission_reviewed",
    entity_type: "load_submission",
    entity_id: parsed.data.load_submission_id,
    metadata: {
      decision: parsed.data.decision,
      approved_advance_amount: parsed.data.approved_advance_amount ?? null,
      backend_buy_rate_percent: parsed.data.backend_buy_rate_percent ?? null,
      funding_date: parsed.data.funding_date ?? null,
    },
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
