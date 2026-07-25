import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Admin Authentication Check
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Preview Bypass Query & Cookie Check
  if (searchParams.get("preview") === "true") {
    const response = NextResponse.next();
    response.cookies.set("kindred_preview", "true", { maxAge: 60 * 60 * 24 });
    return response;
  }

  const hasPreviewCookie = req.cookies.get("kindred_preview")?.value === "true";

  // 3. Coming Soon Redirect Logic for Storefront Routes
  const isPublicRoute =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/icons") &&
    !pathname.startsWith("/images") &&
    !pathname.includes(".");

  if (isPublicRoute && !hasPreviewCookie) {
    try {
      const settingsUrl = new URL("/api/settings/coming-soon", req.url);
      const res = await fetch(settingsUrl, { headers: { internal: "middleware" } });
      if (res.ok) {
        const data = await res.json();
        if (data.comingSoon?.enabled) {
          if (pathname !== "/coming-soon") {
            return NextResponse.redirect(new URL("/coming-soon", req.url));
          }
        } else if (pathname === "/coming-soon") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } catch (err) {
      console.error("[middleware] Error checking coming soon status:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
