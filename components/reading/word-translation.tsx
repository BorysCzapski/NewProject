"use client";

// ============================================================================
// components/reading/word-translation.tsx
// "Dotknij słowa, zobacz polskie tłumaczenie i przykładowe zdania" w czytankach.
//
//  - useWordTranslation: JEDEN stan na całą czytankę (zaznaczone słowo, tłumaczenie,
//    przykłady), współdzielony przez artykuł i pytania — dzięki temu nie da się
//    otworzyć dwóch arkuszy naraz, a zaznaczenie przeskakuje między tekstami.
//  - TappableText: tekst pocięty na słowa; dotknięcie słowa woła tłumaczenie.
//  - TranslationSheet: arkusz u dołu ekranu (nie blokuje tekstu — można od razu
//    dotknąć kolejnego słowa).
//
// Tłumaczenie i przykłady to DWA równoległe żądania z własnym stanem. Tłumaczenie
// jest małe i pojawia się szybko, przykłady dochodzą chwilę później; awaria
// przykładów nie ukrywa tłumaczenia, a "Ponów" ponawia tylko tę część, która zawiodła.
//
// Nowe dotknięcie PRZERYWA poprzednie żądania (AbortController), więc nic nie czeka
// w kolejce za słowem, które użytkownik już porzucił. (Akcje serwerowe tak nie
// potrafią — klient wysyła je po jednej, więc tu jest trasa API: lib/reading/translate-client.ts.)
//
// Wyniki zostają w pamięci strony: to samo słowo w tym samym zdaniu nie woła AI
// drugi raz. Słowa to <span role="button" tabIndex={-1}>, nie <button> i nie ogniska
// klawiatury: czytanka ma kilkaset słów, a kilkaset przystanków Tab zrobiłoby z
// formularza pod nią męczarnię. Dla czytników ekranu pozostają rolą przycisku.
// ============================================================================
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { RotateCcw, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultWordApi } from "@/lib/reading/translate-client";
import { splitForHighlight } from "@/lib/reading/translate-core";
import type { WordApi, WordExample, WordTranslation } from "@/lib/reading/translate-types";
import { sentenceAround, tokenize, translationCacheKey } from "@/lib/reading/words";
import type { TargetLanguage } from "@/lib/types/database";

const SPEECH_LANG: Record<TargetLanguage, string> = { en: "en-GB", es: "es-ES", ru: "ru-RU" };

/** Wyniki przeżywają przejścia między czytankami w tej samej sesji przeglądarki. */
const TRANSLATIONS = new Map<string, WordTranslation>();
const EXAMPLES = new Map<string, WordExample[]>();

interface Selected {
  /** Identyfikuje konkretne wystąpienie słowa w konkretnym tekście. */
  key: string;
  word: string;
  sentence: string;
}

type Part<T> = { status: "loading" } | { status: "ready"; data: T } | { status: "error"; message: string };

type Phase =
  | { status: "idle" }
  | { status: "open"; selected: Selected; translation: Part<WordTranslation>; examples: Part<WordExample[]> };

export interface WordTranslator {
  language: TargetLanguage;
  phase: Phase;
  tap: (selected: Selected) => void;
  retry: (part: "translation" | "examples") => void;
  close: () => void;
}

const isAbort = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

