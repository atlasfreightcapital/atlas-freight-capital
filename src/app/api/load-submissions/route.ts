import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadSubmissionSchema } from "@/lib/validation";
import { uploadPrivateDocument } from "@/lib/services/storage";
import { calculatePricing } from "@/lib/services/pricing";
import { isUuid } from "@/lib/records";

const requiredDocuments = ["rate_confirmation", "invoice", "bol_pod"];
const optionalDocuments = ["lumper_receipt", "detention_proof", "email_approval", "other_document"];

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

    const payload = Object.fromEntries(
      [...formData.entries()].filter(([, value]) => typeof value === "string"),
    );

    const parsed = loadSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    let brokerId: string | null = null;
    if (parsed.data.broker_id && isUuid(parsed.data.broker_id)) {
      const { data: selectedBroker } = await supabase
        .from("brokers")
        .select("id")
        .eq("id", parsed.data.broker_id)
        .maybeSingle();
      brokerId = selectedBroker?.id ?? null;
    }

    if (!brokerId) {
      const brokerPayload = {
        broker_name: parsed.data.broker_name,
        broker_mc: parsed.data.broker_mc || null,
        email: parsed.data.broker_email,
        phone: parsed.data.broker_phone || null,
        address: parsed.data.broker_address || null,
      };

      const { data: broker } = await supabase
        .from("brokers")
        .upsert(brokerPayload, { onConflict: "email" })
        .select("id")
        .single();

      brokerId = broker?.id ?? null;
    }

    const { data: load, error: loadError } = await supabase
      .from("load_submissions")
      .insert({
        carrier_id: carrierId,
        broker_id: brokerId,
        load_number: parsed.data.load_number,
        invoice_number: parsed.data.invoice_number,
        rate_amount: parsed.data.rate_amount,
        accessorial_amount: parsed.data.accessorials ?? 0,
        total_invoice_amount: parsed.data.total_invoice_amount,
        pickup_date: parsed.data.pickup_date,
        delivery_date: parsed.data.delivery_date,
        origin: parsed.data.origin,
        destination: parsed.data.destination,
        commodity: parsed.data.commodity || null,
        status: "submitted",
        admin_notes: parsed.data.notes || null,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (loadError || !load) {
      return NextResponse.json({ error: loadError?.message ?? "Could not create load" }, { status: 500 });
    }

    for (const key of [...requiredDocuments, ...optionalDocuments]) {
      const file = formData.get(key);
      if (!(file instanceof File) || file.size === 0) {
        if (requiredDocuments.includes(key)) {
          return NextResponse.json({ error: `Missing required document: ${key}` }, { status: 400 });
        }
        continue;
      }

      const path = `loads/${carrierId}/${load.id}/${key}-${Date.now()}-${file.name}`;
      await uploadPrivateDocument("load-documents", path, file);

      await supabase.from("load_documents").insert({
        load_submission_id: load.id,
        document_type: key,
        file_name: file.name,
        storage_bucket: "load-documents",
        storage_path: path,
        status: "uploaded",
        uploaded_by: user.id,
      });
    }

    const pricing = calculatePricing({
      invoiceAmount: parsed.data.total_invoice_amount,
      carrierRatePercent: 3,
      backendBuyRatePercent: 1.75,
      advancePercent: 90,
      feeTiming: "upfront",
    });

    await supabase.from("load_pricing").insert({
      load_submission_id: load.id,
      carrier_rate_percent: 3,
      backend_buy_rate_percent: 1.75,
      advance_percent: 90,
      invoice_amount: parsed.data.total_invoice_amount,
      gross_fee: pricing.grossFee,
      backend_cost: pricing.backendCost,
      atlas_net_revenue: pricing.atlasSpread,
      advance_amount: pricing.advanceAmount,
      reserve_amount: pricing.reserveAmount,
      net_payout_estimate: pricing.netPayoutEstimate,
      fee_timing: "upfront",
    });

    await supabase.from("load_status_history").insert({
      load_submission_id: load.id,
      old_status: "draft",
      new_status: "submitted",
      changed_by: user.id,
      changed_by_role: "carrier",
      note: "Carrier submitted load package",
    });

    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "load_submitted",
      title: "Load submitted",
      body: `Load ${parsed.data.load_number} submitted and queued for Atlas review.`,
    });

    return NextResponse.json({ ok: true, loadId: load.id });
  } catch {
    return NextResponse.json({ error: "Unexpected error submitting load" }, { status: 500 });
  }
}
