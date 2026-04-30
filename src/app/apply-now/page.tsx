import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { CarrierApplicationForm } from "@/components/forms/carrier-application-form";

export default function ApplyNowPage() {
  return (
    <div>
      <MarketingHeader />
      <main className="w-full bg-[#f4f7f6] px-4 py-12 lg:px-10">
        <section className="rounded-lg border border-[#10243d] bg-[#071426] p-8">
          <h1 className="text-4xl font-semibold text-white">Apply for Freight Factoring</h1>
          <p className="mt-3 max-w-3xl text-[#c7d4df]">
            Complete your Atlas onboarding package. Funding is subject to verification, underwriting, and partner
            approval.
          </p>
        </section>
        <div className="mt-6">
          <CarrierApplicationForm />
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
