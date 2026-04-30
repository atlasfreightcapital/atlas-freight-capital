import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "How It Works",
    href: "/how-it-works",
    description: "See the full carrier invoice flow",
    items: [
      { label: "Carrier application", href: "/how-it-works", body: "Start with company and authority details." },
      { label: "Invoice submission", href: "/submit-load", body: "Learn what paperwork is required." },
      { label: "Payment stages", href: "/how-it-works", body: "Processing, pending, paid, and attention-needed." },
    ],
  },
  {
    label: "Freight Factoring",
    href: "/freight-factoring",
    description: "Funding solutions for trucking companies",
    items: [
      { label: "Freight factoring", href: "/freight-factoring", body: "Turn approved invoices into faster cash flow." },
      { label: "New MC factoring", href: "/new-mc-factoring", body: "Structured onboarding for newer authorities." },
      { label: "Small fleet factoring", href: "/small-fleet-factoring", body: "Support for dispatch and back-office teams." },
    ],
  },
  {
    label: "Broker Tools",
    href: "/broker-credit-check",
    description: "Review brokers before you book",
    items: [
      { label: "Broker credit check", href: "/broker-credit-check", body: "Request a review before taking a load." },
      { label: "Broker verification", href: "/how-it-works", body: "How Atlas reviews broker payment details." },
      { label: "Submit load", href: "/submit-load", body: "Carrier-only after login and onboarding." },
    ],
  },
  {
    label: "Resources",
    href: "/pricing",
    description: "Pricing, answers, and contact",
    items: [
      { label: "Pricing", href: "/pricing", body: "Understand program-level pricing factors." },
      { label: "FAQ", href: "/faq", body: "Common carrier questions answered." },
      { label: "Contact", href: "/contact", body: "Reach Atlas for onboarding and support." },
    ],
  },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#10243d] bg-[#071426] backdrop-blur">
      <div className="flex w-full items-center justify-between px-4 py-4 lg:px-10">
        <Link href="/" className="text-lg font-semibold tracking-wide text-white">
          Atlas Freight Capital
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <div key={group.label} className="group relative">
              <Link
                href={group.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#c7d4df] transition hover:bg-white/10 hover:text-white"
              >
                {group.label}
                <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full w-[390px] -translate-x-1/2 translate-y-3 rounded-2xl border border-[#1e3552] bg-[#071426] p-3 opacity-0 shadow-2xl transition duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
                <div className="rounded-xl bg-[#0d1b2f] p-4">
                  <p className="text-sm font-semibold text-white">{group.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#9fb2c1]">{group.description}</p>
                </div>
                <div className="mt-2 grid gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="atlas-lift rounded-xl border border-[#1e3552] bg-[#0b1728] p-4 transition hover:border-[#65d8e1]"
                    >
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-[#9fb2c1]">{item.body}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/apply-now">
            <Button size="sm">Apply Now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
