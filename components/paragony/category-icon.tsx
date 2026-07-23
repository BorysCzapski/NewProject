"use client";

// ============================================================================
// components/paragony/category-icon.tsx
// Maps budget_categories.icon (a plain string, same free-form convention as
// lib/phoenix/apps.ts's icon field / components/phoenix/app-icon.tsx) onto
// lucide-react components. Covers the seeded default categories (see
// lib/paragony/categories.ts CATEGORY_ICONS) plus a safe fallback for any
// user-picked icon name that isn't in the map.
// ============================================================================
import {
  Banknote,
  Car,
  FileText,
  HeartPulse,
  Home,
  MoreHorizontal,
  PlusCircle,
  Popcorn,
  Shirt,
  ShoppingCart,
  Tag,
  Undo2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  ShoppingCart,
  Car,
  Popcorn,
  FileText,
  HeartPulse,
  Home,
  Shirt,
  MoreHorizontal,
  Banknote,
  Undo2,
  PlusCircle,
};

export function CategoryIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = (name && ICONS[name]) || Tag;
  return <Icon className={className} />;
}
