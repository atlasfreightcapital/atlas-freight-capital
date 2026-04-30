import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  carrier_id: z.string().uuid(),
  load_submission_id: z.string().uuid().optional().or(z.literal("")),
  amount: z.coerce.number().min(0),
  status: z.enum(["held", "released", "applied_to_fee", "applied_to_chargeback", "pending_release"]),
  release_date: z.string().optional(),
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
    .from("reserves")
    .insert({
      ...parsed.data,
      load_submission_id: parsed.data.load_submission_id || null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "reserve_recorded",
    entity_type: "reserve",
    entity_id: data.id,
    metadata: { amount: parsed.data.amount, status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, reserveId: data.id });
}
