// ============================================================================
// components/matma/dashboard/assigned-practice-card.tsx
// "Nauczyciel poleca": teacher-assigned practice items (math_assigned_practice
// rows the page already filtered to dismissed_at is null and resolved topic
// title/slug for via a join against math_topics). Each item links straight
// into practice for its topic and can be dismissed via the small client
// DismissPracticeButton.
// ============================================================================
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { DismissPracticeButton } from "@/components/matma/dashboard/dismiss-practice-button";

export interface AssignedPracticeItem {
  id: string;
  topicTitle: string;
  topicSlug: string;
  note: string | null;
}

export function AssignedPracticeCard({ items }: { items: AssignedPracticeItem[] }) {
  if (items.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <CardTitle>Nauczyciel poleca</CardTitle>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-(--radius-control) bg-surface-muted p-3">
            <p className="text-sm font-medium text-foreground">Nauczyciel poleca: {item.topicTitle}</p>
            {item.note && <CardDescription className="mt-0.5">{item.note}</CardDescription>}
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <Link href={`/matma/nauka/${item.topicSlug}/cwiczenia`} className="text-sm font-medium text-primary">
                Ćwicz teraz
              </Link>
              <DismissPracticeButton id={item.id} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
