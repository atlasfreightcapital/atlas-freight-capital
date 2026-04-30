import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function FreightFactoringPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Freight Factoring"
        subtitle="Improve cash flow and keep trucks moving without waiting on broker payment cycles."
        points={[
          "Transparent rate structure and clear reserve tracking.",
          "Broker verification process to reduce payment risk.",
          "Dedicated Atlas operations team for documentation review.",
          "Fast response times on advances and load package decisions.",
          "In-app timeline from submission through funding and closure.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
