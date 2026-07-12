// ============================================================================
// app/(main)/nauka/czytanie/page.tsx
// Reading module hub: a topic picker for generating a new AI article, and a
// list of the user's past reading_texts (most recent first) with a score
// badge for any text they've already attempted.
// ============================================================================
import Link from "next/link";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge, LevelBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TopicPicker } from "@/components/reading/topic-picker";
import type { ReadingText } from "@/lib/types/database";

export default async function ReadingHubPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  // Scoped to the user's CURRENT level — if they change level later, older
  // texts written for a different level shouldn't clutter this list (they're
  // either too easy or too hard to be useful review material anymore).
  const { data: texts } = await supabase
    .from("reading_texts")
    .select("*")
    .eq("user_id", profile.id)
    .eq("level", profile.level)
    .eq("language", profile.target_language)
    .order("created_at", { ascending: false });

  const textList = (texts ?? []) as ReadingText[];
  const textIds = textList.map((t) => t.id);

  const scoreByText = new Map<string, number>();
  if (textIds.length > 0) {
    const { data: attempts } = await supabase
      .from("reading_attempts")
      .select("text_id, score, completed_at")
      .eq("user_id", profile.id)
      .in("text_id", textIds)
      .order("completed_at", { ascending: false });

    // Most recent attempt per text wins (attempts are ordered newest-first).
    for (const a of attempts ?? []) {
      if (!scoreByText.has(a.text_id) && a.score !== null) {
        scoreByText.set(a.text_id, a.score);
      }
    }
  }

  return (
    <div>
      <PageHeader
        title="Czytanie"
        subtitle="Artykuły od AI dopasowane do Twojego poziomu"
        action={<LevelBadge level={profile.level} />}
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <TopicPicker />

        <h2 className="mt-8 mb-3 text-lg font-semibold text-foreground">Twoje teksty</h2>
        {textList.length === 0 ? (
          <Card>
            <CardDescription>
              Nie masz jeszcze żadnych tekstów. Wybierz temat powyżej, żeby zacząć.
            </CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {textList.map((text) => {
              const score = scoreByText.get(text.id);
              return (
                <Link key={text.id} href={`/nauka/czytanie/${text.id}`}>
                  <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                    <div className="min-w-0 flex-1">
                      <CardTitle>{text.title}</CardTitle>
                      <CardDescription className="mt-0.5">{text.topic}</CardDescription>
                    </div>
                    {score !== undefined ? (
                      <Badge
                        className={cn(
                          score >= 80
                            ? "bg-primary-soft text-primary"
                            : score >= 50
                              ? "bg-warning-soft text-warning"
                              : "bg-danger-soft text-danger"
                        )}
                      >
                        {score}%
                      </Badge>
                    ) : (
                      <Badge>Nieukończone</Badge>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
