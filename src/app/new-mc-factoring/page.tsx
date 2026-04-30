import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function NewMcFactoringPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="New MC Factoring"
        subtitle="Specialized onboarding for new authorities that need structure, compliance support, and clear funding expectations."
        points={[
          "Guided document checklist for new MC carriers.",
          "Compliance-first review with UCC visibility.",
          "Broker risk controls before loads are booked.",
          "Clear communication on approval conditions and timelines.",
          "Scalable support as your authority matures.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
