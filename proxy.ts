import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const session = getSessionCookie(request);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // ── All dashboard UI routes ──────────────────────────────────
    "/admin/:path*",

    // ── Protected API routes ─────────────────────────────────────
    // Mutations that should never be callable without a session.
    // The Better Auth handler (/api/auth/**) is intentionally absent
    // here — it must stay public for Google OAuth callbacks to work.
    "/api/appointments/:path*",
    "/api/services/:path*",
    "/api/customers/:path*",

    // ── Catch-all safety net ─────────────────────────────────────
    // Any future /api/admin/** routes are protected automatically.
    "/api/admin/:path*",
  ],
};