// ============================================================================
// app/(main)/admin/prace-domowe/[id]/page.tsx
// Admin homework detail: the assignment's own details plus a per-student
// completion table (everyone eligible by level, not just those who've
// started).
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getCompletionsForHomework } from "@/lib/homework/admin-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeworkStatusBadge } from "@/components/homework/homework-status-badge";
import { formatDeadline } from "@/components/homework/format-deadline";
import { HOMEWORK_TYPE_LABELS } from "@/lib/constants";

export default async function AdminHomeworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();
  const supabase = await createClient();

  const result = await getCompletionsForHomework(supabase, id);
  if (!result) notFound();

  const { homework, completions } = result;
  const completedCount = completions.filter((c) => c.status === "completed").length;

  return (
    <div>
      <PageHeader title="Praca domowa" subtitle={homework.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie prace domowe
        </Link>

        <Card className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{homework.title}</CardTitle>
            <Badge className="shrink-0">{HOMEWORK_TYPE_LABELS[homework.type]}</Badge>
          </div>
          {homework.description && <CardDescription>{homework.description}</CardDescription>}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            <span>Poziomy: {homework.levels.join(", ")}</span>
            {homework.deadline && (
              <span className="flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {formatDeadline(homework.deadline)}
              </span>
            )}
          </div>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Kto ukończył ({completedCount}/{completions.length})
          </h2>

          {completions.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              Brak uczniów na poziomie pasującym do tej pracy domowej.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {completions.map((c) => (
                <Card key={c.profile.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{c.profile.username}</p>
                    <p className="text-xs text-foreground-muted">
                      {c.progress_current}/{c.progress_target}
                      {c.progress_target === 0 && " • jeszcze nie rozpoczęto"}
                      {c.completed_at &&
                        ` • ukończono ${formatDeadline(c.completed_at)}`}
                    </p>
                  </div>
                  <HomeworkStatusBadge status={c.status} className="shrink-0" />
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
