// ============================================================================
// database.ts
// Hand-written TypeScript mirror of supabase/migrations/0001_init.sql.
// Kept in sync manually — if the schema changes, update this file too.
// ============================================================================

export type UserLevel = "A1" | "A2" | "B1" | "B2";
export type UserRole = "user" | "admin";
/** Which foreign language the user is learning (always taught to a Polish speaker). */
export type TargetLanguage = "en" | "es" | "ru";
export type MasteryStatus = "new" | "learning" | "mastered";
export type HomeworkType =
  | "song_translation"
  | "vocabulary_mastery"
  | "training_count"
  | "reading_count"
  | "flashcards_count"
  | "grammar_topic"
  | "writing_task"
  | "listening_task"
  | "matching_game";
export type HomeworkStatus = "todo" | "in_progress" | "completed" | "overdue";
export type TrainingModule = "vocabulary" | "grammar" | "writing";
export type GrammarExerciseType = "gap_fill" | "multiple_choice" | "transformation";
export type WritingTaskType =
  | "comment_reply"
  | "message_friend"
  | "formal_email"
  | "question_answer";

export interface Profile {
  id: string;
  username: string;
  email: string;
  level: UserLevel;
  target_language: TargetLanguage;
  role: UserRole;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  /** Phoenix: mini-app ids shown on the user's launcher (lib/phoenix/apps.ts). */
  installed_apps: string[];
  created_at: string;
  updated_at: string;
}

export interface VocabularyWord {
  id: string;
  language: TargetLanguage;
  level: UserLevel;
  category: string;
  // NOTE: column is historically named `word_en`, but holds the foreign word
  // in whatever `language` the row belongs to (Spanish/Russian too). Kept the
  // name to avoid a disruptive rename; treat it as "the target-language word".
  word_en: string;
  translation_pl: string;
  example_sentence: string | null;
  created_at: string;
}

export interface VocabularyProgress {
  id: string;
  user_id: string;
  word_id: string;
  correct_count: number;
  incorrect_count: number;
  status: MasteryStatus;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  updated_at: string;
}

export interface GrammarTopic {
  id: string;
  language: TargetLanguage;
  level: UserLevel;
  slug: string;
  title: string;
  explanation: string;
  order_index: number;
  created_at: string;
}

export interface LearningPathStage {
  id: string;
  language: TargetLanguage;
  level: UserLevel;
  order_index: number;
  category: string;
  title: string;
  grammar_topic_id: string | null;
  created_at: string;
}

export interface GrammarExercise {
  id: string;
  topic_id: string;
  type: GrammarExerciseType;
  prompt: string;
  options: string[] | null;
  correct_answer: string;
  order_index: number;
}

export interface GrammarProgress {
  id: string;
  user_id: string;
  topic_id: string;
  exercise_id: string | null;
  is_correct: boolean;
  attempted_at: string;
}

export interface ReadingText {
  id: string;
  user_id: string | null;
  language: TargetLanguage;
  level: UserLevel;
  topic: string;
  title: string;
  content: string;
  created_at: string;
}

export interface ReadingQuestion {
  id: string;
  text_id: string;
  type: "multiple_choice" | "open";
  question: string;
  options: string[] | null;
  correct_answer: string | null;
  order_index: number;
}

export interface ReadingAttempt {
  id: string;
  user_id: string;
  text_id: string;
  answers: Record<string, string>;
  score: number | null;
  feedback: string | null;
  completed_at: string;
}

export interface WritingTask {
  id: string;
  language: TargetLanguage;
  level: UserLevel;
  task_type: WritingTaskType;
  scenario: string;
  min_words: number;
  max_words: number;
  created_by: string | null;
  created_at: string;
}

export interface WritingSubmission {
  id: string;
  user_id: string;
  task_id: string;
  content: string;
  ai_feedback: string | null;
  ai_corrected_version: string | null;
  ai_followup_question: string | null;
  score: number | null;
  created_at: string;
}

export interface Song {
  id: string;
  language: TargetLanguage;
  title: string;
  artist: string | null;
  lyrics: string;
  created_by: string | null;
  created_at: string;
}

export interface SongTranslationAttempt {
  id: string;
  user_id: string;
  song_id: string;
  line_index: number;
  user_translation: string;
  is_correct: boolean;
  ai_feedback: string | null;
  created_at: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface ListeningGap {
  segmentIndex: number;
  wordIndex: number;
  answer: string;
  timestamp: number;
}

export interface ListeningExercise {
  id: string;
  language: TargetLanguage;
  youtube_url: string;
  video_id: string;
  title: string;
  level: UserLevel;
  transcript: TranscriptSegment[];
  gaps: ListeningGap[];
  created_by: string | null;
  created_at: string;
}

export interface ListeningAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  answers: Record<number, string>;
  score: number;
  completed_at: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string | null;
  type: HomeworkType;
  config: Record<string, unknown>;
  levels: UserLevel[];
  language: TargetLanguage;
  /** null = whole level(s); set = a single student this homework was assigned to. */
  target_user_id: string | null;
  deadline: string | null;
  created_by: string | null;
  created_at: string;
}

