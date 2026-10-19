#!/usr/bin/env python3
"""Parses a Guitar Pro tab exported to PDF (vector, with a text layer) into JSON:

  python3 scripts/gitara/parse_tab_pdf.py <file.pdf> [out.json]

What is read from the page geometry (no OCR):
  * tab staves  = groups of six horizontal lines ~6.4pt apart; top line = 1st (high e) string
  * bar lines   = thin vertical rects/lines spanning the staff
  * notes       = digit text spans whose centre lies on a staff line (string = that line)
  * "<12>"      = artificial harmonic written next to a fret ("0 <12>" sounds at fret 12)
  * "X" = muted note, "(3)" = tied/ghost note, "H"/"P" labels above the staff = hammer-on/pull-off
  * rhythm      = estimated from the x position of each event inside its bar (Guitar Pro
                  spaces events in proportion to their time), quantised to 1/4 beat. 4/4 assumed.
Output events carry `beat` (0..4 inside the bar) so a play-along mode can follow the tempo.
"""
import json
import re
import sys

import fitz  # PyMuPDF

STRING_GAP = (5.8, 7.0)  # distance between tab lines
BEATS_PER_BAR = 4.0


def horizontal_lines(page):
    """y -> list of (x0, x1) for every horizontal line segment."""
    by_y = {}
    for d in page.get_drawings():
        for it in d["items"]:
            if it[0] == "l":
                a, b = it[1], it[2]
                if abs(a.y - b.y) < 0.3 and abs(a.x - b.x) > 3:
                    by_y.setdefault(round(a.y, 1), []).append((min(a.x, b.x), max(a.x, b.x)))
            elif it[0] == "re":
                r = it[1]
                if r.height < 1.0 and r.width > 3:
                    by_y.setdefault(round((r.y0 + r.y1) / 2, 1), []).append((r.x0, r.x1))
    return by_y


def find_staves(page):
    """Returns [(top_y, gap, x0, x1)] for each 6-line tab staff on the page."""
    by_y = horizontal_lines(page)
    long_ys = []
    for y, segs in by_y.items():
        span = max(s[1] for s in segs) - min(s[0] for s in segs)
        covered = sum(s[1] - s[0] for s in segs)
        if span > 100 and covered > 0.6 * span:
            long_ys.append(y)
    long_ys.sort()
    staves = []
    i = 0
    while i + 5 < len(long_ys):
        ys = long_ys[i : i + 6]
        gaps = [ys[k + 1] - ys[k] for k in range(5)]
        if all(STRING_GAP[0] <= g <= STRING_GAP[1] for g in gaps) and max(gaps) - min(gaps) < 0.6:
            segs = [s for y in ys for s in by_y[y]]
            staves.append((ys[0], sum(gaps) / 5, min(s[0] for s in segs), max(s[1] for s in segs)))
            i += 6
        else:
            i += 1
    return staves


def bar_lines(page, top, bottom, x0, x1):
    xs = []
    for d in page.get_drawings():
        for it in d["items"]:
            if it[0] == "re":
                r = it[1]
                if r.width < 1.4 and r.height >= (bottom - top) - 2 and abs(r.y0 - top) < 3.5:
                    xs.append((r.x0 + r.x1) / 2)
            elif it[0] == "l":
                a, b = it[1], it[2]
                if abs(a.x - b.x) < 0.3 and abs(min(a.y, b.y) - top) < 3.5 and abs(max(a.y, b.y) - bottom) < 3.5:
                    xs.append(a.x)
    xs = sorted(set(round(x, 1) for x in xs if x0 - 3 <= x <= x1 + 3))
    merged = []
    for x in xs:  # double bar lines etc.
        if not merged or x - merged[-1] > 4:
            merged.append(x)
    return merged


def spans(page):
    out = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for sp in line["spans"]:
                t = sp["text"].strip()
                if t:
                    out.append({"t": t, "x0": sp["bbox"][0], "x1": sp["bbox"][2], "y0": sp["bbox"][1], "y1": sp["bbox"][3]})
    return out


def parse_page(page, bar_counter):
    staves = find_staves(page)
    sp_all = spans(page)
    systems = []
    for top, gap, sx0, sx1 in staves:
        bottom = top + 5 * gap
        bars = bar_lines(page, top, bottom, sx0, sx1)
        if len(bars) < 2:
            continue
        in_staff = []
        above = []
        for s in sp_all:
            cy = (s["y0"] + s["y1"]) / 2
            if sx0 - 2 <= s["x0"] <= sx1 + 2:
                if top - gap * 0.6 <= cy <= bottom + gap * 0.6:
                    in_staff.append(s)
                elif top - 45 <= cy < top - gap * 0.6:
                    above.append(s)
        systems.append({"top": top, "gap": gap, "bars": bars, "x0": sx0, "x1": sx1, "staff": in_staff, "above": above})
    return systems


