// ============================================================================
// app/(main)/prace-domowe/page.tsx
// User-facing homework list: everything the admin assigned to the current
// user's level, grouped by live progress into "to do", "done" and
// "overdue" sections.
// ============================================================================
import { ClipboardList } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getHomeworkWithProgress, type HomeworkWithProgress } from "@/lib/homework/progress";
import { PageHeader } from "@/components/layout/page-header";
import { LevelBadge } from "@/components/ui/badge";
import { HomeworkItemCard } from "@/components/homework/homework-item-card";

function Section({ title, items }: { title: string; items: HomeworkWithProgress[] }) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">{title}</h2>
      <div className="flex flex-col gap-3">
        {items.map((hw) => (
          <HomeworkItemCard key={hw.id} homework={hw} />
        ))}
      </div>
    </section>
  );
}

export default async function PraceDomowePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const homeworkList = await getHomeworkWithProgress(supabase, profile.id, profile.level);

  // Each homework's live status (computed by getHomeworkWithProgress) already
  // decides precedence: completed always wins over overdue.
  const todo = homeworkList.filter((hw) => hw.status === "todo" || hw.status === "in_progress");
  const completed = homeworkList.filter((hw) => hw.status === "completed");
  const overdue = homeworkList.filter((hw) => hw.status === "overdue");

  return (
    <div>
      <PageHeader title="Prace domowe" subtitle="Zadania od nauczyciela" action={<LevelBadge level={profile.level} />} />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        {homeworkList.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-foreground-muted">
            <ClipboardList className="h-10 w-10" />
            <p className="text-sm">Nie masz jeszcze żadnych prac domowych na swoim poziomie.</p>
          </div>
        ) : (
          <>
            <Section title="Po terminie" items={overdue} />
            <Section title="Do zrobienia" items={todo} />
            <Section title="Ukończone" items={completed} />
          </>
        )}
      </div>
    </div>
  );
}
