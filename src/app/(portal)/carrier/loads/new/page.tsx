import { LoadSubmissionForm } from "@/components/forms/load-submission-form";
import { demoBrokerDirectory } from "@/lib/carrier-data";
import { createClient } from "@/lib/supabase/server";

export default async function CarrierNewLoadPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("carrier_broker_directory")
    .select("id, broker_name, broker_mc, email, phone, address, payment_terms")
    .order("broker_name", { ascending: true });

  return <LoadSubmissionForm brokers={data?.length ? data : demoBrokerDirectory} />;
}
