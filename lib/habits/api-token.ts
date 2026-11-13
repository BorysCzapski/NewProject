// ============================================================================
// lib/habits/api-token.ts
// Token API do nawyków: generowanie, hash i uwierzytelnienie nagłówkiem
// "Authorization: Bearer ...". Tylko serwer (service-role omija RLS).
// ============================================================================
import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const PREFIX = "hab_";
const TOKEN_RE = /^hab_[A-Za-z0-9_-]{43}$/;

export function generateApiToken(): string {
  return PREFIX + randomBytes(32).toString("base64url");
}

export function hashApiToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Zwraca user_id właściciela tokenu albo null (bez rozróżniania przyczyny). */
export async function authenticateHabitRequest(request: Request): Promise<string | null> {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  const token = match?.[1];
  // Zły format odrzucamy przed dotknięciem bazy.
  if (!token || !TOKEN_RE.test(token)) return null;

  const hash = hashApiToken(token);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("habit_api_tokens")
    .select("user_id, token_hash")
    .eq("token_hash", hash)
    .maybeSingle();
  if (error || !data) return null;

  // Porównanie w stałym czasie (obrona w głąb — wyszukiwanie po indeksie
  // i tak odbywa się po hashu, nie po samym tokenie).
  const a = Buffer.from(hash);
  const b = Buffer.from(String(data.token_hash));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  // Ślad ostatniego użycia — best effort, nie blokuje odpowiedzi.
  void admin
    .from("habit_api_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("user_id", data.user_id)
    .then(() => undefined);

  return data.user_id as string;
}
