// ============================================================================
// app/(main)/geografia/admin/page.tsx
// Admin panel: per-topic exercise counts + AI-generation trigger, and the
// needs_review queue (AI-generated/uploaded exercises pending a fact-check).
// ============================================================================
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { GenerateTriggerForm } from "@/components/geografia/admin/generate-trigger-form";
import { ReviewQueueItem } from "@/components/geografia/admin/review-queue-item";
import type { GeoExercise, GeoTopic } from "@/lib/types/database";

const TARGET_EXERCISE_COUNT = 25;

export default async function GeografiaAdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: topicRows }, { data: countRows }, { data: reviewRows }] = await Promise.all([
    supabase.from("geo_topics").select("*").order("order_index"),
    supabase.from("geo_exercises").select("topic_id"),
    supabase
      .from("geo_exercises")
      .select("*, geo_topics(title)")
      .eq("needs_review", true)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const topics = (topicRows ?? []) as GeoTopic[];
  const countByTopic = new Map<string, number>();
  for (const row of (countRows ?? []) as Array<{ topic_id: string }>) {
    countByTopic.set(row.topic_id, (countByTopic.get(row.topic_id) ?? 0) + 1);
  }
  const reviewItems = (reviewRows ?? []) as unknown as Array<GeoExercise & { geo_topics: { title: string } | null }>;

  return (
    <div>
      <PageHeader title="Panel administratora" subtitle="Geografia — biblioteka ćwiczeń" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-1">
          <CardTitle>Kolejka do sprawdzenia ({reviewItems.length})</CardTitle>
          <p className="text-sm text-foreground-muted">
            Zadania wygenerowane przez AI lub wgrane z arkuszy — sprawdź poprawność faktograficzną przed pełnym
            zaufaniem.
          </p>
        </Card>
        {reviewItems.map((exercise) => (
          <ReviewQueueItem key={exercise.id} exercise={exercise} topicTitle={exercise.geo_topics?.title ?? ""} />
        ))}

        <Card className="flex flex-col gap-1">
          <CardTitle>Działy</CardTitle>
        </Card>
        {topics.map((topic) => {
          const count = countByTopic.get(topic.id) ?? 0;
          return (
            <Card key={topic.id} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                {topic.cke_number}. {topic.title}
              </p>
              <p className="text-xs text-foreground-muted">
                {count} / {TARGET_EXERCISE_COUNT}+ ćwiczeń
              </p>
              <GenerateTriggerForm topicId={topic.id} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
