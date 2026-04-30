import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/domain";
import { roleHome } from "@/data/navigation";

export interface SessionProfile {
  userId: string;
  role: AppRole;
  fullName: string | null;
  email: string | null;
}

const CARRIER_ROLES: AppRole[] = ["carrier_owner", "carrier_staff"];
const ADMIN_ROLES: AppRole[] = ["atlas_admin", "atlas_underwriter", "atlas_operations"];
const PARTNER_ROLES: AppRole[] = ["partner_admin", "partner_reviewer"];

export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, role, full_name, email")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return null;
  }

  return {
    userId: profile.user_id,
    role: profile.role as AppRole,
    fullName: profile.full_name,
    email: profile.email,
  } satisfies SessionProfile;
}

export async function requireRole(allowed: AppRole[]) {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!allowed.includes(profile.role)) {
    redirect(roleHome[profile.role]);
  }

  return profile;
}

export async function requireCarrierRole() {
  return requireRole(CARRIER_ROLES);
}

export async function requireAdminRole() {
  return requireRole(ADMIN_ROLES);
}

export async function requirePartnerRole() {
  return requireRole(PARTNER_ROLES);
}

export async function requireSuperAdminRole() {
  return requireRole(["super_admin"]);
}
