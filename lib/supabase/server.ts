// ============================================================================
// lib/supabase/server.ts
// Supabase client for Server Components, Server Actions and Route Handlers.
// Reads/writes auth cookies via next/headers (async in Next.js 16). Row Level
// Security still applies — this uses the anon key, just like the browser
// client, but carries the user's session cookie.
// ============================================================================
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll is called from a Server Component during render, where
            // cookies can't be mutated. Safe to ignore: proxy.ts refreshes
            // the session on every request instead.
          }
        },
      },
    }
  );
}
