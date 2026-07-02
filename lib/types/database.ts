// ============================================================================
// database.ts
// Hand-written TypeScript mirror of supabase/migrations/0001_init.sql.
// Kept in sync manually — if the schema changes, update this file too.
// ============================================================================

export type UserLevel = "A1" | "A2" | "B1" | "B2";
export type UserRole = "user" | "admin";
export type MasteryStatus = "new" | "learning" | "mastered";
export type HomeworkType =
  | "song_translation"
  | "vocabulary_mastery"
  | "training_count"
  | "reading_count"
  | "flashcards_count"
  | "grammar_topic"
  | "writing_task"
  | "listening_task";
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
  role: UserRole;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface VocabularyWord {
  id: string;
  level: UserLevel;
  category: string;
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
  level: UserLevel;
  slug: string;
  title: string;
  explanation: string;
  order_index: number;
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
  deadline: string | null;
  created_by: string | null;
  created_at: string;
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
