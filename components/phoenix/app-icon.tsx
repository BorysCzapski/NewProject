"use client";

// ============================================================================
// components/phoenix/app-icon.tsx
// Maps registry icon names (plain strings, safe to keep in lib/phoenix/apps.ts
// which server code also imports) onto lucide-react components.
// ============================================================================
import {
  Binary,
  Briefcase,
  Church,
  Compass,
  Dumbbell,
  GraduationCap,
  Guitar,
  Hammer,
  Landmark,
  Languages,
  LayoutGrid,
  LineChart,
  Music4,
  NotebookPen,
  Recycle,
  ScrollText,
  Sparkles,
  Terminal,
  Timer,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Binary,
  Briefcase,
  Church,
  Compass,
  Dumbbell,
  GraduationCap,
  Guitar,
  Hammer,
  Landmark,
  Languages,
  LineChart,
  Music4,
  NotebookPen,
  Recycle,
  ScrollText,
  Sparkles,
  Terminal,
  Timer,
  Wrench,
};

export function AppIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutGrid;
  return <Icon className={className} />;
}
