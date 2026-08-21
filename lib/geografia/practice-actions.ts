"use server";

// ============================================================================
// lib/geografia/practice-actions.ts
// "Rozwiąż zadanie tego typu" for Geografia — the mirror of
// lib/matura/practice-actions.ts. See that file's header for why handing out
// an exercise is a form POST and not a prefetchable link, and why the top-up
// runs inside next/server's after().
// ============================================================================
import { after } from "next/server";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicBySlug } from "@/lib/geografia/content";
import { getGeoType, pickExerciseForType, topUpGeoStock } from "@/lib/geografia/exercise-stock";

export async function startGeoExerciseType(formData: FormData): Promise<void> {
  const topicSlug = String(formData.get("topicSlug") ?? "");
  const type = String(formData.get("type") ?? "");

  const typeDef = getGeoType(type);
  if (!typeDef) redirect(`/geografia/tematy/${topicSlug}`);

  const profile = await requireProfile();
  const supabase = await createClient();

  const topic = await getTopicBySlug(supabase, topicSlug);
  if (!topic) redirect("/geografia/tematy");

  const picked = await pickExerciseForType({ supabase, userId: profile.id, topic, typeDef });
  if (!picked) redirect(`/geografia/tematy/${topicSlug}?pusto=${type}`);

  after(async () => {
    try {
      await topUpGeoStock({ supabase, userId: profile.id, topic, typeDef });
    } catch (err) {
      console.error("[geografia] uzupełnianie zapasu ćwiczeń nie powiodło się:", err);
    }
  });

  redirect(`/geografia/cwiczenie/${picked.exerciseId}?typ=${type}&temat=${topicSlug}`);
}
