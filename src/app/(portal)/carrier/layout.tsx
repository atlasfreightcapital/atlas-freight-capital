import { carrierNav } from "@/data/navigation";
import { requireCarrierRole } from "@/lib/auth";
import { resolveCarrierForUser } from "@/lib/carrier-data";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function CarrierLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireCarrierRole();
  const carrier = await resolveCarrierForUser(profile.userId);

  return (
    <PortalShell profile={profile} nav={carrierNav} title="Carrier Portal" displayName={carrier?.legalName}>
      {children}
    </PortalShell>
  );
}

