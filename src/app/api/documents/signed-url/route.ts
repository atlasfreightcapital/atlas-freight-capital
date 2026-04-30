import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { bucket?: string; path?: string; expiresIn?: number };
    if (!body.bucket || !body.path) {
      return NextResponse.json({ error: "Missing bucket/path" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expiresIn = Math.min(Math.max(body.expiresIn ?? 300, 60), 900);

    const { data, error } = await supabase.storage.from(body.bucket).createSignedUrl(body.path, expiresIn);

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message ?? "Could not generate signed URL" }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      role: "document_access",
      action: "signed_url_generated",
      entity_type: "storage_object",
      entity_id: body.path,
      metadata: { bucket: body.bucket, expiresIn },
    });

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
