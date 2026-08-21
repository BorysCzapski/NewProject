// ============================================================================
// app/(main)/matura/nauka/pisanie/teoria/[lessonSlug]/page.tsx
// One theory lesson for "Wypowiedź pisemna". A separate route from the generic
// [sectionSlug]/teoria one because pisanie's static folder shadows the dynamic
// segment for everything under /matura/nauka/pisanie/*; the body is shared.
// ============================================================================
import { TheoryLessonView } from "@/components/matura/theory-lesson-view";

export default async function PisanieTheoryLessonPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  return <TheoryLessonView sectionSlug="pisanie" lessonSlug={lessonSlug} />;
}
