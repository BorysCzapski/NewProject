// ============================================================================
// lib/matura/listening-pool.ts
// Curated pool of REAL, publicly available YouTube recordings that
// lib/matura/generate-listening-task.ts draws from to build "rozumienie ze
// słuchu" tasks. This is the one piece of the matura content pipeline a
// human still supplies — not because an administrator writes the TASKS
// (they don't; the AI does, grounded in the recording's real transcript),
// but because the model cannot invent an audio recording. Every entry below
// was verified by actually fetching its transcript (the same
// lib/listening/fetch-transcript.ts strategies the app uses at runtime)
// before being added here — a made-up id would just make every task drawn
// from it silently fail to generate. Entries whose captions turned out to be
// disabled, or whose transcript was too thin (<~1000 characters) to
// responsibly ground a multi-question task, were left out.
//
// Picking from this pool (and tracking which ids a section has already used)
// happens in lib/matura/generate-listening-task.ts, not here — this file is
// pure data.
// ============================================================================
import type { MaturaLanguage, MaturaLevel } from "@/lib/types/database";

export interface ListeningPoolEntry {
  videoId: string;
  /** For our own reference when curating — never shown to the student. */
  title: string;
  attribution: string;
}

const EN_PODSTAWOWA: ListeningPoolEntry[] = [
  { videoId: "KkrhHUeMjIU", title: "Are you addicted to your smartphone?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "j2PdEQpu5js", title: "Why you need a good night's sleep", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "yz0oYPfON2g", title: "Can climate change affect our mental health?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "5ZQ65RbsAB8", title: "Young women on social media", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "g8q-Nq-ajx8", title: "Social media and teenage health", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "JaGXfJBx0BM", title: "Rage bait: How online anger makes money", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "xGhbhWUqL-w", title: "The art of conversation", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "4KcXgXgSxDI", title: "Becoming a musician", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "9ifQ3xRz4hM", title: "Learning multiple languages", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "QdE63sYqwd8", title: "Why are we all so stressed?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "u5TITb4P2Mg", title: "What English phrases really mean", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "YAsDeXcYyTg", title: "Scared to speak English?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "Ty3J0XGNpHg", title: "Finding and eating wild food", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "5kr5ADrMeYU", title: "Learning a new food culture", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "vxoPApiNZBU", title: "Rude emails", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "D9jZMLm72a8", title: "Who does the housework?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "h_pvijqmolQ", title: "Why read books, not screens?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "7F1iJZr-p4E", title: "Are you drinking enough water?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "Xbv4IIqwW-4", title: "Which country has the best schools?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "oJmr5d6qn3U", title: "The teenage brain", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "we4KiShNjlA", title: "Improving your memory", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "sm6EtQg-hxw", title: "Meditation and your brain", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "_PIlvBI9rXY", title: "How reading shapes your brain", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "FZDImEiPgMk", title: "Feed your brain", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "p0SUyXLS-ME", title: "Dancing for the brain", attribution: "BBC Learning English — 6 Minute English" },
];

const EN_ROZSZERZONA: ListeningPoolEntry[] = [
  { videoId: "uhfVT5iAtMM", title: "How can I help the environment?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "iMcP-ZydB6s", title: "Is social media dead?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "3IWtnBniKF4", title: "Earth 'pushed beyond its limit', UN warns", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "ngx5g7CwiaM", title: "Women secretly filmed with new tech", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "RImcqAT3m2M", title: "Huge power cuts in Spain and Portugal", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "wZdtCJW0kA0", title: "A third of adults are inactive", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "M4wfS8qqPbI", title: "Trump's tariffs", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "y3dttOboMnE", title: "Octopuses and fish work together", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "8ysrKxRDsLg", title: "Human consciousness: where is it in the brain?", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "vHM8sdoJdoY", title: "2025: the year's big news stories", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "Zhv5QsyrkNA", title: "Earth's climate defences are failing", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "uzcn05nVqvU", title: "DeepSeek: Chinese AI app shocks tech world", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "2FZEznNC-Fs", title: "Is social media 'the new smoking'?", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "OTwexuyafvw", title: "7,000 steps can reduce risk of depression", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "wMQjmpVgor8", title: "How can we make the web a better place?", attribution: "BBC Learning English — 6 Minute English" },
  { videoId: "X0MU_hP4RF0", title: "SpaceX splash down", attribution: "BBC Learning English — News Review" },
  { videoId: "aLr--T6FBLc", title: "Fifa World Cup excitement and concern", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "UWwpe7cHxXw", title: "US and Iran to sign peace deal", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "AtFbr0bh394", title: "Keir Starmer resigns as UK Prime Minister", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "MlHJCNLa__k", title: "60,000 migrants cross Spanish border", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "cMxDulMKJcY", title: "Venezuela earthquakes", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "ufhaiRkgy2w", title: "Turkey and Syria earthquakes", attribution: "BBC Learning English — News Review" },
  { videoId: "impS1eim9C0", title: "Donald Trump wins US election", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "tVrP2QJ421I", title: "German far right wins state election", attribution: "BBC Learning English — Learning English from the News" },
  { videoId: "terGxa9qZok", title: "Ukraine advances into Russian territory", attribution: "BBC Learning English — Learning English from the News" },
];

const ES_PODSTAWOWA: ListeningPoolEntry[] = [
  { videoId: "2GrDFoMl978", title: "Blind Dates (Spanish for Beginners)", attribution: "Dreaming Spanish" },
  { videoId: "6HXYi_VEfvI", title: "Spanish Story for Beginners: The Angry Artist", attribution: "Dreaming Spanish" },
  { videoId: "_7aY3qy1eEY", title: "I Had a Hater (But I Dealt With Him)", attribution: "Dreaming Spanish" },
  { videoId: "CFmfVQx6kP4", title: "100 Spanish Words & Phrases All Beginners Should Know", attribution: "Super Easy Spanish" },
  { videoId: "BJr-6o-eYLc", title: "50+ Simple Phrases for Your First Spanish Conversation", attribution: "Super Easy Spanish" },
  { videoId: "8wNakkUBWvw", title: "50 Phrases to Survive Your First Spanish Conversation", attribution: "Super Easy Spanish" },
  { videoId: "bkUtOdQGmxQ", title: "50 Adjectives Every Spanish Beginner Should Know", attribution: "Super Easy Spanish" },
  { videoId: "BMx7tn_Y0oI", title: "50 Spanish Verbs Beginners Should Know", attribution: "Super Easy Spanish" },
  { videoId: "tEgkJIazDqg", title: "Slow Spanish Conversation to Practise Past Tenses", attribution: "Super Easy Spanish" },
  { videoId: "JsGQizTuPSo", title: "Introduce Yourself in Slow Spanish", attribution: "Super Easy Spanish" },
  { videoId: "tFGq5P7Z69Q", title: "12 Minute Conversation in Slow Spanish", attribution: "Super Easy Spanish" },
  { videoId: "q48w51isHHc", title: "How Much Spanish Can You Learn in One Hour?", attribution: "Super Easy Spanish" },
  { videoId: "SCS1dJ35lig", title: "What are you doing today?", attribution: "Easy Spanish" },
  { videoId: "rw-DW_YlfoI", title: "If You Are A Beginner Watch This NOW!", attribution: "Easy Spanish" },
  { videoId: "JxMo15R8D3k", title: "3 Simple but Underused Techniques to Improve Your Spanish", attribution: "Easy Spanish" },
  { videoId: "-J9IL3Evx5c", title: "Discovering a Typical Spanish City Centre", attribution: "Easy Spanish" },
  { videoId: "wOkC_fDtkcg", title: "We Asked 30 Random Questions to People in Barcelona", attribution: "Easy Spanish" },
  { videoId: "37CeOo547Lo", title: "The Intercambio Secret", attribution: "Notes in Spanish" },
  { videoId: "b3MYW96yPAI", title: "Marina confesses", attribution: "Notes in Spanish" },
  { videoId: "ees43iWV820", title: "¡Tenemos Un Problema!", attribution: "Notes in Spanish" },
  { videoId: "4F060cNFntk", title: "Ben and Marina's Aniversario", attribution: "Notes in Spanish" },
  { videoId: "NP7-5hS9c7M", title: "¡Cada loco con su tema! Marina's Frisbees!", attribution: "Notes in Spanish" },
  { videoId: "0e4LNEDX27s", title: "Juan and Pamela", attribution: "Spanish Playground" },
  { videoId: "hISCF6a06kY", title: "Professions", attribution: "Spanish Playground" },
  { videoId: "rb5AZmMXrwY", title: "Pet Care", attribution: "Spanish Playground" },
];

const ES_ROZSZERZONA: ListeningPoolEntry[] = [
  { videoId: "Lila4Ao9x40", title: "La importancia de los Altos del Golán y Colombia", attribution: "BBC Mundo" },
  { videoId: "QWPNCOTu8FA", title: "Cómo el boom petrolero de Argentina transforma Vaca Muerta", attribution: "BBC Mundo" },
  { videoId: "OOALyJ131VM", title: "Los propietarios de apartamentos en Reino Unido que 'no valen nada'", attribution: "BBC Mundo" },
  { videoId: "FL9hB7wQsZA", title: "Kawachi: el pueblo de la familia Fujimori en Japón", attribution: "BBC Mundo" },
  { videoId: "vv2reDtoOlM", title: "Las detectives que rescatan víctimas de trata en España", attribution: "BBC Mundo" },
  { videoId: "zNO18EEh_dg", title: "4 lugares fascinantes en los que los humanos no pueden poner el pie", attribution: "BBC Mundo" },
  { videoId: "ePEYjY-lyIc", title: "Qué es el pacto de La Meca", attribution: "BBC Mundo" },
  { videoId: "SfsZjFFSPvM", title: "Escalada comercial complica el pacto del T-MEC", attribution: "DW Español" },
  { videoId: "nfRTzSWe8-A", title: "Tensiones en Morena por gobernador acusado de narcotráfico", attribution: "DW Español" },
  { videoId: "vBQlWEMxI40", title: "Islandia, el país de la OTAN sin Ejército, en la disputa por el Ártico", attribution: "DW Español" },
  { videoId: "T_Wz9YRIl6A", title: "Lula da Silva y Flávio Bolsonaro protagonizan actos simultáneos en Río", attribution: "DW Español" },
  { videoId: "FSW7oeaFtFU", title: "Una vez pobre, ¿siempre pobre?", attribution: "DW Documental" },
  { videoId: "PPMb_rrej5c", title: "¿Quién mandará en la inteligencia artificial?", attribution: "DW Documental" },
  { videoId: "DOUp4TJlaXg", title: "Arabia Saudita apuesta por los e-sports y Nintendo", attribution: "France 24 Español" },
  { videoId: "eKy7WaUADr4", title: "Centros de datos: tema central en las elecciones de medio término de EE.UU.", attribution: "France 24 Español" },
  { videoId: "_Why-XmvgSc", title: "Robots humanoides miden sus capacidades en una competencia deportiva en China", attribution: "France 24 Español" },
  { videoId: "VJhlxfi5t_8", title: "Cosas que queremos experimentar al menos una vez", attribution: "Dreaming Spanish" },
  { videoId: "nOAE-JfALCs", title: "Hispanohablantes vs. la cultura pop estadounidense", attribution: "Dreaming Spanish" },
  { videoId: "UrVBr3jR1Iw", title: "Por qué España controla dos ciudades en el norte de África", attribution: "Dreaming Spanish" },
  { videoId: "R10nrudaZz8", title: "Noticias locas de las que ya nadie habla", attribution: "Dreaming Spanish" },
  { videoId: "ZtJKanoPwn0", title: "¿Es difícil aprender español?", attribution: "Easy Spanish" },
  { videoId: "ybfyLfI5Ml0", title: "¿Cómo empiezas tu día?", attribution: "Easy Spanish" },
  { videoId: "6oGTvjmHof0", title: "Nuestros 10 países favoritos", attribution: "Españolistos" },
  { videoId: "fQni0nx-5tY", title: "20 expresiones para sonar como nativo", attribution: "Españolistos" },
  { videoId: "H5rNKSNzvxU", title: "Hoy hablamos de... libros", attribution: "Hoy Hablamos" },
];

export const LISTENING_POOL: Record<MaturaLanguage, Record<MaturaLevel, ListeningPoolEntry[]>> = {
  en: { podstawowa: EN_PODSTAWOWA, rozszerzona: EN_ROZSZERZONA },
  es: { podstawowa: ES_PODSTAWOWA, rozszerzona: ES_ROZSZERZONA },
};
