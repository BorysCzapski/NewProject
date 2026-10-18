// ============================================================================
// app/(main)/informatyka/egzamin/[slug]/page.tsx
// "Rozwiąż na czas": explains the mode and starts the countdown for one paper.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getAllProblems, getExamBySlug } from "@/lib/informatyka/content";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StartExamButton } from "@/components/informatyka/start-exam-button";

export default async function EgzaminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireProfile();
  const supabase = await createClient();
  const exam = await getExamBySlug(supabase, slug);
  if (!exam) notFound();
  const problems = (await getAllProblems(supabase)).filter((p) => p.exam.id === exam.id);
  const minutes = exam.duration_minutes ?? 210;

  return (
    <div>
      <PageHeader title="Rozwiąż na czas" subtitle={exam.title} />
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 py-5">
        <Card className="flex flex-col gap-3">
          <CardTitle>{exam.title}</CardTitle>
          <CardDescription>
            {problems.length} podzadań, {exam.max_points} pkt, {minutes} minut ({Math.floor(minutes / 60)} h {minutes % 60} min).
          </CardDescription>
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground-muted">
            <li>Na górze ekranu leci czas; po jego upływie egzamin kończy się sam.</li>
            <li>Podczas egzaminu klucz i automatyczne sprawdzanie tego arkusza są zablokowane.</li>
            <li>Po zakończeniu przejdziesz do podsumowania: tam odsłonisz klucze i ocenisz każde zadanie.</li>
            <li>Rozwiązania (kod, SQL, arkusz, canvas) zapisują się na bieżąco.</li>
          </ul>
        </Card>
        <StartExamButton slug={exam.slug} minutes={minutes} />
      </div>
    </div>
  );
}
