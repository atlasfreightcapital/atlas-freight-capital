"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

type BrokerOption = {
  id: string;
  broker_name: string;
  broker_mc?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  payment_terms?: string | null;
};

export function LoadSubmissionForm({ brokers = [] }: { brokers?: BrokerOption[] }) {
  const [message, setMessage] = useState<string>("");
  const [selectedBrokerId, setSelectedBrokerId] = useState("manual");
  const selectedBroker = useMemo(
    () => brokers.find((broker) => broker.id === selectedBrokerId),
    [brokers, selectedBrokerId],
  );

  return (
    <form
      className="grid gap-5 rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/load-submissions", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setMessage(response.ok ? "Invoice package submitted to Atlas review." : data.error || "Submission failed.");
      }}
    >
      <div className="rounded-lg border border-[#10243d] bg-[#071426] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#65d8e1]">Invoice submission</p>
        <h2 className="mt-2 text-2xl font-semibold">Submit invoice package</h2>
        <p className="mt-2 text-sm leading-6 text-[#c7d4df]">
          Select an approved broker from Atlas records or add a new broker manually, then upload your rate confirmation,
          invoice, and signed BOL/POD.
        </p>
      </div>

      <section className="grid gap-4 rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#162026]">Broker / customer</label>
            <Select value={selectedBrokerId} onChange={(event) => setSelectedBrokerId(event.target.value)}>
              <option value="manual">Broker not listed - enter manually</option>
              {brokers.map((broker) => (
                <option key={broker.id} value={broker.id}>
                  {broker.broker_name} {broker.broker_mc ? `(MC ${broker.broker_mc})` : ""}
                </option>
              ))}
            </Select>
          </div>
          <div className="rounded-lg border border-[#d1dad6] bg-white px-4 py-3 text-sm text-[#40515a]">
            <p className="font-semibold text-[#162026]">Saved broker directory</p>
            <p>{brokers.length} Atlas broker records available</p>
          </div>
        </div>

        {selectedBroker ? (
          <div className="grid gap-3 rounded-lg border border-[#9ccbc8] bg-[#e7f6f5] p-4 md:grid-cols-3">
            <input type="hidden" name="broker_id" value={selectedBroker.id} />
            <input type="hidden" name="broker_name" value={selectedBroker.broker_name} />
            <input type="hidden" name="broker_mc" value={selectedBroker.broker_mc ?? ""} />
            <input type="hidden" name="broker_email" value={selectedBroker.email ?? "broker@atlasdemo.com"} />
            <input type="hidden" name="broker_phone" value={selectedBroker.phone ?? ""} />
            <input type="hidden" name="broker_address" value={selectedBroker.address ?? ""} />
            <div>
              <p className="text-xs uppercase tracking-wide text-[#0a5961]">Selected broker</p>
              <p className="mt-1 font-semibold text-[#162026]">{selectedBroker.broker_name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#0a5961]">Verification email</p>
              <p className="mt-1 font-semibold text-[#162026]">{selectedBroker.email ?? "On file after review"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#0a5961]">Terms</p>
              <p className="mt-1 font-semibold text-[#162026]">{selectedBroker.payment_terms ?? "Atlas review"}</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="broker_name" placeholder="Broker / customer name" required />
            <Input name="broker_mc" placeholder="Broker MC number" />
            <Input name="broker_email" placeholder="Broker email" type="email" required />
            <Input name="broker_phone" placeholder="Broker phone" />
            <Input name="broker_address" placeholder="Broker address" className="md:col-span-2" />
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#56676f]">Load and invoice details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="load_number" placeholder="Load number" required />
          <Input name="invoice_number" placeholder="Invoice number" required />
          <Input name="rate_amount" type="number" min={0} step="0.01" placeholder="Rate amount" required />
          <Input name="total_invoice_amount" type="number" min={0} step="0.01" placeholder="Total invoice amount" required />
          <Input name="accessorials" type="number" min={0} step="0.01" placeholder="Accessorials" />
          <Input name="lumper_amount" type="number" min={0} step="0.01" placeholder="Lumper amount" />
          <Input name="detention_amount" type="number" min={0} step="0.01" placeholder="Detention amount" />
          <Input name="pickup_date" type="date" required />
          <Input name="delivery_date" type="date" required />
          <Input name="origin" placeholder="Origin" required />
          <Input name="destination" placeholder="Destination" required />
          <Input name="commodity" placeholder="Commodity" />
        </div>
      </section>

      <Textarea name="notes" rows={3} placeholder="Notes for Atlas operations" />
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
        Submit invoice package
      </Button>
      {message ? <p className="text-sm font-medium text-[#0a7c86]">{message}</p> : null}
    </form>
  );
}
