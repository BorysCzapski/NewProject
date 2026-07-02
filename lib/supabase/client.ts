// ============================================================================
// lib/supabase/client.ts
// Supabase client for use in Client Components ("use client"). Uses the
// public anon key only — safe to ship to the browser, Row Level Security
// enforces per-user access.
// ============================================================================
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
