// ============================================================================
// app/(main)/layout.tsx
// Shell for every authenticated screen: scrollable content area + fixed
// bottom tab bar. Route group "(main)" keeps this out of the URL.
// ============================================================================
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
