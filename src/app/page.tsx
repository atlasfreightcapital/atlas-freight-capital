import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileUp,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { AtlasStorySlider } from "@/components/marketing/atlas-story-slider";
import { Button } from "@/components/ui/button";

const trustBlocks = [
  { title: "Fast funding review", body: "Complete paperwork helps Atlas review invoices quickly and keep carriers updated at each step.", icon: Timer },
  { title: "Private document handling", body: "Rate confirmations, invoices, PODs, and compliance files stay inside secured account workflows.", icon: ShieldCheck },
  { title: "Broker verification", body: "Atlas reviews broker details and payment information before eligible invoices move toward funding.", icon: Building2 },
  { title: "Partner-backed capital", body: "Atlas can work with funding partners while keeping the carrier experience under the Atlas brand.", icon: CircleDollarSign },
];

const stats = [
  { value: "24/7", label: "secure portal access for approved carrier accounts" },
  { value: "90%", label: "common advance target, subject to program approval" },
  { value: "Private", label: "signed document access for sensitive paperwork" },
  { value: "Clear", label: "invoice stages carriers can understand at a glance" },
];

const steps = [
  {
    title: "Apply and onboard",
    body: "Submit your company details, W9, MC authority, insurance, registration documents, owner ID, and banking placeholder documents through Atlas.",
  },
  {
    title: "Upload load paperwork",
    body: "Approved carrier users submit rate confirmations, invoices, BOL/POD files, lumper receipts, detention proof, and supporting documents from the secure portal.",
  },
  {
    title: "Atlas verifies broker and documents",
    body: "Atlas operations reviews the package, checks for missing files, flags duplicate invoices, and verifies broker/payment risk before the load moves forward.",
  },
  {
    title: "Funding review and status tracking",
    body: "Atlas can route eligible submissions to assigned backend funding partners while keeping carrier-facing branding and partner visibility controlled.",
  },
  {
    title: "Funding, reserves, and payment visibility",
    body: "Carriers can track funding status, open invoices, reserve balances, broker payment updates, and messages without seeing internal spread or partner pricing.",
  },
];

const benefits = [
  {
    title: "Simple driver-friendly uploads",
    body: "No complicated finance screens for carriers. The carrier portal focuses on documents, status, messages, and funding visibility.",
  },
  {
    title: "Broker checks before booking",
    body: "Onboarded carriers can request broker checks before committing to a load and receive a clear result from Atlas.",
  },
  {
    title: "Transparent carrier experience",
    body: "Carriers see practical statuses such as submitted, reviewing, approved, funded, and need documents instead of backend underwriting terminology.",
  },
  {
    title: "Built for new MCs and small fleets",
    body: "Atlas supports structured onboarding for carriers that need compliance review, UCC/release tracking, and broker risk controls.",
  },
];

const carrierOnlyFeatures = [
  {
    title: "Broker credit checks",
    href: "/broker-credit-check",
    icon: ClipboardCheck,
    body: "Approved carriers can request a broker check before booking a load. Atlas keeps the carrier result simple while internal risk notes stay restricted to operations.",
  },
  {
    title: "Rate confirmation upload",
    href: "/submit-load",
    icon: FileUp,
    body: "Rate confirmations, invoices, BOL/POD files, lumper receipts, detention proof, and other documents are uploaded only after carrier login.",
  },
  {
    title: "Private carrier dashboard",
    href: "/login",
    icon: LockKeyhole,
    body: "Approved carriers get a secure workspace for load status, missing documents, funding visibility, reserve tracking, payments, and Atlas messages.",
  },
];

const programFit = [
  {
    title: "Owner-operators",
    body: "A clean way to submit paperwork, request broker checks, and stay focused on hauling instead of chasing payment updates.",
  },
  {
    title: "New MC carriers",
    body: "Structured onboarding for authority documents, insurance review, UCC/release issues, and broker risk controls.",
  },
  {
    title: "Small fleets",
    body: "A shared carrier workspace for dispatch, office staff, load documents, reserve visibility, and Atlas support messages.",
  },
  {
    title: "Growing carriers",
    body: "Operational infrastructure for more broker checks, more invoice volume, and a cleaner path from load submission to payment.",
  },
];

