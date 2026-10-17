#!/usr/bin/env python3
"""Cuts the CKE informatyka exam PDFs into per-task page crops + answer keys.

    python3 scripts/informatyka/extract_pdfs.py <pdf-dir> <out-dir> [slug ...]

Reads (never writes to) the exam PDFs in <pdf-dir> and writes to <out-dir>:
  images/<slug>/*.png   cropped page images (statement, task intro, answer key)
  exams.json            structure + points + key text, consumed by
                        scripts/informatyka-ingest.mjs

Why crops instead of text: tables, fractions and figures in the statements
don't survive text extraction. The exam layout is regular enough (content in
one column, left-aligned "Zadanie N.M. (0–k)" headings, "Miejsce na …" markers
ending the statement) that headings can be located by coordinates and the
region between two of them rendered as an image — the same approach as the
OneNote import for Maturalnik, just vector-based.

Run with `--list` to print the slugs it knows.
"""
import json
import os
import re
import sys

import fitz  # PyMuPDF

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classify import classify_exam  # noqa: E402

# ----------------------------------------------------------------------------
# Which PDFs make up which session. Formula 2015 papers are two PDFs (Część I
# on paper, Część II on a computer) and one key; formula 2023 is one PDF.
# (The "-2" files for 2023+ in the download folder are byte-identical copies.)
# ----------------------------------------------------------------------------
def paper(year, session, formula, parts, key, order, label=None, stara=False):
    slug = f"{year}-{session}" + ("-stara" if stara else "")
    return {
        "slug": slug,
        "year": year,
        "session": session,
        "formula": formula,
        "parts": parts,  # [(filename, part_number_or_None)]
        "key": key,
        "order": order,
        "title": label or f"Matura {session} {year}",
    }


def pdf(year, session, suffix="", stara=False):
    mid = f"{year}-{session}" + ("-matura-stara" if stara else "-matura")
    return f"informatyka-{mid}-rozszerzona{suffix}.pdf"


EXAMS = [
    paper(2026, "czerwiec", "2023", [(pdf(2026, "czerwiec"), None)], pdf(2026, "czerwiec", "-odpowiedzi"), 1),
    paper(2026, "czerwiec", "2015",
          [(pdf(2026, "czerwiec", stara=True), 1), (pdf(2026, "czerwiec", "-2", stara=True), 2)],
          pdf(2026, "czerwiec", "-odpowiedzi", stara=True), 2, label="Matura czerwiec 2026 (stara formuła)", stara=True),
    paper(2026, "maj", "2023", [(pdf(2026, "maj"), None)], pdf(2026, "maj", "-odpowiedzi"), 3),
    paper(2025, "czerwiec", "2023", [(pdf(2025, "czerwiec"), None)], pdf(2025, "czerwiec", "-odpowiedzi"), 4),
    paper(2025, "maj", "2023", [(pdf(2025, "maj"), None)], pdf(2025, "maj", "-odpowiedzi"), 5),
    paper(2024, "czerwiec", "2023", [(pdf(2024, "czerwiec"), None)], pdf(2024, "czerwiec", "-odpowiedzi"), 6),
    paper(2024, "maj", "2023", [(pdf(2024, "maj"), None)], pdf(2024, "maj", "-odpowiedzi"), 7),
    paper(2023, "czerwiec", "2023", [(pdf(2023, "czerwiec"), None)], pdf(2023, "czerwiec", "-odpowiedzi"), 8),
    paper(2023, "maj", "2023", [(pdf(2023, "maj"), None)], pdf(2023, "maj", "-odpowiedzi"), 9),
    paper(2022, "czerwiec", "2015", [(pdf(2022, "czerwiec"), 1), (pdf(2022, "czerwiec", "-2"), 2)],
          pdf(2022, "czerwiec", "-odpowiedzi"), 10),
    paper(2022, "maj", "2015", [(pdf(2022, "maj"), 1), (pdf(2022, "maj", "-2"), 2)],
          pdf(2022, "maj", "-odpowiedzi"), 11),
]

