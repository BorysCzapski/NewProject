// ============================================================================
// lib/maturalnik/settings.ts
// The exam_date countdown setting. No row / null exam_date both mean "not set
// yet" — deliberately distinct from defaulting to a date, same semantics as
// lib/matura/settings.ts's matura_settings.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaturalnikSettings } from "@/lib/types/database";

export async function getMaturalnikSettings(supabase: SupabaseClient, userId: string): Promise<MaturalnikSettings | null> {
  const { data } = await supabase.from("maturalnik_settings").select("*").eq("user_id", userId).maybeSingle();
  return (data as MaturalnikSettings | null) ?? null;
}
