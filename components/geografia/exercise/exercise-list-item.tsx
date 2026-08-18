// ============================================================================
// components/geografia/exercise/exercise-list-item.tsx
// One row in a topic's exercise list: type icon, difficulty dots, points,
// a "sprawdzone" mark for reviewed content vs a subtle "AI/wgrane" tag for
// needs_review content (transparency, not a blocker — see 0015_geografia.sql
// header comment on why unreviewed content still ships to students).
// ============================================================================
import Link from "next/link";
import { CheckCircle2, ListChecks, Map, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GeoExercise } from "@/lib/types/database";

const TYPE_ICONS = { mc: ListChecks, open: MessageSquareText, map: Map };
const TYPE_LABELS = { mc: "Zamknięte", open: "Otwarte", map: "Mapa" };

export function ExerciseListItem({
  exercise,
  isFavorite,
  isSolved,
}: {
  exercise: GeoExercise;
  isFavorite: boolean;
  isSolved: boolean;
}) {
  const Icon = TYPE_ICONS[exercise.type];

  return (
    <Link href={`/geografia/cwiczenie/${exercise.id}`} className="block">
      <Card className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-foreground-muted">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium text-foreground">{exercise.prompt.statement}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge>{TYPE_LABELS[exercise.type]}</Badge>
            <Badge>
              {exercise.points_max} pkt · poziom {exercise.difficulty}
            </Badge>
            {exercise.needs_review && <Badge className="bg-warning-soft text-warning">niesprawdzone</Badge>}
            {isSolved && (
              <span className="flex items-center gap-1 text-xs font-medium text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" />
                rozwiązane
              </span>
            )}
          </div>
        </div>
        {isFavorite && <span className="text-warning">★</span>}
      </Card>
    </Link>
  );
}
