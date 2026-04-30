import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <div>
      <MarketingHeader />
      <main className="grid min-h-[520px] place-items-center bg-[#f4f7f6] px-4 py-12">
        <SignupForm />
      </main>
      <MarketingFooter />
    </div>
  );
}
