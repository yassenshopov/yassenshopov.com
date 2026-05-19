import { NextRequest, NextResponse } from "next/server";

/**
 * Subdomain handling for `art.yassenshopov.com`.
 *
 * The art subdomain hosts the portfolio gallery that used to live at
 * kofiscrib.com. It maps to a single page (`/art`) on this Next.js app.
 *
 * Rules:
 *   - art.yassenshopov.com/        -> rewrite to /art  (URL bar stays clean)
 *   - art.yassenshopov.com/<path>  -> 308 redirect to https://yassenshopov.com/<path>
 *     (so clicking any other nav link from the art page lands on the main site,
 *     rather than 404'ing under the subdomain)
 *
 * Other hosts pass through untouched.
 *
 * For local dev, `art.localhost:24` behaves the same way and redirects to
 * `localhost:24` for non-root paths.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  const isArtProd = hostname === "art.yassenshopov.com";
  const isArtLocal = hostname === "art.localhost";
  const isArtSubdomain = isArtProd || isArtLocal;

  if (!isArtSubdomain) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  // Already on the /art tree (e.g. internal Next.js navigation after rewrite) — pass through.
  if (pathname === "/art" || pathname.startsWith("/art/")) {
    return NextResponse.next();
  }

  // Root path on the art subdomain: serve the gallery, keep the clean URL.
  if (pathname === "/") {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = "/art";
    return NextResponse.rewrite(rewritten);
  }

  // Anything else on the art subdomain: bounce to the apex domain so links
  // like /projects, /blog, /about etc. resolve to the canonical pages.
  const apexHost = isArtProd
    ? "yassenshopov.com"
    : host.replace(/^art\./, "");
  const protocol = isArtProd ? "https" : request.nextUrl.protocol.replace(":", "");
  const target = `${protocol}://${apexHost}${pathname}${search}`;
  return NextResponse.redirect(target, 308);
}

export const config = {
  // Skip static assets and Next.js internals so /_next, /favicon.ico, and
  // anything in /resources continue to resolve normally on the subdomain.
  matcher: ["/((?!_next/|api/|resources/|favicon.ico|logo|.*\\..*).*)"],
};
