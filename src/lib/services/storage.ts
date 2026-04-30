import { createClient } from "@/lib/supabase/server";

export async function uploadPrivateDocument(
  bucket: string,
  path: string,
  file: File,
) {
  const supabase = await createClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { upsert: false, contentType: file.type || "application/octet-stream" });

  if (error) {
    throw error;
  }
}
