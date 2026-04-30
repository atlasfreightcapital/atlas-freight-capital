import { superNav } from "@/data/navigation";
import { requireSuperAdminRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function SuperLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireSuperAdminRole();

  return (
    <PortalShell profile={profile} nav={superNav} title="Super Admin">
      {children}
    </PortalShell>
  );
}

