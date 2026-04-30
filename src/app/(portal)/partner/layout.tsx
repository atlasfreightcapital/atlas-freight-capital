import { partnerNav } from "@/data/navigation";
import { requirePartnerRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const profile = await requirePartnerRole();

  return (
    <PortalShell profile={profile} nav={partnerNav} title="Funding Partner">
      {children}
    </PortalShell>
  );
}

