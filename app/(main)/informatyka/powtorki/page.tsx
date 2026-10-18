// ============================================================================
// app/(main)/informatyka/powtorki/page.tsx
// Spaced repetition: solved problems that are due for another go, plus what is
// coming up in the next days (see lib/informatyka/review.ts for the intervals).
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems } from "@/lib/informatyka/content";
import { getProgressMap } from "@/lib/informatyka/progress";
import { computeReview, type ReviewItem } from "@/lib/informatyka/review";
import { examShortLabel, KIND_LABEL } from "@/lib/informatyka/taxonomy";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription } from "@/components/ui/card";

const days = (n: number) => `${n} ${n === 1 ? "dzień" : "dni"}`;

function Item({ item }: { item: ReviewItem }) {
  const { problem } = item;
  return (
    <Link
      href={`/informatyka/zadanie/${problem.id}`}
      className="flex items-center gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-3 shadow-(--shadow-card) active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {examShortLabel(problem.exam)} · Zadanie {problem.label}
        </p>
        <p className="truncate text-xs text-foreground-muted">
          {KIND_LABEL[problem.kind]} · poprzednio {item.score}/{problem.points_max} pkt
        </p>
      </div>
      <span className="shrink-0 text-xs font-medium text-foreground-muted">
        {item.inDays <= 0 ? (item.inDays === 0 ? "dziś" : `${days(-item.inDays)} temu`) : `za ${days(item.inDays)}`}
      </span>
    </Link>
  );
}

export default async function PowtorkiPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const [problems, progress] = await Promise.all([getAllProblems(supabase), getProgressMap(supabase, profile.id)]);
  const { due, upcoming } = computeReview(problems, progress);

  return (
    <div>
      <PageHeader title="Powtórki" subtitle={`${due.length} do powtórki`} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card>
          <CardDescription className="text-xs">
            Zadania wracają tym szybciej, im mniej punktów za nie dostałeś: po 2 dniach (poniżej połowy), 5 dniach (częściowo) albo 21 dniach
            (komplet). Po ponownym rozwiązaniu i ocenie wracają według nowego wyniku.
          </CardDescription>
        </Card>
        {due.length === 0 ? (
          <Card className="text-center">
            <CardDescription>Nic do powtórki — wróć, gdy przyjdzie czas na kolejne zadania.</CardDescription>
          </Card>
        ) : (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Na teraz</h2>
            {due.map((item) => (
              <Item key={item.problem.id} item={item} />
            ))}
          </section>
        )}
        {upcoming.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">Wkrótce</h2>
            {upcoming.slice(0, 15).map((item) => (
              <Item key={item.problem.id} item={item} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
