import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MarketingPageProps {
  title: string;
  subtitle: string;
  points: string[];
}

export function MarketingPage({ title, subtitle, points }: MarketingPageProps) {
  return (
    <main className="w-full px-4 py-12 lg:px-10">
      <div className="mb-8 rounded-lg border border-[#10243d] bg-[#071426] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#65d8e1]">Atlas Freight Capital</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">{title}</h1>
        <p className="mt-3 max-w-3xl text-[#c7d4df]">{subtitle}</p>
      </div>
      <Card>
        <ul className="grid gap-3 md:grid-cols-2">
          {points.map((point) => (
            <li key={point} className="rounded-lg border border-[#d1dad6] bg-[#fbfcfa] px-4 py-3 text-sm text-[#1d2a30]">
              {point}
            </li>
          ))}
        </ul>
      </Card>
      <div className="mt-8 flex gap-3">
        <Link href="/apply-now">
          <Button>Apply Now</Button>
        </Link>
        <Link href="/submit-load">
          <Button variant="secondary">Submit Load</Button>
        </Link>
      </div>
    </main>
  );
}
