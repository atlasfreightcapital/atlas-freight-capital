import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApiRoles, requireApiRole } from "@/lib/api/authz";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  company_name: z.string().min(2),
  contact_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  status: z.string().default("active"),
  buy_rate_min: z.coerce.number().min(0),
  buy_rate_max: z.coerce.number().min(0),
  max_invoice_amount: z.coerce.number().min(0),
  accepts_new_mc: z.boolean().optional(),
  accepts_active_ucc: z.boolean().optional(),
  avg_approval_hours: z.coerce.number().min(0).optional(),
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
    .from("funding_partners")
    .insert({
      ...parsed.data,
      email: parsed.data.email || null,
      accepts_new_mc: parsed.data.accepts_new_mc ?? false,
      accepts_active_ucc: parsed.data.accepts_active_ucc ?? false,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "funding_partner_created",
    entity_type: "funding_partner",
    entity_id: data.id,
    metadata: { company_name: parsed.data.company_name },
  });

  return NextResponse.json({ ok: true, partnerId: data.id });
}
