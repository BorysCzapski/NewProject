"use server";

// ============================================================================
// lib/algorytmy/practice-actions.ts
// "Rozwiąż zadanie tego typu" for Algorytmy — the same shape as
// lib/matura/practice-actions.ts and lib/geografia/practice-actions.ts. See
// the Matura file's header for why this is a form POST rather than a link
// (handing out an exercise can generate one, and Next prefetches links) and
// why the refill runs inside next/server's after().
// ============================================================================
import { after } from "next/server";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/algorytmy/content";
import { getAlgoTaskType } from "@/lib/algorytmy/task-types";
import { pickExerciseForType, topUpStock } from "@/lib/algorytmy/exercise-stock";

export async function startExerciseType(formData: FormData): Promise<void> {
  const topicSlug = String(formData.get("topicSlug") ?? "");
  const typeSlug = String(formData.get("typeSlug") ?? "");

  const typeDef = getAlgoTaskType(typeSlug);
  if (!typeDef) redirect(`/algorytmy/dzialy/${topicSlug}`);

  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, topicSlug);
  if (!topic) redirect("/algorytmy/dzialy");

  const picked = await pickExerciseForType({ supabase, userId: profile.id, topic, typeDef });
  if (!picked) redirect(`/algorytmy/dzialy/${topicSlug}?pusto=${typeSlug}`);

  after(async () => {
    try {
      await topUpStock({ supabase, userId: profile.id, topic, typeDef });
    } catch (err) {
      console.error("[algorytmy] uzupełnianie zapasu zadań nie powiodło się:", err);
    }
  });

  redirect(`/algorytmy/zadanie/${picked.exerciseId}?typ=${typeSlug}&dzial=${topicSlug}`);
}
