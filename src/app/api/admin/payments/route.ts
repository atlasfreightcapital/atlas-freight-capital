import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  load_submission_id: z.string().uuid(),
  broker_id: z.string().uuid().optional().or(z.literal("")),
  expected_payment_date: z.string().optional(),
  actual_payment_date: z.string().optional(),
  payment_amount: z.coerce.number().min(0).optional(),
  short_pay_amount: z.coerce.number().min(0).optional(),
  status: z.enum(["expected", "received", "short_paid", "disputed", "applied", "closed"]),
  payment_reference: z.string().optional(),
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
    .from("payments")
    .insert({
      ...parsed.data,
      broker_id: parsed.data.broker_id || null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "payment_recorded",
    entity_type: "payment",
    entity_id: data.id,
    metadata: { status: parsed.data.status, amount: parsed.data.payment_amount ?? null },
  });

  return NextResponse.json({ ok: true, paymentId: data.id });
}
