-- ============================================================================
-- supabase/seed/matura/06_writing_tasks_rozszerzona.sql
-- Writing task bank (matura_writing_tasks) for poziom rozszerzony: rozprawka
-- za i przeciw, 200-250 words, 13 pts max. Tasks 1-3 use REAL CKE topics
-- (2023-2025 past arkusze, publicly reported by exam-coverage press —
-- Strefa Edukacji/Forsal). Task 4 is original, matching CKE's phrasing
-- style. Every model_answer is an ORIGINAL text authored for this app
-- (never a copied CKE model answer), written to satisfy the full-mark
-- pattern described in supabase/seed/matura/04_lessons_pisanie.sql.
--
-- Idempotent: deletes existing curated/past_exam tasks for this section
-- first. Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_writing_tasks
where section_id in (select id from matura_sections where level = 'rozszerzona' and slug = 'pisanie');

-- ----------------------------------------------------------------------------
-- Zadanie 1 (REAL, matura maj 2025): nauka wyłącznie zdalna na uczelniach
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'W dobie nowoczesnych technologii pojawił się pomysł, aby zajęcia na uczelniach odbywały się wyłącznie w trybie online. Napisz rozprawkę, w której przedstawisz dobre i złe strony tego rozwiązania.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za rozwiązaniem", "przedstaw i rozwiń co najmniej dwa argumenty przeciw rozwiązaniu", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'past_exam',
  '{"year": 2025, "session": "maj (termin główny)", "source_url": "https://cke.gov.pl"}'::jsonb,
  $m$In the digital age, the idea of universities offering classes exclusively online has become increasingly popular. This essay will consider both the benefits and the drawbacks of such a shift.

On the one hand, fully online education offers remarkable flexibility, since students can attend lectures from anywhere and organise their study time around part-time jobs or family commitments. In addition, universities could significantly reduce costs by eliminating the need for large lecture halls, savings which might eventually be passed on to students in the form of lower tuition fees.

On the other hand, this model has serious limitations. Firstly, many students struggle to stay motivated without the structure and social pressure of a physical classroom, which can lead to procrastination and, ultimately, poorer academic performance. Moreover, certain subjects, particularly those requiring laboratory work or hands-on practice, simply cannot be taught effectively through a screen, no matter how advanced the technology becomes.

Taking everything into consideration, I would argue that a hybrid model, combining the flexibility of online learning with the irreplaceable value of face-to-face interaction, would serve students far better than an exclusively online approach. While technology undoubtedly has a role to play in modern education, it should support rather than entirely replace traditional teaching methods.$m$,
  'Teza w akapicie 1 wprost zapowiada strukturę za i przeciw. Dwa argumenty za (elastyczność, niższe koszty) i dwa przeciw (motywacja, przedmioty praktyczne) rozwinięte mechanizmem/konsekwencją. Zakończenie proponuje wyważone rozwiązanie i parafrazuje tezę. Bogate łączniki formalne, strona bierna, brak kolokwializmów.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 2 (REAL, matura maj 2024): wolontariat podczas wakacji
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'Coraz więcej młodych ludzi decyduje się na pracę w charakterze wolontariusza podczas wakacji. Napisz rozprawkę, w której przedstawisz zalety i wady takiej decyzji.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za", "przedstaw i rozwiń co najmniej dwa argumenty przeciw", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'past_exam',
  '{"year": 2024, "session": "maj (termin główny)", "source_url": "https://cke.gov.pl"}'::jsonb,
  $m$An increasing number of young people are choosing to spend their summer holidays volunteering rather than simply relaxing. This essay will examine both the advantages and disadvantages of making such a decision.

To begin with, volunteering allows teenagers to develop valuable soft skills, such as teamwork and communication, which are highly regarded by future employers and rarely taught in a traditional classroom setting. What is more, dedicating time to helping others often gives young volunteers a genuine sense of purpose and can significantly boost their self-confidence.

However, this choice is not without its downsides. For one thing, an entire summer spent volunteering leaves little time for rest, and burnout among teenagers who never truly switch off from responsibilities is a growing concern. Furthermore, unlike a paid summer job, volunteering does not provide any financial income, which can be a real drawback for students hoping to save money for further education.

