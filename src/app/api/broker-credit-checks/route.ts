import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { brokerCheckSchema } from "@/lib/validation";

async function resolveCarrierId(userId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: carrier } = await supabase
    .from("carriers")
    .select("id")
    .eq("owner_user_id", userId)
    .maybeSingle();

  if (carrier) return carrier.id as string;

  const { data: staff } = await supabase
    .from("carrier_staff")
    .select("carrier_id")
    .eq("user_id", userId)
    .maybeSingle();

  return (staff?.carrier_id as string | undefined) ?? null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const carrierId = await resolveCarrierId(user.id, supabase);
    if (!carrierId) {
      return NextResponse.json({ error: "Carrier profile not found" }, { status: 403 });
    }

    const payload = Object.fromEntries(formData.entries());
    const parsed = brokerCheckSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("broker_credit_checks")
      .insert({
        carrier_id: carrierId,
        broker_name: parsed.data.broker_name,
        mc_number: parsed.data.mc_number || null,
        contact_email: parsed.data.contact_email || null,
        load_amount: parsed.data.load_amount ?? null,
        notes: parsed.data.notes || null,
        status: "pending_review",
        requested_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, requestId: data.id });
  } catch {
    return NextResponse.json({ error: "Unexpected error creating broker check request" }, { status: 500 });
  }
}
