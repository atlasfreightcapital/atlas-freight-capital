"use client";

import { useState } from "react";
import { CheckCircle2, DollarSign, MailCheck, Route, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

async function postJson(path: string, payload: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export function AdminLoadWorkbench() {
  const [message, setMessage] = useState("");

  async function submitStatus(formData: FormData) {
    const result = await postJson("/api/admin/load-status", {
      load_submission_id: formData.get("load_submission_id"),
      new_status: formData.get("new_status"),
      note: formData.get("note"),
    });
    setMessage(`Status updated: ${result.ok ? "saved" : "pending"}`);
  }

  async function submitAssignment(formData: FormData) {
    await postJson("/api/admin/assign-partner", {
      load_submission_id: formData.get("load_submission_id"),
      partner_id: formData.get("partner_id"),
      assignment_reason: formData.get("assignment_reason"),
      manual_override: formData.get("manual_override") === "on",
    });
    setMessage("Partner assignment saved.");
  }

  async function submitPricing(formData: FormData) {
    const result = await postJson("/api/admin/pricing", {
      load_submission_id: formData.get("load_submission_id"),
      carrier_rate_percent: formData.get("carrier_rate_percent"),
      backend_buy_rate_percent: formData.get("backend_buy_rate_percent"),
      advance_percent: formData.get("advance_percent"),
      invoice_amount: formData.get("invoice_amount"),
      fee_timing: formData.get("fee_timing"),
    });
    setMessage(`Pricing saved. Net payout estimate: $${Number(result.pricing.netPayoutEstimate).toFixed(2)}`);
  }

  async function submitBrokerVerification(formData: FormData) {
    const result = await postJson("/api/admin/broker-verifications", {
      load_submission_id: formData.get("load_submission_id"),
      action: formData.get("action"),
      broker_response: formData.get("broker_response"),
      email_thread_reference: formData.get("email_thread_reference"),
    });
    setMessage(`Broker verification marked ${result.status}.`);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <div className="rounded-lg border border-[#9ccbc8] bg-[#e4f4f2] px-4 py-3 text-sm text-[#075b63]">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Status Control">
          <form action={submitStatus} className="grid gap-3">
            <Input name="load_submission_id" placeholder="Load submission ID" required />
            <Select name="new_status" defaultValue="atlas_review">
              <option value="atlas_review">Atlas review</option>
              <option value="missing_documents">Missing documents</option>
              <option value="broker_verification_pending">Broker verification pending</option>
              <option value="broker_verified">Broker verified</option>
              <option value="sent_to_funding_partner">Sent to funding partner</option>
              <option value="approved_for_advance">Approved for advance</option>
              <option value="funded">Funded</option>
              <option value="rejected">Rejected</option>
              <option value="dispute">Dispute</option>
              <option value="chargeback">Chargeback</option>
            </Select>
            <Textarea name="note" rows={3} placeholder="Status note" />
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Update status
            </Button>
          </form>
        </Card>

        <Card title="Partner Assignment">
          <form action={submitAssignment} className="grid gap-3">
            <Input name="load_submission_id" placeholder="Load submission ID" required />
            <Input name="partner_id" placeholder="Funding partner ID" required />
            <Textarea name="assignment_reason" rows={3} placeholder="Routing reason" />
            <label className="flex items-center gap-2 text-sm text-[#40515a]">
              <input name="manual_override" type="checkbox" className="h-4 w-4 accent-[#0a7c86]" />
              Manual override
            </label>
            <Button type="submit" className="gap-2">
              <Route className="h-4 w-4" />
              Assign partner
            </Button>
          </form>
        </Card>

        <Card title="Pricing Engine">
          <form action={submitPricing} className="grid gap-3">
            <Input name="load_submission_id" placeholder="Load submission ID" required />
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="invoice_amount" type="number" step="0.01" placeholder="Invoice amount" required />
              <Input name="advance_percent" type="number" step="0.01" placeholder="Advance percent" defaultValue="90" />
              <Input name="carrier_rate_percent" type="number" step="0.01" placeholder="Carrier rate" defaultValue="3" />
              <Input
                name="backend_buy_rate_percent"
                type="number"
                step="0.01"
                placeholder="Backend buy-rate"
                defaultValue="1.75"
              />
            </div>
            <Select name="fee_timing" defaultValue="upfront">
              <option value="upfront">Fee taken upfront</option>
              <option value="after_payment">Fee taken after broker pays</option>
            </Select>
            <Button type="submit" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Save pricing
            </Button>
          </form>
        </Card>

        <Card title="Broker Verification">
          <form action={submitBrokerVerification} className="grid gap-3">
            <Input name="load_submission_id" placeholder="Load submission ID" required />
            <Select name="action" defaultValue="send">
              <option value="send">Send verification</option>
              <option value="confirm">Confirmed</option>
              <option value="deny">Denied</option>
              <option value="no_response">No response</option>
              <option value="manual">Manual verification</option>
            </Select>
            <Input name="email_thread_reference" placeholder="Email thread reference" />
            <Textarea name="broker_response" rows={3} placeholder="Broker response or manual note" />
            <Button type="submit" className="gap-2">
              <MailCheck className="h-4 w-4" />
              Save verification
            </Button>
          </form>
        </Card>
      </div>

      <Card title="Partner Package Email">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <p className="text-sm text-[#40515a]">
            This control is ready for the email provider layer. The verification API already records the operational
            state and audit trail.
          </p>
          <Button type="button" variant="secondary" className="gap-2">
            <Send className="h-4 w-4" />
            Queue email
          </Button>
        </div>
      </Card>
    </div>
  );
}
