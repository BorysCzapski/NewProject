// ============================================================================
// components/lexicon/session-empty.tsx
// Ekran "na dziś gotowe" dla sesji Pisowni i Treningu fiszek, gdy nie ma ani
// nowych słów, ani powtórek z minionym terminem. Bez hooków, więc działa i na
// serwerze, i w przeglądarce.
//
// Mówi PRAWDĘ o tym, kiedy coś wróci (po poprawnej odpowiedzi powtórka jest
// dopiero za 2 dni, nie "jutro") i daje wyjście: ćwiczenie dodatkowe, które nie
// przesuwa harmonogramu. Sam komunikat "wróć jutro" robił z poprawnie
// działającego modułu coś, co wygląda na zepsute.
// ============================================================================
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SessionEmpty({
  nextDueText,
  canPracticeExtra,
  extraHref,
  backHref,
}: {
  /** Np. "jutro", "za 2 dni"; null, gdy nic nie jest zaplanowane. */
  nextDueText: string | null;
  canPracticeExtra: boolean;
  extraHref: string;
  backHref: string;
}) {
  return (
    <Card className="flex flex-col gap-3 text-center">
      <p className="text-lg font-semibold text-foreground">
        {canPracticeExtra ? "Na dziś gotowe" : "Nie ma tu jeszcze słów do ćwiczenia"}
      </p>
      <p className="text-sm leading-relaxed text-foreground-muted">
        {canPracticeExtra
          ? nextDueText
            ? `Wszystkie słowa z tej talii są już przećwiczone, a najbliższa powtórka wypada ${nextDueText}.`
            : "Wszystkie słowa z tej talii są już przećwiczone."
          : "W tej talii nie ma jeszcze słów z tłumaczeniem. Wybierz inną talię albo poznaj kilka słów w „Codzienne”."}
      </p>
      {canPracticeExtra && (
        <>
          <Link href={extraHref} className="w-full">
            <Button className="w-full" size="lg">
              Ćwicz dodatkowo
            </Button>
          </Link>
          <p className="text-xs leading-relaxed text-foreground-muted">
            Dodatkowe ćwiczenie nie przesuwa terminów powtórek: poprawne odpowiedzi nic nie zmieniają, a błędy wciąż
            się liczą.
          </p>
        </>
      )}
      <Link href={backHref} className="w-full">
        <Button variant="outline" className="w-full">
          Wróć do talii
        </Button>
      </Link>
    </Card>
  );
}
