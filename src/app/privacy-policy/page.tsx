import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function PrivacyPolicyPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Privacy Policy"
        subtitle="Atlas Freight Capital handles carrier, broker, invoice, document, and account information for factoring review and servicing."
        points={[
          "Information may include business details, authority information, invoice data, broker contacts, uploaded documents, payment status, and account messages.",
          "Atlas uses submitted information to review applications, process load packages, verify brokers, manage compliance, communicate with users, and support funding workflows.",
          "Access to carrier documents and submissions is controlled by account role, carrier ownership, and assigned partner permissions.",
          "Atlas does not publish carrier documents through public file links. Document access should use secure workflows and time-limited signed access.",
          "Carriers can contact Atlas support to request help with account information, document questions, or profile updates.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