# ----------------------------------------------------------------------------
# Layout constants (A4 595×842 pt) and heading patterns.
# ----------------------------------------------------------------------------
CROP_X0, CROP_X1 = 62.0, 536.0  # content column; the examiner score boxes sit left of 62
ZOOM = 2.0
DASH = r"[–−-]"
RE_SUB = re.compile(rf"^Zadanie\s+(\d+)\.(\d+)\.?\s*\(\s*0\s*{DASH}\s*(\d+)\s*\)")
RE_STANDALONE = re.compile(rf"^Zadanie\s+(\d+)\.\s*\(\s*0\s*{DASH}\s*(\d+)\s*\)")
RE_TASK = re.compile(r"^Zadanie\s+(\d+)\.\s+(\S.*)$")
RE_INFO = re.compile(r"^Informacja do zadań?\s+(.*)$")
RE_CUT = re.compile(r"^(Miejsce na|Do oceny oddajesz|BRUDNOPIS)", re.I)
RE_FURNITURE = re.compile(
    r"^(Strona\s+\d+\s+z\s+\d+|[EM]INP-R\d[-_]\w+|Więcej arkuszy|Egzamin maturalny z informatyki|"
    r"Zasady oceniania rozwiązań zadań|Rodzaj dokumentu)"
)
RE_SCORING = re.compile(r"^Zasady oceniania")
RE_ANSWER = re.compile(r"^(Poprawna odpowiedź|Poprawne odpowiedzi|Poprawne rozwiązani|Przykładowa odpowiedź|"
                       r"Przykładowe odpowiedzi|Przykładowe rozwiązani|Przykładowy )", re.I)
RE_FOOTNOTE = re.compile(r"^1\s*Rozporządzenie")

MONTHS = {
    "stycznia": 1, "lutego": 2, "marca": 3, "kwietnia": 4, "maja": 5, "czerwca": 6,
    "lipca": 7, "sierpnia": 8, "września": 9, "października": 10, "listopada": 11, "grudnia": 12,
}


def line_text(line):
    return "".join(span["text"] for span in line["spans"]).strip()


def page_lines(page):
    """All text lines of a page as (y0, y1, x0, x1, text), sorted top to bottom."""
    out = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            text = line_text(line)
            if text:
                x0, y0, x1, y1 = line["bbox"]
                out.append((y0, y1, x0, x1, text))
    out.sort()
    return out


def content_bounds(lines, page_height):
    """Vertical content range of a page, excluding running headers/footers."""
    top, bottom = 55.0, page_height - 45.0
    for y0, y1, x0, _x1, text in lines:
        if x0 < 40:  # vertical "Więcej arkuszy…" watermark
            continue
        if RE_FURNITURE.match(text):
            if y1 < 100:
                top = max(top, y1 + 2)
            elif y0 > page_height - 150:
                bottom = min(bottom, y0 - 2)
    return top, bottom


def parse_info_labels(spec):
    """"4.2.–4.4." -> ["4.2","4.3","4.4"]; "6.2." -> ["6.2"]."""
    nums = re.findall(r"(\d+)\.(\d+)", spec)
    has_range = bool(re.search(rf"\d\.?\s*{DASH}\s*\d", spec))
    if has_range and len(nums) >= 2:
        task, first = nums[0]
        _task2, last = nums[1]
        return [f"{task}.{n}" for n in range(int(first), int(last) + 1)]
    return [f"{t}.{n}" for t, n in nums]


def has_no_computer_icon(drawings, y0, y1):
    """The small yellow note icon CKE puts in a heading when the task needs no computer."""
    for d in drawings:
        r = d["rect"]
        fill = d.get("fill")
        if fill and tuple(round(c, 2) for c in fill) == (1.0, 1.0, 0.0) and r.x0 > 100 \
                and 5 < r.width < 25 and 5 < r.height < 25 and y0 - 4 <= r.y0 and r.y1 <= y1 + 4:
            return True
    return False


