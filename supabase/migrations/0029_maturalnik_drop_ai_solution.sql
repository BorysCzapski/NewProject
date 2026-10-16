-- ============================================================================
-- 0029_maturalnik_drop_ai_solution.sql
-- Drops the lazy-AI-solution column added in 0028_maturalnik.sql. The
-- feature never actually produced a cached solution (Groq retired both
-- vision models it depended on before this shipped — see lib/ai.ts), and the
-- student has the book's own step-by-step solutions anyway, so a
-- pay-as-you-go AI guess on top added cost without value. Safe to drop: no
-- row ever had a non-null ai_solution (checked before writing this file).
-- ============================================================================
alter table maturalnik_problems drop column if exists ai_solution;
