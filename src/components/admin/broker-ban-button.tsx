"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BrokerBanButton({
  brokerId,
  brokerName,
  enabled = true,
}: {
  brokerId: string;
  brokerName: string;
  enabled?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function banBroker() {
    if (!enabled) {
      setMessage("Demo broker shown for testing. Save a real Supabase broker to block it permanently.");
      return;
    }
    if (!confirm(`Block ${brokerName} from factoring approvals?`)) return;
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/brokers/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        broker_id: brokerId,
        reason: "Admin manually blocked broker from profile page.",
      }),
    });
    const result = await response.json();
    setLoading(false);
    setMessage(response.ok ? "Broker blocked and audit log recorded." : result.error ?? "Could not block broker.");
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="danger" onClick={banBroker} disabled={loading}>
        {loading ? "Blocking..." : "Block broker"}
      </Button>
      {message ? <p className="text-sm font-medium text-[#0a7c86]">{message}</p> : null}
    </div>
  );
}
