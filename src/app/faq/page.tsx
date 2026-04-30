import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    q: "How fast can Atlas fund a load?",
    a: "Funding timing depends on the quality of the submitted paperwork, broker verification, underwriting review, and any partner approval requirements. Complete load packages with a clean invoice, signed rate confirmation, and clear BOL/POD documentation can typically move much faster than submissions that require corrections, missing documents, or manual broker follow-up.",
  },
  {
    q: "Can new MC carriers apply?",
    a: "Yes. Atlas is built to support new MCs and small fleets, but approval is still subject to authority status, insurance, W9, business registration, identity verification, UCC/factoring history, broker quality, and overall risk review. If an existing factor or active UCC is involved, Atlas may need a release letter or additional compliance documentation before onboarding can be completed.",
  },
  {
    q: "Can I track reserves and payments?",
    a: "Approved carriers can track open invoices, funded loads, reserve balances, reserve release status, broker payment activity, and important status changes from the carrier dashboard. The goal is to give carriers a simple view of what has been submitted, what is under review, what has funded, and what still needs action without exposing internal underwriting or partner pricing details.",
  },
  {
    q: "Do you work with backend funding partners?",
    a: "Atlas Freight Capital may work with third-party funding partners for underwriting, capital deployment, receivables processing, collections, and related services. The carrier-facing experience remains Atlas-branded by default, while backend routing is managed securely through assigned partner access, role-based permissions, and private document links.",
  },
  {
    q: "Can anyone upload a rate confirmation from the public website?",
    a: "No. Rate confirmations, invoices, BOL/POD documents, and related load files are accepted through the secure carrier portal after a carrier has been onboarded or connected to an approved Atlas account. This protects private documents, prevents unauthenticated submissions, and ensures every upload is tied to a carrier, load, status timeline, and audit trail.",
  },
  {
    q: "How does the broker credit check feature work?",
    a: "Broker credit checks are available to onboarded carriers inside the carrier portal. A carrier can request a review before booking a load by submitting broker details and the expected load amount. Atlas returns a simple carrier-friendly result such as approved, use caution, or not approved for factoring at this time, while internal risk notes remain restricted to Atlas operations.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <MarketingHeader />
      <main className="w-full bg-[#f4f7f6] px-4 py-12 lg:px-10">
        <section className="rounded-lg border border-[#10243d] bg-[#071426] p-8">
          <h1 className="text-4xl font-semibold text-white">FAQ</h1>
          <p className="mt-3 max-w-3xl text-[#c7d4df]">
            Clear answers for carriers evaluating Atlas Freight Capital.
          </p>
        </section>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <h2 className="text-lg font-semibold text-[#071426]">{faq.q}</h2>
              <p className="mt-3 text-base leading-7 text-[#40515a]">{faq.a}</p>
            </Card>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
