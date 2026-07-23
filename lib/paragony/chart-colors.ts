// ============================================================================
// lib/paragony/chart-colors.ts
// Categorical series colors for Recharts (Paragony budget/ETF charts). Backed
// by the --chart-1..8 CSS custom properties in app/globals.css — a validated
// CVD-safe 8-hue order (see the dataviz skill's palette.md), already stepped
// for both the light and dark surface via the existing ".dark" class toggle,
// so passing these var() strings straight into Recharts fill/stroke props
// gets automatic theme-awareness for free.
// ============================================================================

export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-6)",
  "var(--color-chart-7)",
  "var(--color-chart-8)",
] as const;

export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export interface LabeledValue {
  label: string;
  value: number;
}

/**
 * For "all-pairs" contexts (pie/donut, scatter) only the first 4 palette
 * slots validate CVD-safety across EVERY pairing, not just neighbors — see
 * the dataviz skill's palette.md. Bar/line charts (adjacent-only contexts)
 * can use all 8 slots directly; pie/donut charts should run their series
 * through this first and cap at 4, folding the rest into "Inne".
 */
export function foldToOther(items: LabeledValue[], maxSlots = 4): LabeledValue[] {
  if (items.length <= maxSlots) return items;
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, maxSlots - 1);
  const restValue = sorted.slice(maxSlots - 1).reduce((sum, i) => sum + i.value, 0);
  return [...head, { label: "Inne", value: restValue }];
}
