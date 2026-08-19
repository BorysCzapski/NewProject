// ============================================================================
// app/(main)/matura/nauka/slownictwo/page.tsx
// Vocabulary hub for Matura Angielski: lists CKE "kręgi tematyczne"
// (thematic circles) as tappable cards, each with a word count and a
// mastered-count summary from matura_vocabulary_progress.
// ============================================================================
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getMaturaSettings } from "@/lib/matura/settings";
import { MATURA_LEVEL_LABELS, visibleMaturaLevels } from "@/lib/matura/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MaturaVocabularyWord } from "@/lib/types/database";

export default async function MaturaSlownictwoPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const settings = await getMaturaSettings(supabase, profile.id);
  if (!settings) redirect("/matura");

  const { data: words } = await supabase
    .from("matura_vocabulary_words")
    .select("id, category")
    .in("level", visibleMaturaLevels(settings.level))
    .order("order_index");
  const wordList = (words ?? []) as Pick<MaturaVocabularyWord, "id" | "category">[];

  const wordIds = wordList.map((w) => w.id);
  const { data: progress } = wordIds.length
    ? await supabase
        .from("matura_vocabulary_progress")
        .select("word_id, status")
        .eq("user_id", profile.id)
        .eq("status", "mastered")
        .in("word_id", wordIds)
    : { data: [] };
  const masteredWordIds = new Set((progress ?? []).map((p) => p.word_id));

  const byCategory = new Map<string, { total: number; mastered: number }>();
  for (const word of wordList) {
    const entry = byCategory.get(word.category) ?? { total: 0, mastered: 0 };
    entry.total += 1;
    if (masteredWordIds.has(word.id)) entry.mastered += 1;
    byCategory.set(word.category, entry);
  }
  const categories = [...byCategory.entries()];

  return (
    <div>
      <PageHeader
        title="Słownictwo"
        subtitle="Fiszki wg kręgów tematycznych CKE"
        action={<Badge>{MATURA_LEVEL_LABELS[settings.level]}</Badge>}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        {categories.length === 0 ? (
          <Card>
            <CardDescription>Brak słownictwa dla tego poziomu — wróć tu później.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {categories.map(([category, { total, mastered }]) => (
              <Link key={category} href={`/matura/nauka/slownictwo/${encodeURIComponent(category)}`}>
                <Card className="flex items-center gap-3 transition-transform active:scale-[0.98]">
                  <div className="min-w-0 flex-1">
                    <CardTitle>{category}</CardTitle>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${total > 0 ? (mastered / total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs font-medium tabular-nums text-foreground-muted">
                        {mastered}/{total}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-foreground-muted" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
