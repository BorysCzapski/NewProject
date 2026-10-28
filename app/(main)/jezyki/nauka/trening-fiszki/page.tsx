// ============================================================================
// app/(main)/jezyki/nauka/trening-fiszki/page.tsx
// "Trening fiszek" — widzisz polskie słowo, wpisujesz angielskie. Tylko dla
// języka angielskiego: talie leksykonu (lexicon_decks) są angielskie.
// ============================================================================
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getSkillDecks } from "@/lib/lexicon/skill-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function TreningFiszekPage() {
  const profile = await requireProfile();
  if (profile.target_language !== "en") redirect("/jezyki/nauka");

  const supabase = await createClient();
  const decks = await getSkillDecks(supabase, profile.id, "lexicon_recall_progress");

  return (
    <div>
      <PageHeader title="Trening fiszek" subtitle="Polskie słowo, angielska odpowiedź" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <Card className="text-sm leading-relaxed text-foreground-muted">
          Widzisz polskie słowo i wpisujesz je po angielsku. Przyjmuję też warianty, np. „pavement” i „sidewalk”.
          Błąd wraca za kilka kart, a literówka o jedną literę jest oznaczona jako „prawie”.
        </Card>

        {decks.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">Talie nie są jeszcze wgrane do bazy.</Card>
        )}

        {decks.map(({ deck, available, started, mastered, due }) => {
          const disabled = available === 0;
          // Wszystko przećwiczone i nic nie czeka: sesja będzie pusta, więc
          // mówimy to od razu, zamiast kazać klikać, żeby się o tym przekonać.
          const caughtUp = available > 0 && started >= available && due === 0;
          const body = (
            <Card
              className={`flex items-center justify-between gap-3 transition-transform ${
                disabled ? "opacity-60" : "active:scale-[0.99]"
              }`}
            >
              <div className="min-w-0 flex-1">
                <CardTitle>{deck.title}</CardTitle>
                <CardDescription className="mt-0.5">{deck.description}</CardDescription>
                {disabled ? (
                  <p className="mt-1.5 text-xs text-foreground-muted">
                    Najpierw poznaj kilka słów w „Codzienne” — tu ćwiczysz tylko te, które mają już tłumaczenie.
                  </p>
                ) : (
                  <>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${(mastered / available) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs tabular-nums text-foreground-muted">
                      {mastered} opanowanych • {started}/{available} ćwiczonych
                      {due > 0 && <span className="ml-1.5 text-primary">• {due} do powtórki</span>}
                    </p>
                    {caughtUp && (
                      <p className="mt-1 text-xs text-foreground-muted">
                        Na dziś gotowe — możesz poćwiczyć dodatkowo.
                      </p>
                    )}
                  </>
                )}
              </div>
              {!disabled && <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />}
            </Card>
          );
          return disabled ? (
            <div key={deck.id}>{body}</div>
          ) : (
            <Link key={deck.id} href={`/jezyki/nauka/trening-fiszki/sesja/${deck.slug}`}>
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
