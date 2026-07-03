"use client";

// ============================================================================
// components/listening/gap-transcript.tsx
// Renders the transcript as flowing, wrapped text where gap words are
// replaced with small inline inputs. Answers are controlled by the parent
// (keyed by a stable "segmentIndex-wordIndex" gap id) so the parent can grade
// the attempt and, after submitting, pass back per-gap correctness to
// highlight each input green/red.
// ============================================================================
import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import type { ListeningGap, TranscriptSegment } from "@/lib/types/database";
import type { YoutubePlayerHandle } from "@/components/listening/youtube-player";

export function gapId(gap: ListeningGap): string {
  return `${gap.segmentIndex}-${gap.wordIndex}`;
}

interface GapTranscriptProps {
  transcript: TranscriptSegment[];
  gaps: ListeningGap[];
  playerRef: RefObject<YoutubePlayerHandle | null>;
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
  results?: Record<string, boolean> | null;
  disabled?: boolean;
}

export function GapTranscript({
  transcript,
  gaps,
  playerRef,
  answers,
  onAnswerChange,
  results,
  disabled,
}: GapTranscriptProps) {
  const gapsByKey = new Map(gaps.map((gap) => [gapId(gap), gap]));

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 text-base leading-loose text-foreground">
      {transcript.map((segment, segmentIndex) => {
        const words = segment.text.split(/\s+/).filter(Boolean);
        return words.map((word, wordIndex) => {
          const id = `${segmentIndex}-${wordIndex}`;
          const gap = gapsByKey.get(id);

          if (!gap) {
            return <span key={id}>{word}</span>;
          }

          const isCorrect = results ? results[id] : undefined;

          return (
            <span key={id} className="inline-flex items-center gap-1">
              <input
                value={answers[id] ?? ""}
                onChange={(e) => onAnswerChange(id, e.target.value)}
                onFocus={() => playerRef.current?.seekTo(gap.timestamp)}
                disabled={disabled}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                style={{ width: `${Math.max(6, Math.min(12, gap.answer.length + 2))}ch` }}
                className={cn(
                  "h-10 min-w-11 rounded-(--radius-control) border px-1.5 text-center text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                  isCorrect === undefined && "border-border bg-surface text-foreground",
                  isCorrect === true && "border-primary bg-primary-soft text-primary",
                  isCorrect === false && "border-danger bg-danger-soft text-danger"
                )}
              />
              {isCorrect === false && (
                <span className="text-xs font-medium text-danger">({gap.answer})</span>
              )}
            </span>
          );
        });
      })}
    </div>
  );
}
