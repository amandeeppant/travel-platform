import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-DNS-Prefetch-Control": "off",
  "X-XSS-Protection": "0",
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([header, value]) => response.headers.set(header, value));

  if (process.env.NODE_ENV === "production" && request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
