import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { SessionProfile } from "@/lib/auth";

interface NavItem {
  label: string;
  href: string;
}

interface PortalShellProps {
  children: React.ReactNode;
  profile: SessionProfile;
  nav: NavItem[];
  title: string;
}

export function PortalShell({ children, profile, nav, title }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#162026] lg:flex">
      <Sidebar nav={nav} title={title} />
      <div className="flex-1">
        <Topbar profile={profile} />
        <main className="p-5 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
