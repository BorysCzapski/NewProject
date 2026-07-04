// ============================================================================
// lib/grammar/content/b2.ts
// Authored interactive lessons for B2 grammar topics, keyed by topic slug
// (must match grammar_topics.slug in supabase/seed/02_grammar_b2.sql).
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";

export const B2_LESSONS: Record<string, GrammarLesson> = {
  "mixed-conditionals": [
    {
      type: "intro",
      text:
        "Mixed Conditionals łączą drugi i trzeci tryb warunkowy, gdy warunek i skutek dotyczą różnych momentów w czasie. Najczęściej: nierealna przeszłość ma widoczny skutek dzisiaj — idealna konstrukcja do mówienia o żalu za dawnymi decyzjami.",
    },
    {
      type: "timeline",
      title: "Przeszły warunek → teraźniejszy skutek",
      markers: [
        {
          at: 15,
          label: "warunek (przeszłość)",
          example: {
            en: "If I had studied medicine...",
            pl: "Gdybym (wtedy) studiował medycynę...",
          },
        },
        {
          at: 50,
          label: "skutek (teraz)",
          example: {
            en: "...I would be a doctor now.",
            pl: "...byłbym teraz lekarzem.",
          },
        },
      ],
      caption:
        "Decyzja zapadła (albo nie) w przeszłości, ale jej konsekwencje widzimy dzisiaj — dlatego czasy w obu częściach zdania są różne.",
    },
    {
      type: "formula",
      title: "Dwa typy zdań mieszanych",
      variants: [
        {
          label: "Przeszłość → teraz",
          parts: [
            { text: "If", role: "other" },
            { text: "I", role: "subject" },
            {
              text: "had taken",
              role: "verb",
              note: "Past Perfect — warunek dotyczy przeszłości (jak w 3. trybie)",
            },
            { text: "that job,", role: "object" },
            { text: "I", role: "subject" },
            {
              text: "would",
              role: "aux",
              note: "would + bezokolicznik BEZ have — skutek jest teraz (jak w 2. trybie)",
            },
            { text: "live", role: "verb" },
            { text: "in London now", role: "object" },
          ],
          example: {
            en: "If I had taken that job, I would live in London now.",
            pl: "Gdybym przyjął tamtą pracę, mieszkałbym teraz w Londynie.",
          },
        },
        {
          label: "Teraz → przeszłość",
          parts: [
            { text: "If", role: "other" },
            { text: "he", role: "subject" },
            {
              text: "weren't",
              role: "verb",
              note: "Past Simple — stała cecha/sytuacja teraźniejsza (were dla wszystkich osób)",
            },
            { text: "so shy,", role: "object" },
            { text: "he", role: "subject" },
            {
              text: "would have",
              role: "aux",
              note: "would have + III forma — skutek (nie) wydarzył się w przeszłości",
            },
            { text: "asked", role: "verb" },
            { text: "her out", role: "object" },
          ],
          example: {
            en: "If he weren't so shy, he would have asked her out.",
            pl: "Gdyby nie był taki nieśmiały, zaprosiłby ją (wtedy) na randkę.",
          },
        },
      ],
      caption:
        "Klucz: zapytaj siebie — KIEDY dzieje się warunek, a KIEDY skutek? Każda część zdania dostaje czas pasujący do swojego momentu.",
    },
    {
      type: "compare",
      title: "Third Conditional vs Mixed Conditional",
      columns: [
        {
          title: "Third Conditional",
          formula: "If + Past Perfect, would have + III forma",
          whenToUse: "Obie części dotyczą przeszłości — sprawa zamknięta.",
          examples: [
            "If I had studied harder, I would have passed the exam.",
            "If we had left earlier, we wouldn't have missed the train.",
          ],
        },
        {
          title: "Mixed Conditional",
          formula: "If + Past Perfect, would + bezokolicznik",
          whenToUse:
            "Warunek w przeszłości, ale skutek widoczny TERAZ (często z \"now\", \"today\").",
          examples: [
            "If I had studied harder, I would have a better job now.",
            "If we hadn't lost our jobs, we would be on holiday right now.",
          ],
        },
      ],
    },
    {
      type: "examples",
      title: "Mixed Conditionals w akcji",
      items: [
        {
          en: "If I hadn't missed the flight, I would be at the conference right now.",
          pl: "Gdybym nie spóźnił się na samolot, byłbym teraz na konferencji.",
          highlight: "would be",
        },
        {
          en: "If she had saved money when she was young, she would be rich now.",
          pl: "Gdyby odkładała pieniądze za młodu, byłaby teraz bogata.",
          highlight: "had saved",
        },
        {
          en: "If I were more patient, I wouldn't have shouted at him yesterday.",
          pl: "Gdybym był bardziej cierpliwy, nie nakrzyczałbym na niego wczoraj.",
          highlight: "wouldn't have shouted",
        },
        {
          en: "Would you be happier now if you hadn't moved abroad?",
          pl: "Byłbyś teraz szczęśliwszy, gdybyś nie wyjechał za granicę?",
          highlight: "hadn't moved",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Typowy błąd: automatyczne "would have" po każdym "if + had". Jeśli skutek dotyczy TERAZ, "have" znika: "If he had taken that job, he would live (NIE: would have lived) in New York now." Słowa "now", "today", "still" to sygnał, że potrzebujesz zdania mieszanego.',
    },
    {
      type: "quiz",
      question:
        "If I ___ money last year, I would have a new car now.",
      options: ["saved", "had saved", "would save"],
      correctIndex: 1,
      explanation:
        'Warunek dotyczy przeszłości (last year), więc po "if" stoi Past Perfect: had saved. Skutek jest teraźniejszy, dlatego dalej mamy "would have" (mieć), a nie "would have had".',
    },
  ],

  "passive-voice-advanced": [
    {
      type: "intro",
      text:
        "Na poziomie B2 strona bierna to znacznie więcej niż \"is made\" i \"was built\". Poznasz ją z czasownikami modalnymi, w czasach perfect, w konstrukcjach typu \"It is said that...\" oraz w bardzo praktycznym \"have something done\".",
    },
    {
      type: "formula",
      title: "Od strony czynnej do biernej",
      variants: [
        {
          label: "Strona czynna",
          parts: [
            { text: "They", role: "subject", note: "wykonawca — często nieistotny" },
            { text: "must", role: "aux" },
            { text: "finish", role: "verb" },
            { text: "the report", role: "object" },
          ],
          example: {
            en: "They must finish the report by Friday.",
            pl: "Muszą skończyć raport do piątku.",
          },
        },
        {
          label: "Bierna z modalem",
          parts: [
            { text: "The report", role: "subject", note: "dawne dopełnienie zostaje podmiotem" },
            { text: "must", role: "aux", note: "modal się nie zmienia" },
            { text: "be", role: "aux", note: "po modalu zawsze gołe \"be\"" },
            { text: "finished", role: "verb", note: "Past Participle (III forma)" },
            { text: "by Friday", role: "object" },
          ],
          example: {
            en: "The report must be finished by Friday.",
            pl: "Raport musi być skończony do piątku.",
          },
        },
        {
          label: "It is said that...",
          parts: [
            { text: "He", role: "subject" },
            { text: "is", role: "aux" },
            {
              text: "said",
              role: "verb",
              note: "też: believed, known, thought, expected, reported",
            },
            {
              text: "to be",
              role: "other",
              note: "dalej bezokolicznik — \"to be\", \"to have been\"",
            },
            { text: "very rich", role: "object" },
          ],
          example: {
            en: "He is said to be very rich.",
            pl: "Mówi się, że jest bardzo bogaty.",
          },
        },
      ],
      caption:
        "Przepis jest zawsze ten sam: określ czas zdania wyjściowego, dobierz formę \"be\", dodaj Past Participle.",
    },
    {
      type: "table",
      title: "Strona bierna w czasach złożonych",
      headers: ["Czas", "Wzór", "Przykład"],
      rows: [
        ["Present Perfect", "has/have been + III", "The documents have been signed."],
        ["Past Perfect", "had been + III", "The house had been sold before we arrived."],
        ["Present Continuous", "is/are being + III", "New regulations are being introduced."],
        ["Modal", "modal + be + III", "This problem can be solved easily."],
      ],
    },
    {
      type: "compare",
      title: "Dwa dopełnienia — dwie strony bierne",
      columns: [
        {
          title: "Osoba jako podmiot",
          formula: "She was given a prize.",
          whenToUse:
            "Częstsza i naturalniejsza wersja — zaczynamy od odbiorcy (give, send, show, tell, offer).",
          examples: [
            "Mary was given an award.",
            "I was told the truth only yesterday.",
          ],
        },
        {
          title: "Rzecz jako podmiot",
          formula: "A prize was given to her.",
          whenToUse:
            "Gdy chcemy podkreślić samą rzecz; odbiorca pojawia się po \"to\".",
          examples: [
            "An award was given to Mary.",
            "The documents were sent to the client.",
          ],
        },
      ],
    },
    {
      type: "examples",
      title: "Zaawansowana strona bierna w praktyce",
      items: [
        {
          en: "There is a lot of work to be done before the deadline.",
          pl: "Jest mnóstwo pracy do zrobienia przed terminem.",
          highlight: "to be done",
        },
        {
          en: "The treasure is believed to be hidden somewhere on the island.",
          pl: "Uważa się, że skarb jest ukryty gdzieś na wyspie.",
          highlight: "is believed to be",
        },
        {
          en: "I had my car repaired yesterday.",
          pl: "Wczoraj oddałem samochód do naprawy (ktoś mi go naprawił).",
          highlight: "had my car repaired",
        },
        {
          en: "The company is believed to be losing money.",
          pl: "Uważa się, że firma traci pieniądze.",
          highlight: "is believed to be losing",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Uwaga na "have something done": "I had my hair cut" znaczy, że fryzjer mnie obciął — NIE "I cut my hair" (sam się obciąłem). Polacy często gubią też "be" po modalu: poprawnie jest "must be sent", nigdy "must sent" ani "must be send".',
    },
    {
      type: "quiz",
      question: 'Active: "People say that he is a brilliant scientist." Wybierz poprawną stronę bierną:',
      options: [
        "He is said to be a brilliant scientist.",
        "He is saying to be a brilliant scientist.",
        "It says that he is a brilliant scientist.",
      ],
      correctIndex: 0,
      explanation:
        'Konstrukcja osobowa: podmiot + is said/believed/known + to + bezokolicznik. "He is said to be..." = "Mówi się, że on jest...".',
    },
  ],

  "wish-if-only": [
    {
      type: "intro",
      text:
        "\"I wish\" i \"if only\" to sposób na wyrażenie żalu i marzeń o rzeczach, których nie możemy (lub nie mogliśmy) zmienić. \"If only\" znaczy to samo co \"wish\", ale jest mocniejsze i bardziej emocjonalne.",
    },
    {
      type: "timeline",
      title: "Czego żałujesz: teraz czy w przeszłości?",
      markers: [
        {
          at: 15,
          label: "żal o przeszłość → Past Perfect",
          example: {
            en: "I wish I had studied harder.",
            pl: "Żałuję, że nie uczyłem się pilniej (wtedy).",
          },
        },
        {
          at: 50,
          label: "żal o teraźniejszość → Past Simple",
          example: {
            en: "I wish I had more free time.",
            pl: "Żałuję, że nie mam (teraz) więcej wolnego czasu.",
          },
        },
        {
          at: 70,
          label: "chęć zmiany → would",
          example: {
            en: "I wish it would stop raining.",
            pl: "Chciałbym, żeby (wreszcie) przestało padać.",
          },
        },
      ],
      caption:
        "Po \"wish\" cofamy czas o jeden krok: teraźniejszość → Past Simple, przeszłość → Past Perfect.",
    },
    {
      type: "compare",
      title: "Trzy konstrukcje z wish",
      columns: [
        {
          title: "wish + Past Simple",
          formula: "I wish I knew...",
          whenToUse:
            "Żal o sytuację TERAZ. Z \"to be\" używamy \"were\" dla wszystkich osób.",
          examples: [
            "I wish I had more free time.",
            "If only I were taller.",
            "I wish she were here with us.",
          ],
        },
        {
          title: "wish + Past Perfect",
          formula: "I wish I had done...",
          whenToUse: "Żal o coś, co (nie) wydarzyło się w PRZESZŁOŚCI.",
          examples: [
            "I wish I had studied harder for the exam.",
            "If only I hadn't said that to her!",
          ],
        },
        {
          title: "wish + would",
          formula: "I wish you would stop...",
          whenToUse:
            "Irytacja cudzym zachowaniem lub chęć zmiany w przyszłości. NIGDY o sobie samym.",
          examples: [
            "I wish you would stop interrupting me.",
            "I wish it would stop raining.",
          ],
        },
      ],
    },
    {
      type: "examples",
      title: "Wish i if only w praktyce",
      items: [
        {
          en: "I wish I knew the answer to this question.",
          pl: "Szkoda, że nie znam odpowiedzi na to pytanie.",
          highlight: "knew",
        },
        {
          en: "If only I hadn't eaten so much cake last night!",
          pl: "Gdybym tylko nie zjadł wczoraj tyle ciasta!",
          highlight: "hadn't eaten",
        },
        {
          en: "She wishes she were on holiday instead of sitting in this meeting.",
          pl: "Wolałaby być na wakacjach zamiast siedzieć na tym zebraniu.",
          highlight: "were",
        },
        {
          en: "I wish my neighbour would stop playing loud music every night.",
          pl: "Chciałbym, żeby sąsiad przestał co noc puszczać głośną muzykę.",
          highlight: "would stop",
        },
      ],
    },
    {
      type: "compare",
      title: "hope czy wish?",
      columns: [
        {
          title: "hope",
          formula: "I hope you pass the exam.",
          whenToUse: "Sytuacje realne i możliwe — zwykły czas teraźniejszy lub przyszły.",
          examples: ["I hope you pass the exam.", "I hope it doesn't rain tomorrow."],
        },
        {
          title: "wish",
          formula: "I wish I had passed the exam.",
          whenToUse: "Sytuacje nierealne albo żal — czas cofnięty o krok.",
          examples: ["I wish I had passed the exam.", "I wish I spoke Japanese."],
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie mów "I wish I would be taller" — konstrukcji "wish + would" NIE używamy o sobie. O sobie zawsze: "I wish I were taller" (teraz) albo "I wish I had been taller" (w przeszłości). "Would" zostaw na narzekanie na innych i na pogodę.',
    },
    {
      type: "quiz",
      question:
        "Kolega żałuje, że wczoraj nie zadzwonił do babci. Które zdanie to wyraża?",
      options: [
        "I wish I called my grandmother yesterday.",
        "I wish I had called my grandmother yesterday.",
        "I wish I would call my grandmother yesterday.",
      ],
      correctIndex: 1,
      explanation:
        "Żal o przeszłość = wish + Past Perfect: \"I wish I had called...\". Past Simple po wish odnosi się do teraźniejszości, a \"would\" nie łączy się z \"I wish I...\".",
    },
  ],

  inversion: [
    {
      type: "intro",
      text:
        "Inwersja to odwrócenie zwykłego szyku zdania: zamiast podmiot + czasownik mamy czasownik posiłkowy + podmiot, jak w pytaniu. Używamy jej w formalnym i literackim angielskim, żeby nadać zdaniu emfazę i dramatyzm.",
    },
    {
      type: "formula",
      title: "Zwykły szyk vs inwersja",
      variants: [
        {
          label: "Zwykły szyk",
          parts: [
            { text: "I", role: "subject" },
            { text: "have", role: "aux" },
            { text: "never", role: "other", note: "przysłówek w środku zdania — bez inwersji" },
            { text: "seen", role: "verb" },
            { text: "such a sunset", role: "object" },
          ],
          example: {
            en: "I have never seen such a beautiful sunset.",
            pl: "Nigdy nie widziałem tak pięknego zachodu słońca.",
          },
        },
        {
          label: "Po Never / Rarely",
          parts: [
            {
              text: "Never",
              role: "other",
              note: "słowo negatywne na początku wymusza inwersję",
            },
            {
              text: "have",
              role: "aux",
              note: "czasownik posiłkowy PRZED podmiotem — jak w pytaniu",
            },
            { text: "I", role: "subject" },
            { text: "seen", role: "verb" },
            { text: "such a sunset", role: "object" },
          ],
          example: {
            en: "Never have I seen such a beautiful sunset.",
            pl: "Nigdy (przenigdy) nie widziałem tak pięknego zachodu słońca.",
          },
        },
        {
          label: "Bez posiłkowego → dodaj do/did",
          parts: [
            { text: "Rarely", role: "other" },
            {
              text: "does",
              role: "aux",
              note: "brak posiłkowego w zdaniu? Wstaw do/does/did jak w pytaniu",
            },
            { text: "he", role: "subject" },
            { text: "complain", role: "verb", note: "czasownik wraca do formy podstawowej" },
            { text: "about his job", role: "object" },
          ],
          example: {
            en: "Rarely does he complain about his job.",
            pl: "Rzadko kiedy narzeka na swoją pracę.",
          },
        },
      ],
      caption:
        "Inwersja zawsze potrzebuje czasownika posiłkowego (have, be, modal albo do/does/did) — dokładnie jak pytanie.",
    },
    {
      type: "table",
      title: "Wyrażenia wymuszające inwersję",
      headers: ["Wyrażenie", "Przykład", "Uwaga"],
      rows: [
        ["Never / Rarely / Seldom", "Never have I seen such chaos.", "emfaza, dramatyzm"],
        ["Hardly ... when", "Hardly had I arrived when the phone rang.", "z Past Perfect"],
        ["No sooner ... than", "No sooner had she sat down than the meeting started.", "z Past Perfect"],
        ["Not only ... but also", "Not only did he forget her birthday, but he also lost her present.", "inwersja w 1. części"],
        ["Little", "Little did he know that his life was about to change.", "= prawie wcale"],
        ["So / Such ...", "So tired was she that she fell asleep at her desk.", "intensywność"],
      ],
    },
    {
      type: "examples",
      title: "Inwersja w zdaniach warunkowych i opisach",
      items: [
        {
          en: "Should you have any questions, please contact us.",
          pl: "Gdyby mieli Państwo jakieś pytania, prosimy o kontakt.",
          highlight: "Should you have",
        },
        {
          en: "Had I known about the problem, I would have helped you.",
          pl: "Gdybym wiedział o problemie, pomógłbym ci.",
          highlight: "Had I known",
        },
        {
          en: "Down the street came a strange figure.",
          pl: "Ulicą nadchodziła dziwna postać.",
          highlight: "came a strange figure",
        },
        {
          en: "Here comes the bus!",
          pl: "O, jedzie autobus!",
          highlight: "Here comes",
        },
      ],
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Typowy błąd: "Not only he was late..." — po wyrażeniu negatywnym na początku zdania inwersja jest OBOWIĄZKOWA: "Not only was he late...". Ale uwaga: gdy never/rarely stoi w środku zdania, szyk zostaje zwykły: "He rarely complains" (bez does!).',
    },
    {
      type: "quiz",
      question: "Hardly ___ down when the fire alarm went off.",
      options: ["we had sat", "had we sat", "we sat"],
      correctIndex: 1,
      explanation:
        '"Hardly" na początku zdania wymusza inwersję z Past Perfect: Hardly + had + podmiot + III forma... when. Stąd: "Hardly had we sat down when...".',
    },
  ],

  "modals-past": [
    {
      type: "intro",
      text:
        "Konstrukcja modal + have + III forma pozwala mówić o przeszłości: snuć domysły (must have, might have), krytykować i żałować (should have) oraz wskazywać niewykorzystane możliwości (could have). To jeden z ulubionych tematów egzaminu FCE.",
    },
    {
      type: "timeline",
      title: "Wniosek TERAZ o tym, co stało się WCZEŚNIEJ",
      markers: [
        {
          at: 20,
          label: "zdarzenie (przeszłość)",
          example: {
            en: "It rained last night.",
            pl: "W nocy padało.",
          },
        },
        {
          at: 50,
          label: "dowód i wniosek (teraz)",
          example: {
            en: "The ground is wet — it must have rained.",
            pl: "Ziemia jest mokra — musiało padać.",
          },
        },
      ],
      caption:
        "Modal opisuje twoją dzisiejszą pewność lub opinię, a \"have + III forma\" przenosi zdarzenie w przeszłość.",
    },
    {
      type: "formula",
      title: "Budowa: modal + have + Past Participle",
      variants: [
        {
          label: "Przypuszczenie",
          parts: [
            { text: "They", role: "subject" },
            {
              text: "must",
              role: "aux",
              note: "must = jestem prawie pewien, że TAK; can't = jestem prawie pewien, że NIE",
            },
            { text: "have", role: "aux", note: "zawsze \"have\" — nigdy \"has\" ani \"had\"" },
            { text: "left", role: "verb", note: "Past Participle (III forma)" },
            { text: "already", role: "other" },
          ],
          example: {
            en: "The lights are off — they must have left already.",
            pl: "Światła zgaszone — musieli już wyjść.",
          },
        },
        {
          label: "Krytyka / żal",
          parts: [
            { text: "You", role: "subject" },
            {
              text: "should",
              role: "aux",
              note: "should have = trzeba było; shouldn't have = niepotrzebnie to zrobiłeś",
            },
            { text: "have", role: "aux" },
            { text: "told", role: "verb" },
            { text: "me", role: "object" },
          ],
          example: {
            en: "You should have told me about the change of plans.",
            pl: "Powinieneś był mi powiedzieć o zmianie planów.",
          },
        },
        {
          label: "Niewykorzystana szansa",
          parts: [
            { text: "You", role: "subject" },
            {
              text: "could",
              role: "aux",
              note: "could have = możliwość istniała, ale z niej nie skorzystano",
            },
            { text: "have", role: "aux" },
            { text: "called", role: "verb" },
            { text: "me", role: "object" },
          ],
          example: {
            en: "You could have called me if you needed help.",
            pl: "Mogłeś do mnie zadzwonić, gdybyś potrzebował pomocy.",
          },
        },
      ],
    },
    {
      type: "compare",
      title: "must have / can't have / might have — skala pewności",
      columns: [
        {
          title: "must have",
          formula: "must have + III",
          whenToUse: "Prawie 100% pewności, że coś SIĘ wydarzyło (mam dowody).",
          examples: ["He must have worked all night — he looks exhausted."],
        },
        {
          title: "can't have",
          formula: "can't/couldn't have + III",
          whenToUse: "Prawie 100% pewności, że coś się NIE wydarzyło.",
          examples: ["She can't have finished already — it's only been five minutes."],
        },
        {
          title: "might have",
          formula: "may/might have + III",
          whenToUse: "Być może — tylko przypuszczenie, brak pewności.",
          examples: ["He might have missed the train, that's why he's late."],
        },
      ],
    },
    {
      type: "table",
      title: "Ściąga: znaczenia modali w przeszłości",
      headers: ["Konstrukcja", "Znaczenie", "Przykład"],
      rows: [
        ["should have + III", "trzeba było (a nie zrobiono)", "I should have called you earlier."],
        ["shouldn't have + III", "zrobiono, choć nie należało", "I shouldn't have eaten so much."],
        ["could have + III", "była możliwość, niewykorzystana", "We could have won the match."],
        ["needn't have + III", "zrobiono niepotrzebnie", "You needn't have brought an umbrella."],
      ],
      caption:
        "needn't have done = zrobiłeś to niepotrzebnie; didn't need to do = nie było konieczne (i nie wiadomo, czy zrobiłeś).",
    },
    {
      type: "tip",
      variant: "warning",
      text:
        'Nie myl "must have" z "should have": "He must have left" = na pewno wyszedł (wniosek z dowodów), "He should have left" = powinien był wyjść, ale tego nie zrobił (krytyka). I pamiętaj: po modalu zawsze "have", nawet w 3. osobie — "she must have gone", nigdy "she must has gone".',
    },
    {
      type: "quiz",
      question:
        "Kupiliśmy za dużo jedzenia i połowa się zmarnowała. Co powiesz?",
      options: [
        "We mustn't have bought so much food.",
        "We needn't have bought so much food.",
        "We couldn't have bought so much food.",
      ],
      correctIndex: 1,
      explanation:
        '"Needn\'t have bought" = kupiliśmy, choć nie było to potrzebne — dokładnie ta sytuacja. "Mustn\'t have" nie istnieje w znaczeniu przeszłej dedukcji, a "couldn\'t have bought" znaczyłoby, że zakup był niemożliwy.',
    },
  ],
};
