"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BrokerCreditCheckForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid gap-4 rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/broker-credit-checks", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setMessage(response.ok ? "Broker check request submitted." : data.error || "Request failed.");
      }}
    >
      <h2 className="text-xl font-semibold text-[#162026]">Request Broker Credit Check</h2>
      <Input name="broker_name" placeholder="Broker name" required />
      <Input name="mc_number" placeholder="MC number" />
      <Input name="contact_email" placeholder="Contact email" type="email" />
      <Input name="load_amount" placeholder="Load amount" type="number" step="0.01" min={0} />
      <Textarea name="notes" rows={3} placeholder="Notes" />
      <Button type="submit" className="w-full md:w-auto">
        Submit request
      </Button>
      {message ? <p className="text-sm text-[#0a7c86]">{message}</p> : null}
    </form>
  );
}
