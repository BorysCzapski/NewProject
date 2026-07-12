// ============================================================================
// app/(main)/admin/prace-domowe/nowa/page.tsx
// Admin homework creator: fetches the small lookup tables the form needs
// (vocabulary categories + grammar topics, per language, so the form can show
// content matching the language the admin picks) plus the student list for the
// "assign to one student" option, then hands off to the client form.
// ============================================================================
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  getVocabularyCategories,
  getGrammarTopics,
  listStudents,
  type VocabularyCategoryOption,
} from "@/lib/homework/admin-queries";
import { LANGUAGES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { HomeworkCreateForm } from "@/components/homework/homework-create-form";
import type { GrammarTopic, TargetLanguage } from "@/lib/types/database";

export default async function NewHomeworkPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Fetch categories + topics for every language so the form can swap them
  // client-side as the admin changes the language select (no refetch needed).
  const [perLanguage, students] = await Promise.all([
    Promise.all(
      LANGUAGES.map(async (lang) => {
        const [categories, topics] = await Promise.all([
          getVocabularyCategories(supabase, lang),
          getGrammarTopics(supabase, lang),
        ]);
        return { lang, categories, topics };
      })
    ),
    listStudents(supabase),
  ]);

  const categoriesByLang = {} as Record<TargetLanguage, VocabularyCategoryOption[]>;
  const topicsByLang = {} as Record<TargetLanguage, GrammarTopic[]>;
  for (const { lang, categories, topics } of perLanguage) {
    categoriesByLang[lang] = categories;
    topicsByLang[lang] = topics;
  }

  return (
    <div>
      <PageHeader title="Nowa praca domowa" subtitle="Ustaw zadanie dla uczniów" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <HomeworkCreateForm
          categoriesByLang={categoriesByLang}
          topicsByLang={topicsByLang}
          students={students}
        />
      </div>
    </div>
  );
}
