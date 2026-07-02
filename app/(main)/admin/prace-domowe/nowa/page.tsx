// ============================================================================
// app/(main)/admin/prace-domowe/nowa/page.tsx
// Admin homework creator: fetches the small lookup tables the form needs
// (vocabulary categories, grammar topics) then hands off to the client form.
// ============================================================================
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getVocabularyCategories, getGrammarTopics } from "@/lib/homework/admin-queries";
import { PageHeader } from "@/components/layout/page-header";
import { HomeworkCreateForm } from "@/components/homework/homework-create-form";

export default async function NewHomeworkPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [categories, topics] = await Promise.all([
    getVocabularyCategories(supabase),
    getGrammarTopics(supabase),
  ]);

  return (
    <div>
      <PageHeader title="Nowa praca domowa" subtitle="Ustaw zadanie dla uczniów" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <HomeworkCreateForm categories={categories} topics={topics} />
      </div>
    </div>
  );
}
