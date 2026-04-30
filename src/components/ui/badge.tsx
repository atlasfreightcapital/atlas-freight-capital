import { cn } from "@/lib/utils";

const variants = {
  default: "bg-[#e7ecea] text-[#40515a]",
  success: "bg-[#dff3e9] text-[#176b45]",
  warning: "bg-[#fff2cc] text-[#8a5a00]",
  danger: "bg-[#fbe4df] text-[#9f2a1d]",
  info: "bg-[#d9f0ee] text-[#075b63]",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
