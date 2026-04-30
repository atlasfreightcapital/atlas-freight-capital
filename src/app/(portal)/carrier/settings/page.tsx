import { redirect } from "next/navigation";
import { CarrierProfileSettingsForm } from "@/components/forms/carrier-profile-settings-form";
import { Card } from "@/components/ui/card";
import { requireCarrierRole } from "@/lib/auth";
import { resolveCarrierForUser } from "@/lib/carrier-data";
import { createClient } from "@/lib/supabase/server";

export default async function CarrierSettingsPage() {
  const profile = await requireCarrierRole();
  const carrier = await resolveCarrierForUser(profile.userId);

  if (!carrier) {
    redirect("/carrier/dashboard");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("carriers")
    .select(
      "id, legal_name, dba_name, mc_number, dot_number, ein, phone, email, address, entity_type, state, years_in_business, truck_count, estimated_monthly_volume",
    )
    .eq("id", carrier.id)
    .single();

  if (!data) {
    redirect("/carrier/dashboard");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#10243d] bg-[#071426] p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65d8e1]">Profile settings</p>
        <h1 className="mt-3 text-3xl font-semibold">Company information</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c7d4df]">
          Keep your company contact information, authority details, fleet size, and invoice volume current for smoother
          invoice review and payment processing.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CarrierProfileSettingsForm carrier={data} />
        <Card title="Profile review notes">
          <div className="space-y-4 text-sm leading-6 text-[#40515a]">
            <p>Atlas may review changes to MC, DOT, EIN, and business address before funding.</p>
            <p>For bank account updates, upload a new voided check or bank letter through Atlas support.</p>
            <p>For insurance updates, send the current certificate to Atlas so the compliance file stays active.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
