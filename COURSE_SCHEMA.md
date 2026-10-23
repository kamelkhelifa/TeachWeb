# Course file format · صيغة ملف المقرر

Every course lives in **one file**: `data/courses/<slug>.yml`.
All courses follow exactly the same structure, so every course page on the site looks and works the same way.

Run `python tools/validate.py` after editing. It checks every course file and tells you what is missing.

---

## Golden rules

1. **Every piece of text is bilingual**: `{ en: …, ar: … }`. Never leave one language out.
   The only exceptions are proper data that is the same in both languages: URLs, course codes, book authors/titles, readings like `Griffiths §2.3`, numbers.
2. **Mathematics** is written in LaTeX between `\( … \)` (inline) or `\[ … \]` (display). The same LaTeX is used in both languages.
3. **YAML and backslashes**: any text containing a backslash (LaTeX!) must be written either
   - in **single quotes**: `en: 'The energy is \(E_n = n^2\pi^2\hbar^2/2ma^2\)'` (to write a `'` inside, double it: `''`), or
   - as a **block scalar** (`|` or `>`), which needs no escaping at all.
   Never put LaTeX inside double quotes.
4. Simple inline HTML is allowed inside text (`<strong>`, `<em>`, `<br>`, `<a href>`, `<ul><li>`), nothing else.
5. The site is about **courses**, not universities. Do not name universities, semesters or rooms in the text.
   Equivalent course codes go in `codes:` only.
6. Arabic uses Modern Standard Arabic with the standard physics terminology used in Arab universities
   (e.g. الدالة الموجية، المؤثر الهرميتي، الزخم الزاوي، التوافقي البسيط، شدة المجال).

---

## Full reference

```yaml
slug: quantum-mechanics-1          # = file name, lowercase-with-dashes
order: 120                          # sort order in the catalogue (smaller = earlier)
codes: [PHYS 354, PHYS 401, UEF 223]   # equivalent course codes (search only)
short: { en: QM I, ar: ك.ك 1 }      # 2–6 char badge shown on cards
title: { en: Quantum Mechanics I, ar: ميكانيكا الكم 1 }
tagline:                            # one sentence, shown under the title
  en: From the wavefunction to the hydrogen atom.
  ar: من الدالة الموجية إلى ذرة الهيدروجين.
area: quantum        # one of: mechanics | electromagnetism | waves | thermal | quantum | modern | mathematical | computational | laboratory | skills
level: 3             # year of study: 1, 2, 3, 4 (=final undergrad year) or 5 (=Master)
credits: 3
hours: { lecture: 3, tutorial: 1, lab: 0 }   # contact hours per week
weeks: 14
instruction: [en, ar]          # languages the material exists in: en, ar, fr
prerequisites: [modern-physics-2, mathematical-physics-2]   # slugs of other courses (may be empty: [])
prerequisite_note:             # free text (knowledge needed), optional
  en: Calculus, linear algebra and complex numbers.
  ar: التفاضل والتكامل، والجبر الخطي، والأعداد المركبة.
sims: [particle-box]          # ids of built-in interactive labs (see list below), may be []
sources: [ "https://khelifak.wordpress.com/…" ]   # original pages used (not displayed)
notes: >                       # editor's notes, not displayed: what was reconstructed / needs checking
  Weekly schedule taken from the 2019 page; quizzes and problems written new.

description:                   # 2–3 paragraphs (HTML <p> allowed, or blank-line separated)
  en: |
    …
  ar: |
    …

topics:                         # 6–10 short "at a glance" chips
  - { en: Wavefunction & Born rule, ar: الدالة الموجية وقاعدة بورن }

outcomes:                       # 6–8 Course Learning Outcomes (CLOs)
  - id: CLO1
    bloom: understand           # remember | understand | apply | analyze | evaluate | create
    domain: knowledge           # knowledge | skills | values  (NQF / ABET style)
    text:
      en: Explain the statistical interpretation of the wavefunction.
      ar: يشرح التفسير الإحصائي للدالة الموجية.
    assessed_by: [quizzes, homework, midterm, final]   # ids from `assessment`

assessment:                     # 5–8 components, weights MUST sum to 100
  - id: quizzes
    type: quiz                  # quiz | homework | midterm | final | lab | project | presentation | participation | report | oral | portfolio
    weight: 10
    title: { en: Weekly quizzes, ar: اختبارات قصيرة أسبوعية }
    detail: { en: …, ar: … }    # what, how, and how it is graded
    when: { en: Weeks 2–13, ar: الأسابيع 2–13 }

schedule:                       # one entry per week (weeks 1..N)
  - week: 1
    title: { en: The wavefunction, ar: الدالة الموجية }
    topics:
      en: [Overview of the course, 'Statistical interpretation of \(\Psi\)']
      ar: [نظرة عامة على المقرر, 'التفسير الإحصائي لـ \(\Psi\)']
    reading: Griffiths §1.1–1.2           # optional, not translated
    activity: { en: Problem set 1 released, ar: نشر السلسلة 1 }   # optional
    milestone: midterm          # optional: quiz | midterm | final | project | lab | review  (shown as a badge)

materials:                      # every downloadable / linkable item. Only items with a real URL.
  - type: notes                 # notes | slides | problems | solutions | summary | video | sim | lab | formula | code | reading | link
    title: { en: 1.1 The wavefunction, ar: 1.1 الدالة الموجية }
    url: https://drive.google.com/…
    week: 1                     # optional: links the item to a week of the schedule
    lang: en                    # optional: language of the document itself (en | ar | fr)

exams:                          # past papers (only with real URLs). May be [].
  - title: { en: First periodic exam, ar: الاختبار الدوري الأول }
    session: 2019–2020          # optional
    paper: https://…            # optional
    solution: https://…         # optional
    lang: en

exam_guide:                     # how exams in this course look (always present)
  format:  { en: …, ar: … }     # duration, structure, number of questions
  allowed: { en: …, ar: … }     # calculator, formula sheet…
  tips:                         # 3–5 tips
    - { en: …, ar: … }

problems:                       # 4–6 worked problems, exam style, with full solutions
  - title: { en: …, ar: … }
    difficulty: 2               # 1 easy · 2 medium · 3 hard
    statement: { en: …, ar: … }
    hint: { en: …, ar: … }
    solution: { en: …, ar: … }

quizzes:                        # 3–4 self-check quizzes (one per chapter), 5 questions each
  - title: { en: The wavefunction, ar: الدالة الموجية }
    questions:
      - q: { en: …, ar: … }
        options:                # 4 options. Bilingual, or a plain string if identical (math only)
          - { en: …, ar: … }
          - '\(\hbar\omega/2\)'
        answer: 0               # index of the right option (0-based)
        explain: { en: …, ar: … }

textbooks:
  required:
    - { authors: D. J. Griffiths & D. F. Schroeter, title: Introduction to Quantum Mechanics, edition: 3rd, publisher: Cambridge University Press, year: 2018 }
  recommended:
    - { authors: …, title: …, publisher: …, year: … }
  online:                       # free, high-quality resources
    - { title: { en: MIT OCW 8.04, ar: مقرر MIT OCW 8.04 }, url: https://ocw.mit.edu/…, note: { en: …, ar: … } }

glossary:                       # 20–30 key terms. en + ar required, fr optional
  - { en: Wavefunction, ar: الدالة الموجية, fr: Fonction d'onde, def: { en: …, ar: … } }
```

