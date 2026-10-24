#!/usr/bin/env python3
"""Check every course file in data/open/ against COURSE_SCHEMA.md.

Usage:  python tools/validate.py            # all courses
        python tools/validate.py slug ...   # selected courses
Exit code 1 if any error was found. Warnings never fail.
"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
COURSES = ROOT / "data" / "open"

AREAS = {"mechanics", "electromagnetism", "waves", "thermal", "quantum", "modern",
         "mathematical", "computational", "laboratory", "skills"}
BLOOM = {"remember", "understand", "apply", "analyze", "evaluate", "create"}
DOMAINS = {"knowledge", "skills", "values"}
ASSESS = {"quiz", "homework", "midterm", "final", "lab", "project", "presentation",
          "participation", "report", "oral", "portfolio"}
MILESTONES = {"quiz", "midterm", "final", "project", "lab", "review"}
MATERIALS = {"notes", "slides", "problems", "solutions", "summary", "video", "sim", "lab",
             "formula", "code", "reading", "link"}
LANGS = {"en", "ar", "fr"}
SIMS = {"projectile", "efield", "rc-circuit", "oscillator", "waves", "particle-box", "two-level",
        "blackbody", "boltzmann", "fourier", "ode-solver", "particles", "phase-space", "vocab"}
OPTIONAL_TOP = ["published", "notes", "sources", "sims", "prerequisite_note"]
REQUIRED = ["slug", "order", "codes", "short", "title", "tagline", "area", "level", "credits",
            "hours", "weeks", "instruction", "prerequisites", "description", "topics", "outcomes",
            "assessment", "schedule", "materials", "exams", "exam_guide", "problems", "quizzes",
            "textbooks", "glossary"]
CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")
ARABIC = re.compile(r"[؀-ۿ]")


class Report:
    def __init__(self, name):
        self.name, self.errors, self.warnings = name, [], []

    def err(self, where, msg):
        self.errors.append(f"{where}: {msg}")

    def warn(self, where, msg):
        self.warnings.append(f"{where}: {msg}")


def is_bi(v):
    return isinstance(v, dict) and "en" in v and "ar" in v


def check_bi(r, where, v, required=True):
    if v is None:
        if required:
            r.err(where, "missing")
        return
    if isinstance(v, str):
        r.err(where, "must be bilingual { en: …, ar: … }")
        return
    if not is_bi(v):
        r.err(where, "needs both 'en' and 'ar'")
        return
    extra = set(v) - {"en", "ar"}
    if extra:
        r.err(where, f"unexpected keys {sorted(map(str, extra))}: an unquoted comma inside {{ en: …, ar: … }}? Quote the text")
    for lang in ("en", "ar"):
        t = v[lang]
        if t in (None, "", []):
            r.err(f"{where}.{lang}", "empty")
    if isinstance(v["ar"], str) and v["ar"] and not ARABIC.search(v["ar"]) and not v["ar"].strip().startswith("\\"):
        r.warn(f"{where}.ar", f"contains no Arabic letters: {v['ar'][:60]!r}")


def walk_strings(v, path=""):
    if isinstance(v, str):
        yield path, v
    elif isinstance(v, dict):
        for k, x in v.items():
            yield from walk_strings(x, f"{path}.{k}")
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from walk_strings(x, f"{path}[{i}]")


def validate(path, slugs):
    r = Report(path.name)
    try:
        c = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        r.err("yaml", str(e).replace("\n", " "))
        return r
    if not isinstance(c, dict):
        r.err("file", "not a mapping")
        return r

    for k in REQUIRED:
        if k not in c:
            r.err(k, "required field missing")
    if c.get("slug") != path.stem:
        r.err("slug", f"must equal file name ({path.stem})")

    for p, s in walk_strings(c):
        if CONTROL.search(s):
            r.err(p, "control character found: a LaTeX backslash inside double quotes? use single quotes or |")
        if s.count("\\(") != s.count("\\)"):
            r.warn(p, "unbalanced \\( \\)")
        if s.count("$") % 2:
            r.warn(p, "odd number of $ signs (use \\( \\) for maths)")

    for k in ("short", "title", "tagline", "description"):
        check_bi(r, k, c.get(k))
    if c.get("prerequisite_note") is not None:
        check_bi(r, "prerequisite_note", c["prerequisite_note"])
    if c.get("area") not in AREAS:
        r.err("area", f"must be one of {sorted(AREAS)}")
    if c.get("level") not in (1, 2, 3, 4, 5):
        r.err("level", "must be 1–5")
    if not isinstance(c.get("sims", []), list):
        r.err("sims", "must be a list")
    for sim in c.get("sims") or []:
        if sim not in SIMS:
            r.err("sims", f"unknown sim {sim!r}")
    for lang in c.get("instruction") or []:
        if lang not in LANGS:
            r.err("instruction", f"unknown language {lang}")
    for p in c.get("prerequisites") or []:
        if p not in slugs:
            r.warn("prerequisites", f"unknown course slug {p!r} (not created yet?)")
    hours = c.get("hours") or {}
    if not isinstance(hours, dict) or not {"lecture", "tutorial", "lab"} <= set(hours):
        r.err("hours", "needs lecture, tutorial and lab")

    topics = c.get("topics") or []
    for i, t in enumerate(topics):
        check_bi(r, f"topics[{i}]", t)
    if not 6 <= len(topics) <= 12:
        r.warn("topics", f"{len(topics)} chips (aim for 6–10)")

    assess = c.get("assessment") or []
    ids = set()
    for i, a in enumerate(assess):
        w = f"assessment[{i}]"
        if a.get("id") in ids:
            r.err(w, "duplicate id")
        ids.add(a.get("id"))
        if a.get("type") not in ASSESS:
            r.err(w, f"type must be one of {sorted(ASSESS)}")
        if not isinstance(a.get("weight"), (int, float)):
            r.err(w, "weight must be a number")
        check_bi(r, f"{w}.title", a.get("title"))
        check_bi(r, f"{w}.detail", a.get("detail"))
        check_bi(r, f"{w}.when", a.get("when"), required=False)
    total = sum(a.get("weight") or 0 for a in assess if isinstance(a.get("weight"), (int, float)))
    if assess and abs(total - 100) > 1e-6:
        r.err("assessment", f"weights sum to {total}, must be 100")
    if len({a.get('type') for a in assess}) < 4:
        r.warn("assessment", "fewer than 4 different assessment types")

    outs = c.get("outcomes") or []
    if not 5 <= len(outs) <= 9:
        r.warn("outcomes", f"{len(outs)} outcomes (aim for 6–8)")
    for i, o in enumerate(outs):
        w = f"outcomes[{i}]"
        if o.get("bloom") not in BLOOM:
            r.err(w, f"bloom must be one of {sorted(BLOOM)}")
        if o.get("domain") not in DOMAINS:
            r.err(w, f"domain must be one of {sorted(DOMAINS)}")
        check_bi(r, f"{w}.text", o.get("text"))
        for a in o.get("assessed_by") or []:
            if a not in ids:
                r.err(w, f"assessed_by {a!r} is not an assessment id")
        if not o.get("assessed_by"):
            r.err(w, "assessed_by is empty")

    sched = c.get("schedule") or []
    weeks = [s.get("week") for s in sched]
    if weeks != list(range(1, len(sched) + 1)):
        r.err("schedule", f"weeks must be 1..N in order, got {weeks}")
    if c.get("weeks") and len(sched) != c["weeks"]:
        r.err("schedule", f"{len(sched)} weeks but weeks: {c['weeks']}")
    for i, s in enumerate(sched):
        w = f"schedule[{i}]"
        check_bi(r, f"{w}.title", s.get("title"))
        t = s.get("topics")
        check_bi(r, f"{w}.topics", t)
        if is_bi(t):
            if not isinstance(t["en"], list) or not isinstance(t["ar"], list):
                r.err(f"{w}.topics", "en and ar must be lists")
            elif len(t["en"]) != len(t["ar"]):
                r.err(f"{w}.topics", "en and ar lists differ in length")
        check_bi(r, f"{w}.activity", s.get("activity"), required=False)
        if s.get("milestone") and s["milestone"] not in MILESTONES:
            r.err(w, f"milestone must be one of {sorted(MILESTONES)}")

    for i, m in enumerate(c.get("materials") or []):
        w = f"materials[{i}]"
        if m.get("type") not in MATERIALS:
            r.err(w, f"type must be one of {sorted(MATERIALS)}")
        if not str(m.get("url", "")).startswith("http"):
            r.err(w, "url missing")
        check_bi(r, f"{w}.title", m.get("title"))
        if m.get("lang") and m["lang"] not in LANGS:
            r.err(w, "bad lang")

    for i, e in enumerate(c.get("exams") or []):
        w = f"exams[{i}]"
        check_bi(r, f"{w}.title", e.get("title"))
        if not (e.get("paper") or e.get("solution")):
            r.err(w, "needs paper or solution url")

    g = c.get("exam_guide") or {}
    for k in ("format", "allowed"):
        check_bi(r, f"exam_guide.{k}", g.get(k))
    for i, t in enumerate(g.get("tips") or []):
        check_bi(r, f"exam_guide.tips[{i}]", t)

    probs = c.get("problems") or []
    if len(probs) < 4:
        r.warn("problems", f"only {len(probs)} worked problems (aim for 4–6)")
    for i, p in enumerate(probs):
        w = f"problems[{i}]"
        for k in ("title", "statement", "solution"):
            check_bi(r, f"{w}.{k}", p.get(k))
        check_bi(r, f"{w}.hint", p.get("hint"), required=False)
        if p.get("difficulty") not in (1, 2, 3):
            r.err(w, "difficulty must be 1, 2 or 3")

    quizzes = c.get("quizzes") or []
    nq = 0
    if len(quizzes) < 3:
        r.warn("quizzes", f"only {len(quizzes)} quizzes (aim for 3–4)")
    for i, qz in enumerate(quizzes):
        w = f"quizzes[{i}]"
        check_bi(r, f"{w}.title", qz.get("title"))
        for j, q in enumerate(qz.get("questions") or []):
            nq += 1
            ww = f"{w}.questions[{j}]"
            check_bi(r, f"{ww}.q", q.get("q"))
            check_bi(r, f"{ww}.explain", q.get("explain"))
            opts = q.get("options") or []
            if len(opts) < 3:
                r.err(ww, "needs at least 3 options")
            for k, o in enumerate(opts):
                if not isinstance(o, (str, int, float)):
                    check_bi(r, f"{ww}.options[{k}]", o)
            if not isinstance(q.get("answer"), int) or not 0 <= q["answer"] < len(opts):
                r.err(ww, "answer must be a valid 0-based option index")
    if nq < 15:
        r.warn("quizzes", f"only {nq} questions in total (aim for 15–20)")

    tb = c.get("textbooks") or {}
    if not tb.get("required"):
        r.err("textbooks.required", "at least one required textbook")
    for k in ("required", "recommended"):
        for i, b in enumerate(tb.get(k) or []):
            if not b.get("title") or not b.get("authors"):
                r.err(f"textbooks.{k}[{i}]", "needs authors and title")
    for i, o in enumerate(tb.get("online") or []):
        check_bi(r, f"textbooks.online[{i}].title", o.get("title"))
        if not str(o.get("url", "")).startswith("http"):
            r.err(f"textbooks.online[{i}]", "url missing")

    gl = c.get("glossary") or []
    if len(gl) < 20:
        r.warn("glossary", f"only {len(gl)} terms (aim for 20–30)")
    for i, t in enumerate(gl):
        if not t.get("en") or not t.get("ar"):
            r.err(f"glossary[{i}]", "needs en and ar")
        extra = set(t) - {"en", "ar", "fr", "def"}
        if extra:
            r.err(f"glossary[{i}]", f"unexpected keys {sorted(map(str, extra))}: quote text containing commas")
        if t.get("def") is not None:
            check_bi(r, f"glossary[{i}].def", t["def"])
    return r


def main(argv):
    files = sorted(p for p in COURSES.glob("*.yml") if not p.name.startswith("_"))
    slugs = {p.stem for p in files}
    if argv:
        files = [COURSES / f"{a.removesuffix('.yml')}.yml" for a in argv]
    bad = 0
    for f in files:
        r = validate(f, slugs)
        status = "OK " if not r.errors else "ERR"
        print(f"[{status}] {f.name}  ({len(r.errors)} errors, {len(r.warnings)} warnings)")
        for e in r.errors:
            print("    ✗", e)
        for w in r.warnings:
            print("    ·", w)
        bad += bool(r.errors)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main(sys.argv[1:])
