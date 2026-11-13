// ============================================================================
// app/(main)/trading/quiz/page.tsx
// Quiz z całego materiału (losowe 10 pytań na rundę).
// ============================================================================
import { requireProfile } from "@/lib/auth/get-profile";
import { PageHeader } from "@/components/layout/page-header";
import { Quiz } from "@/components/trading/quiz";
import { QUIZ } from "@/lib/trading/content";

export default async function QuizPage() {
  await requireProfile();
  return (
    <div>
      <PageHeader title="Quiz" subtitle="Sprawdź, co zostało w głowie" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <Quiz questions={QUIZ} />
      </div>
    </div>
  );
}
