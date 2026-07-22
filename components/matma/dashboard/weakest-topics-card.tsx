// ============================================================================
// components/matma/dashboard/weakest-topics-card.tsx
// Surfaces the 2-3 weakest topics (already sliced by the caller via
// getWeakestTopics in lib/matma/progress.ts) with a direct link into
// practice for each.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import type { TopicWithProgress } from "@/lib/matma/progress";

export function WeakestTopicsCard({ topics }: { topics: TopicWithProgress[] }) {
  if (topics.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>Warto podciągnąć</CardTitle>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/matma/nauka/${topic.slug}/cwiczenia`}
            className="flex items-center justify-between gap-3 rounded-(--radius-control) bg-surface-muted px-3.5 py-3 active:opacity-80"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{topic.title}</p>
              <p className="text-xs text-foreground-muted">{topic.masteryScore}% opanowania</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
              Ćwicz to teraz
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
