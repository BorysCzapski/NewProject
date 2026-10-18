-- ============================================================================
-- 0033_lexicon_definitions.sql
-- Source definition for lexicon entries. The UMN phrasal-verb list ships an
-- English gloss per verb (often several senses separated by ";"); keeping it
-- lets the AI translate the senses the SOURCE lists instead of guessing which
-- meaning of "turn up" or "set off" matters, and lets the card show them.
-- Empty for the EF word list, which is bare headwords.
-- ============================================================================
alter table lexicon_entries add column if not exists definition_en text not null default '';
