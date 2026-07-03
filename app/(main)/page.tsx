// ============================================================================
// app/(main)/page.tsx
// Dashboard ("/"): streak, quick entries into every learning module, and a
// preview of active homework. The landing screen after login.
// ============================================================================
import Link from "next/link";
import { BookOpen, PenLine, Music, Headphones, GraduationCap, Layers, ArrowRight, Map } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getHomeworkWithProgress } from "@/lib/homework/progress";
import { getLearningPath } from "@/lib/learning-path/progress";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { HomeworkProgressBar } from "@/components/homework/homework-progress-bar";
import { HOMEWORK_TYPE_LABELS } from "@/lib/constants";

const MODULE_LINKS = [
  { href: "/nauka/fiszki", label: "Fiszki", icon: Layers, color: "bg-level-a1/15 text-level-a1" },
  { href: "/nauka/slowka", label: "Trener słówek", icon: BookOpen, color: "bg-level-a2/15 text-level-a2" },
  { href: "/nauka/gramatyka", label: "Gramatyka", icon: GraduationCap, color: "bg-level-b1/15 text-level-b1" },
  { href: "/nauka/czytanie", label: "Czytanie", icon: BookOpen, color: "bg-primary-soft text-primary" },
  { href: "/nauka/pisanie", label: "Pisanie", icon: PenLine, color: "bg-accent-soft text-accent" },
  { href: "/nauka/piosenki", label: "Piosenki", icon: Music, color: "bg-level-b2/15 text-level-b2" },
  { href: "/nauka/sluchanie", label: "Słuchanie", icon: Headphones, color: "bg-danger-soft text-danger" },
];

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [homework, { stages, currentStageIndex }] = await Promise.all([
    getHomeworkWithProgress(supabase, profile.id, profile.level),
    getLearningPath(supabase, profile.id, profile.level),
  ]);
  const activeHomework = homework
    .filter((h) => h.status !== "completed")
    .slice(0, 3);
  const currentStage = stages[currentStageIndex] ?? stages[stages.length - 1];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Dzień dobry" : hour < 18 ? "Miłego popołudnia" : "Dobry wieczór";

  return (
    <div className="mx-auto max-w-lg px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">{greeting},</p>
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StreakBadge streak={profile.current_streak} size="lg" />
          <LevelBadge level={profile.level} />
        </div>
      </div>

      {currentStage && (
        <Link href={`/nauka/sciezka/${currentStage.id}`} className="mb-6 block">
          <Card className="flex items-center gap-3 bg-primary-soft">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Map className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <CardDescription className="text-primary">
                Etap {Math.min(currentStageIndex + 1, stages.length)} z {stages.length}
              </CardDescription>
              <CardTitle>{currentStage.title}</CardTitle>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
          </Card>
        </Link>
      )}

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Ćwicz teraz
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {MODULE_LINKS.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="flex flex-col gap-2 active:scale-[0.98] transition-transform">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${mod.color}`}>
                  <mod.icon className="h-5 w-5" />
                </span>
                <span className="font-semibold text-foreground">{mod.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Prace domowe
          </h2>
          <Link href="/prace-domowe" className="flex items-center gap-1 text-sm font-medium text-primary">
            Zobacz wszystkie <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {activeHomework.length === 0 ? (
          <Card className="text-center text-sm text-foreground-muted">
            Brak aktywnych prac domowych — świetna robota! 🎉
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {activeHomework.map((hw) => (
              <Link key={hw.id} href="/prace-domowe">
                <Card>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <CardTitle>{hw.title}</CardTitle>
                  </div>
                  <CardDescription>{HOMEWORK_TYPE_LABELS[hw.type]}</CardDescription>
                  <HomeworkProgressBar
                    current={hw.progress_current}
                    target={hw.progress_target}
                    className="mt-3"
                  />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
