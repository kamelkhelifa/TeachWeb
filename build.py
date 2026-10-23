#!/usr/bin/env python3
"""Build TeachWeb into _site/.

The site has two parts:
  Part 1 · Courses taught  data/taught/<university>/<course>.yml  (TAUGHT_SCHEMA.md)  → /taught/…
  Part 2 · Open courses    data/open/<course>.yml                 (COURSE_SCHEMA.md)  → /open/…
English pages live at the site root, Arabic under /ar/, and French under /fr/
(French only for the courses taught in Algeria).

    python build.py              # build
    python build.py --drafts     # also build unpublished Part 2 courses (local preview only)
    python build.py --serve      # build, then serve on http://localhost:8000
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
PREFIX = {"en": "", "ar": "ar/", "fr": "fr/"}


def load(path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


SITE = load(ROOT / "data" / "site.yml")
UI = load(ROOT / "data" / "i18n.yml")
GUIDE = load(ROOT / "data" / "guide.yml")
UNIS = load(ROOT / "data" / "universities.yml")


# ---------- cleaning course text ----------
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


def load_yaml_course(p):
    try:
        return tidy(load(p))
    except yaml.YAMLError as e:
        print(f"!! skipped {p.relative_to(ROOT)}: invalid YAML ({e.problem}, line {e.problem_mark.line + 1})", file=sys.stderr)
        return None


def common(c):
    c.setdefault("materials", [])
    c.setdefault("exams", [])
    c.setdefault("sims", [])
    c["n_materials"] = len(c["materials"]) + len(c["exams"])
    h = c.get("hours") or {}
    total = sum(h.get(k, 0) or 0 for k in ("lecture", "tutorial", "lab"))
    c["contact_hours"] = int(total) if float(total).is_integer() else total
    weights = [a.get("weight") for a in c.get("assessment") or []]
    c["weights_ok"] = bool(weights) and all(isinstance(w, (int, float)) for w in weights) and abs(sum(weights) - 100) < 1e-6
    return c


def load_open(drafts):
    courses = []
    for p in sorted((ROOT / "data" / "open").glob("*.yml")):
        c = load_yaml_course(p)
        if c is None or p.name.startswith("_"):
            continue
        c["draft"] = not c.get("published", False)
        if c["draft"] and not drafts:
            continue
        c.setdefault("prerequisites", [])
        common(c)
        c["branch"] = "open"
        c["key"] = c["slug"]
        c["path"] = f"open/{c['slug']}/"
        c["n_questions"] = sum(len(q.get("questions", [])) for q in c.get("quizzes", []))
        c["n_terms"] = len(c.get("glossary", []))
        c["hue"] = SITE["areas"][c["area"]]["hue"]
        c["langs"] = ["en", "ar"]
        courses.append(c)
    courses.sort(key=lambda c: (c.get("order", 999), c["slug"]))
    by_slug = {c["slug"]: c for c in courses}
    for c in courses:
        c["prerequisites"] = [s for s in c["prerequisites"] if s in by_slug]
        c["leads_to"] = [d["slug"] for d in courses if c["slug"] in d["prerequisites"]]
    return courses, by_slug


ROMAN = "I II III IV V VI VII VIII IX X XI XII XIII XIV XV XVI XVII XVIII XIX XX".split()


def load_taught(companions):
    unis = []
    for u in UNIS:
        u = dict(u)
        u["langs"] = ["en", "ar"] + (["fr"] if u.get("french") else [])
        courses = []
        for p in sorted((ROOT / "data" / "taught" / u["id"]).glob("*.yml")):
            c = load_yaml_course(p)
            if c is None:
                continue
            # the interactive lab and the glossary come from the companion Part 2 course (published or not)
            comp = companions.get(c.get("companion"))
            if comp:
                c.setdefault("sims", list(comp.get("sims") or []))
                c.setdefault("glossary", comp.get("glossary") or [])
            common(c)
            c["branch"] = "taught"
            c["uni"] = u
            c["key"] = f"{u['id']}/{c['slug']}"
            c["path"] = f"taught/{u['id']}/{c['slug']}/"
            c["hue"] = u["hue"]
            c["langs"] = u["langs"]
            c.setdefault("taught", [])
            for i, w in enumerate(c.get("schedule") or []):
                if w.get("week") in (None, ""):   # a chapter plan without weeks: number it I, II, III…
                    w["week"] = ROMAN[i] if i < len(ROMAN) else str(i + 1)
            c["taught_langs"] = sorted({t["lang"] for t in c["taught"] if t.get("lang")}, key=["en", "ar", "fr"].index)
            c["prerequisites_text"] = c.pop("prerequisites", None)
            courses.append(c)
        courses.sort(key=lambda c: (c.get("order", 999), c["slug"]))
        u["courses"] = courses
        u["n_materials"] = sum(c["n_materials"] for c in courses)
        unis.append(u)
    return unis


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


ARABIC = re.compile(r"[\u0600-\u06FF]")


def ltr(s):
    """Keep numeric ranges such as 2019–2020 in reading order inside Arabic text."""
    s = str(s or "")
    return Markup(s) if ARABIC.search(s) else Markup(f'<bdi dir="ltr">{s}</bdi>')


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", str(s or ""))


class Ctx:
    """Per-page helpers: language picking and relative URLs.
    `path` is the language-independent page path, e.g. "taught/qu/phys193/" ("" for the hub)."""

    def __init__(self, lang, path, langs, pages):
        self.lang, self.path, self.langs, self.pages = lang, path, langs, pages
        out = PREFIX[lang] + path
        self.root = "../" * out.count("/") or "./"

    def t(self, v):
        if isinstance(v, dict) and ("en" in v or "ar" in v):
            return Markup(v.get(self.lang) or v.get("en") or "")
        if isinstance(v, str):
            return Markup(v)
        return v if v is not None else ""

    def ui(self, key):
        e = UI[key]
        return Markup(e.get(self.lang) or e["en"])

    def url(self, p=""):
        """Link to page `p` in the current language, or in English if it has no version in this language."""
        target = p.split("#")[0]
        lang = self.lang if target in self.pages[self.lang] else "en"
        return self.root + PREFIX[lang] + p

    def asset(self, p):
        return self.root + p

    def alts(self):
        """[(lang, url, is_current)] for the language switcher."""
        return [(l, self.root + PREFIX[l] + self.path, l == self.lang) for l in self.langs]


def search_index(lang, unis, open_courses):
    def pick(v):
        if isinstance(v, dict):
            return strip_tags(v.get(lang) or v.get("en"))
        return strip_tags(v)

    items = []
    for u in unis:
        if lang not in u["langs"]:
            continue
        for c in u["courses"]:
            base = c["path"]
            items.append({"k": "course", "t": pick(c["title"]), "s": f"{pick(u['name'])} · {' / '.join(c.get('codes') or [])}",
                          "x": " ".join(c.get("codes") or []), "u": base, "h": c["hue"]})
            for w in c.get("schedule") or []:
                topics = (w.get("topics") or {}).get(lang) or []
                items.append({"k": "week", "t": pick(w["title"]), "s": f"{pick(c['title'])} · {pick(u['name'])}",
                              "x": " ".join(strip_tags(x) for x in topics), "u": base + f"#week-{w['week']}", "h": c["hue"]})
    if lang != "fr":
        for c in open_courses:
            base = c["path"]
            items.append({"k": "course", "t": pick(c["title"]), "s": pick(c["tagline"]),
                          "x": " ".join(c.get("codes", [])) + " " + pick(c["short"]), "u": base, "h": c["hue"]})
            for tp in c.get("topics", []):
                items.append({"k": "topic", "t": pick(tp), "s": pick(c["title"]), "u": base + "#overview", "h": c["hue"]})
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


def build(drafts=False):
    open_courses, by_slug = load_open(drafts)
    unis = load_taught({c["slug"]: c for c in load_open(True)[0]})
    taught_courses = [c for u in unis for c in u["courses"]]
    gloss = glossary_all(open_courses)

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(ROOT / "static", OUT / "static")
    (OUT / ".nojekyll").write_text("")

    env = Environment(loader=FileSystemLoader(ROOT / "templates"), autoescape=False, trim_blocks=True, lstrip_blocks=True)
    env.filters["para"] = paragraphs
    env.filters["plain"] = strip_tags
    env.filters["ltr"] = ltr
    env.filters["tojson_safe"] = lambda v: Markup(json.dumps(v, ensure_ascii=False).replace("</", "<\\/"))

    stats = {
        "universities": len(unis),
        "taught": len(taught_courses),
        "taught_materials": sum(c["n_materials"] for c in taught_courses),
        "open": len(open_courses),
        "weeks": sum(len(c.get("schedule", [])) for c in open_courses),
        "materials": sum(c["n_materials"] for c in open_courses),
        "questions": sum(c["n_questions"] for c in open_courses),
        "terms": len(gloss),
    }

    # every page: (template, path, languages, extra context)
    plan = [("hub.html", "", ["en", "ar"], {"page": "hub", "branch": "hub"}),
            ("taught.html", "taught/", ["en", "ar", "fr"], {"page": "taught", "branch": "taught"}),
            ("open.html", "open/", ["en", "ar"], {"page": "open", "branch": "open"}),
            ("guide.html", "guide/", ["en", "ar"], {"page": "guide", "branch": "hub", "guide": GUIDE})]
    if gloss:
        plan.append(("glossary.html", "glossary/", ["en", "ar"],
                     {"page": "glossary", "branch": "open", "terms": gloss, "gloss_courses": open_courses}))
    for c in taught_courses:
        plan.append(("course.html", c["path"], c["langs"], {"page": "course", "branch": "taught", "c": c}))
    for c in open_courses:
        plan.append(("course.html", c["path"], c["langs"], {"page": "course", "branch": "open", "c": c}))
    pages = {l: {p for _, p, langs, _ in plan if l in langs} for l in PREFIX}

    for lang in PREFIX:
        (OUT / "static" / "js" / f"search-{lang}.js").write_text(
            "window.TW_INDEX=" + json.dumps(search_index(lang, unis, open_courses), ensure_ascii=False, separators=(",", ":")) + ";\n",
            encoding="utf-8")

    written = []
    for tpl, path, langs, kw in plan:
        for lang in langs:
            ctx = Ctx(lang, path, langs, pages)
            shown_unis = [u for u in unis if lang in u["langs"]]
            html = env.get_template(tpl).render(
                site=SITE, lang=lang, dir="rtl" if lang == "ar" else "ltr", t=ctx.t, ui=ctx.ui, url=ctx.url,
                asset=ctx.asset, alts=ctx.alts(), page_path=PREFIX[lang] + path, path=path, pages=pages,
                unis=shown_unis, all_unis=unis, open_courses=open_courses, by_slug=by_slug, stats=stats,
                has_glossary=bool(gloss), drafts=drafts, **kw)
            dest = OUT / (PREFIX[lang] + path) / "index.html"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(html, encoding="utf-8")
            written.append(PREFIX[lang] + path)
    ctx = Ctx("en", "", ["en"], pages)
    (OUT / "404.html").write_text(env.get_template("404.html").render(
        site=SITE, lang="en", dir="ltr", t=ctx.t, ui=ctx.ui, url=lambda p="": SITE["base_url"].rstrip("/") + "/" + p,
        asset=lambda p: SITE["base_url"].rstrip("/") + "/" + p, alts=[], page_path="404.html", path="404", pages=pages,
        unis=unis, all_unis=unis, open_courses=open_courses, by_slug=by_slug, stats=stats, has_glossary=bool(gloss),
        drafts=drafts, page="404", branch="hub"), encoding="utf-8")

    base = SITE["base_url"].rstrip("/")
    urls = "".join(f"  <url><loc>{base}/{p}</loc></url>\n" for p in written)
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')
    if SITE.get("launched"):
        (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n")
    else:  # not launched yet: keep the site out of search engines
        (OUT / "robots.txt").write_text("User-agent: *\nDisallow: /\n")
    print(f"Built {len(written)} pages · {stats}" + (" · DRAFTS INCLUDED" if drafts else ""))


if __name__ == "__main__":
    build(drafts="--drafts" in sys.argv)
    if "--serve" in sys.argv:
        import functools
        import http.server
        handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(OUT))
        print("Serving on http://localhost:8000")
        http.server.ThreadingHTTPServer(("", 8000), handler).serve_forever()
