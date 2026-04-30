import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-[#c6d1cd] bg-white px-3 text-sm text-[#162026] placeholder:text-[#7b8b91] focus:border-[#0a7c86] focus:outline-none",
        props.className,
      )}
    />
  );
}
