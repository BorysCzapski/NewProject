// ============================================================================
// lib/matura/writing-grading.ts
// AI grading for "Wypowiedź pisemna" against the REAL CKE rubric, sourced
// from the official "Informator o egzaminie maturalnym z języka angielskiego
// (od roku szkolnego 2024/2025)" — the exact criteria names, point splits
// and what earns full marks on each (below) come from that document, not a
// generic writing rubric. The word-count "guillotine" (below the floor,
// every criterion except the first is forced to 0) is enforced in CODE
// after the AI call, never left to the model's discretion — it's a hard
// CKE rule, not a judgment call.
// ============================================================================
import "server-only";
import { askAIForJSON } from "@/lib/ai";
import { MATURA_WRITING_WORD_RANGE } from "@/lib/matura/constants";
import type { MaturaLevel, MaturaWritingAiFeedback, MaturaWritingCriterionResult, MaturaWritingTask } from "@/lib/types/database";

interface CriterionDef {
  key: string;
  label: string;
  max: number;
}

const PODSTAWOWA_CRITERIA: CriterionDef[] = [
  { key: "tresc", label: "Treść", max: 5 },
  { key: "spojnosc", label: "Spójność i logika wypowiedzi", max: 2 },
  { key: "zakres", label: "Zakres środków językowych", max: 3 },
  { key: "poprawnosc", label: "Poprawność środków językowych", max: 2 },
];

const ROZSZERZONA_CRITERIA: CriterionDef[] = [
  { key: "zgodnosc", label: "Zgodność z poleceniem", max: 5 },
  { key: "spojnosc", label: "Spójność i logika wypowiedzi", max: 2 },
  { key: "zakres", label: "Zakres środków językowych", max: 3 },
  { key: "poprawnosc", label: "Poprawność środków językowych", max: 3 },
];

