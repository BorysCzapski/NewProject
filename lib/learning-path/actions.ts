"use server";

// ============================================================================
// lib/learning-path/actions.ts
// Server Action for the admin roadmap view: one-click "assign catch-up
// homework" for a lagging category, now targeted at the SPECIFIC student the
// admin is looking at (target_user_id) and in that student's language — so it
// actually reflects where that student is stuck on their path, instead of
// spamming every student at the level.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-profile";
import type { Profile } from "@/lib/types/database";

export async function assignCatchUpHomework(studentId: string, category: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("profiles")
    .select("id, level, target_language, role")
    .eq("id", studentId)
    .maybeSingle();
  if (!student || (student as Profile).role !== "user") {
    throw new Error("Nie znaleziono ucznia.");
  }
  const s = student as Profile;

  const { error } = await supabase.from("homework").insert({
    title: `Nadrób etap: ${category}`,
    description: `Opanuj co najmniej 80% słówek z kategorii „${category}", żeby odblokować kolejny etap ścieżki nauki.`,
    type: "vocabulary_mastery",
    config: { category, threshold: 0.8 },
    levels: [s.level],
    language: s.target_language,
    target_user_id: s.id,
    created_by: admin.id,
  });

  if (error) throw new Error("Nie udało się utworzyć pracy domowej.");

  revalidatePath("/admin/sciezka");
  revalidatePath("/admin");
  revalidatePath("/prace-domowe");
}
