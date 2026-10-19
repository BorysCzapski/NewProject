// ============================================================================
// components/gitara/tab-viewer.tsx
// Renders a parsed tab (GtrTabBar[]) as a classic 6-line tab: bars side by
// side, each event a column, strings top (high e) to bottom (low E). Artificial
// harmonics are coloured, muted notes show "x", tied notes sit in brackets,
// hammer-on / pull-off / AH labels appear above the staff like in the PDF.
// Server-renderable (no state) — the play-along mode wraps this later.
// ============================================================================
import type { GtrTabBar } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const LINE_BG = {
  backgroundImage: "linear-gradient(var(--foreground-muted), var(--foreground-muted))",
  backgroundSize: "100% 1px",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
} as const;

function BarView({ bar }: { bar: GtrTabBar }) {
  const events = bar.events;
  const weights = events.map((e, i) => Math.max(0.5, (events[i + 1]?.beat ?? 4) - e.beat));
  return (
    <div className="relative min-w-0 border-r border-foreground-muted/70 first:border-l">
      <span className="absolute -top-3.5 left-0.5 text-[9px] leading-none text-foreground-muted">{bar.n}</span>
      <div className="flex min-h-[7.5rem]">
        {events.length === 0 && <div className="flex-1" style={{ ...LINE_BG, backgroundSize: "100% 100%" }} />}
        {events.map((ev, i) => {
          const hasAh = ev.notes.some((n) => n.ah !== undefined);
          return (
            <div key={i} className="flex min-w-[0.9rem] flex-col" style={{ flexGrow: weights[i], flexBasis: 0 }}>
              <span className="h-3 text-center text-[8px] leading-3 text-foreground-muted">{ev.tech ?? (hasAh ? "AH" : "")}</span>
              {[1, 2, 3, 4, 5, 6].map((string) => {
                const note = ev.notes.find((n) => n.s === string);
                return (
                  <div key={string} className="flex h-[1.1rem] items-center justify-center" style={LINE_BG}>
                    {note && (
                      <span
                        className={cn(
                          "bg-background px-px text-[11px] font-semibold leading-none tabular-nums",
                          note.ah !== undefined ? "text-primary" : "text-foreground"
                        )}
                        title={note.ah !== undefined ? "flażolet sztuczny" : undefined}
                      >
                        {note.mute ? "x" : note.tie ? `(${note.f})` : note.f}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TabViewer({ bars }: { bars: GtrTabBar[] }) {
  // Bars flow in rows of 2 (phone) / 4 (wide); a section label starts a new row.
  const blocks: { section?: string; bars: GtrTabBar[] }[] = [];
  for (const bar of bars) {
    if (bar.section || blocks.length === 0) blocks.push({ section: bar.section, bars: [bar] });
    else blocks[blocks.length - 1].bars.push(bar);
  }
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, i) => (
        <section key={i} className="flex flex-col gap-1.5">
          {block.section && (
            <h3 className="w-fit rounded border border-foreground-muted/60 px-1.5 text-xs font-bold text-foreground">{block.section}</h3>
          )}
          <div className="grid grid-cols-2 gap-y-6 pt-3 sm:grid-cols-4">
            {block.bars.map((bar) => (
              <BarView key={bar.n} bar={bar} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
