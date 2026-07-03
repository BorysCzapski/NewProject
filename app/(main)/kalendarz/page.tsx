// ============================================================================
// app/(main)/kalendarz/page.tsx
// "Kalendarz" screen: streak header, aggregate learning stats, and the
// interactive month calendar highlighting days with activity_log rows.
// ============================================================================
import { BookMarked, GraduationCap, BookOpen, PenLine, Music, Headphones } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { MonthCalendar } from "@/components/calendar/month-calendar";

export default async function KalendarzPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [
    { count: masteredWords },
    { count: correctGrammar },
    { count: readingTexts },
    { count: writingSubmissions },
    { data: songAttempts },
    { data: listeningAttempts },
  ] = await Promise.all([
    supabase
      .from("vocabulary_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("status", "mastered"),
    supabase
      .from("grammar_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("is_correct", true),
    supabase
      .from("reading_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id),
    supabase
      .from("writing_submissions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id),
    // PostgREST has no COUNT DISTINCT — fetch the id column and dedupe with a Set below.
    // Both songs and listening exercises can be attempted/retried multiple times.
    supabase.from("song_translation_attempts").select("song_id").eq("user_id", profile.id),
    supabase.from("listening_attempts").select("exercise_id").eq("user_id", profile.id),
  ]);

  const translatedSongs = new Set((songAttempts ?? []).map((row) => row.song_id)).size;
  const completedListeningExercises = new Set(
    (listeningAttempts ?? []).map((row) => row.exercise_id)
  ).size;

  const stats = [
    { icon: BookMarked, label: "Opanowane słówka", value: masteredWords ?? 0 },
    { icon: GraduationCap, label: "Poprawne ćwiczenia gramatyczne", value: correctGrammar ?? 0 },
    { icon: BookOpen, label: "Przeczytane teksty", value: readingTexts ?? 0 },
    { icon: PenLine, label: "Napisane teksty", value: writingSubmissions ?? 0 },
    { icon: Music, label: "Przetłumaczone piosenki", value: translatedSongs },
    { icon: Headphones, label: "Ukończone nagrania", value: completedListeningExercises },
  ];

  return (
    <div>
      <PageHeader
        title="Kalendarz"
        subtitle="Twoja passa i historia aktywności"
        action={<StreakBadge streak={profile.current_streak} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Card className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground-muted">Aktualna passa</p>
            <StreakBadge streak={profile.current_streak} size="lg" />
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground-muted">Rekord</p>
            <p className="text-lg font-bold text-foreground">{profile.longest_streak} dni</p>
          </div>
        </Card>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="flex flex-col items-center gap-1 py-3 text-center">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-[11px] leading-tight text-foreground-muted">{s.label}</span>
            </Card>
          ))}
        </div>

        <Card>
          <MonthCalendar userId={profile.id} />
        </Card>
      </div>
    </div>
  );
}
