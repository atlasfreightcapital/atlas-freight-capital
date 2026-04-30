import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: AdminPageHeaderProps) {
  return (
    <section className="rounded-lg border border-[#10243d] bg-[#071426] p-6 text-white">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65d8e1]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold lg:text-4xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-[#c7d4df]">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {secondaryAction ? (
            <Link href={secondaryAction.href}>
              <Button variant="secondary">{secondaryAction.label}</Button>
            </Link>
          ) : null}
          {primaryAction ? (
            <Link href={primaryAction.href}>
              <Button>{primaryAction.label}</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
