import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  broker_id: z.string().uuid(),
  reason: z.string().min(4).optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: broker, error: readError } = await supabase
    .from("brokers")
    .select("notes")
    .eq("id", parsed.data.broker_id)
    .single();

  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 });

  const banNote = `[Blocked ${new Date().toISOString()}] ${parsed.data.reason ?? "Admin blocked broker."}`;
  const { error } = await supabase
    .from("brokers")
    .update({
      risk_level: "blocked",
      notes: broker?.notes ? `${broker.notes}\n${banNote}` : banNote,
    })
    .eq("id", parsed.data.broker_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "broker_blocked",
    entity_type: "broker",
    entity_id: parsed.data.broker_id,
    metadata: { reason: parsed.data.reason ?? null },
  });

  return NextResponse.json({ ok: true });
}
