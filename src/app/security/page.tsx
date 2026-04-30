import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingPage } from "@/components/marketing/marketing-page";

export default function SecurityPage() {
  return (
    <div>
      <MarketingHeader />
      <MarketingPage
        title="Security and Access"
        subtitle="Atlas Freight Capital is structured around private document handling, role-based access, and controlled partner visibility."
        points={[
          "Carrier-facing workflows are separated from Atlas operations, underwriter, partner, and super admin access.",
          "Private storage buckets and signed document links help avoid public access to sensitive carrier paperwork.",
          "Funding partners are intended to review only assigned submissions, documents, and partner-visible notes.",
          "Audit logs, status history, compliance review, and document status fields support operational accountability.",
          "Carrier-facing screens keep backend partner names, buy rates, spreads, and internal risk notes hidden unless explicitly allowed.",
        ]}
      />
      <MarketingFooter />
    </div>
  );
}
