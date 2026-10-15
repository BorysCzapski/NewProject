"use client";

// ============================================================================
// components/phoenix/app-icon.tsx
// Maps registry icon names (plain strings, safe to keep in lib/phoenix/apps.ts
// which server code also imports) onto lucide-react components.
// ============================================================================
import {
  Binary,
  Calculator,
  Church,
  Compass,
  Dumbbell,
  GraduationCap,
  Guitar,
  Hammer,
  Languages,
  LayoutGrid,
  Music4,
  NotebookPen,
  Recycle,
  ScrollText,
  Sparkles,
  Timer,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Binary,
  Calculator,
  Church,
  Compass,
  Dumbbell,
  GraduationCap,
  Guitar,
  Hammer,
  Languages,
  Music4,
  NotebookPen,
  Recycle,
  ScrollText,
  Sparkles,
  Timer,
  Wrench,
};

export function AppIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutGrid;
  return <Icon className={className} />;
}
