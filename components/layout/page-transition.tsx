"use client";

// ============================================================================
// components/layout/page-transition.tsx
// Płynne wejście strony po każdej zmianie adresu. Zwykły `template.tsx` nie
// wystarcza: odtwarza się tylko przy zmianie NAJBLIŻSZEGO segmentu, więc
// przejście z /jezyki/nauka/czytanie do /jezyki/nauka/fiszki (ten sam segment
// "nauka") nie dostałoby animacji. Klucz po `pathname` odtwarza ją przy każdej
// zmianie strony, a zmiana samego query (?tryb=…) niczego nie remontuje.
//
// Animacja używa wypełnienia `backwards` (app/globals.css, "Motion system"), więc
// po jej końcu element nie zostaje z `transform` — inaczej stałby się blokiem
// zawierającym dla dzieci z `position: fixed` (arkusz tłumaczenia, klawiatura).
// ============================================================================
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
