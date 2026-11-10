// ============================================================================
// app/(main)/jezyki/layout.tsx
// Linguo: płynne wejście każdej strony (components/layout/page-transition.tsx).
// ============================================================================
import { PageTransition } from "@/components/layout/page-transition";

export default function LinguoLayout({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
