-- ============================================================================
-- 0022_retire_matura_grammar_vocab.sql
-- Drops the theory/vocabulary tables introduced by 0016_matura_theory.sql.
--
-- WHY. That migration and 0021_matura_theory.sql are two implementations of
-- the same feature, built in parallel sessions against the same database. The
-- one from 0016 has no language dimension at all: matura_grammar_topics and
-- matura_vocabulary_words are keyed by level only, and the term column is
-- literally named `word_en`. Once the module became multilingual, a student
-- who picked hiszpański still got English grammar and English vocabulary,
-- because there was nothing in those tables to filter on. That is the bug this
-- migration exists to remove — the tables cannot be corrected by scoping the
-- queries, since the content itself is English-only.
--
-- The replacement (0021) carries `language` on matura_vocab_topics and reaches
-- lesson content through matura_sections, which has been language-scoped since
-- 0020. It is also a superset in coverage: 75 lessons and 938 entries against
-- 13 topics and 210 words.
--
-- 0016_matura_theory.sql itself is deliberately left in place and NOT deleted.
-- It is recorded as applied in public._migrations and deleting an applied
-- migration would leave a hole in the history; the repo's rule is to reverse a
-- migration with a new one, never to edit or remove it after the fact.
--
-- DATA LOSS IS INTENTIONAL AND ACCEPTED. Dropping these tables discards the
-- 13 grammar topics and 210 English vocabulary entries seeded from
-- supabase/seed/matura/1x_grammar_*.sql and 1x_vocabulary_*.sql (removed in
-- the same commit), plus any per-user progress recorded against them. That was
-- an explicit product decision: keeping both would leave two parallel theory
-- modules and two parallel vocabulary modules doing the same job.
-- ============================================================================

-- Progress tables first — they carry the foreign keys into the content tables.
drop table if exists matura_grammar_progress;
drop table if exists matura_vocabulary_progress;

drop table if exists matura_grammar_exercises;
drop table if exists matura_grammar_topics;
drop table if exists matura_vocabulary_words;
