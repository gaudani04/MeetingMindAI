import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "sma-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/landing") {
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/signup") {
    const authed = request.cookies.get(AUTH_COOKIE)?.value;
    if (authed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const authed = request.cookies.get(AUTH_COOKIE)?.value;
  if (!authed) {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
