import { NextResponse } from "next/server";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";
import { adminStatusUpdateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const parsed = adminStatusUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: current, error: currentError } = await supabase
    .from("load_submissions")
    .select("status")
    .eq("id", parsed.data.load_submission_id)
    .single();

  if (currentError || !current) {
    return NextResponse.json({ error: currentError?.message ?? "Load not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("load_submissions")
    .update({ status: parsed.data.new_status })
    .eq("id", parsed.data.load_submission_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("load_status_history").insert({
    load_submission_id: parsed.data.load_submission_id,
    old_status: current.status,
    new_status: parsed.data.new_status,
    changed_by: auth.profile.userId,
    changed_by_role: auth.profile.role,
    note: parsed.data.note ?? null,
  });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "load_status_updated",
    entity_type: "load_submission",
    entity_id: parsed.data.load_submission_id,
    metadata: { old_status: current.status, new_status: parsed.data.new_status },
  });

  return NextResponse.json({ ok: true });
}
