import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  carrier_id: z.string().uuid(),
  status: z.enum(["clear", "needs_review", "hold", "blocked"]),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("compliance_reviews")
    .insert({
      carrier_id: parsed.data.carrier_id,
      status: parsed.data.status,
      notes: parsed.data.notes,
      reviewed_by: auth.profile.userId,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "compliance_review_recorded",
    entity_type: "compliance_review",
    entity_id: data.id,
    metadata: { carrier_id: parsed.data.carrier_id, status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, complianceReviewId: data.id });
}
