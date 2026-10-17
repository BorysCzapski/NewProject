"""First-pass classification of exam problems into `kind` (way of working) and
`topic` (subject), plus detection of the result file and referenced data files.

Structure beats keywords here. Every CKE paper follows the same layout:
  * written tasks (recursion/algorithm tables, pseudocode, short "test" items)
    — marked with the "no computer" heading icon, or all of Część I in the
    2015 formula;
  * computer tasks that ship data files: the LAST one is the database task
    (SQL), the one before it the spreadsheet task, every earlier one a program.
Keywords only decide the `topic`. Whatever this gets wrong is fixed in
scripts/informatyka/overrides.json (slug -> label -> fields), applied last.
"""
import re

KINDS = ("pisemne", "program", "arkusz", "sql", "teoria")

TOPIC_RULES = [
    # (topic, regex over lowercased title + intro + statement) — first match wins
    ("rekurencja", r"rekurencyjn|rekurencj"),
    ("sieci-i-bezpieczenstwo", r"adres ip|\bsieci\b|sieć|protokół|szyfrowan|szyfr|haszowan|kompresj|\brsa\b|certyfikat|bezpiecz|pakiet"),
    ("systemy-liczbowe", r"system(ie|ach|u|y|ów)? (dwójkow|binarn|szesnastkow|ósemkow|trójkow|piątkow|czwórkow|pozycyjn)|zapis(ie)? (binarn|dwójkow|szesnastkow)|liczb[ay]? binarn|podstaw(ach|ie|ami)\b|kod u2|zapisan\w+ w systemie"),
    ("logika", r"wyrażeni[ea] logiczn|tablic[aey] prawdy|bramk"),
    ("struktury-danych", r"\bdrzew|\bgraf|\bkolejk|\bstos\b|hierarchi|korporacj|plansz"),
    ("algorytmy-tekstowe", r"palindrom|anagram|prefiks|sufiks|\bsłow|\bnapis(?:y|ów|ami|em|u)?\b|\bliter|tekst|ascii|kodowanie"),
    ("liczby", r"pierwsz|\bnwd\b|podzieln|\bcyfr|dzielnik|odbici|przeniesień|permutacj|wielokrotnoś|rozkład"),
    ("symulacje", r"symulac|co dzień|każdego dnia|przyrost|wzrost"),
]

TOPIC_FALLBACK = {"pisemne": "algorytmy-ogolne", "program": "analiza-danych", "teoria": "teoria-ogolna"}


def data_files_in(blob):
    return sorted({f for f in re.findall(r"[A-Za-z_0-9]+\.txt", blob) if not f.startswith("wyniki")})


def task_blob(task):
    return task.get("intro_text", "") + " " + " ".join(p.get("statement_text", "") for p in task["problems"])


def topic_for(kind, task, problem):
    if kind == "sql":
        return "bazy-danych"
    if kind == "arkusz":
        return "arkusz-kalkulacyjny"
    text = " ".join([task.get("title", ""), task.get("intro_text", ""), problem.get("statement_text", "")]).lower()
    for name, pattern in TOPIC_RULES:
        if re.search(pattern, text):
            return name
    return TOPIC_FALLBACK.get(kind, "analiza-danych")


def classify_exam(tasks):
    """Fills kind/topic/result_file/mentioned_files on every problem of an exam (list of task dicts)."""
    computer_tasks = [
        t for t in tasks
        if t.get("part") != 1
        and any(not p.get("no_computer") for p in t["problems"])
        and data_files_in(task_blob(t))
    ]
    kind_of_task = {}
    for i, t in enumerate(computer_tasks):
        from_end = len(computer_tasks) - 1 - i
        kind_of_task[t["number"]] = "sql" if from_end == 0 else "arkusz" if from_end == 1 else "program"

    for task in tasks:
        for problem in task["problems"]:
            standalone = "." not in problem["label"]
            no_computer = bool(problem.get("no_computer"))
            if task.get("title", "").strip().lower() == "test" or (standalone and no_computer and problem["points_max"] <= 2):
                kind = "teoria"
            elif task["number"] in kind_of_task:
                task_kind = kind_of_task[task["number"]]
                kind = "pisemne" if (task_kind == "program" and no_computer) else task_kind
            else:
                kind = "pisemne"
            blob = task.get("intro_text", "") + " " + problem.get("statement_text", "")
            result = re.search(r"wyniki\d*\.txt", blob)
            problem.update(
                kind=kind,
                topic=topic_for(kind, task, problem),
                result_file=result.group(0) if result else None,
                mentioned_files=data_files_in(blob),
            )
