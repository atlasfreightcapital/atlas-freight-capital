import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function HowItWorksPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="How Atlas Freight Capital Works"
        subtitle="A straightforward factoring flow built for owner-operators, small fleets, and enterprise carriers."
        points={[
          "Complete a digital onboarding package in minutes.",
          "Upload rate confirmation, invoice, and POD/BOL from mobile or desktop.",
          "Atlas verifies broker details and routes submissions for funding.",
          "Receive status updates from submitted through funded.",
          "Track reserves, settlements, and payment activity in one portal.",
          "Message operations directly for missing docs and questions.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
