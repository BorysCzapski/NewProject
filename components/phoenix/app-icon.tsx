"use client";

// ============================================================================
// components/phoenix/app-icon.tsx
// Maps registry icon names (plain strings, safe to keep in lib/phoenix/apps.ts
// which server code also imports) onto lucide-react components.
// ============================================================================
import {
  Calculator,
  Church,
  Compass,
  GraduationCap,
  Hammer,
  Languages,
  LayoutGrid,
  Music4,
  ReceiptText,
  Recycle,
  ScrollText,
  Sparkles,
  Timer,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Calculator,
  Church,
  Compass,
  GraduationCap,
  Hammer,
  Languages,
  Music4,
  ReceiptText,
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
