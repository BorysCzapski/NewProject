"use client";

// ============================================================================
// components/layout/back-button.tsx
// Round back arrow shown at the top of every screen: goes to the previous
// window (browser history). When there is no history to go back to (the page
// was opened directly or in a fresh tab) it climbs one level up the URL
// instead, so the arrow always does something sensible. Hidden on the Phoenix
// launcher ("/") and on the Schola home, where there is nowhere to go back to.
// ============================================================================
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const ROOTS = new Set(["/", "/schola"]);

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  if (ROOTS.has(pathname)) return null;

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    const parent = pathname.split("/").slice(0, -1).join("/") || "/";
    router.push(parent);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Wróć"
      className={cn(
        "-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors active:bg-surface-muted print:hidden",
        className
      )}
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
