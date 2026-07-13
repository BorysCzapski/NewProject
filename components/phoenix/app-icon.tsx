"use client";

// ============================================================================
// components/phoenix/app-icon.tsx
// Maps registry icon names (plain strings, safe to keep in lib/phoenix/apps.ts
// which server code also imports) onto lucide-react components.
// ============================================================================
import {
  Calculator,
  Church,
  GraduationCap,
  Languages,
  LayoutGrid,
  Music4,
  ReceiptText,
  Recycle,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Calculator,
  Church,
  GraduationCap,
  Languages,
  Music4,
  ReceiptText,
  Recycle,
  Sparkles,
  Wrench,
};

export function AppIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutGrid;
  return <Icon className={className} />;
}
