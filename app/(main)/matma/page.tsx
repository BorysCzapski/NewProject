// ============================================================================
// app/(main)/matma/page.tsx
// Matma home ("Dziś") screen — the bottom-nav root tab. Pulls together the
// student's estimated exam score, mastery-by-topic overview, progress trend,
// and any due spaced-review / teacher-assigned practice into one front door.
// ============================================================================
import Link from "next/link";
import { CalendarDays, ChevronRight, Settings2, Sparkles } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress, getWeakestTopics } from "@/lib/matma/progress";
import { computeEstimatedScore, getProgressTrend } from "@/lib/matma/dashboard";
import { getSpacedReviewCandidate } from "@/lib/matma/spaced-review";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { EstimatedScoreCard } from "@/components/matma/dashboard/estimated-score-card";
import { SpacedReviewCard } from "@/components/matma/dashboard/spaced-review-card";
import {
  AssignedPracticeCard,
  type AssignedPracticeItem,
} from "@/components/matma/dashboard/assigned-practice-card";
import { TopicMasteryBars } from "@/components/matma/dashboard/topic-mastery-bars";
import { ProgressTrendChart } from "@/components/matma/dashboard/progress-trend-chart";
import { WeakestTopicsCard } from "@/components/matma/dashboard/weakest-topics-card";

interface AssignedPracticeRow {
  id: string;
  note: string | null;
  math_topics: { title: string; slug: string } | null;
}

export default async function MatmaDashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, snapshots, spacedReviewCandidate, { data: assignedRows }] = await Promise.all([
    getTopicsWithProgress(supabase, profile.id),
    getProgressTrend(supabase, profile.id),
    getSpacedReviewCandidate(supabase, profile.id),
    supabase
      .from("math_assigned_practice")
      .select("id, note, math_topics(title, slug)")
      .eq("student_id", profile.id)
      .is("dismissed_at", null)
      .order("created_at", { ascending: false }),
  ]);

  // computeEstimatedScore/getWeakestTopics are pure synchronous functions
  // over already-fetched data — plain calls, not awaited like server reads.
  const estimate = computeEstimatedScore(topics);
  const weakestTopics = getWeakestTopics(topics);
  const isBrandNew = topics.length > 0 && topics.every((t) => t.status === "new");

  const assignedItems: AssignedPracticeItem[] = ((assignedRows ?? []) as unknown as AssignedPracticeRow[])
    .filter((row): row is AssignedPracticeRow & { math_topics: { title: string; slug: string } } => !!row.math_topics)
    .map((row) => ({
      id: row.id,
      topicTitle: row.math_topics.title,
      topicSlug: row.math_topics.slug,
      note: row.note,
    }));

  // The spaced-review candidate only carries topicId — resolve its slug from
  // the already-fetched topics list instead of a second query.
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const spacedReviewTopicSlug = spacedReviewCandidate
    ? (topicById.get(spacedReviewCandidate.topicId)?.slug ?? null)
    : null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Dzień dobry" : hour < 18 ? "Miłego popołudnia" : "Dobry wieczór";

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">{greeting},</p>
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
        </div>
        <StreakBadge streak={profile.current_streak} size="lg" />
      </div>

      {isBrandNew && (
        <Link href="/matma/diagnoza">
          <Card className="flex items-center gap-3 bg-primary-soft">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <CardDescription className="text-primary">Zacznij tutaj</CardDescription>
              <CardTitle>Zrób test diagnostyczny</CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
          </Card>
        </Link>
      )}

      <EstimatedScoreCard estimate={estimate} />

      {spacedReviewCandidate && spacedReviewTopicSlug && (
        <SpacedReviewCard candidate={spacedReviewCandidate} topicSlug={spacedReviewTopicSlug} />
      )}

      {assignedItems.length > 0 && <AssignedPracticeCard items={assignedItems} />}

      <TopicMasteryBars topics={topics} />

      <ProgressTrendChart snapshots={snapshots} />

      <WeakestTopicsCard topics={weakestTopics} />

      <Link
        href="/matma/kalendarz"
        className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          Kalendarz i statystyki
        </span>
        <ChevronRight className="h-4 w-4 text-foreground-muted" />
      </Link>

      {profile.role === "admin" && (
        <Link
          href="/matma/admin"
          className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Settings2 className="h-4 w-4 text-primary" />
            Panel administratora
          </span>
          <ChevronRight className="h-4 w-4 text-foreground-muted" />
        </Link>
      )}
    </div>
  );
}
