import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div>
      <MarketingHeader />
      <main className="grid min-h-[520px] place-items-center bg-[#f4f7f6] px-4 py-12">
        <LoginForm />
      </main>
      <MarketingFooter />
    </div>
  );
}
