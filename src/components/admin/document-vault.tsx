"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import type { DemoDocument } from "@/data/admin-demo";

export function DocumentVault({ documents }: { documents: DemoDocument[] }) {
  const [message, setMessage] = useState("");

  async function openDocument(document: DemoDocument) {
    if (!document.bucket || !document.path) {
      setMessage("Demo document placeholder. Real uploaded files will open with private signed URLs.");
      return;
    }

    setMessage("Generating secure signed link...");
    const response = await fetch("/api/documents/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket: document.bucket, path: document.path, expiresIn: 300 }),
    });
    const result = await response.json();
    if (!response.ok || !result.signedUrl) {
      setMessage(result.error ?? "Could not open document.");
      return;
    }
    window.open(result.signedUrl, "_blank", "noopener,noreferrer");
    setMessage("Secure document link opened. Link expires shortly.");
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="grid gap-3 rounded-lg border border-[#d1dad6] bg-[#fbfcfa] p-4 md:grid-cols-[1.2fr_0.7fr_0.6fr_auto]"
        >
          <div>
            <p className="font-semibold text-[#162026]">{document.name}</p>
            <p className="mt-1 text-xs text-[#62737a]">{document.type} · Uploaded {document.uploadedAt}</p>
          </div>
          <div className="flex items-center">
            <StatusChip status={document.status} />
          </div>
          <p className="flex items-center text-sm text-[#40515a]">
            {document.bucket && document.path ? "Private storage" : "Demo placeholder"}
          </p>
          <Button type="button" variant="secondary" onClick={() => openDocument(document)}>
            Open document
          </Button>
        </div>
      ))}
      {message ? <p className="text-sm font-medium text-[#0a7c86]">{message}</p> : null}
    </div>
  );
}
