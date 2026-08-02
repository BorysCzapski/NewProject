// ============================================================================
// lib/schola/get-member.ts
// Server-only helpers for reading the current user's Schola membership.
// Independent of lib/auth/get-profile.ts's requireProfile() — a Schola
// member need not have (or ever touch) a Phoenix `profiles` row, and vice
// versa. See supabase/migrations/0009_schola.sql for why.
// ============================================================================
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ScholaMember } from "@/lib/types/database";

export async function getCurrentScholaMember(): Promise<ScholaMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("schola_members")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (member as ScholaMember) ?? null;
}

/** Redirects to /schola/logowanie if not logged in at all, or to
 * /schola/brak-dostepu if logged in but not (yet) a Schola member — these
 * are two different states and must not be conflated (see the "Sharp
 * edges" section of the Schola implementation plan). */
export async function requireScholaMember(): Promise<ScholaMember> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/schola/logowanie");

  const { data: member } = await supabase
    .from("schola_members")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!member) redirect("/schola/brak-dostepu");

  return member as ScholaMember;
}
