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
}

export interface MathCuratedMetadata {
  attribution: string;
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
  source_metadata: MathPastExamMetadata | MathCuratedMetadata | null;
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
