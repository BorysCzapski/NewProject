// ============================================================================
// lib/env.ts
// Environment variable sanitizers. Values pasted into hosting dashboards
// (Vercel, etc.) frequently pick up invisible junk — trailing newlines,
// spaces, or wrapping quotes — which turns into DNS failures ("fetch
// failed") that are extremely hard to diagnose. Every consumer of an env
// var goes through these helpers so a slightly-mangled paste still works.
// Safe to import from client components (no secrets, pure string cleaning).
// ============================================================================

/** Trims whitespace/newlines and strips accidental wrapping quotes. */
export function cleanEnv(value: string | undefined): string {
  if (!value) return "";
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

/** cleanEnv + strips trailing slashes (URLs get joined with "/auth/v1/..."). */
export function cleanUrlEnv(value: string | undefined): string {
  return cleanEnv(value).replace(/\/+$/, "");
}
