import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function SmallFleetFactoringPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Small Fleet Factoring"
        subtitle="Give dispatch and accounting a cleaner operating rhythm with centralized load and payment tracking."
        points={[
          "Multi-user carrier staff access with role controls.",
          "Fast mobile upload workflow for drivers and office staff.",
          "Reserve visibility by invoice and release lifecycle.",
          "Aging and settlement clarity to support growth planning.",
          "Support for mixed brokers and recurring customers.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
