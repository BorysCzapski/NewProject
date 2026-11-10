"use client";

// ============================================================================
// components/reading/word-translation.tsx
// "Dotknij słowa, zobacz polskie tłumaczenie" w czytankach.
//
//  - useWordTranslation: JEDEN stan na całą czytankę (zaznaczone słowo, ładowanie,
//    wynik), współdzielony przez artykuł i pytania — dzięki temu nie da się
//    otworzyć dwóch arkuszy naraz, a zaznaczenie przeskakuje między tekstami.
//  - TappableText: tekst pocięty na słowa; dotknięcie słowa woła tłumaczenie.
//  - TranslationSheet: arkusz u dołu ekranu (nie blokuje tekstu — można od razu
//    dotknąć kolejnego słowa).
//
// Tłumaczenie słowa jest zależne od zdania (lib/reading/translate-actions.ts),
// a wyniki zostają w pamięci strony: to samo słowo w tym samym zdaniu nie woła
// AI drugi raz.
//
// Słowa to <span role="button" tabIndex={-1}>, nie <button> i nie ogniska
// klawiatury: czytanka ma kilkaset słów i kilkaset przystanków Tab zrobiłoby z
// formularza pod nią męczarnię, a <button> w środku akapitu zachowuje się
// nierówno w różnych przeglądarkach. Dla czytników ekranu pozostają rolą przycisku.
// ============================================================================
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Loader2, RotateCcw, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { translateWord, type WordTranslation } from "@/lib/reading/translate-actions";
import { sentenceAround, tokenize, translationCacheKey } from "@/lib/reading/words";
import type { TargetLanguage } from "@/lib/types/database";

const SPEECH_LANG: Record<TargetLanguage, string> = { en: "en-GB", es: "es-ES", ru: "ru-RU" };

/** Wyniki przeżywają przejścia między czytankami w tej samej sesji przeglądarki. */
const CACHE = new Map<string, WordTranslation>();

interface Selected {
  /** Identyfikuje konkretne wystąpienie słowa w konkretnym tekście. */
  key: string;
  word: string;
  sentence: string;
}

type Phase =
  | { status: "idle" }
  | { status: "loading"; selected: Selected }
  | { status: "ready"; selected: Selected; data: WordTranslation }
  | { status: "error"; selected: Selected; message: string };

export interface WordTranslator {
  language: TargetLanguage;
  phase: Phase;
  tap: (selected: Selected) => void;
  retry: () => void;
  close: () => void;
}

/** Podpis akcji tłumaczącej; osobny typ, żeby test mógł wstawić atrapę. */
export type TranslateFn = typeof translateWord;

export function useWordTranslation(language: TargetLanguage, translate: TranslateFn = translateWord): WordTranslator {
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  // Numer ostatniego dotknięcia: spóźniona odpowiedź na poprzednie słowo nie może
  // nadpisać tego, które użytkownik dotknął w międzyczasie.
  const latest = useRef(0);

  const load = useCallback(
    async (selected: Selected) => {
      const request = ++latest.current;
      const cached = CACHE.get(translationCacheKey(language, selected.word, selected.sentence));
      if (cached) {
        setPhase({ status: "ready", selected, data: cached });
        return;
      }
      setPhase({ status: "loading", selected });
      const result = await translate({ word: selected.word, sentence: selected.sentence, language }).catch(
        () => null
      );
      if (request !== latest.current) return;
      if (result?.ok) {
        CACHE.set(translationCacheKey(language, selected.word, selected.sentence), result.data);
        setPhase({ status: "ready", selected, data: result.data });
      } else {
        setPhase({
          status: "error",
          selected,
          message: result && !result.ok ? result.error : "Nie udało się pobrać tłumaczenia. Spróbuj ponownie.",
        });
      }
    },
    [language, translate]
  );

  const tap = useCallback(
    (selected: Selected) => {
      // Ponowne dotknięcie zaznaczonego słowa zamyka arkusz.
      if (phase.status !== "idle" && phase.selected.key === selected.key) {
        latest.current++;
        setPhase({ status: "idle" });
        return;
      }
      void load(selected);
    },
    [phase, load]
  );

  const retry = useCallback(() => {
    if (phase.status === "error") void load(phase.selected);
  }, [phase, load]);

  const close = useCallback(() => {
    latest.current++;
    setPhase({ status: "idle" });
  }, []);

  return { language, phase, tap, retry, close };
}

