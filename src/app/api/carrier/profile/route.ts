import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const carrierRoles = ["carrier_owner", "carrier_staff"] as const;

const schema = z.object({
  carrier_id: z.string().uuid(),
  legal_name: z.string().min(2),
  dba_name: z.string().optional(),
  mc_number: z.string().optional(),
  dot_number: z.string().optional(),
  ein: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  entity_type: z.string().optional(),
  state: z.string().optional(),
  years_in_business: z.coerce.number().min(0).optional(),
  truck_count: z.coerce.number().min(0).optional(),
  estimated_monthly_volume: z.coerce.number().min(0).optional(),
});

export async function POST(request: Request) {
  const auth = await requireApiRole([...carrierRoles]);
  if (auth.error) return auth.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { carrier_id, ...payload } = parsed.data;

  const { data: ownerCarrier } = await supabase
    .from("carriers")
    .select("id")
    .eq("id", carrier_id)
    .eq("owner_user_id", auth.profile.userId)
    .maybeSingle();

  const { data: staffCarrier } = ownerCarrier
    ? { data: null }
    : await supabase
        .from("carrier_staff")
        .select("carrier_id")
        .eq("carrier_id", carrier_id)
        .eq("user_id", auth.profile.userId)
        .maybeSingle();

  if (!ownerCarrier && !staffCarrier) {
    return NextResponse.json({ error: "Carrier profile not found" }, { status: 403 });
  }

  const { data: updatedCarrier, error } = await supabase
    .from("carriers")
    .update({
      ...payload,
      email: payload.email || null,
    })
    .eq("id", carrier_id)
    .select("id, legal_name")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!updatedCarrier) return NextResponse.json({ error: "Carrier profile was not updated" }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "carrier_profile_updated",
    entity_type: "carrier",
    entity_id: carrier_id,
    metadata: { legal_name: payload.legal_name },
  });

  return NextResponse.json({ ok: true, carrier: updatedCarrier });
}
