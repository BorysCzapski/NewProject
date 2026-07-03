// ============================================================================
// app/api/health/route.ts
// Server-side diagnostic endpoint (publicly reachable — see PUBLIC_PATHS in
// proxy.ts). Reports whether each required env var is present and clean, and
// performs a LIVE connectivity check from the server to Supabase auth+REST.
// Exists to debug production-only failures ("fetch failed") where the
// browser can't see what the serverless function's env/network looks like.
// Reveals no secrets: only presence/length/format flags, and URL/anon-key
// previews (both are public values by design).
// ============================================================================
import { NextResponse } from "next/server";
import { cleanEnv, cleanUrlEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

interface EnvReport {
  present: boolean;
  rawLength: number;
  // true when the RAW value has leading/trailing whitespace, newlines or
  // wrapping quotes — junk that breaks DNS/auth despite "looking correct"
  hasSuspiciousCharacters: boolean;
  preview?: string;
}

function report(raw: string | undefined, includePreview = false): EnvReport {
  const cleaned = cleanEnv(raw);
  return {
    present: !!raw && cleaned.length > 0,
    rawLength: raw?.length ?? 0,
    hasSuspiciousCharacters: !!raw && (raw !== cleaned || /[\r\n\t]/.test(raw)),
    ...(includePreview && cleaned ? { preview: `${cleaned.slice(0, 16)}…` } : {}),
  };
}

function errorDetail(err: unknown): string {
  if (err instanceof Error) {
    const cause = (err as Error & { cause?: unknown }).cause;
    return cause ? `${err.message} — cause: ${String(cause)}` : err.message;
  }
  return String(err);
}

export async function GET() {
  const url = cleanUrlEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let supabaseAuth = "not tested (missing url/key)";
  let supabaseRest = "not tested (missing url/key)";

  if (url && anonKey) {
    try {
      const res = await fetch(`${url}/auth/v1/health`, {
        headers: { apikey: anonKey },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      supabaseAuth = `HTTP ${res.status}`;
    } catch (err) {
      supabaseAuth = `FAILED: ${errorDetail(err)}`;
    }

    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: anonKey },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      supabaseRest = `HTTP ${res.status}`;
    } catch (err) {
      supabaseRest = `FAILED: ${errorDetail(err)}`;
    }
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: report(process.env.NEXT_PUBLIC_SUPABASE_URL, true),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: report(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, true),
      SUPABASE_SERVICE_ROLE_KEY: report(process.env.SUPABASE_SERVICE_ROLE_KEY),
      GROQ_API_KEY: report(process.env.GROQ_API_KEY),
      NEXT_PUBLIC_SITE_URL: report(process.env.NEXT_PUBLIC_SITE_URL, true),
    },
    connectivity: {
      supabaseAuth,
      supabaseRest,
    },
    timestamp: new Date().toISOString(),
  });
}
