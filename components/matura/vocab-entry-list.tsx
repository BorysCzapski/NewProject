"use client";

// ============================================================================
// components/matura/vocab-entry-list.tsx
// Browsable word list for one thematic block: a filter box, a per-entry
// mastery dot, and tap-to-expand for the example sentence and usage note.
//
// Filtering is client-side over an already-loaded block (a few hundred short
// rows at most). A round-trip per keystroke would be slower and would break
// the list on a patchy connection, which is exactly when someone is revising
// on a bus.
// ============================================================================
import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MATURA_LEVEL_LABELS } from "@/lib/matura/constants";
import type { MasteryStatus, MaturaVocabEntry } from "@/lib/types/database";

const STATUS_DOT: Record<MasteryStatus, string> = {
  new: "bg-border",
  learning: "bg-warning",
  mastered: "bg-accent",
};

const STATUS_LABEL: Record<MasteryStatus, string> = {
  new: "nowe",
  learning: "w trakcie",
  mastered: "opanowane",
};

export function VocabEntryList({
  entries,
  statuses,
  showLevelBadge,
}: {
  entries: MaturaVocabEntry[];
  /** entry id -> mastery status; missing means never practised. */
  statuses: Record<string, MasteryStatus>;
  /** Only meaningful for a rozszerzona student, whose list mixes both levels. */
  showLevelBadge: boolean;
}) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter(
      (entry) =>
        entry.term.toLowerCase().includes(needle) ||
        entry.translation_pl.toLowerCase().includes(needle)
    );
  }, [entries, query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj słowa lub tłumaczenia…"
          aria-label="Szukaj w słownictwie"
          className="pl-10"
        />
      </div>

      {filtered.length === 0 && (
        <Card className="text-center text-sm text-foreground-muted">Nic nie pasuje do „{query}”.</Card>
      )}

      <ul className="flex flex-col gap-1.5">
        {filtered.map((entry) => {
          const status = statuses[entry.id] ?? "new";
          const isOpen = expanded === entry.id;
          const hasDetail = Boolean(entry.example || entry.note);
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : entry.id)}
                disabled={!hasDetail}
                className="w-full rounded-(--radius-control) bg-surface-muted px-3 py-2.5 text-left transition-colors active:bg-border/50 disabled:active:bg-surface-muted"
              >
                <span className="flex items-start gap-2.5">
                  <span
                    className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", STATUS_DOT[status])}
                    aria-label={STATUS_LABEL[status]}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-foreground">{entry.term}</span>
                      {entry.part_of_speech && (
                        <span className="shrink-0 text-xs text-foreground-muted">{entry.part_of_speech}</span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-foreground-muted">{entry.translation_pl}</span>
                    {showLevelBadge && entry.level === "rozszerzona" && (
                      <span className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        {MATURA_LEVEL_LABELS.rozszerzona.replace("Poziom ", "")}
                      </span>
                    )}
                  </span>
                  {hasDetail && (
                    <ChevronDown
                      className={cn(
                        "mt-1 h-4 w-4 shrink-0 text-foreground-muted transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </span>

                {isOpen && (
                  <span className="mt-2 block border-t border-border pt-2">
                    {entry.example && (
                      <span className="block text-sm italic leading-relaxed text-foreground">
                        {entry.example}
                      </span>
                    )}
                    {entry.example_pl && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-foreground-muted">
                        {entry.example_pl}
                      </span>
                    )}
                    {entry.note && (
                      <span className="mt-1.5 block text-xs leading-relaxed text-primary">💡 {entry.note}</span>
                    )}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
