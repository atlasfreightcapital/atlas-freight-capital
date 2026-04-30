import { createClient } from "@/lib/supabase/server";

export async function shouldShowPartnerNameToCarrier() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "show_partner_name_to_carrier")
    .maybeSingle();

  return Boolean(data?.value?.enabled);
}
