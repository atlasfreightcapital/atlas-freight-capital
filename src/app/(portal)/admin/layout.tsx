import { adminNav } from "@/data/navigation";
import { requireAdminRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdminRole();

  return (
    <PortalShell profile={profile} nav={adminNav} title="Atlas Admin">
      {children}
    </PortalShell>
  );
}