def note_tokens(system):
    """[(x, string 1..6, fret|None, flags)] from the digit/X/parenthesis spans inside the staff."""
    top, gap = system["top"], system["gap"]
    toks = []
    texts = system["staff"]
    # attach "<12>" markers to the fret on their left
    brackets = [t for t in texts if re.fullmatch(r"<\d+>", t["t"])]
    for t in texts:
        raw = t["t"]
        if re.fullmatch(r"<\d+>", raw):
            continue
        m = re.fullmatch(r"\(?(\d{1,2})\)?|X", raw)
        if not m:
            # "0 <12>" can arrive as one span
            m2 = re.fullmatch(r"(\d{1,2})\s*<(\d+)>", raw)
            if not m2:
                continue
        cy = (t["y0"] + t["y1"]) / 2
        string = int(round((cy - top) / gap)) + 1
        if not 1 <= string <= 6:
            continue
        flags = {}
        if raw.startswith("(") and raw.endswith(")"):
            flags["tie"] = True
        if raw == "X":
            toks.append(((t["x0"] + t["x1"]) / 2, string, None, {"mute": True}))
            continue
        m2 = re.fullmatch(r"(\d{1,2})\s*<(\d+)>", raw)
        if m2:
            fret = int(m2.group(1))
            flags["ah"] = int(m2.group(2))
        else:
            fret = int(re.sub(r"\D", "", raw))
            for b in brackets:
                bcy = (b["y0"] + b["y1"]) / 2
                if abs(bcy - cy) < gap * 0.6 and 0 <= b["x0"] - t["x1"] < 6:
                    flags["ah"] = int(re.sub(r"\D", "", b["t"]))
                    break
        toks.append(((t["x0"] + t["x1"]) / 2, string, fret, flags))
    return toks


def build_bars(system, bar_counter):
    toks = note_tokens(system)
    bars = system["bars"]
    out = []
    # label annotations above the staff
    labels = [(s["x0"], s["t"]) for s in system["above"] if re.fullmatch(r"[A-Za-z][A-Za-z ]+\d?", s["t"]) and s["t"] not in ("AH", "H", "P", "X")]
    techs = [((s["x0"] + s["x1"]) / 2, s["t"]) for s in system["above"] if s["t"] in ("AH", "H", "P")]
    for i in range(len(bars) - 1):
        bx0, bx1 = bars[i], bars[i + 1]
        in_bar = [t for t in toks if bx0 < t[0] < bx1]
        in_bar.sort(key=lambda t: t[0])
        groups = []
        for t in in_bar:  # chords: same x within 2.4pt
            if groups and abs(t[0] - groups[-1]["x"]) < 2.4:
                groups[-1]["items"].append(t)
                groups[-1]["x"] = sum(i[0] for i in groups[-1]["items"]) / len(groups[-1]["items"])
            else:
                groups.append({"x": t[0], "items": [t]})
        bar_counter[0] += 1
        content_x0 = groups[0]["x"] if groups else bx0
        width = bx1 - bx0
        events = []
        for g in groups:
            beat = round(((g["x"] - bx0 - 2.0) / max(width - 4.0, 1)) * BEATS_PER_BAR * 4) / 4
            beat = max(0.0, min(BEATS_PER_BAR - 0.25, beat))
            notes = []
            for _, string, fret, fl in sorted(g["items"], key=lambda i: i[1]):
                n = {"s": string}
                if fret is not None:
                    n["f"] = fret
                n.update(fl)
                notes.append(n)
            ev = {"beat": beat, "notes": notes}
            tech = [t for x, t in techs if abs(x - g["x"]) < 4]
            if tech:
                ev["tech"] = tech[0]
            events.append(ev)
        bar = {"n": bar_counter[0], "events": events}
        for lx, lt in labels:
            if bx0 - 1 <= lx < bx1 and i == 0 or (abs(lx - bx0) < 6):
                bar["section"] = lt
        out.append(bar)
    return out


def header(doc):
    text = "\n".join(p.get_text() for p in doc)
    lines = [l.strip() for l in doc[0].get_text().split("\n") if l.strip()]
    title = lines[0] if lines else ""
    artist = lines[1] if len(lines) > 1 else ""
    arr = re.search(r"(Arranged(?: & Written)? by [^\n]+)", text)
    capo = re.search(r"Capo\.? ?fret (\d+)", text, re.I)
    tempo = re.search(r"=\s*(\d{2,3})", text)
    note = re.search(r"\*([^*\n]*ARTIF[^*\n]*)\*", text)
    return {
        "title": title,
        "artist": artist,
        "arranger": re.sub(r"^Arranged(?: & Written)? by ", "", arr.group(1)).strip() if arr else None,
        "capo": int(capo.group(1)) if capo else 0,
        "tempo": int(tempo.group(1)) if tempo else None,
        "tuning": "standard" if "Standard tuning" in text else "unknown",
        "note": note.group(1).strip() if note else None,
    }


def parse(path):
    doc = fitz.open(path)
    meta = header(doc)
    bar_counter = [0]
    bars = []
    for page in doc:
        for system in parse_page(page, bar_counter):
            bars.extend(build_bars(system, bar_counter))
    meta["bars"] = bars
    meta["source_file"] = path.split("/")[-1]
    return meta


if __name__ == "__main__":
    result = parse(sys.argv[1])
    out = json.dumps(result, ensure_ascii=False)
    if len(sys.argv) > 2:
        open(sys.argv[2], "w", encoding="utf-8").write(out)
    else:
        sys.stdout.write(out)
    nb = len(result["bars"])
    ne = sum(len(b["events"]) for b in result["bars"])
    nn = sum(len(e["notes"]) for b in result["bars"] for e in b["events"])
    print(f"{result['title']} / {result['artist']} — capo {result['capo']}, tempo {result['tempo']}: {nb} bars, {ne} events, {nn} notes", file=sys.stderr)
