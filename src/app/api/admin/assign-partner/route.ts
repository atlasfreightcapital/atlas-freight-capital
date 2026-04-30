import { NextResponse } from "next/server";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";
import { partnerAssignmentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const parsed = partnerAssignmentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: loadError } = await supabase
    .from("load_submissions")
    .update({
      assigned_partner_id: parsed.data.partner_id,
      status: "sent_to_funding_partner",
    })
    .eq("id", parsed.data.load_submission_id);

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }

  await supabase.from("partner_assignments").insert({
    load_submission_id: parsed.data.load_submission_id,
    partner_id: parsed.data.partner_id,
    assigned_by: auth.profile.userId,
    assignment_reason: parsed.data.assignment_reason ?? null,
    manual_override: parsed.data.manual_override ?? false,
  });

  await supabase.from("load_status_history").insert({
    load_submission_id: parsed.data.load_submission_id,
    old_status: "atlas_review",
    new_status: "sent_to_funding_partner",
    changed_by: auth.profile.userId,
    changed_by_role: auth.profile.role,
    note: parsed.data.assignment_reason ?? "Assigned to funding partner",
  });

  return NextResponse.json({ ok: true });
}
