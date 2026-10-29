// ============================================================================
// lib/biznes/lessons.ts
// The six działy of the maturabiz.pl knowledge base (podstawa programowa BiZ).
// Kept apart from theory.ts so client components can list działy without
// bundling the whole article JSON.
// ============================================================================
import type { Lesson, LessonId } from "./types";

/** Category slug used by content/wiedza.json -> dział id. */
export const CATEGORY_TO_LESSON: Record<string, LessonId> = {
  "osoba-przedsiebiorcza": "osoba",
  "zarzadzanie-projektami": "projekty",
  "gospodarka-rynkowa": "gospodarka",
  "finanse-osobiste": "finanse",
  "osoba-przedsiebiorcza-na-rynku-pracy": "praca",
  przedsiebiorstwo: "firma",
};

/** Glossary category title -> dział id. */
export const GLOSSARY_TO_LESSON: Record<string, LessonId> = {
  "Osoba przedsiębiorcza we współczesnym świecie": "osoba",
  "Zarządzanie projektami": "projekty",
  "Gospodarka rynkowa": "gospodarka",
  "Finanse osobiste": "finanse",
  "Osoba przedsiębiorcza na rynku pracy": "praca",
  Przedsiębiorstwo: "firma",
};

export const LESSONS: Lesson[] = [
  {
    id: "osoba",
    short: "Dział 1",
    title: "Osoba przedsiębiorcza we współczesnym świecie",
    subtitle: "Przedsiębiorczość, kompetencje, komunikacja, praca zespołowa, kreatywność, innowacje",
    source: "maturabiz.pl – Baza wiedzy, dział 1",
  },
  {
    id: "projekty",
    short: "Dział 2",
    title: "Zarządzanie projektami",
    subtitle: "Projekt a proces, cykl życia, zespół i interesariusze, planowanie, podejścia i narzędzia",
    source: "maturabiz.pl – Baza wiedzy, dział 2",
  },
  {
    id: "gospodarka",
    short: "Dział 3",
    title: "Gospodarka rynkowa",
    subtitle: "Rynek, popyt i podaż, struktury rynkowe, wskaźniki, państwo, podatki, UE, konsument",
    source: "maturabiz.pl – Baza wiedzy, dział 3",
  },
  {
    id: "finanse",
    short: "Dział 4",
    title: "Finanse osobiste",
    subtitle: "Pieniądz i banki, budżet domowy, podatki, usługi bankowe, emerytura, giełda, ryzyko",
    source: "maturabiz.pl – Baza wiedzy, dział 4",
  },
  {
    id: "praca",
    short: "Dział 5",
    title: "Osoba przedsiębiorcza na rynku pracy",
    subtitle: "Kariera, rynek pracy i bezrobocie, rekrutacja, zatrudnienie, etyka i mobbing",
    source: "maturabiz.pl – Baza wiedzy, dział 5",
  },
  {
    id: "firma",
    short: "Dział 6",
    title: "Przedsiębiorstwo",
    subtitle: "Typy firm, od pomysłu do MVP, biznesplan, zarządzanie zespołem, marketing i finanse",
    source: "maturabiz.pl – Baza wiedzy, dział 6",
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
