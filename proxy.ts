// ============================================================================
// proxy.ts
// Runs on every request (Next.js 16 renamed the "middleware" file convention
// to "proxy" — see node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md).
// Refreshes the Supabase session and gate-keeps auth-only / guest-only routes
// so pages don't have to re-implement this redirect logic individually.
// ============================================================================
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { cleanEnv, cleanUrlEnv } from "@/lib/env";

const GUEST_ONLY_PATHS = ["/login", "/register"];
const PUBLIC_PATHS = [...GUEST_ONLY_PATHS, "/auth/callback", "/api/health"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    cleanUrlEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // If Supabase is unreachable (network failure), treat the visitor as
  // unauthenticated instead of crashing every page with a 500 — they land on
  // /login and see a normal error there instead of a dead site.
  let user: User | null = null;
  try {
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (user && GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // First-login gate: everyone picks a level once, right after registration,
  // before they can reach any other page.
  if (user) {
    const onboarded = user.user_metadata?.onboarding_completed === true;
    if (!onboarded && !isPublicPath && pathname !== "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (onboarded && pathname === "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on every path except static assets, image optimization files,
     * and common static file extensions.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
