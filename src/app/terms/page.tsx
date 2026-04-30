import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function TermsPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Terms of Use"
        subtitle="Use of Atlas Freight Capital is intended for business factoring inquiries, carrier onboarding, invoice submission, and related account workflows."
        points={[
          "Funding is subject to verification, underwriting, documentation, broker review, and applicable partner requirements.",
          "Users are responsible for submitting accurate business, carrier authority, invoice, broker, and payment information.",
          "Uploaded documents should be complete, current, and authorized for factoring review or servicing.",
          "Atlas may request additional information before approving applications, invoices, advances, reserve releases, or payment changes.",
          "Platform access may be limited or suspended when information is incomplete, disputed, unauthorized, fraudulent, or otherwise unsuitable for review.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
