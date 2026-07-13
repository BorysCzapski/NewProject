// ============================================================================
// app/(main)/nauka/fiszki/page.tsx
// Flashcards trainer entry point: fetches a language- + level-appropriate
// word batch on the server, then hands it off to the client-driven flip-card
// session. The mode switcher narrows the batch to unmastered-only or
// brand-new-only words; ?stage= carries the learning-path stage to return to
// afterwards.
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getFlashcardBatch, type FlashcardMode } from "@/lib/vocabulary/words";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LevelBadge } from "@/components/ui/badge";
import { FlashcardTrainer } from "@/components/vocabulary/flashcard-trainer";
import { cn } from "@/lib/utils";

const MODES: Array<{ value: FlashcardMode; label: string }> = [
  { value: "all", label: "Wszystkie" },
  { value: "unmastered", label: "Do nauki" },
  { value: "new", label: "Nowe" },
];

const EMPTY_MESSAGES: Record<FlashcardMode, { title: string; description: string }> = {
  all: {
    title: "Brak słówek dla Twojego poziomu",
    description: "Nie znaleziono jeszcze słówek dla tego poziomu. Wróć tu później.",
  },
  unmastered: {
    title: "Wszystko opanowane! 🎉",
    description: "Nie masz tu już słówek do nauki — przełącz na „Wszystkie”, żeby powtórzyć opanowane.",
  },
  new: {
    title: "Brak nowych słówek",
    description: "Każde słówko z tej puli już ćwiczyłeś/aś — wybierz „Do nauki” albo „Wszystkie”.",
  },
};

function parseMode(raw?: string): FlashcardMode {
  return raw === "unmastered" || raw === "new" ? raw : "all";
}

export default async function FiszkiPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; stage?: string; mode?: string }>;
}) {
  const { category, stage, mode: rawMode } = await searchParams;
  const mode = parseMode(rawMode);
  const profile = await requireProfile();
  const supabase = await createClient();
  const words = await getFlashcardBatch(
    supabase,
    profile.id,
    profile.target_language,
    profile.level,
    15,
    category,
    mode
  );

  const backHref = stage ? `/jezyki/nauka/sciezka/${encodeURIComponent(stage)}` : undefined;
  const hrefFor = (m: FlashcardMode) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (stage) params.set("stage", stage);
    if (m !== "all") params.set("mode", m);
    const query = params.toString();
    return `/jezyki/nauka/fiszki${query ? `?${query}` : ""}`;
  };

  const empty = EMPTY_MESSAGES[mode];

  return (
    <div>
      <PageHeader
        title="Fiszki"
        subtitle={category ? `Kategoria: ${category}` : "Powtarzaj słówka aż do opanowania"}
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <div className="mb-4 flex rounded-(--radius-control) bg-surface-muted p-1">
          {MODES.map((m) => (
            <Link
              key={m.value}
              href={hrefFor(m.value)}
              className={cn(
                "min-h-9 flex-1 rounded-[calc(var(--radius-control)-4px)] px-2 py-1.5 text-center text-sm font-medium transition-colors",
                m.value === mode
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-foreground-muted"
              )}
            >
              {m.label}
            </Link>
          ))}
        </div>

        {words.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 py-10 text-center">
            <CardTitle>{empty.title}</CardTitle>
            <CardDescription>{empty.description}</CardDescription>
          </Card>
        ) : (
          <FlashcardTrainer words={words} backHref={backHref} />
        )}
      </div>
    </div>
  );
}
