// ============================================================================
// app/(main)/matura/nauka/[sectionSlug]/teoria/[lessonSlug]/page.tsx
// One theory lesson for any exact-match-graded section. The body is shared
// with pisanie's own teoria route — see components/matura/theory-lesson-view.tsx
// for why that route has to exist separately.
// ============================================================================
import { TheoryLessonView } from "@/components/matura/theory-lesson-view";

export default async function MaturaTheoryLessonPage({
  params,
}: {
  params: Promise<{ sectionSlug: string; lessonSlug: string }>;
}) {
  const { sectionSlug, lessonSlug } = await params;
  return <TheoryLessonView sectionSlug={sectionSlug} lessonSlug={lessonSlug} />;
}
