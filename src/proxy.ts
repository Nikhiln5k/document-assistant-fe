// Runs before every page request (this was called "middleware" before Next.js 16).
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

const GUEST_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Login and register make no sense once the user is signed in.
  if (GUEST_ROUTES.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // Every other matched URL needs a signed-in user.
  if (!token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    // Remember where the user was heading so login can bring them back.
    if (pathname !== ROUTES.HOME) loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

// Only run the proxy for these URLs.
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/:path*",
    "/documents/:path*",
    "/settings/:path*",
  ],
};
