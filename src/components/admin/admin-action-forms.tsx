"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  loading: boolean;
  message: string;
  error: boolean;
};

const initialState: FormState = { loading: false, message: "", error: false };

async function postJson(endpoint: string, payload: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Request failed");
  return result;
}

function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p className={state.error ? "text-sm font-medium text-[#b42318]" : "text-sm font-medium text-[#0a7c86]"}>
      {state.message}
    </p>
  );
}

function asForm(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries());
}

export function ApplicationStatusForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: "", error: false });
    const form = asForm(event.currentTarget);
    try {
      await postJson("/api/admin/applications/status", form);
      event.currentTarget.reset();
      setState({ loading: false, message: "Application status updated and logged.", error: false });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : "Update failed", error: true });
    }
  }

  return (
    <Card title="Application command center">
      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-2">
        <Input name="application_id" required placeholder="Application ID" />
        <Select name="status" defaultValue="under_atlas_review">
          <option value="submitted">Submitted</option>
          <option value="under_atlas_review">Under Atlas review</option>
          <option value="more_info_needed">More info needed</option>
          <option value="compliance_review">Compliance review</option>
          <option value="ucc_review">UCC review</option>
          <option value="partner_review">Partner review</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="onboarded">Onboarded</option>
        </Select>
        <Textarea name="note" placeholder="Internal status note for audit log and operations handoff" rows={4} className="lg:col-span-2" />
        <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
          <Button type="submit" disabled={state.loading}>{state.loading ? "Updating..." : "Update application"}</Button>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

export function BrokerRiskForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: "", error: false });
    const form = asForm(event.currentTarget);
    try {
      await postJson("/api/admin/brokers", {
        broker_name: form.broker_name,
        broker_mc: form.broker_mc,
        email: form.email,
        phone: form.phone,
        credit_score_internal: form.credit_score_internal,
        credit_limit: form.credit_limit,
        average_days_to_pay: form.average_days_to_pay,
        risk_level: form.risk_level,
        notes: form.notes,
      });
      event.currentTarget.reset();
      setState({ loading: false, message: "Broker saved with updated risk controls.", error: false });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : "Broker save failed", error: true });
    }
  }

  return (
    <Card title="Broker risk desk">
      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-4">
        <Input name="broker_name" required placeholder="Broker / customer name" className="lg:col-span-2" />
        <Input name="broker_mc" placeholder="Broker MC" />
        <Select name="risk_level" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="blocked">Blocked</option>
        </Select>
        <Input name="email" type="email" placeholder="AR / verification email" />
        <Input name="phone" placeholder="Phone" />
        <Input name="credit_score_internal" type="number" min="0" max="100" placeholder="Internal score 0-100" />
        <Input name="credit_limit" type="number" min="0" placeholder="Credit limit" />
        <Input name="average_days_to_pay" type="number" min="0" placeholder="Average days to pay" />
        <Textarea name="notes" placeholder="Risk notes, payment pattern, claims, or special verification instructions" rows={4} className="lg:col-span-3" />
        <div className="flex flex-wrap items-center gap-3 lg:col-span-4">
          <Button type="submit" disabled={state.loading}>{state.loading ? "Saving..." : "Save broker risk"}</Button>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

export function PartnerCreateForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: "", error: false });
    const form = asForm(event.currentTarget);
    try {
      await postJson("/api/admin/partners", {
        company_name: form.company_name,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        status: form.status,
        buy_rate_min: form.buy_rate_min,
        buy_rate_max: form.buy_rate_max,
        max_invoice_amount: form.max_invoice_amount,
        accepts_new_mc: form.accepts_new_mc === "on",
        accepts_active_ucc: form.accepts_active_ucc === "on",
        avg_approval_hours: form.avg_approval_hours,
      });
      event.currentTarget.reset();
      setState({ loading: false, message: "Funding partner created.", error: false });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : "Partner creation failed", error: true });
    }
  }

  return (
    <Card title="Partner capacity setup">
      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-4">
        <Input name="company_name" required placeholder="Funding partner company" className="lg:col-span-2" />
        <Input name="contact_name" placeholder="Primary contact" />
        <Select name="status" defaultValue="active">
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="inactive">Inactive</option>
        </Select>
        <Input name="email" type="email" placeholder="Partner email" />
        <Input name="phone" placeholder="Phone" />
        <Input name="buy_rate_min" type="number" min="0" step="0.01" required placeholder="Buy-rate min %" />
        <Input name="buy_rate_max" type="number" min="0" step="0.01" required placeholder="Buy-rate max %" />
        <Input name="max_invoice_amount" type="number" min="0" required placeholder="Max invoice amount" />
        <Input name="avg_approval_hours" type="number" min="0" placeholder="Avg approval hours" />
        <label className="flex items-center gap-2 rounded-md border border-[#d1dad6] bg-[#fbfcfa] px-3 text-sm text-[#1d2a30]">
          <input name="accepts_new_mc" type="checkbox" /> Accepts new MC
        </label>
        <label className="flex items-center gap-2 rounded-md border border-[#d1dad6] bg-[#fbfcfa] px-3 text-sm text-[#1d2a30]">
          <input name="accepts_active_ucc" type="checkbox" /> Accepts active UCC
        </label>
        <div className="flex flex-wrap items-center gap-3 lg:col-span-4">
          <Button type="submit" disabled={state.loading}>{state.loading ? "Creating..." : "Create partner"}</Button>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

export function PaymentRecordForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: "", error: false });
    const form = asForm(event.currentTarget);
    try {
      await postJson("/api/admin/payments", form);
      event.currentTarget.reset();
      setState({ loading: false, message: "Broker payment recorded.", error: false });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : "Payment save failed", error: true });
    }
  }

  return (
    <Card title="Broker payment posting">
      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-4">
        <Input name="load_submission_id" required placeholder="Load submission ID" className="lg:col-span-2" />
        <Input name="broker_id" placeholder="Broker ID optional" className="lg:col-span-2" />
        <Input name="expected_payment_date" type="date" />
        <Input name="actual_payment_date" type="date" />
        <Input name="payment_amount" type="number" min="0" step="0.01" placeholder="Payment amount" />
        <Input name="short_pay_amount" type="number" min="0" step="0.01" placeholder="Short pay amount" />
        <Select name="status" defaultValue="received">
          <option value="expected">Expected</option>
          <option value="received">Received</option>
          <option value="short_paid">Short paid</option>
          <option value="disputed">Disputed</option>
          <option value="applied">Applied</option>
          <option value="closed">Closed</option>
        </Select>
        <Input name="payment_reference" placeholder="ACH/check/reference" />
        <Textarea name="notes" placeholder="Payment notes, short-pay reason, reserve action, or reconciliation detail" rows={4} className="lg:col-span-2" />
        <div className="flex flex-wrap items-center gap-3 lg:col-span-4">
          <Button type="submit" disabled={state.loading}>{state.loading ? "Posting..." : "Record payment"}</Button>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

export function ReserveRecordForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: "", error: false });
    const form = asForm(event.currentTarget);
    try {
      await postJson("/api/admin/reserves", form);
      event.currentTarget.reset();
      setState({ loading: false, message: "Reserve movement recorded.", error: false });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : "Reserve save failed", error: true });
    }
  }

  return (
    <Card title="Reserve ledger action">
      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-4">
        <Input name="carrier_id" required placeholder="Carrier ID" className="lg:col-span-2" />
        <Input name="load_submission_id" placeholder="Load submission ID optional" className="lg:col-span-2" />
        <Input name="amount" required type="number" min="0" step="0.01" placeholder="Reserve amount" />
        <Select name="status" defaultValue="held">
          <option value="held">Held</option>
          <option value="pending_release">Pending release</option>
          <option value="released">Released</option>
          <option value="applied_to_fee">Applied to fee</option>
          <option value="applied_to_chargeback">Applied to chargeback</option>
        </Select>
        <Input name="release_date" type="date" />
        <Input name="notes" placeholder="Ledger note" />
        <div className="flex flex-wrap items-center gap-3 lg:col-span-4">
          <Button type="submit" disabled={state.loading}>{state.loading ? "Saving..." : "Record reserve"}</Button>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

export function ComplianceReviewForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, message: "", error: false });
    const form = asForm(event.currentTarget);
    try {
      await postJson("/api/admin/compliance-review", form);
      event.currentTarget.reset();
      setState({ loading: false, message: "Compliance review recorded.", error: false });
    } catch (error) {
      setState({ loading: false, message: error instanceof Error ? error.message : "Compliance save failed", error: true });
    }
  }

  return (
    <Card title="Compliance decision">
      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-3">
        <Input name="carrier_id" required placeholder="Carrier ID" />
        <Select name="status" defaultValue="needs_review">
          <option value="clear">Clear</option>
          <option value="needs_review">Needs review</option>
          <option value="hold">Hold</option>
          <option value="blocked">Blocked</option>
        </Select>
        <Textarea name="notes" placeholder="Compliance notes, missing docs, fraud flags, insurance/UCC detail" rows={4} className="lg:col-span-3" />
        <div className="flex flex-wrap items-center gap-3 lg:col-span-3">
          <Button type="submit" disabled={state.loading}>{state.loading ? "Saving..." : "Record review"}</Button>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}
