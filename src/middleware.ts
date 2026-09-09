import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin (not /admin/login)
  if (
    request.nextUrl.pathname === "/admin" &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify token contains the pin
    try {
      const decoded = Buffer.from(token, "base64").toString();
      const pin = decoded.split(":")[0];
      const adminPin = process.env.ADMIN_PIN || "3323";
      if (pin !== adminPin) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
