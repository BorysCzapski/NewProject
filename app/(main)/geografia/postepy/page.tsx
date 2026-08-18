// ============================================================================
// app/(main)/geografia/postepy/page.tsx
// Full progress view: mastery per topic, trend chart, and a link to the
// printable report (product spec §8: "eksport wyników... który może zostać
// przekazany nauczycielowi").
// ============================================================================
import Link from "next/link";
import { FileDown } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getTopicsWithProgress } from "@/lib/geografia/progress";
import { computeEstimatedPercent, getProgressTrend } from "@/lib/geografia/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EstimatedScoreCard } from "@/components/geografia/dashboard/estimated-score-card";
import { TopicMasteryBars } from "@/components/geografia/dashboard/topic-mastery-bars";
import { ProgressTrendChart } from "@/components/geografia/dashboard/progress-trend-chart";

export default async function GeografiaProgressPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [topics, snapshots] = await Promise.all([
    getTopicsWithProgress(supabase, profile.id),
    getProgressTrend(supabase, profile.id),
  ]);
  const percent = computeEstimatedPercent(topics);

  return (
    <div>
      <PageHeader title="Postępy" subtitle="Statystyki nauki i eksport raportu" />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Link href="/geografia/raport">
          <Button variant="outline" className="w-full">
            <FileDown className="h-4 w-4" />
            Wygeneruj raport PDF dla nauczyciela
          </Button>
        </Link>

        <EstimatedScoreCard percent={percent} />
        <ProgressTrendChart snapshots={snapshots} />
        <TopicMasteryBars topics={topics} />
      </div>
    </div>
  );
}
