import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { carrierApplicationSchema } from "@/lib/validation";
import { uploadPrivateDocument } from "@/lib/services/storage";

const requiredDocumentKeys = ["w9", "mc_authority", "coi", "articles", "owner_id", "voided_check"];
const optionalDocumentKeys = ["current_factoring_agreement", "release_letter"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = Object.fromEntries(
      [...formData.entries()].filter(([, value]) => typeof value === "string"),
    );

    const parsed = carrierApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { data: application, error } = await supabase
      .from("carrier_applications")
      .insert({
        user_id: user?.id ?? null,
        status: "submitted",
        ...parsed.data,
      })
      .select("id")
      .single();

    if (error || !application) {
      return NextResponse.json({ error: error?.message ?? "Unable to create application" }, { status: 500 });
    }

    for (const key of [...requiredDocumentKeys, ...optionalDocumentKeys]) {
      const file = formData.get(key);
      if (!(file instanceof File) || file.size === 0) {
        if (requiredDocumentKeys.includes(key)) {
          return NextResponse.json({ error: `Missing required document: ${key}` }, { status: 400 });
        }
        continue;
      }

      const path = `applications/${application.id}/${key}-${Date.now()}-${file.name}`;
      await uploadPrivateDocument("carrier-documents", path, file);

      await supabase.from("carrier_documents").insert({
        application_id: application.id,
        document_type: key,
        file_name: file.name,
        storage_bucket: "carrier-documents",
        storage_path: path,
        status: "uploaded",
        uploaded_by: user?.id ?? null,
      });
    }

    await supabase.from("notifications").insert({
      user_id: user?.id ?? null,
      type: "application_submitted",
      title: "Application submitted",
      body: "Your Atlas application was received and is now under review.",
    });

    return NextResponse.json({ ok: true, applicationId: application.id });
  } catch {
    return NextResponse.json({ error: "Unexpected error creating application" }, { status: 500 });
  }
}
