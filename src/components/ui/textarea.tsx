import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border border-[#c6d1cd] bg-white px-3 py-2 text-sm text-[#162026] placeholder:text-[#7b8b91] focus:border-[#0a7c86] focus:outline-none",
        props.className,
      )}
    />
  );
}
