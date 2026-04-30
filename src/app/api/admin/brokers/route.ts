import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  broker_name: z.string().min(2),
  broker_mc: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  credit_score_internal: z.coerce.number().min(0).max(100).optional(),
  credit_limit: z.coerce.number().min(0).optional(),
  average_days_to_pay: z.coerce.number().min(0).optional(),
  risk_level: z.enum(["low", "medium", "high", "blocked"]),
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
    .from("brokers")
    .upsert(
      {
        ...parsed.data,
        email: parsed.data.email || null,
      },
      { onConflict: "email" },
    )
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "broker_upserted",
    entity_type: "broker",
    entity_id: data.id,
    metadata: { broker_name: parsed.data.broker_name, risk_level: parsed.data.risk_level },
  });

  return NextResponse.json({ ok: true, brokerId: data.id });
}
