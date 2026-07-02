// ============================================================================
// app/(main)/nauka/czytanie/[id]/page.tsx
// Reading text detail: loads the text + its questions (404 if missing or not
// owned by the current user) and the user's latest attempt, if any, then
// hands off to a client component for the interactive answer/results flow.
// ============================================================================
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { ReadingSession } from "@/components/reading/reading-session";
import type { ReadingAttempt, ReadingQuestion, ReadingText } from "@/lib/types/database";
import type { ReadingQuestionResult } from "@/lib/reading/actions";

export default async function ReadingTextPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: text } = await supabase
    .from("reading_texts")
    .select("*")
    .eq("id", id)
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!text) notFound();
  const readingText = text as ReadingText;

  const { data: questions } = await supabase
    .from("reading_questions")
    .select("*")
    .eq("text_id", id)
    .order("order_index");

  const { data: attempt } = await supabase
    .from("reading_attempts")
    .select("*")
    .eq("text_id", id)
    .eq("user_id", profile.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let initialAttempt: { score: number; results: Record<string, ReadingQuestionResult>; answers: Record<string, string> } | null = null;
  if (attempt) {
    const readingAttempt = attempt as ReadingAttempt;
    try {
      initialAttempt = {
        score: readingAttempt.score ?? 0,
        results: JSON.parse(readingAttempt.feedback ?? "{}"),
        answers: readingAttempt.answers ?? {},
      };
    } catch {
      initialAttempt = null;
    }
  }

  return (
    <div>
      <PageHeader title={readingText.title} subtitle={`Poziom ${readingText.level} • ${readingText.topic}`} />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/nauka/czytanie"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Wszystkie teksty
        </Link>

        <ReadingSession
          text={readingText}
          questions={(questions ?? []) as ReadingQuestion[]}
          initialAttempt={initialAttempt}
        />
      </div>
    </div>
  );
}
