// ============================================================================
// app/(main)/geografia/tematy/page.tsx
// Full list of the 23 CKE działy, each with mastery + exercise-count status.
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress } from "@/lib/geografia/progress";
import { PageHeader } from "@/components/layout/page-header";
import { TopicListItem } from "@/components/geografia/topic-list-item";

export default async function GeografiaTopicsPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const topics = await getTopicsWithProgress(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Tematy" subtitle="23 działy zgodne z podstawą programową CKE (zakres rozszerzony)" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        {topics.map((topic) => (
          <TopicListItem key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
