import { updateSession } from "@/lib/supabase/middleware";
import { roleHome } from "@/data/navigation";
import { NextRequest } from "next/server";

const protectedRoutes = ["/carrier", "/admin", "/partner", "/super"];

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return response;
  }

  if (!user) {
    return Response.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single();
  if (!profile) {
    return Response.redirect(new URL("/login", request.url));
  }

  const role = profile.role as keyof typeof roleHome;

  if (pathname.startsWith("/carrier") && !role.startsWith("carrier_")) {
    return Response.redirect(new URL(roleHome[role], request.url));
  }

  if (pathname.startsWith("/admin") && !role.startsWith("atlas_")) {
    return Response.redirect(new URL(roleHome[role], request.url));
  }

  if (pathname.startsWith("/partner") && !role.startsWith("partner_")) {
    return Response.redirect(new URL(roleHome[role], request.url));
  }

  if (pathname.startsWith("/super") && role !== "super_admin") {
    return Response.redirect(new URL(roleHome[role], request.url));
  }

  return response;
}

export const config = {
  matcher: ["/carrier/:path*", "/admin/:path*", "/partner/:path*", "/super/:path*"],
};
