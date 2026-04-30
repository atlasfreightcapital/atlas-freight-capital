import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { roleHome } from "@/data/navigation";

export default async function AuthRedirectPage() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login");
  }

  redirect(roleHome[profile.role]);
}
