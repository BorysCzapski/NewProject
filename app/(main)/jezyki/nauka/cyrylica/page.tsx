// ============================================================================
// app/(main)/nauka/cyrylica/page.tsx
// Standalone Cyrillic primer for Russian learners — the recommended FIRST
// step of the Russian path, because stage-1 flashcards are unreadable without
// knowing the alphabet. Reuses the interactive lesson renderer with authored
// blocks from lib/grammar/content/ru-cyrylica.ts. Only meaningful for
// profiles learning Russian; other languages get a gentle pointer back.
// ============================================================================
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GrammarLesson } from "@/components/grammar/lesson/grammar-lesson";
import { RU_CYRYLICA_INTRO } from "@/lib/grammar/content/ru-cyrylica";

export default async function CyrylicaPage() {
  const profile = await requireProfile();

  if (profile.target_language !== "ru") {
    return (
      <div>
        <PageHeader title="Cyrylica" subtitle="Wprowadzenie do rosyjskiego alfabetu" />
        <div className="mx-auto max-w-lg px-5 py-5">
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>Ta lekcja dotyczy rosyjskiego</CardTitle>
            <CardDescription>
              Uczysz się teraz innego języka. Jeśli chcesz zacząć rosyjski, zmień język w
              profilu — wtedy ta lekcja stanie się Twoim pierwszym krokiem.
            </CardDescription>
            <Link href="/jezyki/nauka" className="mt-2">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Wróć do nauki
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Cyrylica"
        subtitle="Zacznij tutaj — 30 minut i wszystko przeczytasz"
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Link
          href="/jezyki/nauka"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Nauka
        </Link>

        <GrammarLesson blocks={RU_CYRYLICA_INTRO} />

        <Card className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
          <CardTitle>Umiesz już czytać!</CardTitle>
          <CardDescription>
            Od teraz fiszki i cała ścieżka nauki będą zrozumiałe. Powodzenia!
          </CardDescription>
          <Link href="/jezyki/nauka/sciezka" className="mt-2 w-full max-w-xs">
            <Button size="lg" className="w-full">
              Przejdź do ścieżki nauki
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
