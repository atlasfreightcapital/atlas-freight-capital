import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import type { AppRole } from "@/types/domain";

export async function requireApiRole(allowed: AppRole[]) {
  const profile = await getSessionProfile();

  if (!profile) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (!allowed.includes(profile.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { profile };
}

export const adminApiRoles: AppRole[] = [
  "atlas_admin",
  "atlas_underwriter",
  "atlas_operations",
  "super_admin",
];

export const pricingApiRoles: AppRole[] = ["atlas_admin", "super_admin"];

export const partnerApiRoles: AppRole[] = ["partner_admin", "partner_reviewer"];
