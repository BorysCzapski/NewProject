// ============================================================================
// app/(main)/geografia/tematy/page.tsx
// Full list of the 23 CKE działy, each with mastery, theory progress and
// exercise-count status.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress } from "@/lib/geografia/progress";
import { getCompletedLessonIds, getLessonCountsByTopic } from "@/lib/geografia/content";
import { PageHeader } from "@/components/layout/page-header";
import { TopicListItem } from "@/components/geografia/topic-list-item";

export default async function GeografiaTopicsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, lessonCounts, completedLessonIds, { data: lessonRows }] = await Promise.all([
    getTopicsWithProgress(supabase, profile.id),
    getLessonCountsByTopic(supabase),
    getCompletedLessonIds(supabase, profile.id),
    supabase.from("geo_lessons").select("id, topic_id"),
  ]);

  // Completed-per-topic needs the lesson->topic mapping, which the counts
  // helper doesn't carry; one extra id-only select is cheaper than a join.
  const doneByTopic = new Map<string, number>();
  for (const row of (lessonRows ?? []) as Array<{ id: string; topic_id: string }>) {
    if (completedLessonIds.has(row.id)) {
      doneByTopic.set(row.topic_id, (doneByTopic.get(row.topic_id) ?? 0) + 1);
    }
  }

  return (
    <div>
      <PageHeader title="Tematy" subtitle="23 działy zgodne z podstawą programową CKE (zakres rozszerzony)" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {topics.map((topic) => (
          <TopicListItem
            key={topic.id}
            topic={topic}
            lessonCount={lessonCounts.get(topic.id) ?? 0}
            lessonsDone={doneByTopic.get(topic.id) ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
