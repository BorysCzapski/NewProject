// ============================================================================
// app/(main)/profil/page.tsx
// Profile screen: identity, level (editable), theme, aggregate stats,
// admin panel entry point (role === 'admin' only), and logout.
// ============================================================================
import { ShieldCheck, Trophy, BookMarked, PenLine } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LevelChangeForm } from "@/components/profile/level-change-form";
import { LanguageChangeForm } from "@/components/profile/language-change-form";
import { ThemeToggle } from "@/components/profile/theme-toggle";
import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from "@/lib/constants";
import Link from "next/link";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ count: masteredWords }, { count: readingTexts }, { count: writingSubmissions }] =
    await Promise.all([
      supabase
        .from("vocabulary_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .eq("status", "mastered"),
      supabase
        .from("reading_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id),
      supabase
        .from("writing_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", profile.id),
    ]);

  const stats = [
    { icon: BookMarked, label: "Opanowane słówka", value: masteredWords ?? 0 },
    { icon: Trophy, label: "Rekord streaka", value: profile.longest_streak },
    { icon: PenLine, label: "Napisane teksty", value: (readingTexts ?? 0) + (writingSubmissions ?? 0) },
  ];

  return (
    <div>
      <PageHeader title="Profil" subtitle={profile.email} />
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-5">
        <Card className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-xl font-bold text-primary">
            {profile.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{profile.username}</p>
            <p className="text-sm text-foreground-muted">{profile.email}</p>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="flex flex-col items-center gap-1 text-center">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-[11px] leading-tight text-foreground-muted">{s.label}</span>
            </Card>
          ))}
        </div>

        {profile.role === "admin" && (
          <Link href="/admin">
            <Card className="flex items-center justify-between bg-primary-soft">
              <span className="flex items-center gap-2 font-semibold text-primary">
                <ShieldCheck className="h-5 w-5" /> Panel administratora
              </span>
            </Card>
          </Link>
        )}

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Język nauki
          </h2>
          <p className="mb-3 flex items-center gap-2 text-foreground">
            <span className="text-2xl">{LANGUAGE_FLAGS[profile.target_language]}</span>
            <span className="font-semibold">{LANGUAGE_LABELS[profile.target_language]}</span>
          </p>
          <LanguageChangeForm currentLanguage={profile.target_language} />
          <p className="mt-2 text-xs text-foreground-muted">
            Zmiana języka przełącza wszystkie treści (słówka, gramatykę, zadania) na wybrany język.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Twój poziom
          </h2>
          <LevelChangeForm currentLevel={profile.level} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Wygląd
          </h2>
          <ThemeToggle />
        </section>

        <form action={logout}>
          <Button type="submit" variant="ghost" className="w-full text-danger">
            Wyloguj się
          </Button>
        </form>
      </div>
    </div>
  );
}
