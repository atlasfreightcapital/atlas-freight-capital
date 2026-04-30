import Link from "next/link";
import { FileCheck2, LockKeyhole, UploadCloud } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SubmitLoadPage() {
  return (
    <div>
      <MarketingHeader />
      <main className="w-full bg-[#f4f7f6] px-4 py-12 lg:px-10">
        <section className="grid gap-8 rounded-lg border border-[#10243d] bg-[#071426] p-8 lg:grid-cols-[1fr_0.7fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#65d8e1]">Carrier portal feature</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-white lg:text-5xl">
              Submit Load Paperwork After Carrier Login
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#c7d4df]">
              Rate confirmations, invoices, BOL/POD documents, lumper receipts, detention proof, and other load
              paperwork are handled inside the secure Atlas carrier portal. This keeps carrier documents private,
              ties each upload to an approved carrier account, and lets Atlas track status history, broker
              verification, funding review, reserves, and payment activity in one controlled workflow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg">Carrier Login</Button>
              </Link>
              <Link href="/apply-now">
                <Button size="lg" variant="secondary">
                  Apply for Access
                </Button>
              </Link>
            </div>
          </div>
          <Card title="Secure upload workflow">
            <div className="space-y-4 text-sm leading-6 text-[#40515a]">
              <div className="flex gap-3">
                <LockKeyhole className="mt-1 h-4 w-4 text-[#0a7c86]" />
                <p>Only onboarded carrier users can submit load packages and view their funding status.</p>
              </div>
              <div className="flex gap-3">
                <UploadCloud className="mt-1 h-4 w-4 text-[#0a7c86]" />
                <p>Private document storage uses signed access links instead of public file URLs.</p>
              </div>
              <div className="flex gap-3">
                <FileCheck2 className="mt-1 h-4 w-4 text-[#0a7c86]" />
                <p>Atlas operations reviews documents, verifies brokers, routes deals, and updates timelines.</p>
              </div>
            </div>
          </Card>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