All things considered, I believe that volunteering can be an extremely rewarding experience, provided it is balanced with sufficient time to rest and, ideally, combined with some paid work. Ultimately, the decision should depend on each individual's personal circumstances and goals, rather than being treated as an obligation every teenager must fulfil.$m$,
  'Argumenty za (umiejętności miękkie, poczucie sensu) i przeciw (brak odpoczynku, brak dochodu) rozwinięte konsekwencją. Zakończenie wyważone, parafrazuje tezę. Formalne łączniki: To begin with, What is more, However, Furthermore, All things considered.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 3 (REAL, matura maj 2023): znane osoby w reklamach
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'Coraz więcej znanych osób, np. sportowców lub aktorów, decyduje się na udział w różnego rodzaju reklamach. Napisz rozprawkę, w której przedstawisz dobre i złe strony tego zjawiska.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za", "przedstaw i rozwiń co najmniej dwa argumenty przeciw", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'past_exam',
  '{"year": 2023, "session": "maj (termin główny)", "source_url": "https://cke.gov.pl"}'::jsonb,
  $m$Nowadays, it has become extremely common for celebrities, including athletes and actors, to appear in advertisements for various brands and products. This essay will discuss both the positive and negative aspects of this growing trend.

Firstly, when a well-known figure endorses a product, it typically boosts consumer trust and can significantly increase a company's sales, which in turn benefits the wider economy through job creation. Moreover, celebrities often use their advertising deals to support causes they genuinely care about, occasionally donating part of their earnings to charity.

Nevertheless, there are notable drawbacks to this practice. One major issue is that celebrities are sometimes paid enormous sums to promote products they have never actually used themselves, which can be considered a form of dishonesty towards consumers. In addition, impressionable young fans may be persuaded to buy items purely because their idol appears in the advert, regardless of whether the product genuinely suits their needs or budget.

Having weighed both sides of the argument, I would argue that celebrity endorsement is acceptable as long as it remains honest and transparent. Stricter regulations requiring public figures to disclose paid partnerships would go a long way towards protecting consumers. Ultimately, people should be encouraged to evaluate products based on their actual quality rather than simply trusting a famous face.$m$,
  'Argumenty za (zaufanie konsumentów, wsparcie dla fundacji) i przeciw (nieszczerość, wpływ na młodych fanów) rozwinięte przykładem/konsekwencją. Zakończenie z osobistą, wyważoną opinią. Zróżnicowane łączniki i strona bierna.'
);

-- ----------------------------------------------------------------------------
-- Zadanie 4 (curated): czterodniowy tydzień pracy
-- ----------------------------------------------------------------------------
insert into matura_writing_tasks
  (section_id, form_type, instructions, content_points, min_words, max_words, points_max, source, source_metadata, model_answer, model_answer_notes)
values (
  (select id from matura_sections where level = 'rozszerzona' and slug = 'pisanie'),
  'rozprawka_za_i_przeciw',
  'Niektóre firmy wprowadzają czterodniowy tydzień pracy. Napisz rozprawkę, w której rozważysz zalety i wady takiego rozwiązania.',
  '["we wstępie sformułuj tezę, która wprost zapowiada, że przedstawisz zalety i wady", "przedstaw i rozwiń co najmniej dwa argumenty za", "przedstaw i rozwiń co najmniej dwa argumenty przeciw", "w zakończeniu podsumuj i parafrazuj tezę"]'::jsonb,
  200, 250, 13, 'curated',
  '{"attribution": "Zespół Matura Angielski"}'::jsonb,
  $m$In recent years, a number of companies around the world have started experimenting with a four-day working week. This essay will explore both the benefits and the drawbacks of adopting such a model.

On the one hand, an extra day off allows employees to rest properly and spend more time with their families, which research has consistently linked to reduced stress levels and, somewhat surprisingly, higher productivity during the days they do work. In addition, companies that offer this benefit often find it easier to attract and retain talented staff in a highly competitive job market.

On the other hand, a shorter working week is not without significant challenges. To begin with, certain industries, particularly healthcare and emergency services, simply cannot afford to reduce staff availability without compromising public safety. Furthermore, some employees report that compressing the same workload into fewer days actually increases pressure and stress rather than reducing it.

Taking everything into account, I believe that a four-day working week could work well in specific sectors, but it is far from a universal solution. A gradual, well-monitored trial period would allow companies to identify potential issues before committing fully. Whether or not it ultimately succeeds depends on the nature of the job and how thoughtfully the transition is managed by employers.$m$,
  'Argumenty za (odpoczynek/produktywność, rekrutacja) i przeciw (sektory krytyczne, presja czasowa) rozwinięte. Zakończenie niejednoznaczne, ale uargumentowane. Bogate słownictwo: compromising public safety, compressing the workload.'
);
