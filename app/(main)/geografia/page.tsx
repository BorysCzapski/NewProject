// ============================================================================
// app/(main)/geografia/page.tsx
// Geografia home ("Dziś") screen — the bottom-nav root tab. Pulls together
// the student's estimated mastery level, per-topic overview, progress trend
// and any due spaced-review check-in. Mirrors app/(main)/matma/page.tsx.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Settings2, Star, TrendingUp, Upload } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress, getWeakestTopics } from "@/lib/geografia/progress";
import { computeEstimatedPercent, getProgressTrend } from "@/lib/geografia/dashboard";
import { getSpacedReviewCandidate } from "@/lib/geografia/spaced-review";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { EstimatedScoreCard } from "@/components/geografia/dashboard/estimated-score-card";
import { SpacedReviewCard } from "@/components/geografia/dashboard/spaced-review-card";
import { TopicMasteryBars } from "@/components/geografia/dashboard/topic-mastery-bars";
import { ProgressTrendChart } from "@/components/geografia/dashboard/progress-trend-chart";
import { WeakestTopicsCard } from "@/components/geografia/dashboard/weakest-topics-card";

export default async function GeografiaDashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, snapshots, spacedReviewCandidate] = await Promise.all([
    getTopicsWithProgress(supabase, profile.id),
    getProgressTrend(supabase, profile.id),
    getSpacedReviewCandidate(supabase, profile.id),
  ]);

  const percent = computeEstimatedPercent(topics);
  const weakestTopics = getWeakestTopics(topics);

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

      <EstimatedScoreCard percent={percent} />

      {spacedReviewCandidate && <SpacedReviewCard candidate={spacedReviewCandidate} />}

      <TopicMasteryBars topics={topics} />

      <ProgressTrendChart snapshots={snapshots} />

      <WeakestTopicsCard topics={weakestTopics} />

      <Link
        href="/geografia/postepy"
        className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Postępy i raport
        </span>
        <ChevronRight className="h-4 w-4 text-foreground-muted" />
      </Link>

      <Link
        href="/geografia/ulubione"
        className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Star className="h-4 w-4 text-primary" />
          Ulubione ćwiczenia
        </span>
        <ChevronRight className="h-4 w-4 text-foreground-muted" />
      </Link>

      <Link
        href="/geografia/wgraj"
        className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Upload className="h-4 w-4 text-primary" />
          Wgraj własny arkusz
        </span>
        <ChevronRight className="h-4 w-4 text-foreground-muted" />
      </Link>

      {profile.role === "admin" && (
        <Link
          href="/geografia/admin"
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
