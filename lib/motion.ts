// ============================================================================
// lib/motion.ts
// Pomocnik do kaskadowego pojawiania się elementów listy (system animacji w
// app/globals.css, sekcja "Motion system"). Użycie:
//   <li className="animate-fade-up motion-stagger" style={stagger(index)} />
// Opóźnienie jest ograniczone, żeby dziesiąty element listy nie czekał pół
// sekundy na pojawienie się.
// ============================================================================
import type { CSSProperties } from "react";

const MAX_STEPS = 8;

export function stagger(index: number): CSSProperties {
  return { "--i": Math.max(0, Math.min(index, MAX_STEPS)) } as CSSProperties;
}