function criteriaFor(level: MaturaLevel): CriterionDef[] {
  return level === "podstawowa" ? PODSTAWOWA_CRITERIA : ROZSZERZONA_CRITERIA;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const PODSTAWOWA_RUBRIC = `
Oceniasz wypowiedź pisemną (e-mail / wpis na blogu / wpis na forum) na maturze z angielskiego, POZIOM PODSTAWOWY, wg oficjalnych kryteriów CKE:

1. TREŚĆ (0-5 pkt): polecenie zawiera do 4 podpunktów. Pełne 5 pkt wymaga zaadresowania WSZYSTKICH podpunktów I rozwinięcia każdego z nich (nie samo wspomnienie jednym zdaniem, ale 1-2 zdania z konkretem/przykładem/uzasadnieniem). Za każdy pominięty lub tylko zasygnalizowany (nierozw inięty) podpunkt odejmuj punkty wg matrycy: im mniej podpunktów zaadresowanych/rozwiniętych, tym niżej (orientacyjnie: 4/4 rozwinięte = 5, 3-4 zaadresowane ale część nierozwinięta = 3-4, połowa pominięta = 1-2, prawie nic = 0).
2. SPÓJNOŚĆ I LOGIKA WYPOWIEDZI (0-2 pkt): 2 pkt = tekst płynie jako całość, jasne powiązania logiczne/leksykalne, brak sprzecznych fragmentów (brak podziału na akapity NIE obniża tej oceny, jeśli logika jest zachowana). 1 pkt = kilka zakłóceń spójności. 0 pkt = liczne, chaotyczny tekst.
3. ZAKRES ŚRODKÓW JĘZYKOWYCH (0-3 pkt): pełne 3 pkt = zróżnicowane słownictwo i struktury na poziomie B1+, precyzyjne sformułowania zamiast ogólników typu "nice/great/interesting/good/bad" — nagradzaj naturalne kolokacje i konkretne słownictwo tematyczne. 1-2 pkt = słownictwo podstawowe/powtarzalne. 0 pkt = bardzo ubogie.
4. POPRAWNOŚĆ ŚRODKÓW JĘZYKOWYCH (0-2 pkt): 2 pkt = brak błędów lub sporadyczne błędy niezakłócające komunikacji (oceniaj proporcjonalnie do długości tekstu). 1 pkt = błędy miejscami zakłócają zrozumienie. 0 pkt = liczne błędy poważnie zakłócające komunikację.

ZASADA GILOTYNY (WAŻNE): jeśli tekst ma mniej niż 80 słów, kryterium 1 oceniasz normalnie, ale kryteria 2-4 i tak zostaną wyzerowane przez system niezależnie od Twojej oceny — możesz je ocenić uczciwie, korekta nastąpi automatycznie.
`.trim();

const ROZSZERZONA_RUBRIC = `
Oceniasz rozprawkę "za i przeciw" (200-250 słów, styl formalny) na maturze z angielskiego, POZIOM ROZSZERZONY, wg oficjalnych kryteriów CKE:

1. ZGODNOŚĆ Z POLECENIEM (0-5 pkt): to połączona ocena treści i formy. Pełne 5 pkt wymaga: (a) wstępu z JASNĄ tezą, która WPROST zapowiada strukturę "za i przeciw" (teza w stylu "there are both advantages and disadvantages of..." — sama pytająca teza typu "is it good or bad?" BEZ zapowiedzi struktury to błąd obniżający ocenę); (b) argumentów za, każdy rozwinięty (nie samo wymienienie, ale wyjaśniony mechanizm/konsekwencja); (c) argumentów przeciw, tak samo rozwiniętych; (d) zakończenia, które parafrazuje tezę (nie powtarza dosłownie) i podsumowuje bilans; (e) braku dygresji nie na temat; oraz poprawnej formy: teza na początku, widoczna struktura wstęp/rozwinięcie/zakończenie, podział na akapity (jeden akapit = jedna myśl), długość w granicach 180-280 słów (mniej niż 160 słów = tylko to kryterium liczy się normalnie, reszta i tak zostanie wyzerowana przez system).
2. SPÓJNOŚĆ I LOGIKA WYPOWIEDZI (0-2 pkt): licz konkretne zakłócenia spójności/logiki. 0-2 zakłócenia = 2 pkt, 3-5 = 1 pkt, 6+ = 0 pkt.
3. ZAKRES ŚRODKÓW JĘZYKOWYCH (0-3 pkt): pełne 3 pkt = "szeroki zakres" na poziomie B2+ — liczne, naturalne, precyzyjne i zróżnicowane frazy (nie tylko "firstly/secondly", ale np. "what is more/nevertheless/it is often argued that"), STYL FORMALNY I JEDNOLITY przez cały tekst (bez wtrąceń kolokwialnych, bez ściągniętych form typu don't/can't). Mieszanie rejestru bez uzasadnienia obniża ocenę nawet przy bogatym słownictwie.
4. POPRAWNOŚĆ ŚRODKÓW JĘZYKOWYCH (0-3 pkt): oceniana dwuwymiarowo — błędy językowe ORAZ błędy ortograficzne/interpunkcyjne. Pełne 3 pkt wymaga niewielu błędów w OBU wymiarach jednocześnie (mocna gramatyka, ale dużo literówek, nie daje pełnej punktacji).

ZASADA GILOTYNY (WAŻNE): jeśli tekst ma mniej niż 160 słów, kryterium 1 (zgodność z poleceniem) oceniasz normalnie, ale kryteria 2-4 i tak zostaną wyzerowane przez system niezależnie od Twojej oceny — możesz je ocenić uczciwie, korekta nastąpi automatycznie.
`.trim();

function rubricFor(level: MaturaLevel): string {
  return level === "podstawowa" ? PODSTAWOWA_RUBRIC : ROZSZERZONA_RUBRIC;
}

interface RawGrading {
  criteria: Array<{ key: string; pointsAwarded: number; comment: string }>;
  generalFeedback: string;
  improvementTip: string;
}

export async function gradeWritingSubmission(
  level: MaturaLevel,
  task: MaturaWritingTask,
  content: string
): Promise<MaturaWritingAiFeedback> {
  const trimmed = content.trim();
  const wordCount = countWords(trimmed);
  const criteriaDefs = criteriaFor(level);
  const range = MATURA_WRITING_WORD_RANGE[level];

  const raw = await askAIForJSON<RawGrading>({
    system:
      "Jesteś egzaminatorem maturalnym oceniającym wypowiedź pisemną z języka angielskiego wg " +
      "oficjalnych kryteriów CKE. Odpowiadasz PO POLSKU, konkretnie i rzeczowo, jak prawdziwy " +
      "egzaminator — nie jesteś nadmiernie surowy ani nadmiernie łagodny.\n\n" +
      rubricFor(level),
    prompt:
      `Polecenie: "${task.instructions}"\n` +
      `Wymagane podpunkty:\n${task.content_points.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n` +
      `Wymagana długość: ${range.min}-${range.max} słów.\n` +
      `Tekst ucznia (${wordCount} słów):\n"""\n${trimmed}\n"""\n\n` +
      `Oceń każde z kryteriów w tej kolejności, używając dokładnie tych kluczy: ${criteriaDefs.map((c) => c.key).join(", ")}. ` +
      `Maksymalne punkty per kryterium: ${criteriaDefs.map((c) => `${c.key}=${c.max}`).join(", ")}.`,
    schema: {
      criteria: {
        type: "array",
        description: "ocena dla każdego kryterium, w podanej kolejności",
        items: {
          type: "object",
          properties: {
            key: { type: "string", description: "dokładnie jeden z podanych kluczy kryteriów" },
            pointsAwarded: { type: "integer", description: "liczba punktów przyznanych za to kryterium" },
            comment: { type: "string", description: "krótki, konkretny komentarz po polsku (1-2 zdania)" },
          },
          required: ["key", "pointsAwarded", "comment"],
        },
      },
      generalFeedback: { type: "string", description: "ogólny komentarz po polsku, 2-4 zdania" },
      improvementTip: {
        type: "string",
        description: "jedna konkretna, praktyczna wskazówka po polsku, co poprawić najpierw",
      },
    },
    maxTokens: 1200,
  });

  const byKey = new Map(raw.criteria.map((c) => [c.key, c]));
  const belowFloor = wordCount < range.floor;

  const criteria: MaturaWritingCriterionResult[] = criteriaDefs.map((def, i) => {
    const found = byKey.get(def.key);
    const forceZero = belowFloor && i > 0; // guillotine: only the first criterion survives
    const pointsAwarded = forceZero ? 0 : Math.max(0, Math.min(def.max, Math.round(found?.pointsAwarded ?? 0)));
    const comment = forceZero
      ? `0 pkt — tekst ma ${wordCount} słów, poniżej wymaganego minimum (${range.floor} słów), więc zgodnie z zasadami CKE to kryterium jest zerowane.`
      : (found?.comment ?? "Brak komentarza.");
    return { key: def.key, label: def.label, pointsAwarded, pointsMax: def.max, comment };
  });

  const totalPoints = criteria.reduce((sum, c) => sum + c.pointsAwarded, 0);
  const maxPoints = criteriaDefs.reduce((sum, c) => sum + c.max, 0);

  return {
    criteria,
    totalPoints,
    maxPoints,
    generalFeedback: belowFloor
      ? `Tekst jest za krótki (${wordCount} słów, minimum to ${range.floor}) — na maturze taka praca jest oceniana tylko wg pierwszego kryterium. ${raw.generalFeedback}`
      : raw.generalFeedback,
    improvementTip: raw.improvementTip,
  };
}

export { countWords };
