// Runs before every page request (this was called "middleware" before Next.js 16).
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if(request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
  }
  return NextResponse.next();
}

// Only run the proxy for these URLs.
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/documents/:path*",
    "/settings/:path*",
  ],
};
