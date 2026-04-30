import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  title?: string;
  children: React.ReactNode;
}

export function Card({ className, title, children }: CardProps) {
  return (
    <section className={cn("rounded-lg border border-[#d1dad6] bg-white p-5 shadow-sm", className)}>
      {title ? <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#56676f]">{title}</h3> : null}
      {children}
    </section>
  );
}
