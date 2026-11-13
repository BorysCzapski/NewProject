// ============================================================================
// app/(main)/trading/lekcje/[slug]/page.tsx
// Pojedyncza lekcja: najważniejsze punkty, wniosek, powiązane scenariusze
// i pytania, przycisk „przerobiona" oraz nawigacja do sąsiednich lekcji.
// ============================================================================
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LessonDoneButton } from "@/components/trading/lesson-done";
import { BREAK_EVEN_TABLE, JOURNAL, LESSONS, QUIZ, SCENARIOS } from "@/lib/trading/content";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireProfile();
  const { slug } = await params;
  const index = LESSONS.findIndex((l) => l.slug === slug);
  if (index === -1) notFound();
  const lesson = LESSONS[index];
  const prev = LESSONS[index - 1];
  const next = LESSONS[index + 1];
  const scenarios = SCENARIOS.filter((s) => s.lesson === slug);
  const questions = QUIZ.filter((q) => q.lesson === slug).length;
  const examples = JOURNAL.filter((j) => j.lessonSlug === slug);

  return (
    <div>
      <PageHeader title={lesson.title} subtitle={`Lekcja ${index + 1} z ${LESSONS.length}`} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <p className="text-base text-foreground">{lesson.lead}</p>

        <Card>
          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
            {lesson.points.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Card>

        {slug === "matematyka" && (
          <Card className="flex flex-col gap-2">
            <CardTitle>Ściąga: relacja → próg opłacalności</CardTitle>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-foreground-muted">
                  <th className="py-1 font-medium">TP : SL</th>
                  <th className="py-1 text-right font-medium">Min. % wygranych</th>
                </tr>
              </thead>
              <tbody>
                {BREAK_EVEN_TABLE.map((r) => (
                  <tr key={r.rr} className="border-t border-border/70">
                    <td className="py-1.5">{r.rr}</td>
                    <td className="py-1.5 text-right font-semibold">{r.winPct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <Card className="border-primary/30 bg-primary-soft">
          <p className="text-sm font-semibold text-foreground">Zapamiętaj</p>
          <p className="mt-1 text-sm text-foreground">{lesson.takeaway}</p>
        </Card>

        {examples.length > 0 && (
          <Card className="flex flex-col gap-2">
            <CardTitle>Z Twojego dziennika</CardTitle>
            {examples.map((j, i) => (
              <p key={i} className="text-sm text-foreground-muted">
                <span className="font-medium text-foreground">
                  {j.date} · {j.side} · {j.resultPln >= 0 ? "+" : "−"}
                  {Math.abs(j.resultPln).toFixed(2).replace(".", ",")} PLN
                </span>
                {" — "}
                {j.lesson}
              </p>
            ))}
          </Card>
        )}

        <div className="flex flex-col gap-2">
          {scenarios.length > 0 && (
            <Link href="/trading/przyklady">
              <Button variant="outline" className="w-full">
                Ćwicz na przykładach ({scenarios.length})
              </Button>
            </Link>
          )}
          {questions > 0 && (
            <Link href="/trading/quiz">
              <Button variant="outline" className="w-full">
                Sprawdź się w quizie
              </Button>
            </Link>
          )}
        </div>

        <LessonDoneButton slug={lesson.slug} />

        <div className="flex gap-2">
          {prev ? (
            <Link href={`/trading/lekcje/${prev.slug}`} className="flex-1">
              <Button variant="ghost" className="w-full">← Poprzednia</Button>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link href={`/trading/lekcje/${next.slug}`} className="flex-1">
              <Button variant="ghost" className="w-full">Następna →</Button>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      </div>
    </div>
  );
}
