import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div>
      <MarketingHeader />
      <main className="w-full bg-[#f4f7f6] px-4 py-12 lg:px-10">
        <section className="rounded-lg border border-[#10243d] bg-[#071426] p-8">
          <h1 className="text-4xl font-semibold text-white">Contact Atlas Freight Capital</h1>
          <p className="mt-3 max-w-3xl text-[#c7d4df]">
            Talk with our operations team about onboarding, broker checks, documentation, and funding timelines.
          </p>
        </section>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card title="General">
            <p className="text-sm text-[#40515a]">info@atlasfreightcapital.com</p>
            <p className="mt-2 text-sm text-[#40515a]">(000) 000-0000</p>
          </Card>
          <Card title="Carrier Support">
            <p className="text-sm text-[#40515a]">support@atlasfreightcapital.com</p>
            <p className="mt-2 text-sm text-[#40515a]">Mon-Fri, 6am-6pm PT</p>
          </Card>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
