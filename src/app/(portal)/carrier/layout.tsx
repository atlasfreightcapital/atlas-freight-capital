import { carrierNav } from "@/data/navigation";
import { requireCarrierRole } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function CarrierLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireCarrierRole();

  return (
    <PortalShell profile={profile} nav={carrierNav} title="Carrier Portal">
      {children}
    </PortalShell>
  );
}

