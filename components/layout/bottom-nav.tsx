"use client";

// ============================================================================
// components/layout/bottom-nav.tsx
// Fixed bottom tab bar — the app's primary navigation on mobile. Phoenix is
// a shell hosting mini-apps, so the tab set depends on where you are: inside
// /jezyki you get Linguo's tabs (first tab = back to the Phoenix launcher),
// elsewhere the platform tabs. Respects the safe-area inset so it doesn't
// collide with the home indicator on iOS.
// ============================================================================
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Binary,
  BookOpen,
  ClipboardList,
  Calendar,
  User,
  LayoutGrid,
  Sun,
  Hammer,
  Calculator,
  TrendingUp,
  GraduationCap,
  Compass,
  Upload,
  Sparkles,
  Church,
  HeartHandshake,
  Timer,
  ListChecks,
  Dumbbell,
  Droplet,
  UtensilsCrossed,
  Pill,
  LineChart,
  Lightbulb,
} from "lucide-react";
import { NAV_BY_PREFIX } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS = {
  Home,
  Binary,
  BookOpen,
  ClipboardList,
  Calendar,
  User,
  LayoutGrid,
  Sun,
  Hammer,
  Calculator,
  TrendingUp,
  GraduationCap,
  Compass,
  Upload,
  Sparkles,
  Church,
  HeartHandshake,
  Timer,
  ListChecks,
  Dumbbell,
  Droplet,
  UtensilsCrossed,
  Pill,
  LineChart,
  Lightbulb,
};

export function BottomNav() {
  const pathname = usePathname();
  // Longest matching prefix wins; the "" entry is the platform fallback.
  const items = NAV_BY_PREFIX.find(
    (set) => set.prefix === "" || pathname === set.prefix || pathname.startsWith(`${set.prefix}/`)
  )!.items;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 bg-surface/80 shadow-[0_-1px_0_var(--border),0_-8px_24px_-16px_rgb(0_0_0/0.3)] backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-foreground-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
                    isActive && "bg-primary-soft"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