export function useWordTranslation(language: TargetLanguage, api: WordApi = defaultWordApi): WordTranslator {
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  /** Kontroler bieżącego zaznaczenia: abort = użytkownik poszedł dalej, wyniki do kosza. */
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const patch = useCallback((selected: Selected, signal: AbortSignal, update: Partial<Phase & { status: "open" }>) => {
    if (signal.aborted) return;
    setPhase((prev) => (prev.status === "open" && prev.selected.key === selected.key ? { ...prev, ...update } : prev));
  }, []);

  const loadTranslation = useCallback(
    async (selected: Selected, signal: AbortSignal) => {
      try {
        const result = await api.translate({ word: selected.word, sentence: selected.sentence, language }, signal);
        if (result.ok) {
          TRANSLATIONS.set(translationCacheKey(language, selected.word, selected.sentence), result.data);
          patch(selected, signal, { translation: { status: "ready", data: result.data } });
        } else {
          patch(selected, signal, { translation: { status: "error", message: result.error } });
        }
      } catch (error) {
        if (isAbort(error)) return;
        patch(selected, signal, {
          translation: { status: "error", message: "Nie udało się pobrać tłumaczenia. Spróbuj ponownie." },
        });
      }
    },
    [api, language, patch]
  );

  const loadExamples = useCallback(
    async (selected: Selected, signal: AbortSignal) => {
      try {
        const result = await api.examples({ word: selected.word, sentence: selected.sentence, language }, signal);
        if (result.ok) {
          EXAMPLES.set(translationCacheKey(language, selected.word, selected.sentence), result.data);
          patch(selected, signal, { examples: { status: "ready", data: result.data } });
        } else {
          patch(selected, signal, { examples: { status: "error", message: result.error } });
        }
      } catch (error) {
        if (isAbort(error)) return;
        patch(selected, signal, {
          examples: { status: "error", message: "Nie udało się pobrać przykładów. Spróbuj ponownie." },
        });
      }
    },
    [api, language, patch]
  );

  const tap = useCallback(
    (selected: Selected) => {
      // Ponowne dotknięcie zaznaczonego słowa zamyka arkusz.
      if (phase.status === "open" && phase.selected.key === selected.key) {
        controllerRef.current?.abort();
        setPhase({ status: "idle" });
        return;
      }

      // Poprzednie żądania nie są już potrzebne — przerywamy je, zamiast czekać.
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const cacheKey = translationCacheKey(language, selected.word, selected.sentence);
      const cachedTranslation = TRANSLATIONS.get(cacheKey);
      const cachedExamples = EXAMPLES.get(cacheKey);
      setPhase({
        status: "open",
        selected,
        translation: cachedTranslation ? { status: "ready", data: cachedTranslation } : { status: "loading" },
        examples: cachedExamples ? { status: "ready", data: cachedExamples } : { status: "loading" },
      });

      // Dwa równoległe żądania: tłumaczenie nie czeka na (dłuższe) przykłady.
      if (!cachedTranslation) void loadTranslation(selected, controller.signal);
      if (!cachedExamples) void loadExamples(selected, controller.signal);
    },
    [phase, language, loadTranslation, loadExamples]
  );

  const retry = useCallback(
    (part: "translation" | "examples") => {
      if (phase.status !== "open") return;
      const controller = controllerRef.current;
      if (!controller || controller.signal.aborted) return;
      const { selected } = phase;
      if (part === "translation") {
        patch(selected, controller.signal, { translation: { status: "loading" } });
        void loadTranslation(selected, controller.signal);
      } else {
        patch(selected, controller.signal, { examples: { status: "loading" } });
        void loadExamples(selected, controller.signal);
      }
    },
    [phase, patch, loadTranslation, loadExamples]
  );

  const close = useCallback(() => {
    controllerRef.current?.abort();
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

function Skeleton({ lines }: { lines: string[] }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {lines.map((width, index) => (
        <div key={index} className={cn("skeleton h-4 animate-shimmer rounded-lg", width)} />
      ))}
    </div>
  );
}

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press inline-flex shrink-0 items-center gap-1.5 rounded-(--radius-control) border border-border px-3 py-1.5 text-sm font-medium text-foreground"
    >
      <RotateCcw className="h-4 w-4" /> Ponów
    </button>
  );
}

export function TranslationSheet({ translator }: { translator: WordTranslator }) {
  const { phase, close, retry, language } = translator;
  const open = phase.status === "open";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (phase.status !== "open") return null;
  const { selected, translation, examples } = phase;
  const lemma = translation.status === "ready" ? translation.data.lemma : "";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto mx-auto max-h-[min(70vh,30rem)] max-w-lg animate-sheet-up overflow-y-auto rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card-hover)"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-foreground">{selected.word}</p>
            {lemma && lemma.toLowerCase() !== selected.word.toLowerCase() && (
              <p className="text-xs text-foreground-muted">
                forma podstawowa: <span className="font-medium text-foreground">{lemma}</span>
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

        {/* key: przy zmianie słowa lub stanu część wchodzi od nowa, zamiast skakać. */}
        <div key={`${selected.key}:t:${translation.status}`} className="mt-2 animate-fade-in">
          {translation.status === "loading" && <Skeleton lines={["w-2/3", "w-1/3"]} />}

          {translation.status === "ready" && (
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-primary">{translation.data.translation}</p>
              {translation.data.partOfSpeech && (
                <p className="text-xs text-foreground-muted">{translation.data.partOfSpeech}</p>
              )}
              {translation.data.note && <p className="mt-1 text-sm text-foreground-muted">{translation.data.note}</p>}
            </div>
          )}

          {translation.status === "error" && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-danger">{translation.message}</p>
              <RetryButton onClick={() => retry("translation")} />
            </div>
          )}
        </div>

        {/* Przykłady są niezależne od tłumaczenia: ich awaria go nie ukrywa. */}
        <div key={`${selected.key}:e:${examples.status}`} className="mt-4 animate-fade-in border-t border-border/70 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Przykłady</p>

          {examples.status === "loading" && <Skeleton lines={["w-full", "w-4/5", "w-full", "w-2/3"]} />}

          {examples.status === "ready" && (
            <ul className="flex flex-col gap-3">
              {examples.data.map((example) => (
                <li key={example.sentence}>
                  <p className="text-sm leading-snug text-foreground">
                    {splitForHighlight(example.sentence, [selected.word, lemma]).map((part, index) =>
                      part.match ? (
                        <strong key={index} className="font-semibold text-primary">
                          {part.text}
                        </strong>
                      ) : (
                        part.text
                      )
                    )}
                  </p>
                  <p className="text-xs leading-snug text-foreground-muted">{example.translation}</p>
                </li>
              ))}
            </ul>
          )}

          {examples.status === "error" && (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-foreground-muted">{examples.message}</p>
              <RetryButton onClick={() => retry("examples")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
