"use client";

// ============================================================================
// components/modlitwa/verse-card.tsx
// „Werset dnia” w oprawie graficznej: gradient dopasowany do koloru szat
// liturgicznych danego dnia, duża, czytelna typografia (aplikacja ma być
// przyjazna dla osób starszych) i dwie akcje — kopiowanie oraz systemowe
// udostępnianie tam, gdzie przeglądarka je wspiera.
// ============================================================================
import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import type { LiturgicalColor } from "@/lib/modlitwa/liturgical-calendar";
import type { BibleVerse } from "@/lib/types/database";

/** Gradient tła w barwie szat liturgicznych dnia. */
const GRADIENTS: Record<LiturgicalColor, string> = {
  bialy: "from-amber-100 via-amber-50 to-white dark:from-amber-950 dark:via-amber-900/40 dark:to-surface",
  czerwony: "from-rose-200 via-rose-100 to-white dark:from-rose-950 dark:via-rose-900/40 dark:to-surface",
  zielony:
    "from-emerald-200 via-emerald-100 to-white dark:from-emerald-950 dark:via-emerald-900/40 dark:to-surface",
  fioletowy:
    "from-violet-200 via-violet-100 to-white dark:from-violet-950 dark:via-violet-900/40 dark:to-surface",
  rozowy: "from-pink-200 via-pink-100 to-white dark:from-pink-950 dark:via-pink-900/40 dark:to-surface",
};

export function VerseCard({
  verse,
  color,
  dayName,
}: {
  verse: BibleVerse;
  color: LiturgicalColor;
  dayName: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `„${verse.text}”\n— ${verse.reference} (${verse.translation})`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Bez uprawnienia do schowka nie ma co pokazywać błędu — użytkownik
      // zawsze może zaznaczyć tekst ręcznie.
    }
  }

  async function share() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({ title: "Werset dnia", text: shareText });
    } catch {
      // Anulowanie okna udostępniania nie jest błędem.
    }
  }

  return (
    <section
      className={`rounded-(--radius-card) border border-border bg-gradient-to-br ${GRADIENTS[color]} p-6 shadow-sm`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        Werset dnia · {dayName}
      </p>

      <blockquote className="mt-4">
        <p className="text-[1.375rem] leading-relaxed font-medium text-foreground">„{verse.text}”</p>
        <footer className="mt-4 text-base font-semibold text-foreground">
          {verse.reference}
          <span className="ml-2 text-sm font-normal text-foreground-muted">{verse.translation}</span>
        </footer>
      </blockquote>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-11 items-center gap-2 rounded-(--radius-control) border border-border bg-surface/80 px-4 text-sm font-medium text-foreground active:opacity-80"
        >
          {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
          {copied ? "Skopiowano" : "Kopiuj"}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-11 items-center gap-2 rounded-(--radius-control) border border-border bg-surface/80 px-4 text-sm font-medium text-foreground active:opacity-80"
        >
          <Share2 className="h-4 w-4" />
          Udostępnij
        </button>
      </div>
    </section>
  );
}
