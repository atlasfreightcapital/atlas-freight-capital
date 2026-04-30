"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

export function LoadSubmissionForm() {
  const [message, setMessage] = useState<string>("");

  return (
    <form
      className="grid gap-4 rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/load-submissions", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setMessage(response.ok ? "Load package submitted." : data.error || "Submission failed.");
      }}
    >
      <h2 className="text-xl font-semibold text-[#162026]">Submit Load Package</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="broker_name" placeholder="Broker / customer name" required />
        <Input name="broker_mc" placeholder="Broker MC number" />
        <Input name="broker_email" placeholder="Broker email" type="email" required />
        <Input name="broker_phone" placeholder="Broker phone" />
        <Input name="broker_address" placeholder="Broker address" />
        <Input name="load_number" placeholder="Load number" required />
        <Input name="invoice_number" placeholder="Invoice number" required />
        <Input name="rate_amount" type="number" min={0} step="0.01" placeholder="Rate amount" required />
        <Input name="accessorials" type="number" min={0} step="0.01" placeholder="Accessorials" />
        <Input name="lumper_amount" type="number" min={0} step="0.01" placeholder="Lumper amount" />
        <Input name="detention_amount" type="number" min={0} step="0.01" placeholder="Detention amount" />
        <Input name="total_invoice_amount" type="number" min={0} step="0.01" placeholder="Total invoice amount" required />
        <Input name="pickup_date" type="date" required />
        <Input name="delivery_date" type="date" required />
        <Input name="origin" placeholder="Origin" required />
        <Input name="destination" placeholder="Destination" required />
        <Input name="commodity" placeholder="Commodity" />
      </div>
      <Textarea name="notes" rows={3} placeholder="Notes" />
      <div className="grid gap-3 md:grid-cols-2">
        <UploadDropzone label="Rate confirmation" name="rate_confirmation" required />
        <UploadDropzone label="Invoice" name="invoice" required />
        <UploadDropzone label="BOL / POD" name="bol_pod" required />
        <UploadDropzone label="Lumper receipt (optional)" name="lumper_receipt" />
        <UploadDropzone label="Detention proof (optional)" name="detention_proof" />
        <UploadDropzone label="Email approval (optional)" name="email_approval" />
        <UploadDropzone label="Other document (optional)" name="other_document" />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        Submit for review
      </Button>
      {message ? <p className="text-sm text-[#0a7c86]">{message}</p> : null}
    </form>
  );
}
