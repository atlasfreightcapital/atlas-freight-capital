import Link from "next/link";
import { marketingNav } from "@/data/navigation";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#10243d] bg-[#071426] backdrop-blur">
      <div className="flex w-full items-center justify-between px-4 py-4 lg:px-10">
        <Link href="/" className="text-lg font-semibold tracking-wide text-white">
          Atlas Freight Capital
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {marketingNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-[#c7d4df] transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/signup" className="hidden sm:block">
            <Button variant="secondary" size="sm">
              Sign Up
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
