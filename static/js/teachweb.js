/* TeachWeb — interactions. Vanilla JS, no dependencies besides KaTeX (loaded from CDN). */
(function () {
  'use strict';
  var TW = window.TW || {};
  var UI = TW.ui || {};
  var RTL = document.documentElement.dir === 'rtl';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- storage (never throws) ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('tw:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('tw:' + k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem('tw:' + k); } catch (e) {} }
  };
  TW.store = store;

  // ---------- maths ----------
  var MACROS = {
    '\\ket': '\\left|#1\\right\\rangle', '\\bra': '\\left\\langle#1\\right|', '\\braket': '\\left\\langle#1\\middle|#2\\right\\rangle',
    '\\expval': '\\left\\langle#1\\right\\rangle', '\\abs': '\\left|#1\\right|', '\\norm': '\\left\\lVert#1\\right\\rVert',
    '\\vb': '\\mathbf{#1}', '\\dv': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}', '\\pdv': '\\frac{\\partial#1}{\\partial#2}',
    '\\dd': '\\mathrm{d}', '\\comm': '\\left[#1,#2\\right]', '\\order': '\\mathcal{O}\\left(#1\\right)'
  };
  function renderMath(el) {
    if (!window.renderMathInElement) return;
    try {
      window.renderMathInElement(el || document.body, {
        delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }, { left: '$$', right: '$$', display: true }],
        macros: MACROS, throwOnError: false, ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input']
      });
    } catch (e) { /* keep raw LaTeX visible */ }
  }
  TW.renderMath = renderMath;

  // ---------- theme ----------
  var themeBtn = $('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('tw:theme', next); } catch (e) {}
    document.dispatchEvent(new CustomEvent('tw:theme'));
  });

  // ---------- header, scroll progress, back-to-top ----------
  var header = $('.site-header'), bar = $('.progress-bar span'), toTop = $('.to-top');
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (bar) bar.style.setProperty('--p', h > 0 ? Math.min(1, y / h) : 0);
    if (toTop) toTop.classList.toggle('show', y > 900);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  var menuBtn = $('.menu-toggle'), mnav = $('#mobile-nav');
  if (menuBtn && mnav) {
    menuBtn.addEventListener('click', function () {
      var open = mnav.hasAttribute('hidden');
      mnav.toggleAttribute('hidden', !open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.setAttribute('hidden', ''); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  }

  // ---------- reveal on scroll & counters ----------
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  $$('[data-count]').forEach(function (el) {
    var end = +el.getAttribute('data-count'); if (reduce || !end) return;
    var fmt = new Intl.NumberFormat(TW.lang === 'ar' ? 'ar' : 'en');
    var t0 = null; el.textContent = fmt.format(0);
    function step(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1400); el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); }
    setTimeout(function () { requestAnimationFrame(step); }, 300);
  });

  // ---------- hero canvas: interfering waves ----------
  var hc = $('.hero-canvas');
  if (hc && hc.getContext) {
    var ctx = hc.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), running = true;
    function size() { W = hc.clientWidth; H = hc.clientHeight; hc.width = W * dpr; hc.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);
    var cs = getComputedStyle(document.documentElement);
    function draw(t) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
      var n = 14;
      for (var i = 0; i < n; i++) {
        var y0 = H * (0.18 + 0.7 * i / n), amp = 10 + 16 * Math.sin(i * 0.7 + 1), k = 0.006 + i * 0.0006, w = 0.0005 + i * 0.00003;
        ctx.beginPath();
        for (var x = W * 0.25; x <= W + 10; x += 8) {
          var env = Math.min(1, (x - W * 0.25) / (W * 0.4));
          var y = y0 + env * (amp * Math.sin(k * x - w * t + i) + amp * 0.6 * Math.sin(k * 1.7 * x + w * 1.3 * t));
          if (x === W * 0.25) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var a = 0.06 + 0.05 * Math.sin(i);
        ctx.strokeStyle = (dark ? 'rgba(170,160,255,' : 'rgba(70,60,170,') + a + ')';
        ctx.lineWidth = 1.2; ctx.stroke();
      }
      if (!reduce) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !running) { running = true; requestAnimationFrame(draw); } running = v; }).observe(hc);
    document.addEventListener('tw:theme', function () { if (reduce) requestAnimationFrame(draw); });
  }

  // ---------- search palette ----------
  var pal = $('.palette');
  if (pal) {
    var input = $('input', pal), list = $('.palette-results', pal), sel = 0, results = [], lastFocus = null;
    var KIND = { course: UI.kind_course, term: UI.kind_term, week: UI.kind_week, topic: UI.kind_topic };
    var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ْ]/g, '').replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    function hl(s, q) {
      if (!q) return esc(s);
      var i = norm(s).indexOf(q); if (i < 0) return esc(s);
      return esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length));
    }
    function search(q) {
      var idx = window.TW_INDEX || [], nq = norm(q.trim());
      if (!nq) {
        results = idx.filter(function (x) { return x.k === 'course'; });
      } else {
        var words = nq.split(/\s+/);
        results = idx.map(function (x) {
          var t = norm(x.t), hay = t + ' ' + norm(x.s) + ' ' + norm(x.x || '');
          if (!words.every(function (w) { return hay.indexOf(w) >= 0; })) return null;
          var score = (t.indexOf(nq) === 0 ? 0 : t.indexOf(nq) > 0 ? 1 : 2) + ({ course: 0, topic: 0.4, week: 0.6, term: 0.5 }[x.k] || 1);
          return { x: x, s: score };
        }).filter(Boolean).sort(function (a, b) { return a.s - b.s; }).slice(0, 40).map(function (r) { return r.x; });
      }
      sel = 0;
      if (!results.length) { list.innerHTML = '<li class="palette-empty">' + esc(UI.search_empty || '') + '</li>'; return; }
      list.innerHTML = results.map(function (x, i) {
        return '<li role="option"><a href="' + TW.root + x.u + '" class="' + (i === 0 ? 'sel' : '') + '" style="--hue:' + x.h + '">' +
          '<span class="pr-kind">' + esc(KIND[x.k] || x.k) + '</span><span class="pr-text"><b>' + hl(x.t, nq) + '</b><small>' + esc(x.s || '') + '</small></span></a></li>';
      }).join('');
    }
    function move(d) {
      var as = $$('a', list); if (!as.length) return;
      as[sel] && as[sel].classList.remove('sel');
      sel = (sel + d + as.length) % as.length;
      as[sel].classList.add('sel'); as[sel].scrollIntoView({ block: 'nearest' });
    }
    function open() { lastFocus = document.activeElement; pal.hidden = false; document.body.style.overflow = 'hidden'; input.value = ''; search(''); setTimeout(function () { input.focus(); }, 10); }
    function close() { pal.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', open); });
    $$('[data-search-close]', pal).forEach(function (b) { b.addEventListener('click', close); });
    input.addEventListener('input', function () { search(input.value); });
    pal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { var a = $$('a', list)[sel]; if (a) { e.preventDefault(); location.href = a.href; close(); } }
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (pal.hidden && ((e.key === '/' && !/input|textarea|select/.test(tag)) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) { e.preventDefault(); open(); }
    });
  }

  // ---------- progress helpers ----------
  function setRing(svg, pct) { var c = svg && svg.querySelector('.ring-val'); if (c) c.setAttribute('stroke-dasharray', Math.max(0, Math.min(100, pct)).toFixed(1) + ' 100'); }
  $$('[data-progress-ring]').forEach(function (el) {
    var slug = el.getAttribute('data-progress-ring'), n = +el.getAttribute('data-weeks') || 1;
    var done = store.get('weeks:' + slug, []).length;
    setRing(el.querySelector('svg'), 100 * done / n);
    el.title = done + ' / ' + n + ' ' + (UI.completed_weeks || '');
  });

  // ---------- home: filters ----------
  var grid = $('[data-course-grid]');
  if (grid) {
    var fArea = '', fLevel = '';
    function apply() {
      var shown = 0;
      $$('.course-card', grid).forEach(function (c) {
        var ok = (!fArea || c.dataset.area === fArea) && (!fLevel || c.dataset.level === fLevel);
        c.classList.toggle('is-hidden', !ok); if (ok) shown++;
      });
      $('[data-filter-empty]').hidden = shown > 0;
    }
    $$('[data-filter-area]').forEach(function (b) { b.addEventListener('click', function () { fArea = b.dataset.filterArea; $$('[data-filter-area]').forEach(function (x) { x.classList.toggle('is-on', x === b); }); apply(); }); });
    $$('[data-filter-level]').forEach(function (b) { b.addEventListener('click', function () { fLevel = b.dataset.filterLevel; $$('[data-filter-level]').forEach(function (x) { x.classList.toggle('is-on', x === b); }); apply(); }); });
  }

  // ---------- Part 1 index: filter by language of instruction ----------
  var tf = $('[data-lang-filter]');
  if (tf) {
    $$('[data-taught-lang]', tf).forEach(function (b) {
      b.addEventListener('click', function () {
        var l = b.dataset.taughtLang;
        $$('[data-taught-lang]', tf).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        $$('.taught-card').forEach(function (c) { c.classList.toggle('is-hidden', !!l && (' ' + c.dataset.langs + ' ').indexOf(' ' + l + ' ') < 0); });
        $$('.uni-section').forEach(function (sec) { sec.hidden = !$$('.taught-card:not(.is-hidden)', sec).length; });
      });
    });
  }

  // ---------- home: learning path ----------
  var map = $('[data-path-map]');
  if (map) {
    var svg = $('.path-lines', map), nodes = {};
    $$('[data-node]', map).forEach(function (n) { nodes[n.dataset.node] = n; });
    var edges = [];
    Object.keys(nodes).forEach(function (k) {
      (nodes[k].dataset.prereqs || '').split(' ').filter(Boolean).forEach(function (p) { if (nodes[p]) edges.push([p, k]); });
    });
    function drawPaths() {
      if (getComputedStyle(svg).display === 'none') return;
      var mr = map.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + mr.width + ' ' + mr.height);
      svg.innerHTML = edges.map(function (e) {
        var a = nodes[e[0]].getBoundingClientRect(), b = nodes[e[1]].getBoundingClientRect();
        var x1, x2, y1 = a.top + a.height / 2 - mr.top, y2 = b.top + b.height / 2 - mr.top;
        if (!RTL) { x1 = a.right - mr.left; x2 = b.left - mr.left; } else { x1 = a.left - mr.left; x2 = b.right - mr.left; }
        if (Math.abs(a.left - b.left) < 4) { // same column
          x1 = (RTL ? a.left : a.right) - mr.left; x2 = (RTL ? b.left : b.right) - mr.left;
          var bulge = RTL ? -26 : 26;
          return '<path data-e="' + e[0] + ' ' + e[1] + '" d="M' + x1 + ',' + y1 + ' C' + (x1 + bulge) + ',' + y1 + ' ' + (x2 + bulge) + ',' + y2 + ' ' + x2 + ',' + y2 + '"/>';
        }
        var mx = (x1 + x2) / 2;
        return '<path data-e="' + e[0] + ' ' + e[1] + '" d="M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2 + '"/>';
      }).join('');
    }
    function related(k) {
      var set = {}; set[k] = 1;
      (function up(x) { edges.forEach(function (e) { if (e[1] === x && !set[e[0]]) { set[e[0]] = 1; up(e[0]); } }); })(k);
      (function down(x) { edges.forEach(function (e) { if (e[0] === x && !set[e[1]]) { set[e[1]] = 1; down(e[1]); } }); })(k);
      return set;
    }
    Object.keys(nodes).forEach(function (k) {
      function on() {
        var r = related(k); map.classList.add('hovering');
        Object.keys(nodes).forEach(function (n) { nodes[n].classList.toggle('on', !!r[n]); });
        $$('path', svg).forEach(function (p) { var e = p.getAttribute('data-e').split(' '); p.classList.toggle('on', !!(r[e[0]] && r[e[1]])); });
      }
      function off() { map.classList.remove('hovering'); $$('.on', map).forEach(function (x) { x.classList.remove('on'); }); }
      nodes[k].addEventListener('mouseenter', on); nodes[k].addEventListener('focus', on);
      nodes[k].addEventListener('mouseleave', off); nodes[k].addEventListener('blur', off);
    });
    drawPaths(); addEventListener('resize', drawPaths); addEventListener('load', drawPaths);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawPaths);
  }

  // ---------- course page ----------
  var course = $('[data-course]');
  if (course) initCourse(course);

  function initCourse(root) {
    var slug = root.dataset.course;
    function boxes0() { return $$('[data-week-done]'); }

    // print
    $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { print(); }); });

    // scrollspy
    var links = $$('[data-toc]'), secs = links.map(function (a) { return document.getElementById(a.dataset.toc); });
    function spy() {
      var y = scrollY + innerHeight * 0.3, cur = 0;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
      links.forEach(function (a, i) {
        var on = i === cur; if (a.classList.contains('active') !== on) { a.classList.toggle('active', on); if (on && innerWidth <= 1020) { var ul = a.closest('.toc-list'); ul.scrollLeft += (a.getBoundingClientRect().left + a.offsetWidth / 2) - (ul.getBoundingClientRect().left + ul.clientWidth / 2); } }
      });
    }
    addEventListener('scroll', spy, { passive: true }); spy();

    // weeks
    var done = store.get('weeks:' + slug, []).map(String);
    var nWeeks = boxes0().filter(function (b) { return !b.disabled; }).length || 1;
    var boxes = boxes0();
    function syncWeeks() {
      boxes.forEach(function (b) { var w = b.dataset.weekDone; b.checked = done.indexOf(w) >= 0; b.closest('.week').classList.toggle('done', b.checked); });
      var pct = 100 * done.length / nWeeks;
      setRing($('[data-week-progress] svg'), pct);
      var c = $('[data-week-count]'); if (c) c.textContent = done.length + ' / ' + nWeeks;
      var wb = $('[data-week-bar]'); if (wb) wb.style.width = pct + '%';
    }
    boxes.forEach(function (b) {
      b.addEventListener('change', function () {
        var w = b.dataset.weekDone;
        done = done.filter(function (x) { return x !== w; }); if (b.checked) done.push(w);
        store.set('weeks:' + slug, done); syncWeeks();
      });
    });
    syncWeeks();
    var reset = $('[data-weeks-reset]');
    if (reset) reset.addEventListener('click', function () { done = []; store.del('weeks:' + slug); syncWeeks(); });

    function setWeek(btn, open) {
      var panel = btn && document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    }
    $$('.week-toggle').forEach(function (btn) { btn.addEventListener('click', function () { setWeek(btn, btn.getAttribute('aria-expanded') !== 'true'); }); });
    $$('[data-weeks-toggle]').forEach(function (b) { b.addEventListener('click', function () { var o = b.dataset.weeksToggle === 'open'; $$('.week-toggle').forEach(function (x) { setWeek(x, o); }); }); });
    function openHash() {
      var m = /^#week-(.+)$/.exec(location.hash); if (!m) return;
      var w = document.getElementById('week-' + m[1]); if (w) { setWeek($('.week-toggle', w), true); }
    }
    addEventListener('hashchange', openHash); openHash();
    // open the first not-yet-studied week by default
    if (!location.hash) {
      var first = $$('.week').filter(function (w) { return !w.classList.contains('done') && $('.week-panel', w); })[0];
      if (first) setWeek($('.week-toggle', first), true);
    }

    // donut <-> list
    var donut = $('.donut');
    $$('[data-seg-hover]').forEach(function (li) {
      var seg = $('[data-seg="' + li.dataset.segHover + '"]');
      li.addEventListener('mouseenter', function () { donut.classList.add('hovering'); seg.classList.add('on'); li.classList.add('on'); });
      li.addEventListener('mouseleave', function () { donut.classList.remove('hovering'); seg.classList.remove('on'); li.classList.remove('on'); });
    });

    // calculator
    var calc = $('[data-calc]');
    if (calc) {
      var inputs = $$('input', calc), saved = store.get('calc:' + slug, {});
      inputs.forEach(function (inp, i) { if (saved[i] != null) inp.value = saved[i]; });
      function compute() {
        var tot = 0, any = false, s = {};
        inputs.forEach(function (inp, i) {
          var v = parseFloat(inp.value);
          if (!isNaN(v)) { v = Math.max(0, Math.min(100, v)); tot += v * (+inp.dataset.weight) / 100; any = true; s[i] = v; }
        });
        store.set('calc:' + slug, s);
        $('[data-calc-total]', calc).textContent = any ? tot.toFixed(1) : '—';
        $('[data-calc-20]', calc).textContent = any ? (tot / 5).toFixed(2) : '—';
      }
      inputs.forEach(function (inp) { inp.addEventListener('input', compute); }); compute();
    }

    // materials filter
    var mgrid = $('[data-mat-grid]');
    if (mgrid) {
      var mType = '', mq = '';
      var mitems = $$('li', mgrid);
      function mApply() {
        mitems.forEach(function (li) {
          var ok = (!mType || li.dataset.type === mType) && (!mq || li.textContent.toLowerCase().indexOf(mq) >= 0);
          li.hidden = !ok;
        });
      }
      $$('[data-mat-type]').forEach(function (b) { b.addEventListener('click', function () { mType = b.dataset.matType; $$('[data-mat-type]').forEach(function (x) { x.classList.toggle('is-on', x === b); }); mApply(); }); });
      var ms = $('[data-mat-search]'); if (ms) ms.addEventListener('input', function () { mq = ms.value.trim().toLowerCase(); mApply(); });
    }

    // problems: hint / solution
    $$('[data-problem]').forEach(function (p) {
      $$('[data-reveal]', p).forEach(function (b) {
        var box = $('[data-box="' + b.dataset.reveal + '"]', p), label = b.innerHTML;
        b.addEventListener('click', function () {
          var open = box.hidden; box.hidden = !open; b.setAttribute('aria-expanded', String(open));
        });
      });
    });

    // quizzes
    var tabs = $$('[data-quiz-tab]'), quizzes = $$('[data-quiz]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', String(on)); });
        quizzes.forEach(function (q) { q.hidden = q.dataset.quiz !== t.dataset.quizTab; });
      });
    });
    quizzes.forEach(function (qz) { initQuiz(qz, slug); });
  }

  function initQuiz(qz, slug) {
    var id = qz.dataset.quiz, qs = $$('[data-q]', qz), cur = 0, score = 0, answered = false;
    var next = $('[data-quiz-next]', qz), retry = $('[data-quiz-retry]', qz), result = $('.quiz-result', qz);
    var pos = $('[data-quiz-pos]', qz), dots = $('[data-quiz-dots]', qz), tabBest = $('[data-quiz-best="' + id + '"]');
    dots.innerHTML = qs.map(function () { return '<i></i>'; }).join('');
    var dotEls = $$('i', dots);
    function showBest() {
      var b = store.get('quiz:' + slug + ':' + id, null);
      if (b != null && tabBest) tabBest.textContent = qs.length + ' · ' + UI.best_score + ' ' + b + '%';
    }
    showBest();
    function show(i) {
      qs.forEach(function (q, j) { q.hidden = j !== i; });
      pos.textContent = UI.question + ' ' + (i + 1) + ' ' + UI.of + ' ' + qs.length;
      dotEls.forEach(function (d, j) { d.classList.toggle('cur', j === i); });
      next.disabled = true; answered = false;
      next.innerHTML = (i === qs.length - 1 ? UI.finish : UI.next) + ' <svg class="ic flip" aria-hidden="true"><use href="#i-arrow"/></svg>';
    }
    qs.forEach(function (q, qi) {
      var ans = +q.dataset.answer, opts = $$('.opt', q), fb = $('.q-feedback', q), verdict = $('.q-verdict', q);
      opts.forEach(function (o) {
        o.addEventListener('click', function () {
          if (answered) return; answered = true;
          var k = +o.dataset.opt, ok = k === ans;
          if (ok) score++;
          opts.forEach(function (x) {
            x.disabled = true;
            var j = +x.dataset.opt;
            if (j === ans) x.classList.add('right'); else if (x === o) x.classList.add('wrong'); else x.classList.add('dim');
          });
          verdict.textContent = ok ? UI.correct : UI.incorrect; verdict.className = 'q-verdict ' + (ok ? 'ok' : 'ko');
          fb.hidden = false; dotEls[qi].classList.add(ok ? 'ok' : 'ko');
          next.disabled = false; next.focus({ preventScroll: true });
        });
      });
    });
    next.addEventListener('click', function () {
      if (cur < qs.length - 1) { cur++; show(cur); return; }
      qs.forEach(function (q) { q.hidden = true; });
      var pct = Math.round(100 * score / qs.length);
      result.hidden = false; next.hidden = true; retry.hidden = false;
      pos.textContent = UI.your_score;
      $('[data-score]', result).textContent = score + '/' + qs.length;
      setTimeout(function () { setRing($('svg', result), pct); }, 30);
      $('[data-score-msg]', result).textContent = pct >= 80 ? UI.quiz_great : pct >= 50 ? UI.quiz_good : UI.quiz_low;
      var best = store.get('quiz:' + slug + ':' + id, null);
      if (best == null || pct > best) store.set('quiz:' + slug + ':' + id, pct);
      showBest();
    });
    retry.addEventListener('click', function () {
      cur = 0; score = 0; result.hidden = true; next.hidden = false; retry.hidden = true;
      setRing($('svg', result), 0);
      dotEls.forEach(function (d) { d.className = ''; });
      qs.forEach(function (q) {
        $('.q-feedback', q).hidden = true;
        var opts = $$('.opt', q), box = $('.q-options', q);
        opts.forEach(function (o) { o.disabled = false; o.classList.remove('right', 'wrong', 'dim'); });
        // shuffle options on retry
        for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
        opts.forEach(function (o, i) { box.appendChild(o); var key = o.querySelector('.opt-key'); key.textContent = (TW.lang === 'ar' ? 'أبجد' : 'ABCD').charAt(i); });
      });
      show(0);
    });
    show(0);
  }

  // ---------- glossary: table filter, flashcards, speech ----------
  $$('[data-gloss]').forEach(function (g) {
    var rows = $$('[data-term]', g), search = $('[data-gloss-search]', g), sel = $('[data-gloss-course]', g), count = $('[data-gloss-count]', g);
    var deck = rows.slice(), idx = 0;
    var card = $('[data-flash-card]', g);
    function visible() { return rows.filter(function (r) { return !r.hidden; }); }
    function filter() {
      var q = (search.value || '').trim().toLowerCase(), c = sel ? sel.value : '';
      rows.forEach(function (r) {
        var hay = (r.dataset.en + ' ' + r.dataset.ar + ' ' + r.dataset.fr + ' ' + r.textContent).toLowerCase();
        r.hidden = !((!q || hay.indexOf(q) >= 0) && (!c || (' ' + r.dataset.courses + ' ').indexOf(' ' + c + ' ') >= 0));
      });
      count.textContent = visible().length;
      deck = visible(); idx = 0; paint();
    }
    if (search) search.addEventListener('input', filter);
    if (sel) sel.addEventListener('change', filter);
    $$('[data-gloss-view]', g).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-gloss-view]', g).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        $$('[data-gloss-pane]', g).forEach(function (p) { p.hidden = p.dataset.glossPane !== b.dataset.glossView; });
        paint();
      });
    });
    var front = TW.lang === 'ar' ? 'ar' : TW.lang === 'fr' ? 'fr' : 'en', back = TW.lang === 'ar' ? 'en' : 'ar';
    var LBL = { en: 'English', ar: 'العربية', fr: 'Français' };
    function paint() {
      if (!card) return;
      card.classList.remove('flipped');
      var r = deck[idx];
      if (!r) { $('[data-flash-front]', g).textContent = '—'; $('[data-flash-pos]', g).textContent = '0 / 0'; return; }
      var f = $('[data-flash-front]', g), bk = $('[data-flash-back]', g);
      var fl = r.dataset[front] ? front : 'en';
      f.textContent = r.dataset[fl]; f.lang = fl;
      var extra = fl === 'fr' ? r.dataset.en : r.dataset.fr;
      bk.textContent = r.dataset[back] + (extra ? '  ·  ' + extra : ''); bk.lang = back;
      $('[data-flash-lang-front]', g).textContent = LBL[fl];
      $('[data-flash-lang-back]', g).textContent = LBL[back] + (extra ? ' · ' + LBL[fl === 'fr' ? 'en' : 'fr'] : '');
      var def = $('.g-def', r); $('[data-flash-def]', g).innerHTML = def ? def.innerHTML : '';
      $('[data-flash-pos]', g).textContent = (idx + 1) + ' / ' + deck.length;
    }
    if (card) {
      card.addEventListener('click', function () { card.classList.toggle('flipped'); });
      $('[data-flash-next]', g).addEventListener('click', function () { if (deck.length) { idx = (idx + 1) % deck.length; paint(); } });
      $('[data-flash-prev]', g).addEventListener('click', function () { if (deck.length) { idx = (idx - 1 + deck.length) % deck.length; paint(); } });
      $('[data-flash-shuffle]', g).addEventListener('click', function () {
        for (var i = deck.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
        idx = 0; paint();
      });
      $('[data-flash-speak]', g).addEventListener('click', function () { var r = deck[idx]; if (r) speak(r.dataset.en); });
      g.addEventListener('keydown', function (e) {
        if ($('[data-gloss-pane="cards"]', g).hidden || /input|select/i.test(e.target.tagName)) return;
        if (e.key === 'ArrowRight') { idx = (idx + (RTL ? -1 : 1) + deck.length) % deck.length; paint(); }
        if (e.key === 'ArrowLeft') { idx = (idx + (RTL ? 1 : -1) + deck.length) % deck.length; paint(); }
      });
      paint();
    }
    $$('[data-speak]', g).forEach(function (b) { b.addEventListener('click', function () { speak(b.dataset.speak); }); });
  });

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = 0.9;
      var v = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)/i.test(v.lang); });
      if (v.length) u.voice = v.filter(function (x) { return /GB/i.test(x.lang); })[0] || v[0];
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  TW.speak = speak;

  // ---------- render maths last (KaTeX scripts are deferred before this one) ----------
  renderMath(document.body);
  document.dispatchEvent(new CustomEvent('tw:ready'));
})();
