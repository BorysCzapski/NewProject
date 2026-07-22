// ============================================================================
// app/(main)/matma/nauka/page.tsx
// "Nauka" hub: every topic annotated with this student's mastery (see
// getTopicsWithProgress), pre-sorted by order_index. The "Zrób diagnozę"
// nudge only shows on what looks like a first visit (every topic still
// "new") — never naggy once the student has real progress.
// ============================================================================
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress, type TopicWithProgress } from "@/lib/matma/progress";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MasteryStatus } from "@/lib/types/database";

const STATUS_LABELS: Record<MasteryStatus, string> = {
  new: "Nowy",
  learning: "W trakcie",
  mastered: "Opanowany",
};

const STATUS_BADGE_CLASSES: Record<MasteryStatus, string> = {
  new: "bg-surface-muted text-foreground-muted",
  learning: "bg-warning-soft text-warning",
  mastered: "bg-accent-soft text-accent",
};

const STATUS_BAR_CLASSES: Record<MasteryStatus, string> = {
  new: "bg-border",
  learning: "bg-warning",
  mastered: "bg-accent",
};

export default async function MatmaNaukaPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const topics = await getTopicsWithProgress(supabase, profile.id);
  const isFirstVisit = topics.length > 0 && topics.every((t) => t.status === "new");

  return (
    <div>
      <PageHeader title="Nauka" subtitle="Wybierz dział, żeby zacząć" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        {isFirstVisit && (
          <Link href="/matma/diagnoza">
            <Card className="flex items-center gap-3 bg-primary-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <CardDescription className="text-primary">Zacznij tutaj</CardDescription>
                <CardTitle>Zrób diagnozę, żeby dobrać poziom trudności</CardTitle>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
            </Card>
          </Link>
        )}

        {topics.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">
            Brak dostępnych działów — wróć tu wkrótce.
          </Card>
        )}

        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: TopicWithProgress }) {
  return (
    <Link href={`/matma/nauka/${topic.slug}`}>
      <Card className="transition-transform active:scale-[0.99]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle>{topic.title}</CardTitle>
            <CardDescription className="mt-0.5 line-clamp-2">{topic.description}</CardDescription>
          </div>
          <Badge className={STATUS_BADGE_CLASSES[topic.status]}>{STATUS_LABELS[topic.status]}</Badge>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn("h-full rounded-full transition-all", STATUS_BAR_CLASSES[topic.status])}
              style={{ width: `${Math.min(100, Math.max(0, topic.masteryScore))}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-foreground-muted">
            {topic.masteryScore}%
          </span>
        </div>
      </Card>
    </Link>
  );
}
