"use server";

// ============================================================================
// lib/learning-path/actions.ts
// Server Action for the admin roadmap view: one-click "assign catch-up
// homework" for a lagging category. Creates a level-wide vocabulary_mastery
// homework (homework has no per-user targeting in this schema — see
// lib/homework/progress.ts — so this helps every student at that level who
// hasn't mastered the category yet, not just the one the admin was looking
// at when they clicked it).
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-profile";
import type { UserLevel } from "@/lib/types/database";

export async function assignCatchUpHomework(level: UserLevel, category: string): Promise<void> {
  const profile = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("homework").insert({
    title: `Nadrób zaległości: ${category}`,
    description: `Opanuj co najmniej 80% słówek z kategorii „${category}", żeby dogonić ścieżkę nauki.`,
    type: "vocabulary_mastery",
    config: { category, threshold: 0.8 },
    levels: [level],
    created_by: profile.id,
  });

  if (error) throw new Error("Nie udało się utworzyć pracy domowej.");

  revalidatePath("/admin/sciezka");
  revalidatePath("/admin");
  revalidatePath("/prace-domowe");
}
