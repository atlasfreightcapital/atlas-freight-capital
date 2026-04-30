import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function AboutPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="About Atlas Freight Capital"
        subtitle="Atlas Freight Capital is built for carriers that want organized invoice submission, clearer payment visibility, and a professional factoring experience."
        points={[
          "Carrier-first workflows for applications, invoices, broker checks, and funding updates.",
          "Operations tools designed around document review, broker verification, compliance, reserves, and payment tracking.",
          "White-label partner infrastructure that keeps the carrier relationship under the Atlas brand.",
          "Secure account access for carriers, Atlas operations, underwriters, and assigned funding partners.",
          "A modern factoring platform built for owner-operators, new MCs, and growing small fleets.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
