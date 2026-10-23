#!/usr/bin/env python3
"""Build TeachWeb into _site/.

English pages live at the site root, Arabic pages under /ar/.
Every course is one YAML file in data/courses/ (see COURSE_SCHEMA.md).

    python build.py            # build
    python build.py --serve    # build, then serve on http://localhost:8000
"""
import json
import re
import shutil
import sys
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "_site"
LANGS = ("en", "ar")


def load(path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


SITE = load(ROOT / "data" / "site.yml")
UI = load(ROOT / "data" / "i18n.yml")
GUIDE = load(ROOT / "data" / "guide.yml")


LINEBREAK_SPACING = re.compile(r"\\\\\[\s*-?[\d.]+\s*(?:mm|cm|pt|em|ex)\s*\]")


MATH = re.compile(r"\\\((.*?)\\\)|\\\[(.*?)\\\]", re.S)


def escape_math(m):
    return m.group(0).replace("<", "&lt;").replace(">", "&gt;")


def tidy(v):
    """Recursively clean course text before it is put into HTML.
    - `\\\\[2mm]` (line break + spacing) confuses KaTeX's auto-render, which reads `\\[` as the
      start of display maths: keep the line break only.
    - `<` and `>` inside maths would be parsed as HTML tags: escape them (KaTeX reads the decoded text)."""
    if isinstance(v, str):
        v = LINEBREAK_SPACING.sub(r"\\\\ ", v)
        return MATH.sub(escape_math, v)
    if isinstance(v, dict):
        return {k: tidy(x) for k, x in v.items()}
    if isinstance(v, list):
        return [tidy(x) for x in v]
    return v


def load_courses():
    courses = []
    for p in sorted((ROOT / "data" / "courses").glob("*.yml")):
        if p.name.startswith("_"):
            continue
        try:
            c = tidy(load(p))
        except yaml.YAMLError as e:
            print(f"!! skipped {p.name}: invalid YAML ({e.problem}, line {e.problem_mark.line + 1})", file=sys.stderr)
            continue
        c.setdefault("sims", [])
        c.setdefault("materials", [])
        c.setdefault("exams", [])
        c.setdefault("prerequisites", [])
        courses.append(c)
    courses.sort(key=lambda c: (c.get("order", 999), c["slug"]))
    by_slug = {c["slug"]: c for c in courses}
    for c in courses:
        c["prerequisites"] = [s for s in c["prerequisites"] if s in by_slug]
        c["leads_to"] = [d["slug"] for d in courses if c["slug"] in d["prerequisites"]]
        c["n_questions"] = sum(len(q.get("questions", [])) for q in c.get("quizzes", []))
        c["n_materials"] = len(c["materials"]) + len(c["exams"])
        c["n_terms"] = len(c.get("glossary", []))
        h = c.get("hours", {})
        c["contact_hours"] = sum(h.get(k, 0) or 0 for k in ("lecture", "tutorial", "lab"))
        c["hue"] = SITE["areas"][c["area"]]["hue"]
    return courses, by_slug


# ---------- text helpers ----------
BLOCK = re.compile(r"^\s*<(p|ul|ol|div|table|pre|h\d|blockquote|figure)\b", re.I)


def paragraphs(text):
    """Blank-line separated text → <p> paragraphs (HTML blocks are left alone)."""
    if text is None:
        return Markup("")
    text = str(text).strip()
    out = []
    for block in re.split(r"\n\s*\n", text):
        block = block.strip()
        if not block:
            continue
        if BLOCK.match(block):
            out.append(block)
        else:
            out.append(f"<p>{' '.join(line.strip() for line in block.splitlines())}</p>")
    return Markup("\n".join(out))


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", str(s or ""))


class Ctx:
    """Per-page helpers: language picking and relative URLs."""

    def __init__(self, lang, path):
        self.lang = lang
        self.path = path  # output path relative to site root, e.g. "ar/courses/x/index.html"
        depth = path.count("/")
        self.root = "../" * depth or "./"
        self.prefix = "" if lang == "en" else "ar/"

    def t(self, v):
        if isinstance(v, dict) and ("en" in v or "ar" in v):
            return Markup(v.get(self.lang) or v.get("en") or "")
        if isinstance(v, str):
            return Markup(v)
        return v if v is not None else ""

    def ui(self, key):
        return Markup(UI[key][self.lang])

    def url(self, p=""):
        """Link to a page in the current language."""
        return self.root + self.prefix + p

    def asset(self, p):
        return self.root + p

    def other(self):
        """Same page in the other language."""
        rest = self.path[3:] if self.lang == "ar" else self.path
        target = rest if self.lang == "ar" else "ar/" + rest
        return self.root + target.removesuffix("index.html")


def search_index(lang, courses):
    def pick(v):
        return strip_tags(v.get(lang) if isinstance(v, dict) else v)

    items = []
    for c in courses:
        base = f"courses/{c['slug']}/"
        items.append({"k": "course", "t": pick(c["title"]), "s": pick(c["tagline"]),
                      "x": " ".join(c.get("codes", [])) + " " + pick(c["short"]), "u": base, "h": c["hue"]})
        for tp in c.get("topics", []):
            items.append({"k": "topic", "t": pick(tp), "s": pick(c["title"]), "u": base + "#overview", "h": c["hue"]})
        for w in c.get("schedule", []):
            items.append({"k": "week", "t": pick(w["title"]), "s": f"{pick(c['title'])} · {UI['week'][lang]} {w['week']}",
                          "x": " ".join(pick({"en": x, "ar": y}) for x, y in zip(w["topics"]["en"], w["topics"]["ar"])),
                          "u": base + f"#week-{w['week']}", "h": c["hue"]})
        for g in c.get("glossary", []):
            other = g["ar"] if lang == "en" else g["en"]
            items.append({"k": "term", "t": g[lang], "s": f"{other} · {pick(c['title'])}",
                          "x": (g.get("fr") or ""), "u": base + "#glossary", "h": c["hue"]})
    return items


def glossary_all(courses):
    seen = {}
    for c in courses:
        for g in c.get("glossary", []):
            key = g["en"].strip().lower()
            if key in seen:
                seen[key]["courses"].append(c["slug"])
                continue
            seen[key] = {**g, "courses": [c["slug"]]}
    return sorted(seen.values(), key=lambda g: g["en"].lower())


def build():
    courses, by_slug = load_courses()
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(ROOT / "static", OUT / "static")
    (OUT / ".nojekyll").write_text("")

    env = Environment(loader=FileSystemLoader(ROOT / "templates"), autoescape=False,
                      trim_blocks=True, lstrip_blocks=True)
    env.filters["para"] = paragraphs
    env.filters["plain"] = strip_tags
    env.filters["tojson_safe"] = lambda v: Markup(json.dumps(v, ensure_ascii=False).replace("</", "<\\/"))

    stats = {
        "courses": len(courses),
        "weeks": sum(len(c.get("schedule", [])) for c in courses),
        "materials": sum(c["n_materials"] for c in courses),
        "questions": sum(c["n_questions"] for c in courses),
        "terms": len(glossary_all(courses)),
    }
    gloss = glossary_all(courses)
    pages = []

    def render(tpl, lang, path, **kw):
        ctx = Ctx(lang, path)
        html = env.get_template(tpl).render(
            site=SITE, lang=lang, dir="rtl" if lang == "ar" else "ltr", t=ctx.t, ui=ctx.ui,
            url=ctx.url, asset=ctx.asset, other_url=ctx.other(), page_path=path,
            courses=courses, by_slug=by_slug, stats=stats, **kw)
        dest = OUT / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
        pages.append(path)

    for lang in LANGS:
        pre = "" if lang == "en" else "ar/"
        index = search_index(lang, courses)
        (OUT / "static" / "js" / f"search-{lang}.js").write_text(
            "window.TW_INDEX=" + json.dumps(index, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
        render("index.html", lang, pre + "index.html", page="home")
        render("glossary.html", lang, pre + "glossary/index.html", page="glossary", terms=gloss, gloss_courses=courses)
        render("guide.html", lang, pre + "guide/index.html", page="guide", guide=GUIDE)
        for c in courses:
            render("course.html", lang, pre + f"courses/{c['slug']}/index.html", page="course", c=c)
    render("404.html", "en", "404.html", page="404")

    base = SITE["base_url"].rstrip("/")
    urls = "".join(f"  <url><loc>{base}/{p.removesuffix('index.html')}</loc></url>\n" for p in pages if p != "404.html")
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n")
    print(f"Built {len(pages)} pages · {stats}")


if __name__ == "__main__":
    build()
    if "--serve" in sys.argv:
        import functools
        import http.server
        handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(OUT))
        print("Serving on http://localhost:8000")
        http.server.ThreadingHTTPServer(("", 8000), handler).serve_forever()