export interface MatchingAttempt {
  id: string;
  user_id: string;
  language: TargetLanguage;
  level: UserLevel;
  category: string | null;
  score: number;
  total: number;
  completed_at: string;
}

export interface HomeworkProgress {
  id: string;
  homework_id: string;
  user_id: string;
  status: HomeworkStatus;
  progress_current: number;
  progress_target: number;
  completed_at: string | null;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_date: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface PromptForgeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PromptForgeConflict {
  issue: string;
  fix: string;
}

export interface PromptSession {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  draft: string;
  messages: PromptForgeMessage[];
  conflicts: PromptForgeConflict[];
  suggestions: string[];
  ready_to_copy: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Schola: a fully separate realm (own membership, own auth pages, no
// Phoenix shell) — see app/schola/* and lib/schola/*. Mirrors
// supabase/migrations/0009_schola.sql.
// ============================================================================

export interface ScholaMember {
  id: string;
  display_name: string;
  created_at: string;
}

export interface ScholaSong {
  id: string;
  title: string;
  /** Lyrics with inline ChordPro-style chord tags, e.g. "[C]tekst linijki". */
  lyrics_chordpro: string;
  tags: string[];
  youtube_url: string | null;
  sheet_music_url: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholaMassPlan {
  id: string;
  title: string;
  mass_date: string;
  notes: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholaMassPlanItem {
  id: string;
  plan_id: string;
  song_id: string;
  order_index: number;
  note: string;
  created_at: string;
}

// ============================================================================
// Podręcznik: a student's own uploaded English-textbook PDF, split by AI into
// units/vocabulary/grammar. Mirrors supabase/migrations/0010_textbooks.sql.
// ============================================================================

export interface Textbook {
  id: string;
  user_id: string;
  title: string;
  language: TargetLanguage;
  created_at: string;
}

export interface TextbookUnit {
  id: string;
  textbook_id: string;
  user_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface TextbookWord {
  id: string;
  unit_id: string;
  textbook_id: string;
  user_id: string;
  language: TargetLanguage;
  level: UserLevel;
  category: string;
  word_en: string;
  translation_pl: string;
  example_sentence: string | null;
  order_index: number;
  created_at: string;
}

/** Per-student progress on a (possibly shared) textbook word — mirrors
 * VocabularyProgress. Split out from TextbookWord because a textbook can be
 * studied by many students, each with their own mastery of the same word. */
export interface TextbookWordProgress {
  id: string;
  user_id: string;
  word_id: string;
  correct_count: number;
  incorrect_count: number;
  mastery_status: MasteryStatus;
  updated_at: string;
  created_at: string;
}

export interface TextbookGrammarTopic {
  id: string;
  textbook_id: string;
  unit_id: string | null;
  user_id: string;
  language: TargetLanguage;
  title: string;
  // GrammarBlock[] from lib/grammar/lesson-blocks.ts — kept as unknown[] here
  // to avoid a client-type <-> db-type import cycle; cast at the call site.
  blocks: unknown[];
  order_index: number;
  created_at: string;
}

export interface TextbookGrammarExercise {
  id: string;
  topic_id: string;
  user_id: string;
  type: Extract<GrammarExerciseType, "gap_fill" | "multiple_choice">;
  prompt: string;
  options: string[] | null;
  correct_answer: string;
  order_index: number;
}

// ============================================================================
// Matura — CKE foreign-language matura exam prep (poziom podstawowy /
// rozszerzony), for English and Spanish. Mirrors supabase/migrations/
// 0013_matura.sql + 0020_matura_language.sql: shared content (sections/
// lessons/task bank) + per-user attempts, mastery-per-section, mock exams,
// study plan.
// ============================================================================

export type MaturaLevel = "podstawowa" | "rozszerzona";

/** Languages the matura module actually has content for. Deliberately NOT
 * TargetLanguage from lib/languages.ts — that one includes 'ru', for which
 * there is no matura content and none planned. See 0020_matura_language.sql. */
export type MaturaLanguage = "en" | "es";
export type MaturaTaskSource = "topic" | "past_exam" | "curated" | "ai_generated";
export type MaturaMockExamStatus = "in_progress" | "completed" | "abandoned";
export type MaturaStudyPlanWeekStatus =
  | "upcoming"
  | "in_progress"
  | "completed"
  | "partially_completed"
  | "skipped";

/** The 4 CKE exam parts — see lib/matura/sections.ts MATURA_SECTION_SLUGS. */
export type MaturaSectionSlug = "sluchanie" | "czytanie" | "srodki-jezykowe" | "pisanie";

export interface MaturaSection {
  id: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  slug: MaturaSectionSlug;
  title: string;
  description: string;
  order_index: number;
  exam_weight: number;
  created_at: string;
  updated_at: string;
}

/** How a theory lesson is filed within its exam part — drives grouping on the
 * section page. "strategia" is technique rather than language knowledge (how
 * to skim a text, what to listen for on the second play). */
export type MaturaLessonKind = "gramatyka" | "slownictwo" | "strategia";

export interface MaturaLesson {
  id: string;
  section_id: string;
  /** Unique within a section — the lesson's own URL segment. */
  slug: string;
  title: string;
  /** One-line description for the lesson index, so listing lessons never has
   * to parse `content`. */
  summary: string;
  kind: MaturaLessonKind;
  estimated_minutes: number;
  // GrammarBlock[] from lib/grammar/lesson-blocks.ts — kept as unknown[] here
  // to avoid a client-type <-> db-type import cycle; cast at the call site
  // (same pattern as MathLesson.content / TextbookGrammarTopic.blocks).
  content: unknown[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MaturaLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

// ----------------------------------------------------------------------------
// Matura — vocabulary bank (0021_matura_theory.sql)
// ----------------------------------------------------------------------------

/** One of the podstawa programowa's thematic blocks, per language. */
export interface MaturaVocabTopic {
  id: string;
  language: MaturaLanguage;
  slug: string;
  /** Polish name of the block ("Podróżowanie i turystyka"). */
  title: string;
  /** The same block named in the target language. */
  title_target: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MaturaVocabEntry {
  id: string;
  topic_id: string;
  /** The level from which this entry is expected — a rozszerzona student is
   * responsible for podstawowa entries too. See lib/matura/vocab.ts. */
  level: MaturaLevel;
  term: string;
  part_of_speech: string;
  translation_pl: string;
  example: string;
  example_pl: string;
  /** Collocations, register, false friends, irregular forms. */
  note: string;
  order_index: number;
  created_at: string;
}

export interface MaturaVocabProgress {
  id: string;
  user_id: string;
  entry_id: string;
  /** Leitner box 0-5; the interval per box lives in lib/matura/vocab-review.ts. */
  box: number;
  correct_count: number;
  incorrect_count: number;
  status: MasteryStatus;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  updated_at: string;
}

export type MaturaTaskItemType = "gap_fill" | "multiple_choice";

export interface MaturaTaskItem {
  id: string;
  type: MaturaTaskItemType;
  /** Sentence/question for this sub-item, e.g. "I wish I ___ (KNOW) the answer sooner." */
  prompt: string;
  /** The base word to transform, shown separately — słowotwórstwo-style items. */
  transformWord?: string;
  /** multiple_choice only. */
  options?: string[];
  /** Accepted answers, exact-normalized match (see lib/matura/grading.ts) —
   * for multiple_choice, the single correct option text. */
  correctAnswers: string[];
  explanation?: string;
}

export interface MaturaTaskContent {
  instructions: string;
  /** Optional shared reading passage/context for the item group. */
  passage?: string;
  /** Listening tasks only: embeds a real YouTube video the student plays
   * while answering — see components/matura/task-attempt-form.tsx. */
  youtubeVideoId?: string;
  items: MaturaTaskItem[];
}

export interface MaturaPastExamMetadata {
  year: number;
  session: string;
  source_url: string;
  needsReview?: boolean;
}

export interface MaturaCuratedMetadata {
  attribution: string;
  needsReview?: boolean;
}

export interface MaturaGeneratedMetadata {
  needsReview?: boolean;
}

/** CKE task types practised inside an exam part — see lib/matura/task-types.ts
 * for the catalog and why the student practises along this axis rather than a
 * numbered task list. */
export type MaturaTaskTypeSlug =
  | "slowotworstwo"
  | "luki-otwarte"
  | "formy-czasownika"
  | "luki-wybor"
  | "parafraza"
  | "tlumaczenie"
  | "czytanie-wybor"
  | "czytanie-dobieranie"
  | "czytanie-prawda-falsz"
  | "sluchanie-wybor"
  | "sluchanie-dobieranie";

export interface MaturaTask {
  id: string;
  section_id: string;
  /** Which CKE task type this is an instance of. Null only for rows seeded
   * before 0023_matura_task_types.sql that the backfill could not classify —
   * those are hidden from the type hubs but still openable by direct link. */
  task_type: MaturaTaskTypeSlug | null;
  content: MaturaTaskContent;
  points_max: number;
  source: MaturaTaskSource;
  source_metadata: MaturaPastExamMetadata | MaturaCuratedMetadata | MaturaGeneratedMetadata | null;
  created_by: string | null;
  created_at: string;
}

export interface MaturaTaskItemResult {
  itemId: string;
  isCorrect: boolean;
  studentAnswer: string;
  correctAnswers: string[];
}

export interface MaturaTaskAttempt {
  id: string;
  task_id: string;
  user_id: string;
  answers: Record<string, string>;
  points_awarded: number;
  max_points: number;
  item_results: MaturaTaskItemResult[];
  mock_exam_id: string | null;
  attempted_at: string;
}

export interface MaturaMockExamBreakdownEntry {
  section_id: string;
  section_title: string;
  points_awarded: number;
  points_max: number;
}

export interface MaturaMockExam {
  id: string;
  user_id: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  task_ids: string[];
  time_limit_seconds: number;
  started_at: string;
  finished_at: string | null;
  total_points: number | null;
  max_points: number;
  breakdown: MaturaMockExamBreakdownEntry[] | null;
  draft_answers: Record<string, unknown>;
  status: MaturaMockExamStatus;
}

export interface MaturaSectionProgress {
  id: string;
  user_id: string;
  section_id: string;
  status: MasteryStatus;
  mastery_score: number;
  diagnosed_at: string | null;
  last_reviewed_at: string | null;
  updated_at: string;
}

export interface MaturaProgressSnapshot {
  id: string;
  user_id: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  snapshot_at: string;
  estimated_score: number;
  estimated_percent: number;
  section_breakdown: Record<string, number>;
}

export interface MaturaStudyPlan {
  id: string;
  user_id: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  exam_date: string | null;
  weekly_hours_target: number | null;
  generated_at: string;
  last_recomputed_at: string | null;
}

export interface MaturaStudyPlanWeek {
  id: string;
  plan_id: string;
  week_index: number;
  target_start_date: string;
  target_end_date: string;
  section_ids: string[];
  is_review_week: boolean;
  status: MaturaStudyPlanWeekStatus;
}

export interface MaturaAssignedPractice {
  id: string;
  student_id: string;
  section_id: string;
  assigned_by: string | null;
  note: string | null;
  created_at: string;
  dismissed_at: string | null;
}

export interface MaturaSettings {
  user_id: string;
  language: MaturaLanguage;
  level: MaturaLevel;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------------
// Wypowiedź pisemna (0014_matura_writing.sql) — separate from MaturaTask/
// MaturaTaskAttempt above: a writing submission is one free-text answer
// graded holistically against a 4-part CKE rubric, not per-item exact match.
// ----------------------------------------------------------------------------

/** Forms the writing prompt can take. Podstawowa: email/blog_post/forum_post.
 * Rozszerzona: the tekst argumentacyjny forms — rozprawka, artykuł
 * publicystyczny, list formalny. All are graded against one form-independent
 * CKE rubric (lib/matura/writing-grading.ts). */
export type MaturaWritingFormType =
  | "email"
  | "blog_post"
  | "forum_post"
  | "rozprawka_za_i_przeciw"
  | "artykul"
  | "list_formalny";

export interface MaturaWritingTask {
  id: string;
  section_id: string;
  form_type: MaturaWritingFormType;
  instructions: string;
  content_points: string[];
  min_words: number;
  max_words: number;
  points_max: number;
  source: MaturaTaskSource;
  source_metadata: MaturaPastExamMetadata | MaturaCuratedMetadata | MaturaGeneratedMetadata | null;
  /** Original, full-mark-quality reference text — revealed only after the
   * student submits their own attempt. */
  model_answer: string;
  model_answer_notes: string;
  created_by: string | null;
  created_at: string;
}

export interface MaturaWritingCriterionResult {
  /** e.g. "tresc" | "zgodnosc" | "spojnosc" | "zakres" | "poprawnosc" */
  key: string;
  label: string;
  pointsAwarded: number;
  pointsMax: number;
  comment: string;
}

export interface MaturaWritingAiFeedback {
  criteria: MaturaWritingCriterionResult[];
  totalPoints: number;
  maxPoints: number;
  generalFeedback: string;
  improvementTip: string;
}

export interface MaturaWritingSubmission {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  word_count: number;
  points_awarded: number;
  max_points: number;
  ai_feedback: MaturaWritingAiFeedback;
  created_at: string;
}

export interface BottleCounter {
  user_id: string;
  count: number;
  updated_at: string;
}

export interface BottleCoupon {
  id: string;
  user_id: string;
  image_path: string;
  created_at: string;
}

// ============================================================================
// Geografia — matura rozszerzona z geografii exam prep. Mirrors
// supabase/migrations/0015_geografia.sql. Sibling to Matma/Matura Angielski:
// shared content (topics/exercises) + per-user attempts, mastery-per-topic,
// spaced review. Open-answer grading is DELIBERATELY not AI-authoritative
// (see lib/geografia/grading.ts) — the student self-assesses against a
// rubric, AI only supplies a hint, per product requirement.
// ============================================================================
export type GeoExerciseType = "mc" | "open" | "map";
export type GeoExerciseSource = "built_in" | "ai_generated" | "uploaded";
/** 'layer_select' is reserved for a future thematic-layer picker — schema-only for now. */
export type GeoMapInteraction = "point" | "region" | "layer_select";
export type GeoAnnotationType = "note" | "highlight";
export type GeoFileStatus = "processing" | "ready" | "failed";

export interface GeoTopic {
  id: string;
  cke_number: string;
  slug: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GeoFile {
  id: string;
  user_id: string;
  title: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  status: GeoFileStatus;
  error_message: string | null;
  exercises_extracted: number;
  created_at: string;
}

export interface GeoExercisePrompt {
  statement: string;
  imageUrl?: string;
}

export interface GeoMcOption {
  id: string;
  text: string;
}

export interface GeoMcCorrectAnswer {
  correctOptionIds: string[];
}

export interface GeoOpenCorrectAnswer {
  modelAnswer: string;
  rubric: string[];
}

export interface GeoExercise {
  id: string;
  topic_id: string;
  type: GeoExerciseType;
  difficulty: 1 | 2 | 3;
  points_max: number;
  prompt: GeoExercisePrompt;
  options: GeoMcOption[] | null;
  correct_answer: GeoMcCorrectAnswer | GeoOpenCorrectAnswer | null;
  hints: string[];
  source: GeoExerciseSource;
  needs_review: boolean;
  file_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface GeoMapPointInput {
  center: [number, number];
  zoom: number;
}

export interface GeoMapRegionFeatureProperties {
  regionId: string;
  label: string;
}

export interface GeoMapRegionInput {
  center: [number, number];
  zoom: number;
  geojson: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      properties: GeoMapRegionFeatureProperties;
      geometry: { type: "Polygon" | "MultiPolygon"; coordinates: unknown };
    }>;
  };
}

export interface GeoMapPointAnswer {
  lat: number;
  lng: number;
  toleranceKm: number;
}

export interface GeoMapRegionAnswer {
  correctRegionIds: string[];
  partialRegionIds?: string[];
}

export interface GeoMapTask {
  id: string;
  exercise_id: string;
  interaction_type: GeoMapInteraction;
  input_data: GeoMapPointInput | GeoMapRegionInput | Record<string, unknown>;
  correct_answer: GeoMapPointAnswer | GeoMapRegionAnswer | Record<string, unknown>;
  feedback_description: string | null;
}

/** Hint-only AI output for an open-answer attempt — NEVER drives points_awarded. */
export interface GeoExerciseAiFeedback {
  hint: string;
  matchedRubricPoints: string[];
  missingRubricPoints: string[];
}

export interface GeoMcAnswer {
  selectedOptionIds: string[];
}
export interface GeoOpenAnswer {
  text: string;
}
export interface GeoMapPointGivenAnswer {
  lat: number;
  lng: number;
}
export interface GeoMapRegionGivenAnswer {
  regionId: string;
}

export interface GeoExerciseAttempt {
  id: string;
  exercise_id: string;
  user_id: string;
  answer: GeoMcAnswer | GeoOpenAnswer | GeoMapPointGivenAnswer | GeoMapRegionGivenAnswer;
  points_awarded: number;
  points_max: number;
  self_assessed: boolean;
  ai_feedback: GeoExerciseAiFeedback | null;
  duration_seconds: number | null;
  attempted_at: string;
}

export interface GeoLesson {
  id: string;
  topic_id: string;
  slug: string;
  title: string;
  summary: string;
  // GeoBlock[] from lib/geografia/lesson-blocks.ts — kept as unknown[] here to
  // avoid a client-type <-> db-type import cycle; cast at the call site (same
  // pattern as MathLesson.content above).
  content: unknown[];
  reading_minutes: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GeoLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface GeoTopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: MasteryStatus;
  mastery_score: number;
  solved_count: number;
  last_reviewed_at: string | null;
  updated_at: string;
}

export interface GeoProgressSnapshot {
  id: string;
  user_id: string;
  snapshot_at: string;
  estimated_percent: number;
  topic_breakdown: Record<string, number>;
}

export interface GeoFavorite {
  user_id: string;
  exercise_id: string;
  created_at: string;
}

export interface GeoAnnotation {
  id: string;
  file_id: string;
  user_id: string;
  page_number: number;
  type: GeoAnnotationType;
  content: string;
  excerpt: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Modlitwa — aplikacja modlitewna. Mirrors supabase/migrations/0017_modlitwa.sql.
// Treści wspólne (wersety, czytania, kalendarz liturgiczny) + dane prywatne
// (streak, dziennik, intencje, ustawienia). Kalendarz liturgiczny NIE jest
// przechowywany jako źródło prawdy — wylicza go lib/modlitwa/liturgical-calendar.ts,
// a tabela special_liturgical_dates jest tylko cache'em dla widoku miesiąca i
// feedu ICS.
// ============================================================================
export type BibleVerseSeason = "adwent" | "boze_narodzenie" | "wielki_post" | "wielkanoc" | "zwykly";
export type LiturgicalRankRow = "uroczystosc" | "swieto" | "wspomnienie" | "niedziela";
export type LiturgicalColorRow = "bialy" | "czerwony" | "zielony" | "fioletowy" | "rozowy";

export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  translation: string;
  themes: string[];
  season: BibleVerseSeason | null;
  is_active: boolean;
  created_at: string;
}

export interface DailyVersePick {
  user_id: string;
  verse_date: string;
  verse_id: string;
  created_at: string;
}

export interface DailyReading {
  reading_date: string;
  day_name: string | null;
  first_reading_citation: string | null;
  first_reading_text: string | null;
  psalm_citation: string | null;
  psalm_refrain: string | null;
  psalm_text: string | null;
  second_reading_citation: string | null;
  second_reading_text: string | null;
  acclamation_citation: string | null;
  acclamation_text: string | null;
  gospel_citation: string | null;
  gospel_text: string | null;
  source_url: string | null;
  fetched_at: string;
}

export interface SpecialLiturgicalDate {
  observance_date: string;
  name: string;
  rank: LiturgicalRankRow;
  color: LiturgicalColorRow;
  season: string;
  is_holy_day_of_obligation: boolean;
  created_at: string;
}

export interface PrayerStreakRow {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_days: number;
  last_prayer_date: string | null;
  updated_at: string;
}

export interface PrayerLogEntry {
  user_id: string;
  prayer_date: string;
  hours: string[];
  note: string | null;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  user_id: string;
  person_name: string;
  reason: string | null;
  promise_date: string;
  fulfilled: boolean;
  fulfilled_at: string | null;
  notes: string | null;
  last_prayed_at: string | null;
  prayed_count: number;
  created_at: string;
  updated_at: string;
}

export interface PrayerSettings {
  user_id: string;
  notifications_enabled: boolean;
  reminder_time: string;
  calendar_sync_enabled: boolean;
  calendar_token: string;
  include_intentions_in_calendar: boolean;
  large_text: boolean;
  updated_at: string;
}

// ----------------------------------------------------------------------------
// Modlitwa — cache pełnych tekstów Liturgii Godzin z brewiarz.pl.
// Mirrors supabase/migrations/0019_modlitwa_brewiarz.sql. Tabele globalne:
// SELECT dla zalogowanych, zapis wyłącznie przez service-role.
// ----------------------------------------------------------------------------
export interface BreviaryHourRow {
  hour_date: string;
  hour_id: string;
  variant: string;
  title: string | null;
  subtitle: string | null;
  /** BreviarySection[] — patrz lib/modlitwa/breviary-source.ts. */
  sections: unknown;
  source_url: string;
  fetched_at: string;
}

export interface BreviaryDayRow {
  day_date: string;
  /** BreviaryVariant[] */
  variants: unknown;
  source_url: string;
  fetched_at: string;
}

// ---------------------------------------------------------------------------
// Godziny — rejestr czasu nauki (supabase/migrations/0020_godziny.sql)
// ---------------------------------------------------------------------------

export interface StudyTopic {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  /** Slot palety --chart-1..8 (0-7), patrz lib/chart-colors.ts. */
  color_index: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  topic_id: string;
  study_date: string;
  duration_minutes: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Algorytmy — nauka struktur danych i algorytmów.
// Mirrors supabase/migrations/0024_algorytmy.sql. Ćwiczenia są wyłącznie
// jednokrotnego wyboru — uzasadnienie w lib/algorytmy/task-types.ts.
// ============================================================================
export type AlgoCategoryRow = "podstawy" | "struktury" | "algorytmy";
export type AlgoExerciseSource = "curated" | "ai_generated";

export interface AlgoTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: AlgoCategoryRow;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AlgoLesson {
  id: string;
  topic_id: string;
  slug: string;
  title: string;
  summary: string;
  /** AlgoBlock[] from lib/algorytmy/lesson-blocks.ts — kept as unknown[] here
   * to avoid a client-type <-> db-type import cycle; cast at the call site
   * (same pattern as GeoLesson.content above). */
  content: unknown[];
  reading_minutes: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AlgoLessonProgress {
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface AlgoExerciseOption {
  id: string;
  text: string;
}

export interface AlgoExercise {
  id: string;
  topic_id: string;
  /** Slug from lib/algorytmy/task-types.ts. */
  task_type: string;
  statement: string;
  code: string | null;
  code_language: string | null;
  options: AlgoExerciseOption[];
  correct_option_id: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
  points_max: number;
  source: AlgoExerciseSource;
  needs_review: boolean;
  created_by: string | null;
  created_at: string;
}

export interface AlgoExerciseAttempt {
  id: string;
  exercise_id: string;
  user_id: string;
  chosen_option_id: string;
  is_correct: boolean;
  points_awarded: number;
  points_max: number;
  attempted_at: string;
}

// ============================================================================
// Gitara — nauka gry na gitarze: akordy, nuty i rytm, CAGED, techniki,
// biblioteka akordów i piosenek, praktyka (metronom, stroik).
// Mirrors supabase/migrations/0025_gitara.sql. Nie ma banku ćwiczeń —
// uzasadnienie w komentarzu na górze tej migracji.
// ============================================================================
export type GtrChordCategory = "open" | "power" | "barre" | "rozszerzony";
export type GtrSongSource = "curated" | "imported";
export type GtrPracticeKind = "metronom" | "strojenie" | "wolna-gra";

export interface GtrTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GtrLesson {
  id: string;
  topic_id: string;
  slug: string;
  title: string;
  summary: string;
  /** GtrBlock[] from lib/gitara/lesson-blocks.ts — kept as unknown[] here to
   * avoid a client-type <-> db-type import cycle; cast at the call site
   * (same pattern as AlgoLesson.content above). */
  content: unknown[];
  reading_minutes: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface GtrLessonProgress {
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

/** Mirrors FrettedChord from lib/gitara/theory.ts — kept as unknown here for
 * the same reason GtrLesson.content is: no client-type import in a db-type
 * file. Cast at the call site. */
export interface GtrChord {
  id: string;
  slug: string;
  symbol: string;
  root: string;
  quality: string;
  category: GtrChordCategory;
  positions: unknown;
  difficulty: 1 | 2 | 3;
  order_index: number;
  description: string;
  created_at: string;
}

export interface GtrSong {
  id: string;
  slug: string;
  title: string;
  artist: string;
  difficulty: 1 | 2 | 3;
  tempo_bpm: number | null;
  capo: number;
  content_chordpro: string;
  tab_text: string;
  source: GtrSongSource;
  created_by: string | null;
  created_at: string;
}

export interface GtrPracticeSession {
  id: string;
  user_id: string;
  kind: GtrPracticeKind;
  bpm: number | null;
  duration_seconds: number;
  practiced_at: string;
}

export interface GtrDrillAttempt {
  id: string;
  user_id: string;
  /** Slug from lib/gitara/drills.ts. */
  drill_type: string;
  is_correct: boolean;
  attempted_at: string;
}

// ============================================================================
// Siłownia — dziennik treningów, nawodnienia, posiłków i suplementów.
// Mirrors supabase/migrations/0026_silownia.sql.
// ============================================================================
export type GymGoal = "redukcja" | "masa" | "utrzymanie" | "wytrzymalosc";

export interface GymProfile {
  user_id: string;
  weight_kg: number | null;
  height_cm: number | null;
  goal: GymGoal | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  name: string;
  sets: { reps: number; weightKg: number | null }[];
}

export interface GymWorkout {
  id: string;
  user_id: string;
  workout_date: string;
  split_label: string;
  duration_minutes: number | null;
  exercises: WorkoutExercise[];
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface GymHydrationLog {
  user_id: string;
  log_date: string;
  consumed_ml: number;
  updated_at: string;
}

export interface GymMealEntry {
  id: string;
  user_id: string;
  entry_date: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ai_note: string | null;
  created_at: string;
}

export interface GymSupplementEntry {
  id: string;
  user_id: string;
  entry_date: string;
  name: string;
  dose: string | null;
  time_label: string | null;
  note: string | null;
  created_at: string;
}

// ============================================================================
// Maturalnik — zaimportowany bank zadań z notatnika OneNote (17 rozdziałów,
// ~612 zadań maturalnych z matematyki). Mirrors supabase/migrations/0028_maturalnik.sql.
// ============================================================================
export interface MaturalnikChapter {
  id: string;
  number: number;
  slug: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface MaturalnikProblem {
  id: string;
  chapter_id: string;
  number: number;
  image_path: string;
  flagged_for_review: boolean;
  created_at: string;
}

export interface MaturalnikProgress {
  id: string;
  user_id: string;
  problem_id: string;
  done: boolean;
  done_at: string | null;
  canvas_path: string | null;
  updated_at: string;
}

export interface MaturalnikSettings {
  user_id: string;
  exam_date: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Informatyka — arkusze CKE z matury rozszerzonej z informatyki 2022–2026.
// Mirrors supabase/migrations/0030_informatyka.sql.
// ============================================================================
export type InformatykaKind = "pisemne" | "program" | "arkusz" | "sql" | "teoria";
export type InformatykaStatus = "todo" | "in_progress" | "done";

export interface InformatykaExam {
  id: string;
  slug: string;
  year: number;
  session: "maj" | "czerwiec";
  formula: "2015" | "2023";
  title: string;
  exam_date: string | null;
  duration_minutes: number | null;
  max_points: number;
  order_index: number;
}

export interface InformatykaTask {
  id: string;
  exam_id: string;
  number: number;
  part: 1 | 2 | null;
  title: string;
  intro_image_paths: string[];
}

export interface InformatykaProblem {
  id: string;
  task_id: string;
  label: string;
  order_index: number;
  points_max: number;
  kind: InformatykaKind;
  topic: string;
  statement_image_paths: string[];
  key_image_paths: string[];
  scoring_text: string;
  key_text: string;
  result_file: string | null;
  data_files: string[];
  sql_extra_schema: string | null;
  needs_review: boolean;
  reference_sql: string | null;
  reference_code: string | null;
  reference_note: string | null;
  answer_check: { any: string[][] } | null;
}

export interface InformatykaDataFile {
  id: string;
  exam_id: string;
  name: string;
  content: string;
  is_example: boolean;
}

export interface InformatykaProgress {
  id: string;
  user_id: string;
  problem_id: string;
  status: InformatykaStatus;
  score: number | null;
  done_at: string | null;
  code: string | null;
  answer_text: string | null;
  sql_text: string | null;
  canvas_path: string | null;
  sheet_path: string | null;
  updated_at: string;
}

export interface InformatykaSettings {
  user_id: string;
  exam_date: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Lexicon ("Codzienne"): frequency-list decks of daily words and phrases
// (supabase/migrations/0032_lexicon.sql)
// ---------------------------------------------------------------------------
export interface LexiconDeck {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: "word" | "phrase";
  source_name: string;
  source_url: string;
  order_index: number;
}

export interface LexiconEntry {
  id: string;
  deck_id: string;
  /** Position in the source list; new entries are taught in this order. */
  rank: number;
  term: string;
  part_of_speech: string;
  /** The source list's English gloss (UMN phrasal verbs: senses separated by
   * ";"). Empty for bare-headword lists. */
  definition_en: string;
  /** Empty until the AI fills the card in (see lexicon/enrich.ts). */
  translation_pl: string;
  example: string;
  example_pl: string;
  note: string;
  enriched_at: string | null;
}

export interface LexiconProgress {
  id: string;
  user_id: string;
  entry_id: string;
  box: number;
  correct_count: number;
  incorrect_count: number;
  status: MasteryStatus;
  last_reviewed_at: string | null;
  next_review_at: string | null;
}

// ============================================================================
// Gitara tabs — whole songs as structured notes (supabase/migrations/0035_gitara_tabs.sql).
// ============================================================================
export interface GtrTabNote {
  /** 1 = thinnest (high e) … 6 = thickest (low E). */
  s: number;
  /** Fret relative to the capo; absent for a muted note. */
  f?: number;
  /** Artificial harmonic — the fret it sounds at (written fret + 12). */
  ah?: number;
  mute?: boolean;
  /** Held/tied note shown in brackets in the tab — not plucked again. */
  tie?: boolean;
}

export interface GtrTabEvent {
  /** Position inside the bar in beats (0–4), estimated from the layout. */
  beat: number;
  notes: GtrTabNote[];
  /** "H" hammer-on, "P" pull-off, "AH" artificial harmonic label above the staff. */
  tech?: string;
  /** Note names are derived, never stored. */
}

export interface GtrTabBar {
  n: number;
  section?: string;
  events: GtrTabEvent[];
}

export interface GtrTab {
  id: string;
  slug: string;
  title: string;
  artist: string;
  arranger: string | null;
  capo: number;
  tempo: number | null;
  tuning: string;
  note: string | null;
  source_file: string | null;
  bars: GtrTabBar[];
  bar_count: number;
  created_by: string | null;
  created_at: string;
}
