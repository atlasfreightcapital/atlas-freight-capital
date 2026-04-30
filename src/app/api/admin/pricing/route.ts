import { NextResponse } from "next/server";
import { pricingApiRoles, requireApiRole } from "@/lib/api/authz";
import { calculatePricing } from "@/lib/services/pricing";
import { createClient } from "@/lib/supabase/server";
import { pricingUpdateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireApiRole(pricingApiRoles);
  if (auth.error) return auth.error;

  const parsed = pricingUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const pricing = calculatePricing({
    invoiceAmount: parsed.data.invoice_amount,
    carrierRatePercent: parsed.data.carrier_rate_percent,
    backendBuyRatePercent: parsed.data.backend_buy_rate_percent,
    advancePercent: parsed.data.advance_percent,
    feeTiming: parsed.data.fee_timing,
  });

  const supabase = await createClient();
  const { error } = await supabase.from("load_pricing").upsert(
    {
      load_submission_id: parsed.data.load_submission_id,
      carrier_rate_percent: parsed.data.carrier_rate_percent,
      backend_buy_rate_percent: parsed.data.backend_buy_rate_percent,
      advance_percent: parsed.data.advance_percent,
      invoice_amount: parsed.data.invoice_amount,
      gross_fee: pricing.grossFee,
      backend_cost: pricing.backendCost,
      atlas_net_revenue: pricing.atlasSpread,
      advance_amount: pricing.advanceAmount,
      reserve_amount: pricing.reserveAmount,
      net_payout_estimate: pricing.netPayoutEstimate,
      fee_timing: parsed.data.fee_timing,
    },
    { onConflict: "load_submission_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    user_id: auth.profile.userId,
    role: auth.profile.role,
    action: "pricing_updated",
    entity_type: "load_submission",
    entity_id: parsed.data.load_submission_id,
    metadata: pricing,
  });

  return NextResponse.json({ ok: true, pricing });
}
