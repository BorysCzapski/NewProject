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
// Matma — matura rozszerzona z matematyki trainer (0007_matma.sql)
// ============================================================================

export type MathProblemSource = "topic" | "past_exam" | "curated" | "ai_generated";
export type MathMockExamStatus = "in_progress" | "completed" | "abandoned";
export type MathStudyPlanWeekStatus =
  | "upcoming"
  | "in_progress"
  | "completed"
  | "partially_completed"
  | "skipped";

export interface MathTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  order_index: number;
  exam_weight: number;
  created_at: string;
  updated_at: string;
}

export interface MathLesson {
  id: string;
  topic_id: string;
  title: string;
  // MathBlock[] from lib/matma/lesson-blocks.ts — kept as unknown[] here to
  // avoid a client-type <-> db-type import cycle; cast at the call site.
  content: unknown[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MathProblemContent {
  /** Polish prose; may embed KaTeX via $inline$ / $$display$$ delimiters
   * (see lib/matma/lesson-blocks.ts header comment) — render with
   * components/matma/math.tsx's <MathText>. */
  statement: string;
  imageUrl?: string;
  /** Only for non-proof problems with one unambiguous final result — lets
   * submitProblemAttempt skip the AI round-trip and grade programmatically
   * when the student typed just the final answer with no method/canvas. */
  acceptedAnswers?: string[];
}

export interface MathGradingCriterion {
  step: string;
  points: number;
  description: string;
}

export interface MathPastExamMetadata {
  year: number;
  session: string;
  formula: string;
  source_url: string;
  /** True when the automated importer couldn't fully validate this problem
   * (unrecognized topic, mismatched grading-criteria sum, AI structuring
   * failure) and inserted it anyway rather than silently dropping it — flags
   * it for an admin to double-check via adminUpsertProblem. */
  needsReview?: boolean;
}

export interface MathCuratedMetadata {
  attribution: string;
  /** See MathPastExamMetadata.needsReview — same meaning, curated pipeline. */
  needsReview?: boolean;
}

export interface MathGeneratedMetadata {
  /** The lekcja title this batch was generated for (see
   * lib/matma/ai-generation-lekcje.ts) — lets generateAiProblemsForLekcja
   * check "already generated for this lekcja" the same way the CKE/curated
   * pipelines check "already imported". */
  lekcja: string;
  /** See MathPastExamMetadata.needsReview — same meaning, AI-generation pipeline. */
  needsReview?: boolean;
}

export interface MathProblem {
  id: string;
  topic_id: string;
  content: MathProblemContent;
  difficulty: 1 | 2 | 3;
  is_proof: boolean;
  points_max: number;
  source: MathProblemSource;
  grading_criteria: MathGradingCriterion[];
  source_metadata: MathPastExamMetadata | MathCuratedMetadata | MathGeneratedMetadata | null;
  created_by: string | null;
  created_at: string;
}

export interface MathStepBreakdownEntry {
  step: string;
  points_awarded: number;
  points_possible: number;
  satisfied: boolean;
  justification: string;
}

export interface MathAiFeedback {
  points_awarded: number;
  max_points: number;
  step_breakdown: MathStepBreakdownEntry[];
  improvement_tip: string;
}

export interface MathProblemAttempt {
  id: string;
  problem_id: string;
  user_id: string;
  answer_text: string | null;
  canvas_image_url: string | null;
  method_description: string | null;
  points_awarded: number | null;
  ai_feedback: MathAiFeedback | null;
  mock_exam_id: string | null;
  attempted_at: string;
}

export interface MathMockExamBreakdownEntry {
  topic_id: string;
  topic_title: string;
  points_awarded: number;
  points_max: number;
}

export interface MathMockExamDraftAnswer {
  answerText: string | null;
  /** Raw "data:image/png;base64,..." ink snapshot — NOT a stored URL yet;
   * it's only uploaded to Storage once the exam is graded (see
   * lib/matma/actions.ts uploadCanvasImage). */
  canvasImageDataUrl: string | null;
  methodDescription: string | null;
  savedAt: string;
}

export interface MathMockExam {
  id: string;
  user_id: string;
  problem_ids: string[];
  time_limit_seconds: number;
  started_at: string;
  finished_at: string | null;
  total_points: number | null;
  max_points: number;
  breakdown: MathMockExamBreakdownEntry[] | null;
  draft_answers: Record<string, MathMockExamDraftAnswer>;
  status: MathMockExamStatus;
}

export interface MathTopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: MasteryStatus;
  mastery_score: number;
  diagnosed_at: string | null;
  last_reviewed_at: string | null;
  updated_at: string;
}

export interface MathLearningPathStage {
  id: string;
  order_index: number;
  topic_id: string;
  title: string;
  created_at: string;
}

export interface MathProgressSnapshot {
  id: string;
  user_id: string;
  snapshot_at: string;
  estimated_score: number;
  estimated_percent: number;
  topic_breakdown: Record<string, number>;
}

export interface MathStudyPlan {
  id: string;
  user_id: string;
  exam_date: string | null;
  weekly_hours_target: number | null;
  generated_at: string;
  last_recomputed_at: string | null;
}

export interface MathAssignedPractice {
  id: string;
  student_id: string;
  topic_id: string;
  assigned_by: string | null;
  note: string | null;
  created_at: string;
  dismissed_at: string | null;
}

export interface MathStudyPlanWeek {
  id: string;
  plan_id: string;
  week_index: number;
  target_start_date: string;
  target_end_date: string;
  topic_ids: string[];
  is_review_week: boolean;
  status: MathStudyPlanWeekStatus;
}

// ============================================================================
// Paragony: receipts, home budget ledger, ETF portfolio.
// Mirrors supabase/migrations/0008_paragony_budzet_etf.sql.
// ============================================================================

export type AccountKind = "cash" | "bank" | "credit_card" | "other";
export type BudgetCategoryKind = "expense" | "income";
export type ReceiptStatus = "pending_review" | "confirmed";
export type TransactionType = "uznanie" | "obciazenie" | "transfer";
export type RecurringFrequency = "monthly" | "quarterly" | "yearly";
export type EtfProvider = "stooq" | "fmp";
export type EtfTransactionType = "buy" | "sell";

export interface Account {
  id: string;
  user_id: string;
  name: string;
  kind: AccountKind;
  starting_balance: number;
  created_at: string;
}

export interface BudgetCategory {
  id: string;
  /** null = shared default category, visible to everyone. */
  user_id: string | null;
  name: string;
  kind: BudgetCategoryKind;
  icon: string | null;
  is_default: boolean;
  created_at: string;
}

/** Raw structured OCR extraction from askAIForJSONWithImage, before review. */
export interface ReceiptOcrResult {
  store_name: string | null;
  purchase_date: string | null;
  total_amount: number | null;
  payment_method: string | null;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number | null;
    total_price: number;
    /** AI-suggested category name (see lib/paragony/categories.ts), matched
     * to a budget_categories row by name at insert time. */
    category?: string;
  }>;
}

