// ============================================================================
// components/geografia/dashboard/weakest-topics-card.tsx
// The 2-3 weakest (already-attempted) topics with a direct link to practice.
// Mirrors components/matma/dashboard/weakest-topics-card.tsx.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import type { TopicWithProgress } from "@/lib/geografia/progress";

export function WeakestTopicsCard({ topics }: { topics: TopicWithProgress[] }) {
  if (topics.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>Nad czym warto popracować</CardTitle>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/geografia/tematy/${topic.slug}`}
            className="flex items-center justify-between gap-2 rounded-(--radius-control) border border-border px-3 py-2.5 active:bg-surface-muted"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{topic.title}</span>
            <span className="shrink-0 text-xs font-medium text-foreground-muted">{topic.masteryScore}%</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