def collect_events(doc, mode):
    """Headings and markers in reading order across the whole document.

    mode "paper": task/sub/info headings + "Miejsce na …" cut markers.
    mode "key":   sub headings + "Zasady oceniania" / answer / footnote markers.
    """
    events = []
    bounds = {}
    for pno in range(len(doc)):
        page = doc[pno]
        lines = page_lines(page)
        drawings = page.get_drawings() if mode == "paper" else []
        bounds[pno] = content_bounds(lines, page.rect.height)
        for y0, y1, x0, _x1, text in lines:
            if x0 > 100 or x0 < 40:
                continue
            m = RE_SUB.match(text)
            if m:
                events.append((pno, y0, "sub", {"label": f"{m.group(1)}.{m.group(2)}", "task": int(m.group(1)), "points": int(m.group(3)),
                                                "no_computer": has_no_computer_icon(drawings, y0, y1)}))
                continue
            m = RE_STANDALONE.match(text)
            if m:
                events.append((pno, y0, "sub", {"label": m.group(1), "task": int(m.group(1)), "points": int(m.group(2)),
                                                "no_computer": has_no_computer_icon(drawings, y0, y1)}))
                continue
            if mode == "key":
                if RE_SCORING.match(text):
                    events.append((pno, y0, "scoring", {}))
                elif RE_FOOTNOTE.match(text):
                    events.append((pno, y0, "footnote", {}))
                elif RE_ANSWER.match(text):
                    events.append((pno, y0, "answer", {}))
                continue
            m = RE_TASK.match(text)
            if m and not text.rstrip().endswith(")"):
                events.append((pno, y0, "task", {"task": int(m.group(1)), "title": m.group(2).strip()}))
                continue
            m = RE_INFO.match(text)
            if m:
                events.append((pno, y0, "info", {"labels": parse_info_labels(m.group(1))}))
                continue
            if RE_CUT.match(text):
                events.append((pno, y0, "cut", {}))
    events.sort(key=lambda e: (e[0], e[1]))
    return events, bounds


def clips_between(start, end, bounds, pad_top=4.0, pad_bottom=7.0):
    """Page clips from event `start` up to (not including) event `end` (or document end)."""
    s_pno, s_y = start[0], start[1]
    clips = []
    last_pno = end[0] if end else max(bounds)
    for pno in range(s_pno, last_pno + 1):
        top, bottom = bounds[pno]
        y0 = max(top, s_y - pad_top) if pno == s_pno else top
        y1 = bottom
        if end and pno == end[0]:
            y1 = min(bottom, end[1] - pad_bottom)
        if y1 - y0 > 6:
            clips.append((pno, y0, y1))
    return clips


def subtract_hole(clips, hole_start, hole_end):
    """Remove everything between two (pno, y) points from the clips."""
    (sp, sy), (ep, ey) = hole_start, hole_end
    out = []
    for pno, y0, y1 in clips:
        if pno < sp or pno > ep:
            out.append((pno, y0, y1))
            continue
        lo = sy if pno == sp else y0
        hi = ey if pno == ep else y1
        if lo > y0 + 6:
            out.append((pno, y0, min(lo, y1)))
        if hi < y1 - 6:
            out.append((pno, max(hi, y0), y1))
    return out


_ink_cache = {}


def trim_clips(doc, clips):
    """Cut blank space off the bottom of every clip (statements often end well above the next heading)."""
    out = []
    for pno, y0, y1 in clips:
        key = (doc.name, pno)
        if key not in _ink_cache:
            page = doc[pno]
            lines = [(l[0], l[1]) for l in page_lines(page) if l[2] >= 40 and not RE_FURNITURE.match(l[4])]
            shapes = [(d["rect"].y0, d["rect"].y1) for d in page.get_drawings()
                      if 0.5 < d["rect"].width < 540 and d["rect"].x1 > CROP_X0 and d["rect"].x0 < CROP_X1]
            images = [(b["bbox"][1], b["bbox"][3]) for b in page.get_text("dict")["blocks"] if b["type"] == 1 and b["bbox"][0] > 60]
            _ink_cache[key] = lines + shapes + images
        ink = _ink_cache[key]
        inside = [b for a, b in ink if a >= y0 - 1 and b <= y1 + 0.5]
        if not inside:
            continue
        new_y1 = min(y1, max(inside) + 8)
        if new_y1 - y0 > 6:
            out.append((pno, y0, new_y1))
    return out


