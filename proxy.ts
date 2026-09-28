import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  /* =========================
     1️⃣ PUBLIC ROUTES
  ========================= */
  const publicRoutes = ["/"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  /* =========================
     2️⃣ UNAUTH-ONLY ROUTES
  ========================= */
  if (pathname === "/login" || pathname === "/signup") {
    if (token && role) {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
    return NextResponse.next();
  }

  /* =========================
     3️⃣ AUTH REQUIRED (COMMON)
  ========================= */
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /* =========================
     4️⃣ ROLE-BASED ROUTES
  ========================= */
  if (pathname.startsWith("/candidate") && role !== "candidate") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/interviewer") && role !== "interviewer") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

/* =========================
   MATCHER
========================= */
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/candidate/:path*",
    "/interviewer/:path*",
    "/admin/:path*",
  ],
};
