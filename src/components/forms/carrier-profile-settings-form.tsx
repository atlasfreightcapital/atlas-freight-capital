"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CarrierProfileValues = {
  id: string;
  legal_name: string;
  dba_name: string | null;
  mc_number: string | null;
  dot_number: string | null;
  ein: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  entity_type: string | null;
  state: string | null;
  years_in_business: number | null;
  truck_count: number | null;
  estimated_monthly_volume: number | null;
};

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-semibold text-[#162026]">{label}</span>
      {children}
      {helper ? <span className="text-xs leading-5 text-[#62737a]">{helper}</span> : null}
    </label>
  );
}

export function CarrierProfileSettingsForm({ carrier }: { carrier: CarrierProfileValues }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    const response = await fetch("/api/carrier/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    setLoading(false);
    if (!response.ok) {
      setMessage(result.error ?? "Profile update failed.");
      return;
    }

    setMessage("Company profile updated.");
    router.refresh();
  }

  return (
    <Card title="Company profile settings">
      <form onSubmit={submitProfile} className="grid gap-4">
        <input type="hidden" name="carrier_id" value={carrier.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Legal company name" helper="The legal business name on your W9 and authority records.">
            <Input name="legal_name" defaultValue={carrier.legal_name} placeholder="Legal company name" required />
          </Field>
          <Field label="DBA name" helper="Trade name, if your company operates under a different name.">
            <Input name="dba_name" defaultValue={carrier.dba_name ?? ""} placeholder="DBA name" />
          </Field>
          <Field label="MC number" helper="Your motor carrier number.">
            <Input name="mc_number" defaultValue={carrier.mc_number ?? ""} placeholder="MC number" />
          </Field>
          <Field label="DOT number" helper="Your USDOT number.">
            <Input name="dot_number" defaultValue={carrier.dot_number ?? ""} placeholder="DOT number" />
          </Field>
          <Field label="EIN" helper="Business tax ID used for compliance review.">
            <Input name="ein" defaultValue={carrier.ein ?? ""} placeholder="EIN" />
          </Field>
          <Field label="Company phone" helper="Best phone number for Atlas operations to reach your office.">
            <Input name="phone" defaultValue={carrier.phone ?? ""} placeholder="Company phone" />
          </Field>
          <Field label="Company email" helper="Used for invoice, document, and funding updates.">
            <Input name="email" type="email" defaultValue={carrier.email ?? ""} placeholder="Company email" />
          </Field>
          <Field label="Business address" helper="Physical or mailing address for your business profile.">
            <Input name="address" defaultValue={carrier.address ?? ""} placeholder="Business address" />
          </Field>
          <Field label="Entity type" helper="Example: LLC, Corporation, Sole Proprietor.">
            <Input name="entity_type" defaultValue={carrier.entity_type ?? ""} placeholder="Entity type" />
          </Field>
          <Field label="State of registration" helper="State where the business is registered.">
            <Input name="state" defaultValue={carrier.state ?? ""} placeholder="State" />
          </Field>
          <Field label="Years in business" helper="How long the company has been operating.">
            <Input
              name="years_in_business"
              type="number"
              min={0}
              defaultValue={carrier.years_in_business ?? ""}
              placeholder="Years in business"
            />
          </Field>
          <Field label="Truck count" helper="Total trucks currently operating under your company.">
            <Input name="truck_count" type="number" min={0} defaultValue={carrier.truck_count ?? ""} placeholder="Truck count" />
          </Field>
          <Field label="Estimated monthly invoice volume" helper="Approximate monthly amount you expect to factor.">
            <Input
              name="estimated_monthly_volume"
              type="number"
              min={0}
              step="0.01"
              defaultValue={carrier.estimated_monthly_volume ?? ""}
              placeholder="Estimated monthly invoice volume"
            />
          </Field>
        </div>
        <div className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4 text-sm leading-6 text-[#40515a]">
          Changes are saved to your Atlas carrier profile. Some compliance-sensitive updates may still be reviewed by
          Atlas before funding decisions.
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save company profile"}</Button>
          {message ? <p className="text-sm font-medium text-[#0a7c86]">{message}</p> : null}
        </div>
      </form>
    </Card>
  );
}