def render(doc, clips):
    """Stack the clips vertically into one PNG (bytes), or None if empty."""
    clips = trim_clips(doc, clips)
    if not clips:
        return None
    width = CROP_X1 - CROP_X0
    height = sum(c[2] - c[1] for c in clips) + 4 * (len(clips) - 1)
    out = fitz.open()
    page = out.new_page(width=width, height=height)
    y = 0.0
    for pno, y0, y1 in clips:
        h = y1 - y0
        page.show_pdf_page(fitz.Rect(0, y, width, y + h), doc, pno, clip=fitz.Rect(CROP_X0, y0, CROP_X1, y1))
        y += h + 4
    png = page.get_pixmap(matrix=fitz.Matrix(ZOOM, ZOOM), alpha=False).tobytes("png")
    out.close()
    return png


def clip_text(doc, clips):
    parts = []
    for pno, y0, y1 in clips:
        parts.append(doc[pno].get_text("text", clip=fitz.Rect(CROP_X0, y0, CROP_X1, y1)).strip())
    return "\n".join(p for p in parts if p)


def parse_meta(doc):
    """Date and duration from the cover page of a paper."""
    text = doc[0].get_text("text")
    meta = {}
    m = re.search(r"DATA:\s*(\d{1,2})\s+(\w+)\s+(\d{4})", text)
    if m and m.group(2) in MONTHS:
        meta["date"] = f"{m.group(3)}-{MONTHS[m.group(2)]:02d}-{int(m.group(1)):02d}"
    m = re.search(r"CZAS (?:PRACY|TRWANIA):\s*(\d+)\s*minut", text)
    if m:
        meta["duration"] = int(m.group(1))
    m = re.search(r"LICZBA PUNKTÓW DO UZYSKANIA:\s*(\d+)", text)
    if m:
        meta["points"] = int(m.group(1))
    return meta


def save(out_dir, slug, name, png):
    rel = f"images/{slug}/{name}.png"
    path = os.path.join(out_dir, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)
    return rel


def extract_paper(doc, part, slug, out_dir, tasks, problems_by_label):
    """Statement/intro images for one exam PDF into `tasks` / `problems_by_label`."""
    events, bounds = collect_events(doc, "paper")
    pending_info = {}  # label -> [image rel paths] from "Informacja do zadań …" blocks
    pending_info_text = {}  # label -> text of those blocks (file names live there)
    for i, ev in enumerate(events):
        kind = ev[2]
        if kind not in ("task", "sub", "info"):
            continue
        end = events[i + 1] if i + 1 < len(events) else None
        clips = clips_between(ev, end, bounds)
        png = render(doc, clips)
        if kind == "task":
            n = ev[3]["task"]
            task = tasks.setdefault(n, {"number": n, "part": part, "title": ev[3]["title"], "intro_images": [], "problems": []})
            task["title"] = ev[3]["title"]
            task["intro_text"] = clip_text(doc, clips)
            if png:
                task["intro_images"].append(save(out_dir, slug, f"t{n}-intro", png))
        elif kind == "info":
            if png:
                rel = save(out_dir, slug, f"info-{ev[3]['labels'][0]}", png)
                info_text = clip_text(doc, clips)
                for label in ev[3]["labels"]:
                    pending_info.setdefault(label, []).append(rel)
                    pending_info_text.setdefault(label, []).append(info_text)
        else:
            label = ev[3]["label"]
            n = ev[3]["task"]
            task = tasks.setdefault(n, {"number": n, "part": part, "title": "", "intro_images": [], "problems": []})
            images = list(pending_info.get(label, []))
            if png:
                images.append(save(out_dir, slug, f"p{label}-q", png))
            problem = {
                "label": label,
                "points_max": ev[3]["points"],
                "no_computer": ev[3]["no_computer"],
                "statement_images": images,
                "key_images": [],
                "scoring_text": "",
                "key_text": "",
                "statement_text": "\n".join(pending_info_text.get(label, []) + [clip_text(doc, clips)]),
            }
            task["problems"].append(problem)
            problems_by_label[label] = problem


