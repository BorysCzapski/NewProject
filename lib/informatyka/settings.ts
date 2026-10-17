// ============================================================================
// lib/informatyka/settings.ts
// The exam_date countdown setting. No row / null both mean "not set yet".
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { InformatykaSettings } from "@/lib/types/database";

export async function getInformatykaSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<InformatykaSettings | null> {
  const { data } = await supabase.from("informatyka_settings").select("*").eq("user_id", userId).maybeSingle();
  return (data as InformatykaSettings | null) ?? null;
}
