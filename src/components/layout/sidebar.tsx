"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface SidebarProps {
  nav: NavItem[];
  title: string;
}

export function Sidebar({ nav, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-[#10243d] bg-[#071426] px-4 py-5 shadow-sm lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#65d8e1]">{title}</p>
      <nav className="space-y-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-[#0a7c86] text-white"
                  : "text-[#c7d4df] hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
