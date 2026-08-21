-- ============================================================================
-- supabase/seed/matura/08_tasks_czytanie.sql
-- Curated reading task bank (matura_tasks, source='curated') for "Rozumienie
-- tekstów pisanych": 3 tasks per poziom. Passages are ORIGINAL texts written
-- for this app (never copied from real CKE arkusze, which use copyrighted
-- authentic material) but modeled on real CKE task TYPES and topic register
-- researched from actual past arkusze. Matching/heading tasks are
-- represented as multiple_choice items (one per paragraph/gap, options =
-- the candidate headings/sentences) — reuses the same MaturaTaskContent
-- shape as środki językowe, no schema change needed.
--
-- Idempotent: deletes existing curated tasks for these sections first. Run
-- 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_tasks
where source = 'curated'
  and section_id in (select id from matura_sections where language = 'en' and slug = 'czytanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 1: wybór wielokrotny
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst. Do każdego pytania dopasuj właściwą odpowiedź (A, B, C lub D).",
    "passage": "When fifteen-year-old Amy Clarke noticed that her neighbourhood had no public library nearby, she decided to build one herself — a small wooden box on a post, filled with books that anyone could borrow for free.\n\nAmy built her first 'Little Free Library' in her front garden using old wood from her grandfather's shed. She painted it bright yellow and filled it with books she no longer needed. Within a week, neighbours started leaving their own books inside, and the little box was always full.\n\nWord spread quickly around town, and soon other families asked Amy to help them build similar boxes for their own streets. She now runs workshops at the local community centre, teaching other teenagers basic carpentry skills while explaining how to start their own tiny library.\n\nAmy says the most rewarding part isn't the building itself, but seeing young children choosing their first book from a box she made. She hopes that within a year, there will be a Little Free Library on every street in her town.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "Why did Amy decide to build a Little Free Library?", "options": ["A. She wanted to sell books.", "B. Her neighbourhood had no library nearby.", "C. Her school asked her to.", "D. She wanted to learn carpentry."], "correctAnswers": ["B. Her neighbourhood had no library nearby."], "explanation": "Pierwsze zdanie tekstu wprost podaje ten powód." },
      { "id": "2", "type": "multiple_choice", "prompt": "What did Amy use to build her first library box?", "options": ["A. New wood bought from a shop.", "B. Plastic materials.", "C. Old wood from her grandfather's shed.", "D. Bricks and cement."], "correctAnswers": ["C. Old wood from her grandfather's shed."], "explanation": "Drugi akapit wprost to podaje." },
      { "id": "3", "type": "multiple_choice", "prompt": "What does Amy do at the community centre?", "options": ["A. She sells her books.", "B. She teaches other teenagers carpentry skills.", "C. She reads to young children.", "D. She repairs old libraries."], "correctAnswers": ["B. She teaches other teenagers carpentry skills."], "explanation": "Trzeci akapit opisuje warsztaty stolarskie, które prowadzi Amy." },
      { "id": "4", "type": "multiple_choice", "prompt": "What does Amy find most rewarding?", "options": ["A. Painting the boxes bright colours.", "B. Being famous in her town.", "C. Seeing children choose their first book.", "D. Building boxes for money."], "correctAnswers": ["C. Seeing children choose their first book."], "explanation": "Ostatni akapit wprost to podaje." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 2: dopasowanie nagłówków do akapitów
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst podzielony na akapity A-D. Do każdego akapitu dopasuj pasujący nagłówek z listy. Jeden nagłówek nie pasuje do żadnego akapitu.",
    "passage": "A. Many teenagers get their first part-time job around the age of sixteen, often working in shops, cafés or as babysitters. For most young people, this is their very first experience of earning their own money and managing a work schedule alongside school.\n\nB. Before applying for any job, it is worth thinking about how many hours you can realistically work without your studies suffering. Most part-time jobs for students offer between five and ten hours a week, usually at weekends or after school.\n\nC. When you receive your first pay, it can be tempting to spend it all immediately. However, many financial experts suggest setting aside at least a small percentage of every pay cheque into a savings account, even if it is only a few pounds a week.\n\nD. Beyond the money, a part-time job teaches valuable skills that are hard to learn anywhere else — punctuality, communication with customers, and working as part of a team. These experiences often look impressive on a future CV, long after the job itself has ended.",
    "items": [
      { "id": "A", "type": "multiple_choice", "prompt": "Akapit A", "options": ["1. Choosing the right number of working hours", "2. The benefits that go beyond a pay cheque", "3. A common first step into the working world", "4. Learning to save money wisely", "5. How to write a good CV"], "correctAnswers": ["3. A common first step into the working world"], "explanation": "Akapit A opisuje pierwszą pracę jako typowe doświadczenie nastolatków." },
      { "id": "B", "type": "multiple_choice", "prompt": "Akapit B", "options": ["1. Choosing the right number of working hours", "2. The benefits that go beyond a pay cheque", "3. A common first step into the working world", "4. Learning to save money wisely", "5. How to write a good CV"], "correctAnswers": ["1. Choosing the right number of working hours"], "explanation": "Akapit B dotyczy liczby godzin pracy." },
      { "id": "C", "type": "multiple_choice", "prompt": "Akapit C", "options": ["1. Choosing the right number of working hours", "2. The benefits that go beyond a pay cheque", "3. A common first step into the working world", "4. Learning to save money wisely", "5. How to write a good CV"], "correctAnswers": ["4. Learning to save money wisely"], "explanation": "Akapit C dotyczy odkładania części wynagrodzenia." },
      { "id": "D", "type": "multiple_choice", "prompt": "Akapit D", "options": ["1. Choosing the right number of working hours", "2. The benefits that go beyond a pay cheque", "3. A common first step into the working world", "4. Learning to save money wisely", "5. How to write a good CV"], "correctAnswers": ["2. The benefits that go beyond a pay cheque"], "explanation": "Akapit D dotyczy umiejętności zdobywanych poza wynagrodzeniem. Nagłówek 5 (CV) to dystraktor — CV jest tylko wspomniane, nie jest tematem żadnego akapitu." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 3: prawda/fałsz
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst. Zdecyduj, czy poniższe zdania są zgodne (True) czy niezgodne (False) z treścią tekstu.",
    "passage": "Every year, St. Mary's Secondary School sends a group of twenty students to Germany as part of an exchange programme with a partner school in Munich. Students live with host families for two weeks, attend lessons at the German school, and take part in weekend trips organised by the teachers.\n\nThis year, for the first time, the programme is open to students from Year 10 as well as Year 11, meaning more pupils than ever applied to take part. Students who are chosen must write a short essay explaining why they want to join and attend an interview with the German teacher.\n\nMany former participants say the exchange completely changed their attitude towards learning languages, and several have stayed in contact with their host families for years afterwards. The school hopes to expand the programme to include a partner school in France next year.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "The exchange programme is with a school in Berlin.", "options": ["True", "False"], "correctAnswers": ["False"], "explanation": "Tekst mówi o Monachium (Munich), nie Berlinie." },
      { "id": "2", "type": "multiple_choice", "prompt": "Students stay with host families for two weeks.", "options": ["True", "False"], "correctAnswers": ["True"], "explanation": "Wprost podane w pierwszym akapicie." },
      { "id": "3", "type": "multiple_choice", "prompt": "This year, only Year 11 students could apply.", "options": ["True", "False"], "correctAnswers": ["False"], "explanation": "Tekst mówi, że w tym roku dołączył też rocznik 10." },
      { "id": "4", "type": "multiple_choice", "prompt": "Applicants must write an essay and attend an interview.", "options": ["True", "False"], "correctAnswers": ["True"], "explanation": "Wprost podane w drugim akapicie." },
      { "id": "5", "type": "multiple_choice", "prompt": "The school plans to add a partner school in France next year.", "options": ["True", "False"], "correctAnswers": ["True"], "explanation": "Wprost podane w ostatnim zdaniu." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 1: tekst z lukami zdaniowymi
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst, z którego usunięto cztery zdania. Do każdej luki [1]-[4] dopasuj właściwe zdanie z listy A-E. Jedno zdanie nie pasuje do żadnej luki.",
    "passage": "High above the rocky coastline of northern Scotland stands the Eilean Mor lighthouse, a structure whose eerie history has fascinated writers and historians for more than a century. Built in 1899 to warn ships away from the dangerous rocks surrounding the island, the lighthouse was operated by a rotating team of three keepers who took turns living in near-total isolation. [1]\n\nIn December 1900, a passing ship noticed that the lighthouse's light was not lit, an alarming sign given how reliable the keepers had always been. [2] When a relief boat finally managed to land days later due to rough seas, the crew discovered the lighthouse completely empty. The table was set for a meal, a chair had been knocked over, and the keepers' oilskin coats were still hanging by the door — yet all three men had vanished without a trace.\n\n[3] Some suggested the men had been swept away by an enormous wave while inspecting the equipment near the cliff edge; others proposed wilder theories involving foreign spies or even the supernatural. No bodies were ever found, and no storm severe enough to explain three simultaneous deaths was recorded in the area that week.\n\n[4] Today, the lighthouse still operates automatically, and the mystery of the three missing keepers remains one of the most enduring unsolved cases in British maritime history.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "Luka [1]", "options": ["A. The nearest mainland was over twenty miles away, making any emergency response extremely slow.", "B. Investigators at the time offered several competing explanations, none of which was ever proven.", "C. Despite decades of research, historians still disagree about what truly happened that winter.", "D. It would take several more days before anyone could reach the remote island to investigate.", "E. The keepers had recently requested additional supplies, expecting a long and difficult winter."], "correctAnswers": ["A. The nearest mainland was over twenty miles away, making any emergency response extremely slow."], "explanation": "Zdanie A logicznie rozwija myśl o izolacji strażników wspomnianą tuż przed luką." },
      { "id": "2", "type": "multiple_choice", "prompt": "Luka [2]", "options": ["A. The nearest mainland was over twenty miles away, making any emergency response extremely slow.", "B. Investigators at the time offered several competing explanations, none of which was ever proven.", "C. Despite decades of research, historians still disagree about what truly happened that winter.", "D. It would take several more days before anyone could reach the remote island to investigate.", "E. The keepers had recently requested additional supplies, expecting a long and difficult winter."], "correctAnswers": ["D. It would take several more days before anyone could reach the remote island to investigate."], "explanation": "Zdanie D naturalnie prowadzi do kolejnego zdania o łodzi ratunkowej, która dotarła dopiero po kilku dniach." },
      { "id": "3", "type": "multiple_choice", "prompt": "Luka [3]", "options": ["A. The nearest mainland was over twenty miles away, making any emergency response extremely slow.", "B. Investigators at the time offered several competing explanations, none of which was ever proven.", "C. Despite decades of research, historians still disagree about what truly happened that winter.", "D. It would take several more days before anyone could reach the remote island to investigate.", "E. The keepers had recently requested additional supplies, expecting a long and difficult winter."], "correctAnswers": ["B. Investigators at the time offered several competing explanations, none of which was ever proven."], "explanation": "Zdanie B wprowadza teorie wymienione zaraz po luce (fala, szpiedzy, zjawiska nadprzyrodzone)." },
      { "id": "4", "type": "multiple_choice", "prompt": "Luka [4]", "options": ["A. The nearest mainland was over twenty miles away, making any emergency response extremely slow.", "B. Investigators at the time offered several competing explanations, none of which was ever proven.", "C. Despite decades of research, historians still disagree about what truly happened that winter.", "D. It would take several more days before anyone could reach the remote island to investigate.", "E. The keepers had recently requested additional supplies, expecting a long and difficult winter."], "correctAnswers": ["C. Despite decades of research, historians still disagree about what truly happened that winter."], "explanation": "Zdanie C stanowi płynne przejście do ostatniego zdania zaczynającego się od 'Today'." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 2: dopasowanie pytań do fragmentów tekstu
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst podzielony na cztery fragmenty A-D. Do każdego pytania dopasuj fragment, w którym znajduje się odpowiedź.",
    "passage": "A. Over the past decade, keeping bees on city rooftops has grown from a niche hobby into a genuine urban movement, with hotels, office blocks and even government buildings installing hives above their top floors. Advocates argue that cities, surprisingly, can offer bees a more stable food supply than intensively farmed countryside, where a single crop often dominates for miles.\n\nB. Critics, however, warn that the trend has become a victim of its own popularity. In some cities, so many hives have been installed within a small area that local bee populations may now be competing for the same limited flowers, potentially harming both managed honeybees and wild native bee species that were there first.\n\nC. Setting up a rooftop hive is far from simple. Beekeepers must consider wind exposure, distance from neighbours who might be nervous about stinging insects, and local regulations, which vary enormously from one city to another and sometimes require special permits before a single hive can be installed.\n\nD. Despite the challenges, many beekeepers insist the rewards go beyond honey production. Employees at companies with rooftop hives often report a greater sense of connection to nature, and some businesses have found that hosting bee tours has become an unexpectedly popular addition to their public image.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "In which paragraph does the author mention a possible conflict between managed and wild bees?", "options": ["A", "B", "C", "D"], "correctAnswers": ["B"], "explanation": "Fragment B opisuje konkurencję o kwiaty między pszczołami hodowlanymi a dzikimi." },
      { "id": "2", "type": "multiple_choice", "prompt": "In which paragraph does the author mention permits required for installing hives?", "options": ["A", "B", "C", "D"], "correctAnswers": ["C"], "explanation": "Fragment C wspomina o pozwoleniach lokalnych." },
      { "id": "3", "type": "multiple_choice", "prompt": "In which paragraph does the author suggest cities might offer a better food supply than farmland?", "options": ["A", "B", "C", "D"], "correctAnswers": ["A"], "explanation": "Fragment A porównuje miasta do intensywnie uprawianej wsi." },
      { "id": "4", "type": "multiple_choice", "prompt": "In which paragraph does the author mention benefits unrelated to honey production?", "options": ["A", "B", "C", "D"], "correctAnswers": ["D"], "explanation": "Fragment D opisuje korzyści takie jak poczucie więzi z naturą i wizerunek firmy." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 3: wybór wielokrotny (wnioskowanie)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst. Do każdego pytania dopasuj właściwą odpowiedź (A, B, C lub D). Niektóre pytania wymagają wywnioskowania odpowiedzi z kontekstu.",
    "passage": "In a small town in western India, a newspaper called Musalman is still produced entirely by hand, exactly as it has been since 1927. Every single issue is written out in elegant Urdu calligraphy by a team of scribes, using pen and ink rather than any printing software, before being photographed and reproduced for print.\n\nThe tradition has survived nearly a century of enormous change in the media industry, largely thanks to a small, devoted team who see their work as preserving a disappearing art form rather than simply producing news. The head calligrapher has worked at the paper for over three decades and insists that no keyboard could ever replicate the personal character each scribe brings to a page.\n\nFinancially, the newspaper has always struggled, relying on a loyal but shrinking readership and occasional donations to stay afloat. Younger scribes are increasingly difficult to find, since the skill takes years to master and offers little financial security compared with other careers now available to young people in the region.\n\nEven so, the editor remains determined to continue the tradition for as long as possible, arguing that once a handwritten newspaper like this disappears, an entire craft and a particular way of seeing the world disappear along with it. For now, each morning, the scribes still take up their pens exactly as their predecessors did generations ago.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "What can be inferred about why the scribes continue this tradition?", "options": ["A. They believe it is faster than using computers.", "B. They see it as preserving a disappearing art form.", "C. They are required to by law.", "D. They are paid significantly more than typical journalists."], "correctAnswers": ["B. They see it as preserving a disappearing art form."], "explanation": "Drugi akapit wprost to sugeruje." },
      { "id": "2", "type": "multiple_choice", "prompt": "What is suggested about the newspaper's finances?", "options": ["A. It receives large government funding.", "B. It is very profitable.", "C. It struggles and depends partly on donations.", "D. It recently became free to produce."], "correctAnswers": ["C. It struggles and depends partly on donations."], "explanation": "Trzeci akapit wprost to podaje." },
      { "id": "3", "type": "multiple_choice", "prompt": "Why does the article suggest younger scribes are hard to find?", "options": ["A. The skill takes years to master with little financial reward.", "B. Young people are not interested in newspapers at all.", "C. The training is no longer offered anywhere.", "D. The pay is higher in other creative jobs."], "correctAnswers": ["A. The skill takes years to master with little financial reward."], "explanation": "Trzeci akapit wprost to podaje." },
      { "id": "4", "type": "multiple_choice", "prompt": "What does the editor believe would be lost if the newspaper stopped?", "options": ["A. Only the town's main source of local news.", "B. Nothing significant, since printing exists elsewhere.", "C. An entire craft and a particular way of seeing the world.", "D. Access to Urdu language education."], "correctAnswers": ["C. An entire craft and a particular way of seeing the world."], "explanation": "Ostatni akapit wprost cytuje tę opinię redaktora." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);
