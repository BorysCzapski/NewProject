// ============================================================================
// components/fiszki/mode-list.tsx
// Lista trybów nauki (krok 2 menu "Fiszki"): dwie grupy, każdy tryb jako karta-
// link albo — gdy niedostępny — wygaszona karta z powodem. Bez hooków i bez
// dostępu do danych: stan przychodzi z lib/fiszki/mode-state.ts.
// ============================================================================
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FISZKI_GROUPS, FISZKI_MODES, groupHint, type FiszkiModeId, type MaterialKind } from "@/lib/fiszki/modes";
import type { ModeState } from "@/lib/fiszki/mode-state";
import { stagger } from "@/lib/motion";

export function ModeList({
  material,
  kind,
  states,
}: {
  material: string;
  kind: MaterialKind;
  states: Record<FiszkiModeId, ModeState>;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5 px-5 py-5">
      {FISZKI_GROUPS.map((group, groupIndex) => (
        <section key={group.id} aria-label={group.title}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">{group.title}</h2>
          <p className="mb-2 mt-0.5 text-xs text-foreground-muted">{groupHint(group.id, kind)}</p>
          <div className="flex flex-col gap-3">
            {FISZKI_MODES.filter((mode) => mode.group === group.id).map((mode, index) => {
              const state = states[mode.id];
              const body = (
                <Card
                  className={`flex items-center justify-between gap-3 transition-transform ${
                    state.blocked ? "opacity-60" : "active:scale-[0.99]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <CardTitle>{mode.label}</CardTitle>
                    <CardDescription className="mt-0.5">{mode.description}</CardDescription>
                    {state.blocked ? (
                      <p className="mt-1.5 text-xs text-foreground-muted">{state.blocked}</p>
                    ) : (
                      state.stats && <p className="mt-1.5 text-xs tabular-nums text-foreground-muted">{state.stats}</p>
                    )}
                  </div>
                  {!state.blocked && <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" />}
                </Card>
              );
              return state.blocked ? (
                <div key={mode.id} aria-disabled="true" data-mode={mode.id}>
                  {body}
                </div>
              ) : (
                <Link
                  key={mode.id}
                  href={`/jezyki/fiszki/${material}/${mode.id}`}
                  data-mode={mode.id}
                  className="animate-fade-up motion-stagger"
                  style={stagger(groupIndex * 3 + index)}
                >
                  {body}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
