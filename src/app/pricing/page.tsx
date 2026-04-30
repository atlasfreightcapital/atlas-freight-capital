import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function PricingPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Pricing"
        subtitle="Atlas structures pricing by profile, broker risk, documentation quality, and program fit."
        points={[
          "Carrier rate and advance terms are disclosed before funding.",
          "Fee timing options: upfront or collected on payment.",
          "Reserve release policy visible in dashboard history.",
          "Partner-backed funding strategy supports continuity and scale.",
          "Custom programs available for larger fleets and strategic lanes.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
