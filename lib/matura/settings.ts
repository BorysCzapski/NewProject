// ============================================================================
// lib/matura/settings.ts
// The chosen poziom matury (podstawowa/rozszerzona) — read on every matura
// page to scope sections/tasks, picked on first visit and changeable later.
// No row yet = the student hasn't picked a level (first-run state); this is
// deliberately distinct from "defaults to podstawowa" so the dashboard can
// show the picker instead of silently assuming.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaturaSettings } from "@/lib/types/database";

export async function getMaturaSettings(supabase: SupabaseClient, userId: string): Promise<MaturaSettings | null> {
  const { data } = await supabase.from("matura_settings").select("*").eq("user_id", userId).maybeSingle();
  return (data as MaturaSettings | null) ?? null;
}