const platformCapabilities = [
  { title: "Application review", body: "Carrier profile, documents, compliance status, and underwriting notes in one workflow.", icon: FileCheck2 },
  { title: "Load package intake", body: "Rate confirmation, invoice, BOL/POD, lumper, detention, email approval, and other support files.", icon: ReceiptText },
  { title: "Broker risk database", body: "Internal broker history, payment trends, disputes, chargebacks, limits, and risk level controls.", icon: Building2 },
  { title: "Reserve tracking", body: "Reserve held by invoice, release status, payment application, chargeback application, and history.", icon: CircleDollarSign },
  { title: "Messages and notes", body: "Carrier-facing messages, internal Atlas notes, and partner notes separated by role visibility.", icon: MessageSquareText },
  { title: "Partner routing", body: "Manual and rule-based routing by carrier, broker risk, invoice amount, state, capacity, and buy-rate.", icon: MapPinned },
];

const complianceItems = [
  "Private Supabase Storage buckets with signed links",
  "Carrier documents restricted to the carrier account",
  "Partner users only see assigned submissions",
  "Atlas admin audit trails for status and document access",
  "White-label controls keep backend partner names hidden by default",
  "Future-ready structure for OCR, Plaid, QuickBooks, Twilio, DocuSign, and payment reconciliation",
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <MarketingHeader />
      <main className="w-full">
        <section className="relative w-full overflow-hidden border-b border-[#10243d] bg-[#071426] px-4 py-16 lg:px-10 lg:py-24">
          <div className="atlas-glow absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#0a7c86]/30" />
          <div className="atlas-glow absolute right-10 top-36 h-96 w-96 rounded-full bg-[#0d5c83]/25" />
          <div className="relative grid min-h-[560px] w-full gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="max-w-5xl">
              <p className="text-sm uppercase tracking-[0.28em] text-[#65d8e1]">Atlas Freight Capital</p>
              <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-tight text-white lg:text-7xl">
                Fast Freight Factoring Built for Carriers
              </h1>
              <p className="mt-7 max-w-4xl text-xl leading-9 text-[#c7d4df]">
                Submit loads, upload paperwork, track funding, and get paid faster through a secure Atlas carrier
                portal built for owner-operators, new MCs, small fleets, and growing trucking companies.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/apply-now">
                  <Button size="lg">Apply Now</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary">
                    Carrier Login
                  </Button>
                </Link>
              </div>
              <div className="mt-12 grid gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-l border-[#1e3552] pl-4">
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm leading-5 text-[#9fb2c1]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="atlas-hero-card atlas-perspective grid gap-4 rounded-2xl border border-[#1e3552] bg-[#0d1b2f]/95 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c7d4df]">Trust signals</p>
              {trustBlocks.map(({ title, body, icon: Icon }) => (
                <div
                  key={title}
                  className="atlas-lift flex items-start gap-4 rounded-xl border border-[#1e3552] bg-[#071426] p-5"
                >
                  <Icon className="mt-1 h-5 w-5 text-[#65d8e1]" />
                  <div>
                    <p className="text-base font-semibold text-[#eef5f8]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#9fb2c1]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AtlasStorySlider />

        <section className="w-full border-b border-[#d7dfdc] bg-white px-4 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">Who Atlas supports</p>
              <h2 className="mt-3 text-4xl font-semibold text-[#071426]">Built for carriers at different stages.</h2>
              <p className="mt-4 text-lg leading-8 text-[#40515a]">
                Atlas is designed for trucking companies that need fast document intake, practical funding visibility,
                broker review, and a professional back office without forcing carriers into complicated finance screens.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {programFit.map((item) => (
                <div key={item.title} className="atlas-lift rounded-xl border border-[#d1dad6] bg-[#fbfcfa] p-7">
                  <h3 className="text-2xl font-semibold text-[#071426]">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#40515a]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-b border-[#d7dfdc] bg-[#eef3f1] px-4 py-16 lg:px-10">
          <div className="mb-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">Carrier-only tools</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#071426]">Powerful tools, protected behind onboarding.</h2>
            <p className="mt-4 text-lg leading-8 text-[#40515a]">
              Public visitors can learn how Atlas works, but sensitive workflows like broker checks and load uploads
              stay inside the secure carrier portal.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {carrierOnlyFeatures.map(({ title, href, icon: Icon, body }) => (
              <Link
                key={title}
                href={href}
                className="atlas-lift rounded-xl border border-[#d1dad6] bg-white p-8 shadow-sm transition hover:border-[#0a7c86]"
              >
                <Icon className="h-7 w-7 text-[#0a7c86]" />
                <h2 className="mt-5 text-2xl font-semibold text-[#071426]">{title}</h2>
                <p className="mt-3 text-base leading-7 text-[#40515a]">{body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="w-full border-b border-[#d7dfdc] bg-white px-4 py-16 lg:px-10">
          <div className="mb-10 max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">Platform capabilities</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#071426]">More than a form. A full factoring operating system.</h2>
            <p className="mt-4 text-lg leading-8 text-[#40515a]">
              The carrier portal stays simple, while Atlas has the operational tooling needed for review, broker risk,
              partner routing, pricing, reserves, payments, reporting, compliance, and audit history.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {platformCapabilities.map(({ title, body, icon: Icon }) => (
              <div key={title} className="atlas-lift rounded-xl border border-[#d1dad6] bg-[#fbfcfa] p-7">
                <Icon className="h-7 w-7 text-[#0a7c86]" />
                <h3 className="mt-5 text-2xl font-semibold text-[#071426]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#40515a]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid w-full gap-8 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="atlas-lift rounded-xl border border-[#d1dad6] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0a7c86]">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#071426]">From application to funded invoice.</h2>
            <ol className="mt-8 grid gap-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 text-[#1d2a30]">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9f0ee] text-sm font-semibold text-[#075b63]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#071426]">{step.title}</h3>
                    <p className="mt-2 text-base leading-7 text-[#40515a]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="atlas-lift rounded-xl border border-[#10243d] bg-[#071426] p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#65d8e1]">Carrier benefits</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Built for carriers who need clarity.</h2>
            <ul className="mt-8 grid gap-5">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="rounded-lg border border-[#1e3552] bg-[#0d1b2f] p-5">
                  <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-base leading-7 text-[#c7d4df]">{benefit.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full border-y border-[#10243d] bg-[#071426] px-4 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#65d8e1]">Broker risk and verification</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Know more before you advance against a load.</h2>
              <p className="mt-4 text-lg leading-8 text-[#c7d4df]">
                Atlas supports broker credit check requests, internal broker profiles, payment trends, risk levels,
                credit limits, disputes, chargebacks, and broker verification history. Carriers see simple results,
                while Atlas keeps deeper risk context inside operations.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                "Broker profile and MC/DOT details",
                "Payment terms and average days to pay",
                "Internal credit score and credit limit",
                "Dispute, chargeback, and blocked broker controls",
                "Verification email status and manual review notes",
              ].map((item) => (
                  <div key={item} className="atlas-lift rounded-xl border border-[#1e3552] bg-[#0d1b2f] p-5 text-base text-[#eef5f8]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full border-b border-[#d7dfdc] bg-[#eef3f1] px-4 py-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">Security and compliance</p>
              <h2 className="mt-3 text-4xl font-semibold text-[#071426]">Designed around private paperwork and controlled access.</h2>
              <p className="mt-4 text-lg leading-8 text-[#40515a]">
                Freight factoring involves sensitive carrier, broker, invoice, banking, and payment information. Atlas
                is structured so access is tied to role, ownership, and partner assignment.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {complianceItems.map((item) => (
                <div key={item} className="atlas-lift rounded-xl border border-[#d1dad6] bg-white p-5 text-base leading-7 text-[#1d2a30] shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-4 mb-16 rounded-lg border border-[#d1dad6] bg-white p-8 shadow-sm lg:mx-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7c86]">Ready to start?</p>
              <h2 className="mt-3 text-4xl font-semibold text-[#071426]">Apply for a carrier account with Atlas Freight Capital.</h2>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-[#40515a]">
                Submit your application, complete onboarding, and unlock the secure carrier portal for broker checks,
                load paperwork, funding status, reserves, and messages.
              </p>
            </div>
            <Link href="/apply-now">
              <Button size="lg">Apply Now</Button>
            </Link>
          </div>
          <p className="mt-8 max-w-4xl border-t border-[#d1dad6] pt-6 text-base leading-7 text-[#40515a]">
            Funding subject to verification, underwriting, and partner approval.
          </p>
          <Link href="/apply-now" className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-[#0a7c86]">
            Start your application <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