### Built-in interactive labs (`sims:`)

| id | What it shows |
|----|---------------|
| `projectile` | Projectile motion with drag-free trajectory, range and max height |
| `efield` | Electric field and equipotentials of draggable point charges |
| `rc-circuit` | Charging/discharging of an RC circuit, time constant |
| `oscillator` | Damped & driven harmonic oscillator, resonance curve |
| `waves` | Superposition of two travelling waves, standing waves, beats |
| `particle-box` | Infinite square well: eigenstates, superpositions, time evolution |
| `two-level` | Two-level system: Rabi oscillations (time-dependent perturbation) |
| `blackbody` | Planck spectrum vs temperature, Wien peak |
| `boltzmann` | Maxwell–Boltzmann speed distribution vs temperature and mass |
| `fourier` | Fourier series of square/triangle/sawtooth waves, Gibbs phenomenon |
| `ode-solver` | Euler vs RK4 on the pendulum/oscillator, error vs step size |
| `particles` | Interactive Standard Model particle table |
| `phase-space` | Phase portrait of a pendulum (Lagrangian/Hamiltonian mechanics) |
| `vocab` | Flashcards with spoken English pronunciation (language courses) |

### Maths macros available (KaTeX)

Besides standard LaTeX (KaTeX subset: `\frac`, `\int`, `\sum`, `\vec`, `\hat`, `\partial`, `\nabla`, `\begin{aligned}`, `\begin{pmatrix}`, `\begin{cases}`, …)
these shortcuts are defined: `\ket{\psi}`, `\bra{\psi}`, `\braket{\phi}{\psi}`, `\expval{x}`, `\abs{x}`, `\norm{x}`, `\vb{E}` (bold vector),
`\dv{f}{x}`, `\pdv{f}{x}`, `\dd` (upright d), `\comm{A}{B}`, `\order{x}`.
Do not use `\begin{align}` (use `\begin{aligned}` inside `\[ \]`), `\label`, `\eqref` or packages.
