# Part 1 · Courses taught — file format

Part 1 is the **record of the courses actually taught at each university, with that university's own syllabus**.
One file per course: `data/taught/<university>/<slug>.yml` (`<university>` is an id from `data/universities.yml`).

Run `python tools/validate.py` after editing.

## Rules

1. **Faithful, not invented.** The syllabus (description, outcomes, weekly plan, assessment weights, textbooks) is the one used at that university.
   If something is not known, **leave the field out**: the page shows a discreet "to be added" placeholder in its place.
2. **Bilingual everywhere**: every text is `{ en: …, ar: … }`.
   For courses taught in **Algeria** (Relizane, Chlef, USTHB), every text is **trilingual**: `{ en: …, ar: …, fr: … }`.
3. **Only your own materials.** Publish notes, slides, problem sets, solutions, exams, videos, etc. that you prepared yourself.
   Do **not** publish official university documents (master syllabi, forms, department lab manuals), files written by other people,
   translated/pirated books, student marks, questionnaires or portals. When unsure, put the item under `pending:` (never displayed) for review.
   Links to well-known open resources (MIT OCW, PhET, Feynman Lectures…) are fine under `textbooks.online`.
4. **Nothing personal**: no rooms, timetables, office hours, phone numbers, CRN/section numbers or student names.
5. Maths: LaTeX in `\( … \)` / `\[ … \]`, inside single quotes or `|` blocks (see COURSE_SCHEMA.md).
   Text containing `: ` or `, ` inside `{ en: …, ar: … }` must be quoted.

## Reference

```yaml
slug: quantum-mechanics-1             # = file name
order: 10                             # order inside the university (smaller first)
codes: [PHYS 401, PHYS 354]           # code(s) used at this university
title: { en: Quantum Mechanics I, ar: ميكانيكا الكم 1 }          # + fr for Algeria
tagline: { en: …, ar: … }             # optional, one sentence
level: { en: "Level 7 · 4th year", ar: "المستوى السابع · السنة الرابعة" }   # as defined by that university; optional
area: quantum                         # same keys as Part 2 (mechanics, electromagnetism, waves, thermal, quantum, modern, mathematical, computational, laboratory, skills)
companion: quantum-mechanics-1        # Part 2 course (data/open/) whose interactive lab and glossary are shown here
kind: { en: Lecture & tutorials, ar: محاضرات وأعمال موجهة }       # optional
taught:                               # every time it was taught here (language of instruction!)
  - { years: 2019–2020, code: PHYS 401, lang: en }
  - { years: 2017–2018, code: PHYS 354, lang: en }
credits: 3                            # optional
hours: { lecture: 3, tutorial: 1, lab: 0 }   # optional, per week
weeks: 15                             # optional
prerequisites: { en: …, ar: … }       # optional, free text (codes as used there)
corequisites: { en: …, ar: … }        # optional

description: { en: |, ar: | }         # optional → placeholder
objectives:                           # optional (some universities list objectives separately)
  - { en: …, ar: … }
methods:                              # optional: teaching / delivery methods
  - { en: …, ar: … }
safety:                               # optional: lab safety rules (lab courses)
  - { en: …, ar: … }
outcomes:                             # optional → placeholder
  - id: CLO1
    text: { en: …, ar: … }
    assessed_by: { en: "Homework 1–2, Quiz 1–2, Midterm, Final", ar: … }   # optional free text
assessment:                           # optional → placeholder. Weights exactly as at the university
  - type: midterm                     # quiz | homework | midterm | final | lab | project | presentation | participation | report | oral | portfolio
    weight: 30
    title: { en: Midterm exam, ar: الاختبار الفصلي }
    detail: { en: …, ar: … }          # optional
    when: { en: Week 7, ar: الأسبوع 7 }   # optional
assessment_note: { en: …, ar: … }     # optional (e.g. "best five reports count")
schedule:                             # optional → placeholder
  - week: 1                           # number, or a label such as "1–3"
    title: { en: …, ar: … }
    topics: { en: [ … ], ar: [ … ] }  # optional
    reading: Serway Ch. 22            # optional
    activity: { en: …, ar: … }        # optional
    milestone: midterm                # optional: quiz | midterm | final | project | lab | review | break
textbooks:                            # optional → placeholder
  required: [ { authors: …, title: …, edition: …, publisher: …, year: … } ]
  recommended: [ … ]
  online: [ { title: { en, ar }, url: …, note: { en, ar } } ]
materials:                            # your own material only (same format as Part 2)
  - { type: notes, title: { en, ar }, url: …, week: 1, lang: en }
exams:                                # your own past papers
  - { title: { en, ar }, session: 2019–2020, paper: …, solution: …, lang: en }

pending:                              # NOT displayed: items you must decide about
  - { what: "PHYS 101 lab manual (department document)", url: …, why: "prepared by the department, carries the university logo" }
sources: [ … ]                        # original pages used (not displayed)
notes: >                              # editor's notes (not displayed)
  …
```

A Part 1 course can later be polished into a Part 2 course (`data/open/`), which adds quizzes, worked problems, interactive labs and a glossary.
