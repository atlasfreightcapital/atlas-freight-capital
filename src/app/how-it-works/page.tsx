import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  FileUp,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";

const processSteps = [
  {
    title: "Start with a carrier application",
    icon: ClipboardList,
    body: "Tell Atlas about your company, authority, equipment, expected invoice volume, and current factoring situation. This helps Atlas understand how your business operates before load paperwork starts moving through the portal.",
    details: ["Business and owner information", "MC/DOT and fleet details", "Expected monthly invoice volume", "Factoring type requested"],
  },
  {
    title: "Complete onboarding documents",
    icon: ShieldCheck,
    body: "Atlas reviews the core documents needed to keep funding decisions clean and compliant. Missing or expired paperwork can delay invoice review, so the portal keeps document requirements visible.",
    details: ["W9 and MC authority", "Certificate of insurance", "Articles or registration", "Owner ID and banking document placeholder"],
  },
  {
    title: "Submit invoice paperwork",
    icon: FileUp,
    body: "Once your carrier account is ready, you can submit invoice packages from the secure portal. Select a saved broker when available or enter the broker manually if the customer is new.",
    details: ["Rate confirmation", "Carrier invoice", "Signed BOL/POD", "Lumper, detention, or supporting documents"],
  },
  {
    title: "Atlas reviews the package",
    icon: FileSearch,
    body: "Atlas checks the invoice package for required paperwork, duplicate invoice numbers, broker details, load information, and any items that need clarification before payment can move forward.",
    details: ["Document completeness", "Invoice and load matching", "Duplicate checks", "Missing paperwork requests"],
  },
  {
    title: "Broker verification and risk review",
    icon: Building2,
    body: "Before eligible invoices are funded, Atlas may review broker information, payment history, and confirmation details. Carriers see a simple status while Atlas handles the deeper review work.",
    details: ["Broker identity and payment details", "Payment terms", "Credit and risk review", "Confirmation status"],
  },
  {
    title: "Advance decision and payment",
    icon: Banknote,
    body: "When the invoice is accepted for funding, Atlas calculates the advance, reserve, and estimated payout. The carrier portal keeps the status clear so you can see whether the invoice is processing, pending, paid, or needs attention.",
    details: ["Estimated advance", "Reserve amount", "Factoring fee visibility", "Payment and reserve tracking"],
  },
];

const carrierStatuses = [
  {
    title: "Processing",
    body: "Atlas has the invoice and is reviewing documents, broker information, or funding readiness.",
  },
  {
    title: "Pending",
    body: "The invoice is verified or approved and waiting on the next payment step.",
  },
  {
    title: "Paid",
    body: "The advance has been issued or the broker payment has been posted.",
  },
  {
    title: "Needs Attention",
    body: "Atlas needs a document, correction, clarification, or other action before the invoice can continue.",
  },
];

const portalTools = [
  { title: "Invoice center", body: "View processing, pending, paid, and attention-needed invoices in separate sections.", icon: ReceiptText },
  { title: "Broker checks", body: "Request a broker review before booking a load when you want more confidence.", icon: CheckCircle2 },
  { title: "Messages", body: "Keep communication with Atlas organized around documents, invoices, and account questions.", icon: MessageCircle },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <MarketingHeader />
      <main>
        <section className="relative overflow-hidden bg-[#071426] px-4 py-16 text-white lg:px-10 lg:py-24">
          <div className="atlas-glow absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#0a7c86]/30" />
          <div className="atlas-glow absolute right-10 top-32 h-96 w-96 rounded-full bg-[#0d5c83]/25" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#65d8e1]">How factoring works</p>
              <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-tight lg:text-7xl">
                A clear path from delivered load to carrier payment.
              </h1>
              <p className="mt-7 max-w-4xl text-xl leading-9 text-[#c7d4df]">
                Atlas Freight Capital helps carriers organize paperwork, submit invoices, review broker information,
                track payment stages, and understand what is needed before an invoice can move forward.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/apply-now">
                  <Button size="lg">Apply Now</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary">Carrier Login</Button>
                </Link>
              </div>
            </div>
            <div className="atlas-hero-card rounded-2xl border border-[#1e3552] bg-[#0d1b2f]/95 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c7d4df]">Carrier outcome</p>
              <div className="mt-5 grid gap-4">
                {carrierStatuses.map((status) => (
                  <div key={status.title} className="atlas-lift rounded-xl border border-[#1e3552] bg-[#071426] p-5">
                    <p className="text-lg font-semibold text-white">{status.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#9fb2c1]">{status.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 lg:px-10">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">The Atlas process</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#071426]">What happens after you choose to factor an invoice?</h2>
            <p className="mt-4 text-lg leading-8 text-[#40515a]">
              Freight factoring is not just uploading a document and waiting. A clean funding process depends on carrier
              onboarding, complete paperwork, broker review, invoice verification, payment timing, and reserve tracking.
            </p>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-2">
            {processSteps.map(({ title, icon: Icon, body, details }, index) => (
              <article key={title} className="atlas-lift rounded-2xl border border-[#d1dad6] bg-[#fbfcfa] p-7 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d9f0ee] text-[#075b63]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0a7c86]">Step {index + 1}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#071426]">{title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#40515a]">{body}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div key={detail} className="rounded-lg border border-[#d1dad6] bg-white p-4 text-sm font-medium text-[#1d2a30]">
                      {detail}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#10243d] bg-[#071426] px-4 py-16 text-white lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#65d8e1]">Carrier portal</p>
              <h2 className="mt-3 text-4xl font-semibold">Built to make invoice status easier to understand.</h2>
              <p className="mt-4 text-lg leading-8 text-[#c7d4df]">
                Carriers should not have to decode back-office language. Atlas keeps the carrier view focused on simple
                payment stages, required paperwork, broker status, and next steps.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {portalTools.map(({ title, body, icon: Icon }) => (
                <div key={title} className="atlas-lift rounded-2xl border border-[#1e3552] bg-[#0d1b2f] p-6">
                  <Icon className="h-7 w-7 text-[#65d8e1]" />
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#c7d4df]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eef3f1] px-4 py-16 lg:px-10">
          <div className="rounded-2xl border border-[#d1dad6] bg-white p-8 shadow-sm lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">Ready to move faster?</p>
                <h2 className="mt-3 text-4xl font-semibold text-[#071426]">Start with an Atlas carrier application.</h2>
                <p className="mt-4 max-w-4xl text-lg leading-8 text-[#40515a]">
                  Once approved, your carrier account can submit invoices, upload paperwork, request broker checks, and
                  monitor payment activity through the Atlas portal.
                </p>
              </div>
              <Link href="/apply-now">
                <Button size="lg" className="gap-2">
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
