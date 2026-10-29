"use client";

// ============================================================================
// components/biznes/mind-map.tsx
// Mind map as a mobile-friendly tree: a central node, colour-coded branches
// and leaf notes. "Ćwicz z pamięci" hides the leaves so you can recall them
// and tap a branch to reveal; "Zwiń" collapses branches.
// ============================================================================
import { useState } from "react";
import { Brain, ChevronDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MindMap as MindMapData } from "@/lib/biznes/types";

// Distinct, CVD-safe-ish hues from the app's chart tokens.
const BRANCH_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-6)", "var(--chart-7)", "var(--chart-4)", "var(--chart-5)", "var(--chart-8)", "var(--chart-3)"];

export function MindMap({ map }: { map: MindMapData }) {
  const [recall, setRecall] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const toggle = (set: Set<number>, i: number) => {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    return next;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          aria-pressed={recall}
          onClick={() => {
            setRecall((r) => !r);
            setRevealed(new Set());
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            recall ? "border-primary bg-primary-soft text-primary" : "border-border text-foreground-muted"
          )}
        >
          <Brain className="h-4 w-4" /> Ćwicz z pamięci
        </button>
        {recall && (
          <button type="button" onClick={() => setRevealed(new Set(map.branches.map((_, i) => i)))} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-foreground-muted">
            <Eye className="h-4 w-4" /> Pokaż wszystko
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="max-w-full rounded-2xl bg-primary px-5 py-3 text-center text-lg font-bold text-primary-foreground shadow-(--shadow-primary)">{map.center}</div>
        <div aria-hidden className="h-4 w-0.5 bg-border" />
      </div>

      <ul className="flex flex-col gap-3 border-l-2 border-border pl-3 sm:pl-5">
        {map.branches.map((branch, i) => {
          const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
          const hidden = recall && !revealed.has(i);
          const isCollapsed = collapsed.has(i);
          return (
            <li key={branch.label} className="relative">
              <span aria-hidden className="absolute -left-3 top-5 h-0.5 w-3 sm:-left-5 sm:w-5" style={{ background: color }} />
              <div className="overflow-hidden rounded-(--radius-control) border bg-surface" style={{ borderColor: color }}>
                <button
                  type="button"
                  onClick={() => (recall ? setRevealed((s) => toggle(s, i)) : setCollapsed((s) => toggle(s, i)))}
                  aria-expanded={recall ? !hidden : !isCollapsed}
                  className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm font-semibold text-white"
                  style={{ background: color }}
                >
                  <span>{branch.label}</span>
                  {recall ? <Eye className="h-4 w-4 opacity-80" /> : <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsed && "-rotate-90")} />}
                </button>
                {!hidden && !isCollapsed && (
                  <ul className="flex flex-col gap-1.5 p-3.5">
                    {branch.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-foreground-muted">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {hidden && <p className="px-3.5 py-3 text-xs text-foreground-muted">Przypomnij sobie {branch.items.length} {branch.items.length === 1 ? "punkt" : "punkty/ów"}, potem dotknij nagłówka.</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
