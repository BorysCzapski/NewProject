-- ============================================================================
-- 0023_matura_task_types.sql
-- Tags every matura_tasks row with the CKE TASK TYPE it is an instance of, so
-- the app can stop serving a fixed numbered bank ("Zadanie 1..N", one-shot,
-- exhausted after four attempts) and start serving TYPES the student practises
-- repeatedly with fresh content each time. The catalog of types lives in
-- lib/matura/task-types.ts; this migration only stores which type a row is and
-- makes sure nothing can be inserted without one.
--
-- Wypowiedź pisemna needs no column here: matura_writing_tasks.form_type
-- already IS its task type. 0023 only widens what that column may hold —
-- rozszerzona's tekst argumentacyjny comes in three forms (rozprawka, artykuł,
-- list formalny), and only rozprawka existed before.
--
-- Backfill strategy: matura_tasks.content carries the Polish polecenie, and the
-- seeded polecenia are formulaic enough to classify exactly (verified against
-- all of supabase/seed/matura/ and supabase/seed/matura-es/ — every seeded task
-- lands on its correct type). The rules live in a FUNCTION rather than a
-- one-off UPDATE so that (a) the seeds, which delete and re-insert their rows
-- on every run, keep classifying correctly without duplicating the logic, and
-- (b) any future import path that forgets task_type still produces a usable
-- row. A BEFORE INSERT/UPDATE trigger applies it whenever task_type is null.
-- ============================================================================

alter table matura_tasks add column if not exists task_type text;

-- ----------------------------------------------------------------------------
-- matura_infer_task_type: maps (section, content) onto a task-type slug from
-- lib/matura/task-types.ts. Returns null for sections that do not use this
-- axis (pisanie) or an unknown section — the trigger then leaves task_type
-- null and the row simply never shows up in a type hub.
--
-- Rule order matters. Parafraza and odmiana czasownika both carry a
-- transformWord just like słowotwórstwo does, so they are matched by their
-- polecenie FIRST and the transformWord test is only the last resort.
-- ----------------------------------------------------------------------------
create or replace function matura_infer_task_type(p_section_id uuid, p_content jsonb)
returns text
language plpgsql
stable
as $fn$
declare
  v_section_slug text;
  v_polecenie text := coalesce(p_content ->> 'instructions', '');
  v_has_transform boolean;
  v_all_mc boolean;
begin
  select slug into v_section_slug from matura_sections where id = p_section_id;
  if v_section_slug is null then
    return null;
  end if;

  select
    coalesce(bool_or(item ? 'transformWord'), false),
    coalesce(bool_and(item ->> 'type' = 'multiple_choice'), false)
  into v_has_transform, v_all_mc
  from jsonb_array_elements(coalesce(p_content -> 'items', '[]'::jsonb)) as item;

  if v_section_slug = 'srodki-jezykowe' then
    if v_polecenie ilike '%znaczenie zdania%' then
      return 'parafraza';
    elsif v_polecenie ilike '%tłumacz%' then
      return 'tlumaczenie';
    elsif v_polecenie ilike '%przekształcając podane w nawiasach%' then
      return 'slowotworstwo';
    elsif v_polecenie ilike '%formą cza%' or v_polecenie ilike '%formą trybu%' then
      -- „poprawną formą czasownika" / „formą czasu przeszłego"
      return 'formy-czasownika';
    elsif v_has_transform then
      return 'slowotworstwo';
    elsif v_all_mc then
      return 'luki-wybor';
    else
      return 'luki-otwarte';
    end if;

  elsif v_section_slug = 'czytanie' then
    if v_polecenie ilike '%nagłów%' then
      return 'czytanie-dobieranie';
    elsif v_polecenie ilike '%zgodne%' or v_polecenie ilike '%prawda%' then
      return 'czytanie-prawda-falsz';
    elsif v_polecenie ilike '%dopasuj właściwe zdanie%'
       or v_polecenie ilike '%wybierając zdanie%'
       or v_polecenie ilike '%dopasuj fragment%' then
      return 'czytanie-dobieranie';
    elsif v_polecenie ilike '%dopasuj%' and v_polecenie not ilike '%dopasuj właściwą odpowiedź%' then
      return 'czytanie-dobieranie';
    else
      return 'czytanie-wybor';
    end if;

  elsif v_section_slug = 'sluchanie' then
    if v_polecenie ilike '%dopasuj%' and v_polecenie not ilike '%dopasuj właściwą odpowiedź%' then
      return 'sluchanie-dobieranie';
    else
      return 'sluchanie-wybor';
    end if;
  end if;

  -- 'pisanie' i wszystko inne: ta oś nie dotyczy.
  return null;
end;
$fn$;

create or replace function matura_tasks_set_task_type()
returns trigger
language plpgsql
as $fn$
begin
  if new.task_type is null then
    new.task_type := matura_infer_task_type(new.section_id, new.content);
  end if;
  return new;
end;
$fn$;

drop trigger if exists matura_tasks_task_type_trg on matura_tasks;
create trigger matura_tasks_task_type_trg
  before insert or update of section_id, content on matura_tasks
  for each row execute function matura_tasks_set_task_type();

-- Backfill rows that predate the trigger.
update matura_tasks
set task_type = matura_infer_task_type(section_id, content)
where task_type is null;

-- The type hubs read "every task of this type in this section, minus the ones
-- this student already did", so (section_id, task_type) is the hot path.
create index if not exists matura_tasks_section_type_idx on matura_tasks (section_id, task_type);

-- ----------------------------------------------------------------------------
-- Wypowiedź pisemna: allow the two other CKE tekst-argumentacyjny forms.
-- form_type is a plain text column with no check constraint (see
-- 0014_matura_writing.sql), so this is a comment-only widening — recorded here
-- because lib/types/database.ts MaturaWritingFormType changed with it.
-- ----------------------------------------------------------------------------
comment on column matura_writing_tasks.form_type is
  'email | blog_post | forum_post (podstawowa) | rozprawka_za_i_przeciw | artykul | list_formalny (rozszerzona). Katalog: lib/matura/task-types.ts MATURA_WRITING_TYPES.';

create index if not exists matura_writing_tasks_section_form_idx
  on matura_writing_tasks (section_id, form_type);