export function TappableText({
  id,
  text,
  translator,
  className,
}: {
  /** Odróżnia teksty na jednej stronie (artykuł, pytanie 1, pytanie 2…). */
  id: string;
  text: string;
  translator: WordTranslator;
  className?: string;
}) {
  const tokens = useMemo(() => tokenize(text), [text]);
  const selectedKey = translator.phase.status === "idle" ? null : translator.phase.selected.key;

  return (
    <p className={className}>
      {tokens.map((token, index) => {
        if (!token.isWord) return token.text;
        const key = `${id}:${index}`;
        const select = () =>
          translator.tap({ key, word: token.text, sentence: sentenceAround(text, token.start, token.end) });
        return (
          <span
            key={index}
            role="button"
            tabIndex={-1}
            onClick={select}
            onKeyDown={(event: KeyboardEvent) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                select();
              }
            }}
            className={cn(
              "cursor-pointer rounded-[5px] transition-colors duration-200 [-webkit-touch-callout:none] active:bg-primary-soft",
              key === selectedKey && "bg-primary-soft text-primary"
            )}
          >
            {token.text}
          </span>
        );
      })}
    </p>
  );
}

function speak(word: string, language: TargetLanguage) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = SPEECH_LANG[language];
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function TranslationSheet({ translator }: { translator: WordTranslator }) {
  const { phase, close, retry, language } = translator;
  const open = phase.status !== "idle";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (phase.status === "idle") return null;
  const { selected } = phase;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto mx-auto max-w-lg animate-sheet-up rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card-hover)"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-foreground">{selected.word}</p>
            {phase.status === "ready" && phase.data.lemma.toLowerCase() !== selected.word.toLowerCase() && (
              <p className="text-xs text-foreground-muted">
                forma podstawowa: <span className="font-medium text-foreground">{phase.data.lemma}</span>
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => speak(selected.word, language)}
              aria-label="Odtwórz wymowę"
              className="press rounded-full p-2 text-foreground-muted hover:bg-surface-muted"
            >
              <Volume2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Zamknij tłumaczenie"
              className="press rounded-full p-2 text-foreground-muted hover:bg-surface-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* key: przy zmianie słowa zawartość wchodzi od nowa, zamiast skakać. */}
        <div key={`${selected.key}:${phase.status}`} className="mt-2 animate-fade-in">
          {phase.status === "loading" && (
            <div className="flex flex-col gap-2" aria-label="Tłumaczenie się ładuje">
              <div className="skeleton h-6 w-2/3 animate-shimmer rounded-lg" />
              <div className="skeleton h-4 w-1/3 animate-shimmer rounded-lg" />
              <span className="sr-only">
                <Loader2 className="inline h-4 w-4 animate-spin" /> Tłumaczę…
              </span>
            </div>
          )}

          {phase.status === "ready" && (
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-primary">{phase.data.translation}</p>
              {phase.data.partOfSpeech && <p className="text-xs text-foreground-muted">{phase.data.partOfSpeech}</p>}
              {phase.data.note && <p className="mt-1 text-sm text-foreground-muted">{phase.data.note}</p>}
            </div>
          )}

          {phase.status === "error" && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-danger">{phase.message}</p>
              <button
                type="button"
                onClick={retry}
                className="press inline-flex shrink-0 items-center gap-1.5 rounded-(--radius-control) border border-border px-3 py-1.5 text-sm font-medium text-foreground"
              >
                <RotateCcw className="h-4 w-4" /> Ponów
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
