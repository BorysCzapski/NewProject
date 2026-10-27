// ============================================================================
// app/(main)/jezyki/nauka/pisownia/page.tsx
// "Pisownia" — uzupełnianie brakujących liter w angielskich słowach. Tylko dla
// języka angielskiego: ćwiczenie opiera się na angielskiej ortografii i
// talii leksykonu (lexicon_decks), która jest angielska.
// ============================================================================
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getSpellingDecks } from "@/lib/lexicon/spelling-queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function PisowniaPage() {
  const profile = await requireProfile();
  if (profile.target_language !== "en") redirect("/jezyki/nauka");

  const supabase = await createClient();
  const decks = await getSpellingDecks(supabase, profile.id);

  return (
    <div>
      <PageHeader title="Pisownia" subtitle="Uzupełnij brakujące litery" />
      <div className="mx-auto flex max-w-lg flex-col gap-3 px-5 py-5">
        <Card className="text-sm leading-relaxed text-foreground-muted">
          Widzisz polskie znaczenie i słowo z jedną lub dwiema brakującymi literami. Nowe słowo ma jedną lukę, a
          gdy już je znasz — dwie. Błąd wraca za kilka kart, z innymi literami do uzupełnienia.
        </Card>

        {decks.length === 0 && (
          <Card className="text-center text-sm text-foreground-muted">Talie nie są jeszcze wgrane do bazy.</Card>
        )}

        {decks.map(({ deck, available, started, mastered, due }) => {
          const disabled = available === 0;
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
                  </>
                )}
              </div>
              {!disabled && <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />}
            </Card>
          );
          return disabled ? (
            <div key={deck.id}>{body}</div>
          ) : (
            <Link key={deck.id} href={`/jezyki/nauka/pisownia/sesja/${deck.slug}`}>
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