export interface Receipt {
  id: string;
  user_id: string;
  store_name: string | null;
  purchase_date: string | null;
  total_amount: number | null;
  raw_ocr_json: ReceiptOcrResult | null;
  status: ReceiptStatus;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit_price: number | null;
  total_price: number;
  category_id: string | null;
  created_at: string;
}

export interface RecurringTransaction {
  id: string;
  user_id: string;
  type: Extract<TransactionType, "uznanie" | "obciazenie">;
  amount: number;
  description: string;
  category_id: string | null;
  account_id: string;
  frequency: RecurringFrequency;
  day_of_period: number;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  target_date: string | null;
  current_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  occurred_at: string;
  description: string;
  category_id: string | null;
  account_id: string;
  transfer_to_account_id: string | null;
  receipt_id: string | null;
  recurring_transaction_id: string | null;
  savings_goal_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyBudget {
  id: string;
  user_id: string;
  category_id: string;
  year: number;
  month: number;
  planned_amount: number;
  created_at: string;
  updated_at: string;
}

export interface EtfHolding {
  id: string;
  user_id: string;
  ticker: string;
  provider: EtfProvider;
  name: string | null;
  currency: string;
  asset_class: string | null;
  region: string | null;
  ter: number | null;
  created_at: string;
}

export interface EtfTransaction {
  id: string;
  holding_id: string;
  user_id: string;
  type: EtfTransactionType;
  units: number;
  price_per_unit: number;
  transaction_date: string;
  created_at: string;
}

export interface EtfDividend {
  id: string;
  holding_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  notes: string | null;
  created_at: string;
}

/** Global cache shared across all users — see migration comment. */
export interface EtfPriceHistoryRow {
  id: string;
  ticker: string;
  price_date: string;
  close_price: number;
  currency: string;
  fetched_at: string;
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
  // to avoid a client-type <-> db-type import cycle; cast at the call site
  // (same pattern as MathLesson.content above).
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
// Matura Angielski — CKE English matura exam prep (poziom podstawowy /
// rozszerzony). Mirrors supabase/migrations/0013_matura.sql. Sibling to
// Matma (lib/matma/*), same shape: shared content (sections/lessons/task
// bank) + per-user attempts, mastery-per-section, mock exams, study plan.
// ============================================================================

export type MaturaLevel = "podstawowa" | "rozszerzona";
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
  level: MaturaLevel;
  slug: MaturaSectionSlug;
  title: string;
  description: string;
  order_index: number;
  exam_weight: number;
  created_at: string;
  updated_at: string;
}

export interface MaturaLesson {
  id: string;
  section_id: string;
  title: string;
  // GrammarBlock[] from lib/grammar/lesson-blocks.ts — kept as unknown[] here
  // to avoid a client-type <-> db-type import cycle; cast at the call site
  // (same pattern as MathLesson.content / TextbookGrammarTopic.blocks).
  content: unknown[];
  order_index: number;
  created_at: string;
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

export interface MaturaTask {
  id: string;
  section_id: string;
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
  level: MaturaLevel;
  snapshot_at: string;
  estimated_score: number;
  estimated_percent: number;
  section_breakdown: Record<string, number>;
}

export interface MaturaStudyPlan {
  id: string;
  user_id: string;
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
  level: MaturaLevel;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------------------
// Wypowiedź pisemna (0014_matura_writing.sql) — separate from MaturaTask/
// MaturaTaskAttempt above: a writing submission is one free-text answer
// graded holistically against a 4-part CKE rubric, not per-item exact match.
// ----------------------------------------------------------------------------

export type MaturaWritingFormType = "email" | "blog_post" | "forum_post" | "rozprawka_za_i_przeciw";

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
