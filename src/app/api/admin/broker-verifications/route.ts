import { NextResponse } from "next/server";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";
import { brokerVerificationSchema } from "@/lib/validation";

const statusByAction = {
  send: "sent",
  confirm: "confirmed",
  deny: "denied",
  no_response: "no_response",
  manual: "manual_verification",
} as const;

export async function POST(request: Request) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const parsed = brokerVerificationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const nextStatus = statusByAction[parsed.data.action];
  const now = new Date().toISOString();

  const update = {
    load_submission_id: parsed.data.load_submission_id,
    status: nextStatus,
    verification_sent_at: parsed.data.action === "send" ? now : undefined,
    verification_confirmed_at:
      parsed.data.action === "confirm" || parsed.data.action === "manual" ? now : undefined,
    verified_by:
      parsed.data.action === "confirm" || parsed.data.action === "manual" ? auth.profile.userId : undefined,
    broker_response: parsed.data.broker_response ?? null,
    email_thread_reference: parsed.data.email_thread_reference ?? null,
  };

  const { error } = await supabase
    .from("broker_verifications")
    .upsert(update, { onConflict: "load_submission_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (parsed.data.action === "send") {
    await supabase
      .from("load_submissions")
      .update({ status: "broker_verification_pending" })
      .eq("id", parsed.data.load_submission_id);
  }

  if (parsed.data.action === "confirm" || parsed.data.action === "manual") {
    await supabase
      .from("load_submissions")
      .update({ status: "broker_verified" })
      .eq("id", parsed.data.load_submission_id);
  }

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "broker_verification_updated",
    entity_type: "load_submission",
    entity_id: parsed.data.load_submission_id,
    metadata: { action: parsed.data.action, status: nextStatus },
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
