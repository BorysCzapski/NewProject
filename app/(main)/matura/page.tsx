// ============================================================================
// app/(main)/matura/page.tsx
// Matura home ("Dziś") screen — the bottom-nav root tab. First visit (no
// matura_settings row) shows the język + poziom picker instead of a
// dashboard, same "pick your target before anything else" pattern as
// /onboarding for Linguo.
// ============================================================================
import Link from "next/link";
import { ChevronRight, Settings2, UploadCloud } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { getSectionsWithProgress } from "@/lib/matura/progress";
import { computeEstimatedScore } from "@/lib/matura/dashboard";
import { MATURA_LANGUAGE_LABELS, MATURA_LEVEL_LABELS } from "@/lib/matura/constants";
import { StreakBadge } from "@/components/dashboard/streak-badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ExamPreferencesForm } from "@/components/matura/exam-preferences-form";
import { EstimatedScoreCard } from "@/components/matura/estimated-score-card";
import { SectionList } from "@/components/matura/section-list";

export default async function MaturaDashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Dzień dobry" : hour < 18 ? "Miłego popołudnia" : "Dobry wieczór";

  if (!settings) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <div>
          <p className="text-sm text-foreground-muted">{greeting},</p>
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
        </div>
        <Card>
          <CardTitle>Do jakiej matury się przygotowujesz?</CardTitle>
          <CardDescription className="mt-1">
            Wybierz język i poziom — oba możesz później zmienić w każdej chwili w ustawieniach.
          </CardDescription>
          <div className="mt-4">
            <ExamPreferencesForm submitLabel="Zaczynamy!" />
          </div>
        </Card>
      </div>
    );
  }

  const sections = await getSectionsWithProgress(supabase, profile.id, settings.language, settings.level);
  const estimate = computeEstimatedScore(sections, settings.level);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground-muted">{greeting},</p>
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
        </div>
        <StreakBadge streak={profile.current_streak} size="lg" />
      </div>

      <EstimatedScoreCard estimate={estimate} level={settings.level} />

      <SectionList sections={sections} />

      <Link
        href="/matura/ustawienia"
        className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Settings2 className="h-4 w-4 text-primary" />
          {MATURA_LANGUAGE_LABELS[settings.language]} — {MATURA_LEVEL_LABELS[settings.level].toLowerCase()}
        </span>
        <ChevronRight className="h-4 w-4 text-foreground-muted" />
      </Link>

      {profile.role === "admin" && (
        <Link
          href="/matura/admin/import"
          className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            <UploadCloud className="h-4 w-4 text-primary" />
            Import zadań z arkusza (admin)
          </span>
          <ChevronRight className="h-4 w-4 text-foreground-muted" />
        </Link>
      )}
    </div>
  );
}
