"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

const factoringOptions = ["recourse", "non_recourse", "not_sure"];

export function CarrierApplicationForm() {
  const [message, setMessage] = useState<string>("");

  return (
    <form
      className="grid gap-4 rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/carrier-applications", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setMessage(response.ok ? "Application submitted successfully." : data.error || "Submission failed.");
      }}
    >
      <h2 className="text-xl font-semibold text-[#162026]">Carrier Application</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="legal_business_name" placeholder="Legal business name" required />
        <Input name="dba" placeholder="DBA" />
        <Input name="owner_name" placeholder="Owner name" required />
        <Input type="email" name="email" placeholder="Email" required />
        <Input name="phone" placeholder="Phone" required />
        <Input name="mc_number" placeholder="MC number" required />
        <Input name="dot_number" placeholder="DOT number" />
        <Input name="ein" placeholder="EIN" required />
        <Input name="business_address" placeholder="Business address" required />
        <Input name="entity_type" placeholder="Entity type" />
        <Input name="state_of_registration" placeholder="State" />
        <Input name="years_in_business" type="number" min={0} placeholder="Years in business" />
        <Input name="number_of_trucks" type="number" min={0} placeholder="Number of trucks" />
        <Input name="trailer_types" placeholder="Trailer types" />
        <Input name="average_monthly_gross_revenue" type="number" min={0} placeholder="Avg monthly gross" />
        <Input name="estimated_factoring_volume" type="number" min={0} placeholder="Estimated factoring volume" />
        <Input name="current_factoring_company" placeholder="Current factoring company" />
        <Select name="active_ucc" defaultValue="no">
          <option value="no">Active UCC: No</option>
          <option value="yes">Active UCC: Yes</option>
        </Select>
        <Select name="needs_release_letter" defaultValue="no">
          <option value="no">Needs release letter: No</option>
          <option value="yes">Needs release letter: Yes</option>
        </Select>
        <Input name="bank_name" placeholder="Bank name" />
        <Input name="preferred_funding_method" placeholder="Preferred funding method" />
        <Select name="factoring_type_requested" defaultValue="recourse">
          {factoringOptions.map((option) => (
            <option key={option} value={option}>
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
      </div>
      <Textarea name="broker_customer_list" placeholder="Broker / customer list" rows={4} />
      <Textarea name="notes" placeholder="Additional notes" rows={4} />
      <div className="grid gap-3 md:grid-cols-2">
        <UploadDropzone label="W9" name="w9" required />
        <UploadDropzone label="MC authority" name="mc_authority" required />
        <UploadDropzone label="Certificate of insurance" name="coi" required />
        <UploadDropzone label="Articles / registration" name="articles" required />
        <UploadDropzone label="Owner ID" name="owner_id" required />
        <UploadDropzone label="Voided check / bank letter" name="voided_check" required />
        <UploadDropzone label="Current factoring agreement (optional)" name="current_factoring_agreement" />
        <UploadDropzone label="Release letter (optional)" name="release_letter" />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Submit application
      </Button>
      {message ? <p className="text-sm text-[#0a7c86]">{message}</p> : null}
    </form>
  );
}
