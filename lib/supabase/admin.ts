// ============================================================================
// lib/supabase/admin.ts
// Service-role Supabase client that BYPASSES Row Level Security. Import this
// ONLY from server-only code (route handlers, server actions) — never from a
// Client Component. Used for: username -> email lookup at login (profiles
// aren't queryable while unauthenticated) and any trusted server-side writes
// to shared content.
// ============================================================================
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cleanEnv, cleanUrlEnv } from "@/lib/env";

export function createAdminClient() {
  return createSupabaseClient(
    cleanUrlEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
