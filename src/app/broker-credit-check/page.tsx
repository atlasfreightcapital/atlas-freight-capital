import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function BrokerCreditCheckMarketingPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Broker Credit Check"
        subtitle="Learn how Atlas helps onboarded carriers screen brokers before booking freight. Actual broker check requests are submitted inside the secure carrier portal after login."
        points={[
          "Approved carriers can submit broker name, MC number, contact email, load amount, and notes from the carrier dashboard.",
          "Carrier-facing results stay simple: approved, use caution, or not approved for factoring at this time.",
          "Atlas risk team monitors disputes and chargeback patterns.",
          "Internal broker database keeps historical risk signals centralized.",
          "Sensitive internal credit notes, partner routing details, and risk scores are not exposed publicly.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
