import Link from "next/link";
import { Search } from "lucide-react";
import type { SessionProfile } from "@/lib/auth";

export function Topbar({ profile, displayName }: { profile: SessionProfile; displayName?: string }) {
  const isCarrier = profile.role.startsWith("carrier_");
  const primaryLabel = displayName ?? profile.role.replaceAll("_", " ");
  const secondaryLabel = isCarrier ? "Carrier account" : profile.fullName || profile.email;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7dfdc] bg-white px-5 py-4 shadow-sm">
      <label className="flex w-full max-w-md items-center gap-2 rounded-md border border-[#c6d1cd] bg-white px-3 py-2 text-[#6c7b82]">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search carriers, brokers, loads"
          className="w-full bg-transparent text-sm text-[#162026] placeholder:text-[#7b8b91] focus:outline-none"
        />
      </label>
      <div className="flex items-center gap-3">
        <div className="text-right text-xs text-[#65747b]">
          <p className="font-semibold uppercase tracking-wider text-[#071426]">{primaryLabel}</p>
          <p>{secondaryLabel}</p>
        </div>
        <Link
          href="/api/auth/signout"
          className="rounded-md border border-[#b9c6c2] bg-white px-3 py-2 text-xs font-semibold text-[#1d2a30] hover:bg-[#eef3f1]"
        >
          Sign out
        </Link>
      </div>
    </header>
  );
}
