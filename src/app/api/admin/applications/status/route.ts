import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  application_id: z.string().uuid(),
  status: z.string().min(2),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiRole(adminApiRoles);
  if (auth.error) return auth.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("carrier_applications")
    .update({ status: parsed.data.status, notes: parsed.data.note ?? null })
    .eq("id", parsed.data.application_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "application_status_updated",
    entity_type: "carrier_application",
    entity_id: parsed.data.application_id,
    metadata: { status: parsed.data.status, note: parsed.data.note ?? null },
  });

  return NextResponse.json({ ok: true });
}
