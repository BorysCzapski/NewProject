-- ============================================================================
-- supabase/seed/matura-es/08_tasks_czytanie.sql
-- Curated Spanish task bank (matura_tasks, source='curated') for "Rozumienie
-- tekstów pisanych": 2 tasks per poziom. Each task carries its own `passage`
-- (an ORIGINAL text written for this bank, not a reproduction of a published
-- arkusz or a copyrighted article) plus multiple_choice items.
--
-- Dobieranie nagłówków is modelled as multiple_choice with the SAME option
-- list repeated on every item — one item per paragraph — which is how the
-- generic renderer in components/matura/task-attempt-form.tsx already handles
-- matching, so it needs no new item type.
--
-- Idempotent: deletes existing Spanish curated tasks for this section first.
-- Run 01_sections.sql BEFORE this file.
-- ============================================================================

delete from matura_tasks
where source = 'curated'
  and section_id in (select id from matura_sections where language = 'es' and slug = 'czytanie');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 1: wybór wielokrotny
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst, a następnie wybierz poprawną odpowiedź na każde pytanie. Odpowiadaj wyłącznie na podstawie informacji zawartych w tekście.",
    "passage": "UNA SEMANA SIN MÓVIL\n\nEl mes pasado, mi instituto propuso un experimento: pasar siete días sin teléfono móvil. Al principio pensé que era una idea absurda y no quería participar. Al final me apunté porque mi mejor amiga insistió durante toda la semana anterior.\n\nLos dos primeros días fueron horribles. Me despertaba y buscaba el teléfono con la mano, aunque sabía perfectamente que estaba guardado en un cajón de la cocina. En clase no podía concentrarme, porque no dejaba de pensar en los mensajes que no estaba leyendo.\n\nSin embargo, a partir del miércoles algo cambió. Empecé a dormir mucho mejor y descubrí que tenía tiempo para cosas que había abandonado, como leer o salir a correr por las tardes. Lo que más me sorprendió fue que, al no mirar la pantalla durante la comida, hablaba bastante más con mis padres.\n\nCuando terminó la semana, recuperé el teléfono, pero no volví a usarlo como antes. Ahora lo dejo en otra habitación mientras estudio. No creo que sea necesario renunciar al móvil, aunque sí a la costumbre de tenerlo siempre en la mano.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "¿Por qué el autor decidió participar en el experimento?", "options": ["Porque le pareció una buena idea desde el principio.", "Porque su amiga lo convenció.", "Porque era obligatorio en su instituto."], "correctAnswers": ["Porque su amiga lo convenció."], "explanation": "Tekst mówi: „Al final me apunté porque mi mejor amiga insistió”. Pierwsza opcja jest wprost zaprzeczona („pensé que era una idea absurda”)." },
      { "id": "2", "type": "multiple_choice", "prompt": "¿Qué le resultaba más difícil durante los primeros días?", "options": ["Levantarse por la mañana.", "Dormir por la noche.", "Concentrarse en clase."], "correctAnswers": ["Concentrarse en clase."], "explanation": "„En clase no podía concentrarme”. Problemy ze snem pojawiają się dopiero jako POPRAWA od środy." },
      { "id": "3", "type": "multiple_choice", "prompt": "¿Qué fue lo que más sorprendió al autor?", "options": ["Que hablaba más con su familia.", "Que dormía peor que antes.", "Que sus amigos no lo echaban de menos."], "correctAnswers": ["Que hablaba más con su familia."], "explanation": "„Lo que más me sorprendió fue que… hablaba bastante más con mis padres”." },
      { "id": "4", "type": "multiple_choice", "prompt": "¿Cuál es la conclusión del autor?", "options": ["Hay que dejar el móvil definitivamente.", "El experimento no cambió nada.", "El problema no es el móvil, sino cómo se usa."], "correctAnswers": ["El problema no es el móvil, sino cómo se usa."], "explanation": "„No creo que sea necesario renunciar al móvil, aunque sí a la costumbre de tenerlo siempre en la mano”." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 2: dobieranie nagłówków do akapitów
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'podstawowa' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Dobierz do każdego akapitu (1–4) właściwy nagłówek. Każdy nagłówek pasuje tylko do jednego akapitu.",
    "passage": "TRABAJAR COMO GUÍA TURÍSTICO\n\n[1] Muchos jóvenes creen que este trabajo consiste en pasear por lugares bonitos y contar historias. La realidad incluye también jornadas de diez horas de pie, grupos que llegan tarde y visitantes que preguntan lo mismo cinco veces.\n\n[2] Para empezar no basta con hablar idiomas. En España hay que obtener una acreditación oficial, que se consigue tras un examen sobre historia, arte y legislación turística de la comunidad autónoma correspondiente.\n\n[3] El sueldo depende mucho de la temporada. Entre junio y septiembre se puede ganar bastante, pero en invierno hay semanas sin ningún grupo, así que conviene ahorrar durante los meses buenos.\n\n[4] A pesar de todo, quienes se dedican a esto suelen decir que no lo cambiarían por un despacho. Cada grupo es distinto y siempre se aprende algo nuevo de los propios visitantes.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "Akapit [1]", "options": ["Lo que hay que estudiar antes", "Un trabajo menos romántico de lo que parece", "Ingresos que cambian con el año", "Por qué merece la pena"], "correctAnswers": ["Un trabajo menos romántico de lo que parece"], "explanation": "Akapit zestawia wyobrażenie („pasear por lugares bonitos”) z rzeczywistością („diez horas de pie”)." },
      { "id": "2", "type": "multiple_choice", "prompt": "Akapit [2]", "options": ["Lo que hay que estudiar antes", "Un trabajo menos romántico de lo que parece", "Ingresos que cambian con el año", "Por qué merece la pena"], "correctAnswers": ["Lo que hay que estudiar antes"], "explanation": "Mowa o wymaganej akredytacji i egzaminie z historii, sztuki i przepisów." },
      { "id": "3", "type": "multiple_choice", "prompt": "Akapit [3]", "options": ["Lo que hay que estudiar antes", "Un trabajo menos romántico de lo que parece", "Ingresos que cambian con el año", "Por qué merece la pena"], "correctAnswers": ["Ingresos que cambian con el año"], "explanation": "„El sueldo depende mucho de la temporada” — zarobki zależne od sezonu." },
      { "id": "4", "type": "multiple_choice", "prompt": "Akapit [4]", "options": ["Lo que hay que estudiar antes", "Un trabajo menos romántico de lo que parece", "Ingresos que cambian con el año", "Por qué merece la pena"], "correctAnswers": ["Por qué merece la pena"], "explanation": "„No lo cambiarían por un despacho… siempre se aprende algo nuevo” — mimo wad warto." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 1: intencja autora i szczegóły
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Przeczytaj tekst, a następnie wybierz poprawną odpowiedź na każde pytanie. Odpowiadaj wyłącznie na podstawie informacji zawartych w tekście.",
    "passage": "EL DERECHO AL SILENCIO\n\nDurante años, el ruido se ha considerado un inconveniente menor de la vida urbana, algo que se soporta igual que se soporta el tráfico o el precio del alquiler. Los datos, sin embargo, apuntan en otra dirección: la Organización Mundial de la Salud sitúa la contaminación acústica entre los factores ambientales con mayor impacto sobre la salud en Europa, por detrás únicamente de la contaminación del aire.\n\nEl problema no reside solo en el volumen. Un ruido constante, aunque sea moderado, impide que el organismo entre en las fases profundas del sueño, y es precisamente en esas fases cuando se consolida la memoria. De ahí que los estudios realizados en colegios próximos a aeropuertos detecten un retraso medible en la comprensión lectora de los alumnos, incluso cuando estos afirman haberse acostumbrado al sonido de los aviones.\n\nAlgunas ciudades han empezado a reaccionar. París instaló radares capaces de multar a los vehículos especialmente ruidosos, y varios municipios españoles han delimitado zonas de protección acústica en sus centros históricos. Se trata, no obstante, de medidas aisladas, que rara vez se acompañan de un plan urbanístico más amplio.\n\nQuienes se oponen a estas políticas suelen alegar que perjudican a la hostelería y al ocio nocturno. El argumento no carece de fundamento, pero conviene recordar que el descanso de los residentes tampoco es un lujo prescindible. Encontrar el equilibrio exige algo que hasta ahora ha faltado: reconocer el silencio como un bien público, y no como una preferencia personal de quienes protestan.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "Según el texto, ¿qué lugar ocupa el ruido entre los factores ambientales que dañan la salud en Europa?", "options": ["El primero.", "El segundo, tras la contaminación del aire.", "El segundo, tras el tráfico."], "correctAnswers": ["El segundo, tras la contaminación del aire."], "explanation": "„…por detrás únicamente de la contaminación del aire”." },
      { "id": "2", "type": "multiple_choice", "prompt": "¿Por qué el ruido moderado también resulta perjudicial?", "options": ["Porque impide alcanzar el sueño profundo, en el que se consolida la memoria.", "Porque provoca pérdida de audición a largo plazo.", "Porque obliga a hablar más alto durante el día."], "correctAnswers": ["Porque impide alcanzar el sueño profundo, en el que se consolida la memoria."], "explanation": "Drugi akapit wprost łączy brak faz głębokiego snu z konsolidacją pamięci." },
      { "id": "3", "type": "multiple_choice", "prompt": "¿Qué demuestran los estudios realizados en colegios cercanos a aeropuertos?", "options": ["Que los alumnos dejan de oír los aviones con el tiempo.", "Que la comprensión lectora de los alumnos se resiente.", "Que los alumnos duermen menos horas que la media."], "correctAnswers": ["Que la comprensión lectora de los alumnos se resiente."], "explanation": "„…detecten un retraso medible en la comprensión lectora”. Przyzwyczajenie uczniów jest w tekście wspomniane po to, by je ZAKWESTIONOWAĆ („incluso cuando estos afirman”)." },
      { "id": "4", "type": "multiple_choice", "prompt": "¿Cómo valora el autor las medidas adoptadas por ciudades como París?", "options": ["Como una solución suficiente.", "Como iniciativas útiles pero fragmentarias.", "Como un error que perjudica a la hostelería."], "correctAnswers": ["Como iniciativas útiles pero fragmentarias."], "explanation": "„Se trata, no obstante, de medidas aisladas, que rara vez se acompañan de un plan urbanístico más amplio”." },
      { "id": "5", "type": "multiple_choice", "prompt": "¿Cuál es el propósito principal del autor?", "options": ["Informar sobre el funcionamiento de los radares de ruido.", "Defender que el silencio debería tratarse como un bien público.", "Criticar a los propietarios de bares y locales nocturnos."], "correctAnswers": ["Defender que el silencio debería tratarse como un bien público."], "explanation": "Cały tekst zmierza do ostatniego zdania: „reconocer el silencio como un bien público”. Autor przyznaje nawet rację branży gastronomicznej („el argumento no carece de fundamento”), więc jej nie krytykuje." }
    ]
  }
  $c$::jsonb,
  5, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 2: uzupełnianie luk zdaniami
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'es' and level = 'rozszerzona' and slug = 'czytanie'),
  $c$
  {
    "instructions": "Uzupełnij luki (1–4) w tekście, wybierając zdanie, które najlepiej pasuje w każde miejsce. Zwróć uwagę na spójniki i zaimki.",
    "passage": "LIBRERÍAS QUE SE NIEGAN A DESAPARECER\n\nHace quince años, casi nadie habría apostado por el futuro de las librerías independientes. La venta por internet ofrecía precios más bajos y una entrega inmediata, y muchos locales pequeños cerraron sin hacer ruido. ___1___\n\nLa explicación no está en el precio, porque en ese terreno la batalla estaba perdida de antemano. Está en algo que las plataformas digitales no han sabido reproducir: el consejo de alguien que ha leído el libro y conoce a quien lo compra. ___2___\n\nA ello se suma una transformación del propio local. La librería ha dejado de ser un simple punto de venta para convertirse en un espacio donde se organizan presentaciones, clubes de lectura y talleres. ___3___\n\nNada de esto garantiza la supervivencia del sector, que sigue operando con márgenes muy estrechos. ___4___ Pero demuestra que la desaparición que se daba por segura no era, después de todo, inevitable.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "Luka 1", "options": ["Sin embargo, la previsión no se ha cumplido del todo.", "Por ello, el precio sigue siendo el factor decisivo.", "Así, las grandes plataformas perdieron a sus clientes.", "En cambio, los lectores dejaron de comprar libros."], "correctAnswers": ["Sin embargo, la previsión no se ha cumplido del todo."], "explanation": "Po zapowiedzi upadku potrzebny jest kontrast otwierający resztę tekstu — i całe dalsze wywody tłumaczą, dlaczego prognoza się nie sprawdziła." },
      { "id": "2", "type": "multiple_choice", "prompt": "Luka 2", "options": ["Ese trato personal es difícil de sustituir por un algoritmo.", "Ese descuento resulta imposible de igualar.", "Esa entrega inmediata explica su éxito.", "Ese local acabó cerrando pocos meses después."], "correctAnswers": ["Ese trato personal es difícil de sustituir por un algoritmo."], "explanation": "Zaimek „ese” musi odnosić się do rzeczy wymienionej tuż przed luką — a była nią osobista rekomendacja księgarza." },
      { "id": "3", "type": "multiple_choice", "prompt": "Luka 3", "options": ["Quien entra a por un libro puede acabar quedándose dos horas.", "Quien entra a por un libro paga siempre menos que en internet.", "Por eso los talleres se trasladaron a las bibliotecas.", "Sin embargo, estos actos casi nunca atraen público."], "correctAnswers": ["Quien entra a por un libro puede acabar quedándose dos horas."], "explanation": "Zdanie rozwija myśl o księgarni jako przestrzeni, a nie punkcie sprzedaży. Opcja z „sin embargo” przeczyłaby poprzedniemu zdaniu bez powodu." },
      { "id": "4", "type": "multiple_choice", "prompt": "Luka 4", "options": ["Muchas dependen todavía de las ayudas públicas y del trabajo familiar.", "Todas ellas han multiplicado sus beneficios en los últimos años.", "Por eso ninguna organiza ya actividades culturales.", "De ahí que los lectores prefieran comprar en internet."], "correctAnswers": ["Muchas dependen todavía de las ayudas públicas y del trabajo familiar."], "explanation": "Zdanie musi rozwijać „márgenes muy estrechos”, a jednocześnie dać się skontrastować z „Pero demuestra…” w kolejnym zdaniu." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura — hiszpański"}'::jsonb
);
