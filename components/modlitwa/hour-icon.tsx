"use client";

// ============================================================================
// components/modlitwa/hour-icon.tsx
// Mapuje nazwy ikon z lib/modlitwa/hours.ts (zwykłe stringi, żeby kod
// serwerowy mógł ten moduł importować) na komponenty lucide-react.
// Ten sam wzorzec co components/phoenix/app-icon.tsx.
// ============================================================================
import { BookOpen, Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { BookOpen, Moon, Sun, Sunrise, Sunset };

export function HourIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sun;
  return <Icon className={className} />;
}
