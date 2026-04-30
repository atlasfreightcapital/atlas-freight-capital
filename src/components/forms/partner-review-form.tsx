"use client";

import { useState } from "react";
import { Check, Clock, FileWarning, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const decisionIcon = {
  approve: Check,
  reject: X,
  need_info: FileWarning,
  funded: Send,
  broker_paid: Clock,
};

export function PartnerReviewForm() {
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState<keyof typeof decisionIcon>("approve");
  const Icon = decisionIcon[decision];

  async function submitReview(formData: FormData) {
    const response = await fetch("/api/partner/submission-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        load_submission_id: formData.get("load_submission_id"),
        decision: formData.get("decision"),
        approved_advance_amount: formData.get("approved_advance_amount") || undefined,
        backend_buy_rate_percent: formData.get("backend_buy_rate_percent") || undefined,
        funding_date: formData.get("funding_date") || undefined,
        rejection_reason: formData.get("rejection_reason") || undefined,
        partner_note: formData.get("partner_note") || undefined,
      }),
    });

    const data = await response.json();
    setMessage(response.ok ? `Review saved: ${data.status}` : data.error ?? "Review failed");
  }

  return (
    <Card title="Submission Decision">
      <form action={submitReview} className="grid gap-3">
        <Input name="load_submission_id" placeholder="Assigned load submission ID" required />
        <Select
          name="decision"
          value={decision}
          onChange={(event) => setDecision(event.target.value as keyof typeof decisionIcon)}
        >
          <option value="approve">Approve advance</option>
          <option value="reject">Reject submission</option>
          <option value="need_info">Request more documents</option>
          <option value="funded">Mark funded</option>
          <option value="broker_paid">Mark broker paid</option>
        </Select>
        <div className="grid gap-3 md:grid-cols-3">
          <Input name="approved_advance_amount" type="number" step="0.01" placeholder="Approved advance" />
          <Input name="backend_buy_rate_percent" type="number" step="0.01" placeholder="Backend buy-rate" />
          <Input name="funding_date" type="date" />
        </div>
        <Textarea name="partner_note" rows={3} placeholder="Private partner note" />
        <Textarea name="rejection_reason" rows={3} placeholder="Rejection or missing document reason" />
        <Button type="submit" className="gap-2">
          <Icon className="h-4 w-4" />
          Submit decision
        </Button>
        {message ? <p className="text-sm text-[#0a7c86]">{message}</p> : null}
      </form>
    </Card>
  );
}
