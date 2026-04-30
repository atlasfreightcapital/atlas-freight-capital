import { cn } from "@/lib/utils";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-[#c6d1cd] bg-white px-3 text-sm text-[#162026] focus:border-[#0a7c86] focus:outline-none",
        props.className,
      )}
    />
  );
}
