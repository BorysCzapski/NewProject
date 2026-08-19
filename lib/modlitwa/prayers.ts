// ============================================================================
// lib/modlitwa/prayers.ts
// Teksty modlitw tradycyjnych używanych w liturgii godzin i w codziennej
// modlitwie. Świadomie ograniczone do modlitw o utrwalonym, tradycyjnym
// brzmieniu (Ojcze nasz, Zdrowaś Maryjo, Chwała Ojcu, akt pokuty, antyfony
// maryjne) — czyli tekstów, których wersja polska funkcjonuje w domenie
// publicznej od stuleci.
//
// Czego tu CELOWO nie ma: hymnów i psalmów z Liturgii Godzin oraz pełnych
// kantyków biblijnych. To chronione prawem autorskim tłumaczenia (Liturgia
// Godzin / Biblia Tysiąclecia), więc zamiast kopiować ich treść podajemy
// sigla i incipit, a po pełny tekst odsyłamy do brewiarz.pl — zgodnie z
// zasadą ze specyfikacji: „nie przechowywać pełnych tekstów, tylko odwoływać
// się do istniejących źródeł”.
// ============================================================================

export interface Prayer {
  id: string;
  title: string;
  text: string;
  /** Krótkie wyjaśnienie, kiedy się ją odmawia. */
  note?: string;
}

export const OJCZE_NASZ: Prayer = {
  id: "ojcze-nasz",
  title: "Ojcze nasz",
  text: `Ojcze nasz, któryś jest w niebie,
święć się imię Twoje,
przyjdź królestwo Twoje,
bądź wola Twoja, jako w niebie, tak i na ziemi.
Chleba naszego powszedniego daj nam dzisiaj
i odpuść nam nasze winy,
jako i my odpuszczamy naszym winowajcom,
i nie wódź nas na pokuszenie,
ale nas zbaw ode złego. Amen.`,
};

export const ZDROWAS_MARYJO: Prayer = {
  id: "zdrowas-maryjo",
  title: "Zdrowaś Maryjo",
  text: `Zdrowaś Maryjo, łaski pełna, Pan z Tobą,
błogosławionaś Ty między niewiastami
i błogosławiony owoc żywota Twojego, Jezus.
Święta Maryjo, Matko Boża, módl się za nami grzesznymi
teraz i w godzinę śmierci naszej. Amen.`,
};

export const CHWALA_OJCU: Prayer = {
  id: "chwala-ojcu",
  title: "Chwała Ojcu",
  text: `Chwała Ojcu i Synowi, i Duchowi Świętemu,
jak była na początku, teraz i zawsze,
i na wieki wieków. Amen.`,
};

export const AKT_POKUTY: Prayer = {
  id: "akt-pokuty",
  title: "Spowiadam się Bogu",
  text: `Spowiadam się Bogu wszechmogącemu
i wam, bracia i siostry, że bardzo zgrzeszyłem
myślą, mową, uczynkiem i zaniedbaniem:
moja wina, moja wina, moja bardzo wielka wina.
Przeto błagam Najświętszą Maryję, zawsze Dziewicę,
wszystkich Aniołów i Świętych, i was, bracia i siostry,
o modlitwę za mnie do Pana Boga naszego.`,
  note: "Odmawiany na początku Komplety, po krótkim rachunku sumienia.",
};

export const POD_TWOJA_OBRONE: Prayer = {
  id: "pod-twoja-obrone",
  title: "Pod Twoją obronę",
  text: `Pod Twoją obronę uciekamy się, Święta Boża Rodzicielko,
naszymi prośbami racz nie gardzić w potrzebach naszych,
ale od wszelakich złych przygód racz nas zawsze wybawiać,
Panno chwalebna i błogosławiona.
O Pani nasza, Orędowniczko nasza, Pośredniczko nasza, Pocieszycielko nasza.
Z Synem swoim nas pojednaj, Synowi swojemu nas polecaj,
swojemu Synowi nas oddawaj.`,
  note: "Najstarsza znana modlitwa do Matki Bożej (III w.).",
};

export const ANIOL_PANSKI: Prayer = {
  id: "aniol-panski",
  title: "Anioł Pański",
  text: `Anioł Pański zwiastował Pannie Maryi
— i poczęła z Ducha Świętego.
Zdrowaś Maryjo…

Oto ja służebnica Pańska
— niech mi się stanie według słowa Twego.
Zdrowaś Maryjo…

A Słowo stało się ciałem
— i zamieszkało między nami.
Zdrowaś Maryjo…

Módl się za nami, święta Boża Rodzicielko,
— abyśmy się stali godnymi obietnic Chrystusowych.`,
  note: "Odmawiany rano, w południe i wieczorem — poza okresem wielkanocnym.",
};

export const KROLOWO_NIEBA: Prayer = {
  id: "krolowo-nieba",
  title: "Królowo nieba (Regina caeli)",
  text: `Królowo nieba, wesel się, alleluja,
bo Ten, któregoś nosiła, alleluja,
zmartwychwstał, jak powiedział, alleluja.
Módl się za nami do Boga, alleluja.

Raduj się i wesel, Panno Maryjo, alleluja,
— bo zmartwychwstał Pan prawdziwie, alleluja.`,
  note: "Zastępuje „Anioł Pański” w okresie wielkanocnym.",
};

export const WITAJ_KROLOWO: Prayer = {
  id: "witaj-krolowo",
  title: "Witaj, Królowo (Salve Regina)",
  text: `Witaj, Królowo, Matko miłosierdzia,
życie, słodyczy i nadziejo nasza, witaj!
Do Ciebie wołamy wygnańcy, synowie Ewy;
do Ciebie wzdychamy, jęcząc i płacząc
na tym łez padole.
Przeto, Orędowniczko nasza,
one miłosierne oczy Twoje na nas zwróć,
a Jezusa, błogosławiony owoc żywota Twojego,
po tym wygnaniu nam okaż.
O łaskawa, o litościwa, o słodka Panno Maryjo!`,
};

export const MODLITWA_ZA_INNYCH: Prayer = {
  id: "modlitwa-wstawiennicza",
  title: "Modlitwa wstawiennicza",
  text: `Panie Jezu Chryste, Ty powiedziałeś:
„Proście, a będzie wam dane”.
Powierzam Ci osoby, które noszę w sercu.
Ty znasz ich potrzeby lepiej niż ja.
Otocz je swoją opieką, umocnij w trudnościach
i prowadź drogą pokoju.
Amen.`,
  note: "Proponowana modlitwa do odmówienia nad listą intencji.",
};

export const ALL_PRAYERS: Prayer[] = [
  OJCZE_NASZ,
  ZDROWAS_MARYJO,
  CHWALA_OJCU,
  AKT_POKUTY,
  POD_TWOJA_OBRONE,
  ANIOL_PANSKI,
  KROLOWO_NIEBA,
  WITAJ_KROLOWO,
  MODLITWA_ZA_INNYCH,
];
