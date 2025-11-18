// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value || null;

  // Helper to redirect to /login with callbackUrl
  const redirectToLogin = () => {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  };

  // Protect /admin/* -> ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!token) return redirectToLogin();

    const payload = await verifyAuthToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return redirectToLogin();
    }
  }

  // Protect /account -> any logged-in user (ADMIN or CUSTOMER)
  if (pathname.startsWith("/account")) {
    if (!token) return redirectToLogin();

    const payload = await verifyAuthToken(token);
    if (!payload) return redirectToLogin();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account"],
};