def extract_key(doc, slug, out_dir, problems_by_label):
    """Answer-key crop (from "Zasady oceniania" down) + split text per problem."""
    events, bounds = collect_events(doc, "key")
    subs = [e for e in events if e[2] == "sub"]
    for i, ev in enumerate(subs):
        label = ev[3]["label"]
        problem = problems_by_label.get(label)
        if not problem:
            continue
        end = subs[i + 1] if i + 1 < len(subs) else None
        # start the crop at the first "Zasady oceniania" after this heading
        scoring = next(
            (e for e in events if e[2] == "scoring" and (e[0], e[1]) > (ev[0], ev[1]) and (not end or (e[0], e[1]) < (end[0], end[1]))),
            None,
        )
        start = scoring or ev
        clips = clips_between(start, end, bounds)
        # drop the "¹ Rozporządzenie Ministra Edukacji…" footnote and the gap above it
        in_seg = lambda e: (e[0], e[1]) > (start[0], start[1]) and (not end or (e[0], e[1]) < (end[0], end[1]))
        footnote = next((e for e in events if e[2] == "footnote" and in_seg(e)), None)
        if footnote:
            answer = next((e for e in events if e[2] == "answer" and (e[0], e[1]) > (footnote[0], footnote[1]) and in_seg(e)), None)
            hole_end = (answer[0], answer[1] - 4) if answer else ((end[0], end[1] - 7) if end else (max(bounds), bounds[max(bounds)][1]))
            clips = subtract_hole(clips, (footnote[0], footnote[1] - 26), hole_end)
        png = render(doc, clips)
        if png:
            problem["key_images"].append(save(out_dir, slug, f"p{label}-key", png))
        text = clip_text(doc, clips)
        split = re.search(rf"\n({RE_ANSWER.pattern})", text, re.I | re.M)
        if split:
            problem["scoring_text"] = text[: split.start()].strip()
            problem["key_text"] = text[split.start():].strip()
        else:
            problem["scoring_text"] = text.strip()


def load_overrides():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "overrides.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_exam(spec, pdf_dir, out_dir):
    tasks, problems_by_label = {}, {}
    meta = {"date": None, "duration": 0, "points": 0}
    for filename, part in spec["parts"]:
        doc = fitz.open(os.path.join(pdf_dir, filename))
        m = parse_meta(doc)
        meta["date"] = meta["date"] or m.get("date")
        meta["duration"] += m.get("duration", 0)
        meta["points"] += m.get("points", 0)
        extract_paper(doc, part, spec["slug"], out_dir, tasks, problems_by_label)
    key_doc = fitz.open(os.path.join(pdf_dir, spec["key"]))
    extract_key(key_doc, spec["slug"], out_dir, problems_by_label)

    overrides = load_overrides().get(spec["slug"], {})
    ordered = []
    for order, n in enumerate(sorted(tasks)):
        task = tasks[n]
        for pi, problem in enumerate(task["problems"]):
            problem["order"] = order * 100 + pi
        ordered.append(task)
    classify_exam(ordered)
    for task in ordered:
        for problem in task["problems"]:
            problem.update(overrides.get(problem["label"], {}))
    total = sum(p["points_max"] for t in ordered for p in t["problems"])
    return {
        "slug": spec["slug"],
        "year": spec["year"],
        "session": spec["session"],
        "formula": spec["formula"],
        "title": spec["title"],
        "order": spec["order"],
        "exam_date": meta["date"],
        "duration_minutes": meta["duration"] or None,
        "max_points": meta["points"] or total,
        "computed_points": total,
        "tasks": ordered,
    }


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--list" in sys.argv:
        print("\n".join(e["slug"] for e in EXAMS))
        return
    if len(args) < 2:
        sys.exit(__doc__)
    pdf_dir, out_dir, only = args[0], args[1], set(args[2:])
    os.makedirs(out_dir, exist_ok=True)
    exams = []
    for spec in EXAMS:
        if only and spec["slug"] not in only:
            continue
        exam = build_exam(spec, pdf_dir, out_dir)
        n_problems = sum(len(t["problems"]) for t in exam["tasks"])
        flag = "" if exam["computed_points"] == exam["max_points"] else f"  !! punkty {exam['computed_points']} != {exam['max_points']}"
        print(f"{exam['slug']:24s} tasks={len(exam['tasks']):2d} problems={n_problems:3d} points={exam['computed_points']}/{exam['max_points']}{flag}")
        exams.append(exam)
    with open(os.path.join(out_dir, "exams.json"), "w", encoding="utf-8") as f:
        json.dump(exams, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
