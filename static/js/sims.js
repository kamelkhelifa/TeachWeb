/* TeachWeb — interactive labs. Each lab is drawn on a <canvas>; labels are bilingual.
   A course lists its labs in `sims:`; each becomes <div class="sim" data-sim="id">. */
(function () {
  'use strict';
  var LANG = document.documentElement.lang;
  var AR = LANG === 'ar';
  // French (pages of courses taught in Algeria): looked up from the English label
  var FR = { "Projectile motion": "Mouvement d'un projectile", "Launch a ball and compare with the 45° trajectory. Air resistance is neglected.": "Lancez une balle et comparez avec la trajectoire à 45°. La résistance de l'air est négligée.", "your launch": "votre lancer", "velocity": "vitesse", "Launch speed v₀": "Vitesse initiale v₀", "Angle θ": "Angle θ", "Launch height h₀": "Hauteur de lancement h₀", "Gravity": "Pesanteur", "Earth 9.81 m/s²": "Terre 9,81 m/s²", "Moon 1.62 m/s²": "Lune 1,62 m/s²", "Mars 3.71 m/s²": "Mars 3,71 m/s²", "Jupiter 24.8 m/s²": "Jupiter 24,8 m/s²", "Launch": "Lancer", "Range": "Portée", "Max height": "Hauteur maximale", "Time of flight": "Durée du vol", "Speed now": "Vitesse actuelle", "Electric field & equipotentials": "Champ électrique et équipotentielles", "Drag the charges. Lines start on positive charges and end on negative ones; colours show the potential.": "Faites glisser les charges. Les lignes partent des charges positives et aboutissent aux négatives ; les couleurs représentent le potentiel.", "Configuration": "Configuration", "Dipole (+ −)": "Dipôle (+ −)", "Two like charges (+ +)": "Deux charges de même signe (+ +)", "Three charges": "Trois charges", "Add": "Ajouter", "Field lines": "Lignes de champ", "Potential": "Potentiel", "|E| at cursor (arb.)": "|E| au curseur (u.a.)", "V at cursor (arb.)": "V au curseur (u.a.)", "Charges": "Charges", "RC circuit: charging & discharging": "Circuit RC : charge et décharge", "The capacitor voltage follows an exponential with time constant τ = RC.": "La tension du condensateur suit une exponentielle de constante de temps τ = RC.", "V across C": "Tension aux bornes de C", "V across R (∝ current)": "Tension aux bornes de R (∝ courant)", "Source voltage": "Tension de la source", "Process": "Processus", "Charging": "Charge", "Discharging": "Décharge", "Replay": "Rejouer", "Energy in C": "Énergie dans C", "Damped & driven oscillator": "Oscillateur amorti et forcé", "m ẍ + b ẋ + k x = F₀ cos(ωt). Watch the transient die out and the steady state lock to the drive.": "m ẍ + b ẋ + k x = F₀ cos(ωt). Observez la disparition du régime transitoire et l'accrochage du régime permanent sur l'excitation.", "amplitude": "amplitude", "under-damped": "pseudo-périodique", "critical": "critique", "over-damped": "apériodique", "Mass m": "Masse m", "Stiffness k": "Raideur k", "Damping b": "Amortissement b", "Drive amplitude F₀": "Amplitude de la force F₀", "Drive frequency ω": "Pulsation de la force ω", "Restart": "Recommencer", "Quality factor Q": "Facteur de qualité Q", "Regime": "Régime", "Steady amplitude": "Amplitude en régime permanent", "Superposition of waves": "Superposition d'ondes", "Two sinusoidal waves add up: standing waves, beats and interference.": "Deux ondes sinusoïdales s'additionnent : ondes stationnaires, battements et interférences.", "Preset": "Préréglage", "Standing wave (opposite directions)": "Onde stationnaire (sens opposés)", "Beats (close frequencies)": "Battements (fréquences voisines)", "Same direction, phase shift": "Même sens, déphasage", "Frequency ratio f₂/f₁": "Rapport de fréquences f₂/f₁", "Amplitude A₂": "Amplitude A₂", "Phase φ": "Phase φ", "Reverse wave 2": "Inverser l'onde 2", "Particle in a box": "Particule dans une boîte", "Build a superposition of the first four stationary states and watch |Ψ(x,t)|² evolve. Units: ħ = m = a = 1.": "Construisez une superposition des quatre premiers états stationnaires et observez l'évolution de |Ψ(x,t)|². Unités : ħ = m = a = 1.", "Speed": "Vitesse", "Two-level system: Rabi oscillations": "Système à deux niveaux : oscillations de Rabi", "A resonant drive flips the system between |1⟩ and |2⟩. Detuning lowers the maximum probability and speeds up the oscillation.": "Une excitation résonante fait basculer le système entre |1⟩ et |2⟩. Le désaccord diminue la probabilité maximale et accélère l'oscillation.", "Rabi frequency Ω": "Fréquence de Rabi Ω", "Detuning Δ = ω − ω₀": "Désaccord Δ = ω − ω₀", "Generalised Rabi freq. W": "Fréquence de Rabi généralisée W", "Max P₂ = Ω²/W²": "P₂ max = Ω²/W²", "Period 2π/W": "Période 2π/W", "Black-body radiation": "Rayonnement du corps noir", "Planck's law. The peak moves to shorter wavelengths as T rises (Wien's law) and the area grows as T⁴ (Stefan–Boltzmann).": "Loi de Planck. Le maximum se déplace vers les courtes longueurs d'onde quand T augmente (loi de Wien) et l'aire croît comme T⁴ (Stefan–Boltzmann).", "spectral radiance": "luminance spectrale", "reddish": "rougeâtre", "white-yellow": "blanc-jaune", "bluish white": "blanc bleuté", "Sun (5800 K)": "Soleil (5800 K)", "Temperature T": "Température T", "Toggle Sun curve": "Afficher/masquer la courbe du Soleil", "Wien peak λmax = b/T": "Maximum de Wien λmax = b/T", "Power per area vs Sun": "Puissance surfacique / Soleil", "Colour": "Couleur", "Maxwell–Boltzmann speeds": "Vitesses de Maxwell–Boltzmann", "Speed distribution of an ideal gas. Sample molecules to see the histogram converge to the curve.": "Distribution des vitesses d'un gaz parfait. Tirez des molécules pour voir l'histogramme converger vers la courbe.", "Gas": "Gaz", "Sample 2000 molecules": "Tirer 2000 molécules", "Most probable vp": "Vitesse la plus probable vp", "Mean ⟨v⟩": "Vitesse moyenne ⟨v⟩", "Mean KE (3/2)kT": "Énergie cinétique moyenne (3/2)kT", "Fourier series": "Séries de Fourier", "Partial sums of the Fourier series. Notice the Gibbs overshoot (≈ 9%) near jumps.": "Sommes partielles de la série de Fourier. Remarquez le dépassement de Gibbs (≈ 9 %) près des discontinuités.", "function": "fonction", "Waveform": "Forme d'onde", "Square wave": "Signal carré", "Triangle wave": "Signal triangulaire", "Sawtooth": "Dent de scie", "Number of terms N": "Nombre de termes N", "Overshoot near jump": "Dépassement près de la discontinuité", "Numerical ODE solvers": "Résolution numérique des équations différentielles", "Harmonic oscillator ẍ = −x solved with Euler, Euler–Cromer and RK4. Increase the step h and compare with the exact solution.": "Oscillateur harmonique ẍ = −x résolu par Euler, Euler–Cromer et RK4. Augmentez le pas h et comparez à la solution exacte.", "exact": "exacte", "Step size h": "Pas h", "Time span": "Durée", "Energy ratio, Euler": "Rapport d'énergie, Euler", "Energy ratio, Euler–Cromer": "Rapport d'énergie, Euler–Cromer", "Energy ratio, RK4": "Rapport d'énergie, RK4", "RK4 final error": "Erreur finale RK4", "Pendulum phase portrait": "Portrait de phase du pendule", "Level curves of H(θ, p) = p²/2 − ω₀² cos θ. Click anywhere to launch a trajectory; the separatrix divides oscillation from rotation.": "Courbes de niveau de H(θ, p) = p²/2 − ω₀² cos θ. Cliquez pour lancer une trajectoire ; la séparatrice sépare l'oscillation de la rotation.", "libration": "libration", "rotation": "rotation", "separatrix": "séparatrice", "trajectory": "trajectoire", "Damping γ": "Amortissement γ", "Clear": "Effacer", "Energy H": "Énergie H", "Motion": "Mouvement", "up": "haut (up)", "charm": "charme", "top": "top", "gluon": "gluon", "Higgs": "Higgs", "down": "bas (down)", "strange": "étrange", "bottom": "beauté (bottom)", "photon": "photon", "electron": "électron", "muon": "muon", "tau": "tau", "Z boson": "boson Z", "electron neutrino": "neutrino électronique", "muon neutrino": "neutrino muonique", "tau neutrino": "neutrino tauique", "W boson": "boson W", "Quark": "Quark", "strong, electromagnetic, weak": "forte, électromagnétique, faible", "Lepton": "Lepton", "weak (and electromagnetic if charged)": "faible (et électromagnétique s'il est chargé)", "Gauge boson": "Boson de jauge", "force carrier": "médiateur d'interaction", "Scalar boson": "Boson scalaire", "gives mass via the Higgs mechanism": "donne la masse par le mécanisme de Higgs", "The Standard Model": "Le Modèle standard", "Three generations of quarks and leptons, the force carriers and the Higgs boson. Select a particle.": "Trois générations de quarks et de leptons, les médiateurs des interactions et le boson de Higgs. Sélectionnez une particule.", "Particle": "Particule", "Family": "Famille", "Mass": "Masse", "Charge (e)": "Charge (e)", "Spin": "Spin", "Interactions": "Interactions", "Listen & choose": "Écouter et choisir", "Hear an English term, then pick its Arabic meaning. Builds listening and vocabulary at the same time.": "Écoutez un terme anglais, puis choisissez sa traduction arabe. Pour travailler l'écoute et le vocabulaire en même temps.", "Listen again": "Réécouter", "Next word": "Mot suivant", "Click to reveal": "Cliquez pour afficher", "Score": "Score" };
  var L = function (en, ar) { return AR ? ar : LANG === 'fr' ? (FR[en] || en) : en; };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nf = function (x, d) { return (+x).toFixed(d == null ? 2 : d); };

  // ---------- shell ----------
  function css(el, name, fb) { var v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fb; }
  function colors(el) {
    return {
      accent: css(el, '--accent', '#5b4bd1'), ink: css(el, '--ink', '#111'), muted: css(el, '--muted', '#666'),
      line: css(el, '--line', '#ddd'), gold: css(el, '--gold', '#a87b2f'), ok: css(el, '--ok', '#2a9d5b'),
      bad: css(el, '--bad', '#d0453a'), surface: css(el, '--surface-2', '#fafafa')
    };
  }

  function shell(el, title, desc, opts) {
    opts = opts || {};
    el.innerHTML =
      '<div class="sim-head"><h3>' + title + '</h3><p>' + desc + '</p></div>' +
      '<div class="sim-body"><div class="sim-stage"><canvas></canvas><div class="sim-legend"></div></div><div class="sim-controls"></div></div>';
    var canvas = el.querySelector('canvas'), stage = el.querySelector('.sim-stage'), ctl = el.querySelector('.sim-controls');
    if (opts.height) { canvas.style.minHeight = opts.height + 'px'; stage.style.minHeight = opts.height + 'px'; }
    var ctx = canvas.getContext('2d'), S = { el: el, canvas: canvas, ctx: ctx, ctl: ctl, W: 0, H: 0, C: colors(el), draw: function () {} };
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    function resize() {
      var r = canvas.getBoundingClientRect(); S.W = r.width; S.H = r.height;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); S.draw();
    }
    S.resize = resize;
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else addEventListener('resize', resize);
    document.addEventListener('tw:theme', function () { S.C = colors(el); S.draw(); });
    S.legend = function (items) {
      el.querySelector('.sim-legend').innerHTML = items.map(function (i) { return '<span><i style="background:' + i[1] + '"></i>' + i[0] + '</span>'; }).join('');
    };
    S.slider = function (label, min, max, step, val, fmt, cb) {
      var w = document.createElement('label'); w.className = 'ctl';
      w.innerHTML = '<span class="ctl-top"><span>' + label + '</span><output></output></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">';
      var inp = w.querySelector('input'), out = w.querySelector('output');
      function upd() { out.textContent = fmt ? fmt(+inp.value) : inp.value; cb(+inp.value); }
      inp.addEventListener('input', upd); ctl.appendChild(w); out.textContent = fmt ? fmt(+inp.value) : inp.value; cb(+inp.value);
      return inp;
    };
    S.select = function (label, options, cb) {
      var w = document.createElement('label'); w.className = 'ctl';
      w.innerHTML = '<span class="ctl-top"><span>' + label + '</span></span><select>' + options.map(function (o, i) { return '<option value="' + i + '">' + o + '</option>'; }).join('') + '</select>';
      var s = w.querySelector('select'); s.addEventListener('change', function () { cb(+s.value); }); ctl.appendChild(w); cb(0);
      return s;
    };
    S.buttons = function (list) {
      var w = document.createElement('div'); w.className = 'sim-btns';
      list.forEach(function (b) {
        var x = document.createElement('button'); x.type = 'button'; x.className = 'btn-sm'; x.innerHTML = b[0];
        x.addEventListener('click', function () { b[1](x); }); w.appendChild(x);
      });
      ctl.appendChild(w); return w;
    };
    S.readout = function (rows) {
      var w = document.createElement('div'); w.className = 'sim-readout';
      w.innerHTML = rows.map(function (r) { return '<div><span>' + r + '</span><b>—</b></div>'; }).join('');
      ctl.appendChild(w);
      var bs = w.querySelectorAll('b');
      return function (vals) { vals.forEach(function (v, i) { if (bs[i]) bs[i].textContent = v; }); };
    };
    S.loop = function (step) {
      var visible = true, last = 0, raf = 0;
      function frame(t) { var dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t; step(dt); if (visible && !reduce) raf = requestAnimationFrame(frame); }
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting; if (visible) { last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
      }).observe(el);
      raf = requestAnimationFrame(frame);
    };
    return S;
  }

  // ---------- plotting ----------
  function niceStep(span, n) {
    var raw = span / (n || 5), p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
  }
  function frame(S, box, xr, yr, o) {
    o = o || {};
    var ctx = S.ctx, C = S.C;
    var P = { x0: box[0], y0: box[1], w: box[2], h: box[3], xr: xr, yr: yr };
    P.X = function (x) { return P.x0 + (x - xr[0]) / (xr[1] - xr[0]) * P.w; };
    P.Y = function (y) { return P.y0 + P.h - (y - yr[0]) / (yr[1] - yr[0]) * P.h; };
    ctx.save(); ctx.font = '11px Inter, system-ui, sans-serif'; ctx.fillStyle = C.muted; ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    var sx = niceStep(xr[1] - xr[0], o.nx || 6), sy = niceStep(yr[1] - yr[0], o.ny || 4);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (var x = Math.ceil(xr[0] / sx) * sx; x <= xr[1] + 1e-9; x += sx) {
      var px = P.X(x); ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(px, P.y0); ctx.lineTo(px, P.y0 + P.h); ctx.stroke(); ctx.globalAlpha = 1;
      if (!o.noXLabels) ctx.fillText(o.fx ? o.fx(x) : +x.toPrecision(4), px, P.y0 + P.h + 5);
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (var y = Math.ceil(yr[0] / sy) * sy; y <= yr[1] + 1e-9; y += sy) {
      var py = P.Y(y); ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(P.x0, py); ctx.lineTo(P.x0 + P.w, py); ctx.stroke(); ctx.globalAlpha = 1;
      if (!o.noYLabels) ctx.fillText(o.fy ? o.fy(y) : +y.toPrecision(3), P.x0 - 6, py);
    }
    ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.5;
    if (yr[0] < 0 && yr[1] > 0) { ctx.beginPath(); ctx.moveTo(P.x0, P.Y(0)); ctx.lineTo(P.x0 + P.w, P.Y(0)); ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (o.xlabel) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xlabel, P.x0 + P.w, P.y0 + P.h - 4); }
    if (o.ylabel) { ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(o.ylabel, P.x0 + 6, P.y0 + 4); }
    ctx.restore();
    P.curve = function (f, color, width, n, x0, x1) {
      n = n || 400; x0 = x0 == null ? xr[0] : x0; x1 = x1 == null ? xr[1] : x1;
      ctx.save(); ctx.beginPath(); ctx.rect(P.x0, P.y0 - 2, P.w, P.h + 4); ctx.clip();
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width || 2; ctx.lineJoin = 'round';
      for (var i = 0; i <= n; i++) { var x = x0 + (x1 - x0) * i / n, y = f(x); if (!isFinite(y)) continue; i ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y)); }
      ctx.stroke(); ctx.restore();
    };
    P.points = function (pts, color, width) {
      ctx.save(); ctx.beginPath(); ctx.rect(P.x0, P.y0 - 2, P.w, P.h + 4); ctx.clip(); ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width || 2;
      pts.forEach(function (p, i) { i ? ctx.lineTo(P.X(p[0]), P.Y(p[1])) : ctx.moveTo(P.X(p[0]), P.Y(p[1])); }); ctx.stroke(); ctx.restore();
    };
    P.vline = function (x, color, label) {
      ctx.save(); ctx.strokeStyle = color; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(P.X(x), P.y0); ctx.lineTo(P.X(x), P.y0 + P.h); ctx.stroke();
      if (label) { ctx.setLineDash([]); ctx.fillStyle = color; ctx.font = '600 11px Inter, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(label, P.X(x) + 4, P.y0 + 12); }
      ctx.restore();
    };
    P.dot = function (x, y, color, r) { ctx.beginPath(); ctx.fillStyle = color; ctx.arc(P.X(x), P.Y(y), r || 5, 0, 7); ctx.fill(); };
    return P;
  }
  function clear(S) { S.ctx.clearRect(0, 0, S.W, S.H); }
  function pad(S, l, r, t, b) { return [l, t, Math.max(10, S.W - l - r), Math.max(10, S.H - t - b)]; }

  var SIMS = {};

  // ===== Projectile motion =====
  SIMS.projectile = function (el) {
    var S = shell(el, L('Projectile motion', 'حركة المقذوفات'), L('Launch a ball and compare with the 45° trajectory. Air resistance is neglected.', 'أطلق كرة وقارن مسارها بمسار الزاوية 45°. تُهمَل مقاومة الهواء.'));
    var v0 = 20, th = 50, h0 = 0, g = 9.81, t = 0, flying = true;
    var out;
    function tof(a) { var vy = v0 * Math.sin(a); return (vy + Math.sqrt(vy * vy + 2 * g * h0)) / g; }
    S.draw = function () {
      clear(S); var a = th * Math.PI / 180, T = tof(a), R = v0 * Math.cos(a) * T, Hm = h0 + Math.pow(v0 * Math.sin(a), 2) / (2 * g);
      var R45 = v0 * Math.cos(Math.PI / 4) * tof(Math.PI / 4);
      var xmax = Math.max(R, R45, 10) * 1.08, ymax = Math.max(Hm, h0 + v0 * v0 / (4 * g), 5) * 1.15;
      var bx = pad(S, 44, 16, 24, 26), sc = Math.min(bx[2] / xmax, bx[3] / ymax);
      var P = frame(S, [bx[0], bx[1] + bx[3] - ymax * sc, xmax * sc, ymax * sc], [0, xmax], [0, ymax], { xlabel: 'x (m)', ylabel: 'y (m)' });
      var a45 = Math.PI / 4, T45 = tof(a45);
      P.curve(function (s) { return 0; }, S.C.line, 1, 2);
      var ctx = S.ctx; ctx.setLineDash([5, 5]);
      P.points(Array.from({ length: 81 }, function (_, i) { var s = T45 * i / 80; return [v0 * Math.cos(a45) * s, h0 + v0 * Math.sin(a45) * s - g * s * s / 2]; }), S.C.muted, 1.2);
      ctx.setLineDash([]);
      var tt = Math.min(t, T);
      P.points(Array.from({ length: 121 }, function (_, i) { var s = tt * i / 120; return [v0 * Math.cos(a) * s, h0 + v0 * Math.sin(a) * s - g * s * s / 2]; }), S.C.accent, 2.5);
      var bxp = v0 * Math.cos(a) * tt, byp = h0 + v0 * Math.sin(a) * tt - g * tt * tt / 2;
      P.dot(bxp, byp, S.C.accent, 7);
      // velocity arrow
      var vx = v0 * Math.cos(a), vy = v0 * Math.sin(a) - g * tt, k = 0.6;
      ctx.strokeStyle = S.C.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(P.X(bxp), P.Y(byp)); ctx.lineTo(P.X(bxp + vx * k), P.Y(byp + vy * k)); ctx.stroke();
      if (h0 > 0) { ctx.fillStyle = S.C.line; ctx.fillRect(P.X(0) - 10, P.Y(h0), 10, P.Y(0) - P.Y(h0)); }
      out && out([nf(R, 1) + ' m', nf(Hm, 1) + ' m', nf(T, 2) + ' s', nf(Math.hypot(vx, vy), 1) + ' m/s']);
    };
    S.legend([[L('your launch', 'إطلاقك'), S.C.accent], ['45°', S.C.muted], [L('velocity', 'السرعة'), S.C.gold]]);
    S.slider(L('Launch speed v₀', 'سرعة الإطلاق v₀'), 5, 40, 0.5, v0, function (v) { return v + ' m/s'; }, function (v) { v0 = v; t = 0; S.draw(); });
    S.slider(L('Angle θ', 'الزاوية θ'), 5, 85, 1, th, function (v) { return v + '°'; }, function (v) { th = v; t = 0; S.draw(); });
    S.slider(L('Launch height h₀', 'ارتفاع الإطلاق h₀'), 0, 30, 1, h0, function (v) { return v + ' m'; }, function (v) { h0 = v; t = 0; S.draw(); });
    S.select(L('Gravity', 'الجاذبية'), [L('Earth 9.81 m/s²', 'الأرض 9.81 م/ث²'), L('Moon 1.62 m/s²', 'القمر 1.62 م/ث²'), L('Mars 3.71 m/s²', 'المريخ 3.71 م/ث²'), L('Jupiter 24.8 m/s²', 'المشتري 24.8 م/ث²')], function (i) { g = [9.81, 1.62, 3.71, 24.8][i]; t = 0; S.draw(); });
    S.buttons([['▶ ' + L('Launch', 'أطلق'), function () { t = 0; flying = true; }]]);
    out = S.readout([L('Range', 'المدى'), L('Max height', 'أقصى ارتفاع'), L('Time of flight', 'زمن الطيران'), L('Speed now', 'السرعة الآن')]);
    S.loop(function (dt) { var T = tof(th * Math.PI / 180); if (flying && t < T) { t += dt * Math.max(1, T / 4); S.draw(); } });
  };

  // ===== Electric field of point charges =====
  SIMS.efield = function (el) {
    var S = shell(el, L('Electric field & equipotentials', 'المجال الكهربائي وسطوح تساوي الجهد'), L('Drag the charges. Lines start on positive charges and end on negative ones; colours show the potential.', 'اسحب الشحنات. تبدأ خطوط المجال من الشحنات الموجبة وتنتهي عند السالبة؛ وتمثّل الألوان الجهد.'), { height: 380 });
    var Q = [], showLines = true, showPot = true, drag = null, mouse = null, out;
    function reset(kind) {
      Q = kind === 1 ? [{ x: 0.35, y: 0.5, q: 1 }, { x: 0.65, y: 0.5, q: 1 }] : kind === 2 ? [{ x: 0.3, y: 0.35, q: 1 }, { x: 0.7, y: 0.35, q: -1 }, { x: 0.5, y: 0.72, q: 1 }] : [{ x: 0.35, y: 0.5, q: 1 }, { x: 0.65, y: 0.5, q: -1 }];
    }
    reset(0);
    function E(x, y) { // x,y in px
      var ex = 0, ey = 0, v = 0;
      Q.forEach(function (c) { var dx = x - c.x * S.W, dy = y - c.y * S.H, r2 = dx * dx + dy * dy + 30, r = Math.sqrt(r2); ex += c.q * dx / (r2 * r); ey += c.q * dy / (r2 * r); v += c.q / r; });
      return [ex, ey, v];
    }
    S.draw = function () {
      var ctx = S.ctx; clear(S); if (!S.W) return;
      if (showPot) {
        var cell = 8;
        for (var x = 0; x < S.W; x += cell) for (var y = 0; y < S.H; y += cell) {
          var v = E(x + cell / 2, y + cell / 2)[2] * 40, a = Math.min(0.55, Math.abs(v) * 0.35);
          ctx.fillStyle = v > 0 ? 'rgba(220,70,70,' + a + ')' : 'rgba(60,110,230,' + a + ')';
          ctx.fillRect(x, y, cell, cell);
        }
      }
      if (showLines) {
        ctx.strokeStyle = S.C.ink; ctx.globalAlpha = 0.65; ctx.lineWidth = 1.1;
        Q.forEach(function (c) {
          if (c.q <= 0 && Q.some(function (d) { return d.q > 0; })) return;
          var n = 16, sgn = c.q > 0 ? 1 : -1;
          for (var i = 0; i < n; i++) {
            var a = 2 * Math.PI * i / n, x = c.x * S.W + 10 * Math.cos(a), y = c.y * S.H + 10 * Math.sin(a);
            ctx.beginPath(); ctx.moveTo(x, y);
            for (var s = 0; s < 600; s++) {
              var e = E(x, y), m = Math.hypot(e[0], e[1]); if (!m) break;
              x += sgn * 3 * e[0] / m; y += sgn * 3 * e[1] / m; ctx.lineTo(x, y);
              if (x < -20 || y < -20 || x > S.W + 20 || y > S.H + 20) break;
              if (Q.some(function (d) { return d.q * sgn < 0 && Math.hypot(x - d.x * S.W, y - d.y * S.H) < 8; })) break;
            }
            ctx.stroke();
          }
        });
        ctx.globalAlpha = 1;
      }
      Q.forEach(function (c) {
        ctx.beginPath(); ctx.fillStyle = c.q > 0 ? '#d9473f' : '#3567d6'; ctx.arc(c.x * S.W, c.y * S.H, 13, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '700 16px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(c.q > 0 ? '+' : '−', c.x * S.W, c.y * S.H + 1);
      });
      if (mouse && out) { var e = E(mouse[0], mouse[1]); out([nf(Math.hypot(e[0], e[1]) * 1e4, 2), nf(e[2] * 100, 2), String(Q.length)]); }
    };
    function pos(ev) { var r = S.canvas.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
    S.canvas.addEventListener('pointerdown', function (ev) {
      var p = pos(ev); drag = Q.filter(function (c) { return Math.hypot(p[0] - c.x * S.W, p[1] - c.y * S.H) < 18; })[0] || null;
      if (drag) S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener('pointermove', function (ev) {
      var p = pos(ev); mouse = p;
      if (drag) { drag.x = Math.max(0.02, Math.min(0.98, p[0] / S.W)); drag.y = Math.max(0.02, Math.min(0.98, p[1] / S.H)); }
      S.draw();
    });
    S.canvas.addEventListener('pointerup', function () { drag = null; });
    S.canvas.style.cursor = 'grab';
    S.select(L('Configuration', 'التشكيل'), [L('Dipole (+ −)', 'ثنائي القطب (+ −)'), L('Two like charges (+ +)', 'شحنتان متماثلتان (+ +)'), L('Three charges', 'ثلاث شحنات')], function (i) { reset(i); S.draw(); });
    S.buttons([['+ ' + L('Add', 'أضف'), function () { Q.push({ x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.6, q: 1 }); S.draw(); }],
      ['− ' + L('Add', 'أضف'), function () { Q.push({ x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.6, q: -1 }); S.draw(); }],
      [L('Field lines', 'خطوط المجال'), function () { showLines = !showLines; S.draw(); }],
      [L('Potential', 'الجهد'), function () { showPot = !showPot; S.draw(); }]]);
    out = S.readout([L('|E| at cursor (arb.)', '|E| عند المؤشر (اعتباطي)'), L('V at cursor (arb.)', 'V عند المؤشر (اعتباطي)'), L('Charges', 'عدد الشحنات')]);
  };

  // ===== RC circuit =====
  SIMS['rc-circuit'] = function (el) {
    var S = shell(el, L('RC circuit: charging & discharging', 'دارة RC: الشحن والتفريغ'), L('The capacitor voltage follows an exponential with time constant τ = RC.', 'يتبع جهد المكثّف دالة أُسّية ثابتها الزمني τ = RC.'));
    var R = 10, Cc = 100, V0 = 5, mode = 0, t = 0, out;
    S.draw = function () {
      clear(S); var tau = R * 1e3 * Cc * 1e-6, T = 5 * tau;
      var b = pad(S, 46, 46, 22, 26), P = frame(S, b, [0, T], [0, V0 * 1.1], { xlabel: 't (s)', ylabel: 'V (V)' });
      var Vc = function (s) { return mode === 0 ? V0 * (1 - Math.exp(-s / tau)) : V0 * Math.exp(-s / tau); };
      var Ir = function (s) { return V0 * Math.exp(-s / tau); }; // scaled to volts across R
      P.curve(Ir, S.C.gold, 1.6); P.curve(Vc, S.C.accent, 2.6);
      P.vline(tau, S.C.muted, 'τ');
      var tt = Math.min(t, T); P.dot(tt, Vc(tt), S.C.accent, 6);
      out && out([nf(tau * 1000, 1) + ' ms', nf(Vc(tt), 2) + ' V', nf(Ir(tt) / (R * 1e3) * 1e3, 3) + ' mA', nf(0.5 * Cc * 1e-6 * Vc(tt) * Vc(tt) * 1e3, 3) + ' mJ']);
    };
    S.legend([[L('V across C', 'الجهد بين طرفي C'), S.C.accent], [L('V across R (∝ current)', 'الجهد بين طرفي R (∝ التيار)'), S.C.gold]]);
    S.slider('R', 1, 100, 1, R, function (v) { return v + ' kΩ'; }, function (v) { R = v; t = 0; S.draw(); });
    S.slider('C', 10, 1000, 10, Cc, function (v) { return v + ' µF'; }, function (v) { Cc = v; t = 0; S.draw(); });
    S.slider(L('Source voltage', 'جهد المنبع'), 1, 12, 0.5, V0, function (v) { return v + ' V'; }, function (v) { V0 = v; S.draw(); });
    S.select(L('Process', 'العملية'), [L('Charging', 'الشحن'), L('Discharging', 'التفريغ')], function (i) { mode = i; t = 0; S.draw(); });
    S.buttons([['▶ ' + L('Replay', 'أعد التشغيل'), function () { t = 0; }]]);
    out = S.readout(['τ = RC', 'V_C', 'I', L('Energy in C', 'الطاقة في C')]);
    S.loop(function (dt) { var T = 5 * R * Cc * 1e-3; if (t < T) { t += dt * T / 4; S.draw(); } });
  };

  // ===== Damped, driven oscillator =====
  SIMS.oscillator = function (el) {
    var S = shell(el, L('Damped & driven oscillator', 'المهتز المخمّد والقسري'), L('m ẍ + b ẋ + k x = F₀ cos(ωt). Watch the transient die out and the steady state lock to the drive.', 'm ẍ + b ẋ + k x = F₀ cos(ωt). لاحظ تلاشي النظام العابر واستقرار الحركة على تردد القوة المحرّكة.'), { height: 380 });
    var m = 1, k = 20, b = 0.6, F0 = 4, w = 3, st = [1, 0], t = 0, hist = [], out;
    function acc(x, v, s) { return (F0 * Math.cos(w * s) - b * v - k * x) / m; }
    function amp(W) { return F0 / Math.sqrt(Math.pow(k - m * W * W, 2) + Math.pow(b * W, 2)); }
    S.draw = function () {
      clear(S); var ctx = S.ctx, H2 = S.H * 0.56;
      var w0 = Math.sqrt(k / m), A = amp(w), Amax = Math.max(1.2, amp(Math.sqrt(Math.max(0.01, w0 * w0 - b * b / (2 * m * m)))), Math.abs(st[0]));
      var span = 12, P = frame(S, [44, 22, S.W - 150, H2 - 40], [t - span, t], [-Amax * 1.15, Amax * 1.15], { xlabel: 't (s)', ylabel: 'x' });
      P.points(hist.filter(function (p) { return p[0] > t - span; }), S.C.accent, 2);
      // spring + mass
      var cx = S.W - 70, y0 = 30, yM = y0 + (H2 - 90) * 0.5 + st[0] / Amax * (H2 - 110) * 0.45;
      ctx.strokeStyle = S.C.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, y0);
      for (var i = 1; i <= 14; i++) ctx.lineTo(cx + (i % 2 ? 10 : -10), y0 + (yM - y0) * i / 15);
      ctx.lineTo(cx, yM); ctx.stroke(); ctx.fillStyle = S.C.line; ctx.fillRect(cx - 30, y0 - 6, 60, 6);
      ctx.fillStyle = S.C.accent; ctx.fillRect(cx - 18, yM, 36, 30);
      // resonance curve
      var wmax = Math.max(2.2 * w0, w * 1.2), Q = frame(S, [44, H2 + 14, S.W - 70, S.H - H2 - 40], [0, wmax], [0, Amax * 1.15], { xlabel: 'ω (rad/s)', ylabel: L('amplitude', 'السعة') });
      Q.curve(amp, S.C.gold, 2); Q.vline(w0, S.C.muted, 'ω₀'); Q.dot(w, A, S.C.accent, 6);
      var g = b / (2 * m), regime = g < w0 ? L('under-damped', 'تخميد ضعيف') : Math.abs(g - w0) < 1e-3 ? L('critical', 'تخميد حرج') : L('over-damped', 'تخميد قوي');
      out && out([nf(w0, 2) + ' rad/s', b > 0 ? nf(m * w0 / b, 1) : '∞', regime, nf(A, 3)]);
    };
    function reset() { st = [1, 0]; t = 0; hist = []; }
    S.slider(L('Mass m', 'الكتلة m'), 0.2, 5, 0.1, m, function (v) { return v + ' kg'; }, function (v) { m = v; S.draw(); });
    S.slider(L('Stiffness k', 'ثابت النابض k'), 2, 60, 1, k, function (v) { return v + ' N/m'; }, function (v) { k = v; S.draw(); });
    S.slider(L('Damping b', 'معامل التخميد b'), 0, 8, 0.05, b, function (v) { return v + ' kg/s'; }, function (v) { b = v; S.draw(); });
    S.slider(L('Drive amplitude F₀', 'سعة القوة F₀'), 0, 10, 0.5, F0, function (v) { return v + ' N'; }, function (v) { F0 = v; S.draw(); });
    S.slider(L('Drive frequency ω', 'تردد القوة ω'), 0.2, 12, 0.05, w, function (v) { return v + ' rad/s'; }, function (v) { w = v; S.draw(); });
    S.buttons([['↺ ' + L('Restart', 'إعادة'), function () { reset(); }]]);
    out = S.readout(['ω₀ = √(k/m)', L('Quality factor Q', 'معامل الجودة Q'), L('Regime', 'النظام'), L('Steady amplitude', 'السعة المستقرة')]);
    S.loop(function (dt) {
      var h = 0.004, n = Math.round(dt / h);
      for (var i = 0; i < n; i++) { // RK4
        var x = st[0], v = st[1];
        var k1x = v, k1v = acc(x, v, t), k2x = v + h / 2 * k1v, k2v = acc(x + h / 2 * k1x, v + h / 2 * k1v, t + h / 2);
        var k3x = v + h / 2 * k2v, k3v = acc(x + h / 2 * k2x, v + h / 2 * k2v, t + h / 2), k4x = v + h * k3v, k4v = acc(x + h * k3x, v + h * k3v, t + h);
        st = [x + h / 6 * (k1x + 2 * k2x + 2 * k3x + k4x), v + h / 6 * (k1v + 2 * k2v + 2 * k3v + k4v)]; t += h;
      }
      hist.push([t, st[0]]); if (hist.length > 2000) hist.shift(); S.draw();
    });
  };

  // ===== Superposition of waves =====
  SIMS.waves = function (el) {
    var S = shell(el, L('Superposition of waves', 'تراكب الأمواج'), L('Two sinusoidal waves add up: standing waves, beats and interference.', 'تتراكب موجتان جيبيتان: أمواج مستقرة، وضربات (خفقان)، وتداخل.'), { height: 360 });
    var f2 = 1, dir = -1, A2 = 1, ph = 0, t = 0;
    S.draw = function () {
      clear(S); var b = pad(S, 36, 16, 20, 24), P = frame(S, b, [0, 4], [-2.3, 2.3], { xlabel: 'x / λ₁', noYLabels: false });
      var k1 = 2 * Math.PI, w1 = 2 * Math.PI * 0.5, k2 = k1 * f2, w2 = w1 * f2;
      var y1 = function (x) { return Math.sin(k1 * x - w1 * t); }, y2 = function (x) { return A2 * Math.sin(k2 * x - dir * w2 * t + ph); };
      P.curve(y1, S.C.muted, 1.2, 600); P.curve(y2, S.C.gold, 1.2, 600);
      P.curve(function (x) { return y1(x) + y2(x); }, S.C.accent, 2.6, 800);
    };
    S.legend([['y₁', S.C.muted], ['y₂', S.C.gold], ['y₁ + y₂', S.C.accent]]);
    var preset = S.select(L('Preset', 'حالة جاهزة'), [L('Standing wave (opposite directions)', 'موجة مستقرة (اتجاهان متعاكسان)'), L('Beats (close frequencies)', 'الضربات (ترددان متقاربان)'), L('Same direction, phase shift', 'الاتجاه نفسه مع فرق طور')], function (i) {
      if (i === 0) { f2 = 1; dir = -1; ph = 0; A2 = 1; } else if (i === 1) { f2 = 1.12; dir = 1; ph = 0; A2 = 1; } else { f2 = 1; dir = 1; ph = Math.PI / 2; A2 = 1; }
      syncInputs();
    });
    var sf = S.slider(L('Frequency ratio f₂/f₁', 'نسبة الترددين f₂/f₁'), 0.5, 2, 0.01, f2, function (v) { return nf(v, 2); }, function (v) { f2 = v; S.draw(); });
    var sa = S.slider(L('Amplitude A₂', 'السعة A₂'), 0, 1.2, 0.05, A2, null, function (v) { A2 = v; S.draw(); });
    var sp = S.slider(L('Phase φ', 'الطور φ'), 0, 6.28, 0.01, ph, function (v) { return nf(v / Math.PI, 2) + 'π'; }, function (v) { ph = v; S.draw(); });
    S.buttons([['⇄ ' + L('Reverse wave 2', 'اعكس اتجاه الموجة 2'), function () { dir = -dir; }]]);
    function syncInputs() { [[sf, f2], [sa, A2], [sp, ph]].forEach(function (p) { if (p[0]) { p[0].value = p[1]; p[0].dispatchEvent(new Event('input')); } }); }
    S.loop(function (dt) { t += dt; S.draw(); });
  };

  // ===== Particle in an infinite square well =====
  SIMS['particle-box'] = function (el) {
    var S = shell(el, L('Particle in a box', 'جسيم في بئر لا نهائي'), L('Build a superposition of the first four stationary states and watch |Ψ(x,t)|² evolve. Units: ħ = m = a = 1.', 'كوّن تراكبًا لأول أربع حالات مستقرة وراقب تطوّر |Ψ(x,t)|². الوحدات: ħ = m = a = 1.'), { height: 380 });
    var c = [1, 0, 0, 0], t = 0, speed = 1, out;
    var E = function (n) { return n * n * Math.PI * Math.PI / 2; };
    function norm() { var s = Math.sqrt(c.reduce(function (a, x) { return a + x * x; }, 0)) || 1; return c.map(function (x) { return x / s; }); }
    function psi(x, cn) { var re = 0, im = 0; cn.forEach(function (a, i) { var n = i + 1, ph = -E(n) * t, f = a * Math.SQRT2 * Math.sin(n * Math.PI * x); re += f * Math.cos(ph); im += f * Math.sin(ph); }); return [re, im]; }
    S.draw = function () {
      clear(S); var cn = norm(), ctx = S.ctx;
      var b = pad(S, 40, 120, 20, 26), P = frame(S, b, [0, 1], [-2.6, 4.2], { xlabel: 'x / a', nx: 5 });
      P.curve(function (x) { return psi(x, cn)[0]; }, S.C.muted, 1.3);
      P.curve(function (x) { return psi(x, cn)[1]; }, S.C.gold, 1.3);
      P.curve(function (x) { var p = psi(x, cn); return p[0] * p[0] + p[1] * p[1]; }, S.C.accent, 2.6);
      ctx.fillStyle = S.C.line; ctx.fillRect(P.X(0) - 6, P.y0, 6, P.h); ctx.fillRect(P.X(1), P.y0, 6, P.h);
      // energy levels
      var ex = S.W - 100, top = 24, bot = S.H - 30, Emax = E(4) * 1.08;
      ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'left';
      for (var n = 1; n <= 4; n++) {
        var y = bot - (bot - top) * E(n) / Emax, wgt = cn[n - 1] * cn[n - 1];
        ctx.strokeStyle = S.C.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ex, y); ctx.lineTo(ex + 70, y); ctx.stroke();
        ctx.fillStyle = S.C.accent; ctx.globalAlpha = 0.25 + 0.75 * wgt; ctx.fillRect(ex, y - 4, 70 * wgt, 8); ctx.globalAlpha = 1;
        ctx.fillStyle = S.C.muted; ctx.fillText('n=' + n, ex + 2, y - 8);
      }
      var Em = cn.reduce(function (a, x, i) { return a + x * x * E(i + 1); }, 0);
      var xm = 0, N = 200; for (var i = 0; i < N; i++) { var x = (i + 0.5) / N, p = psi(x, cn); xm += x * (p[0] * p[0] + p[1] * p[1]) / N; }
      out && out([nf(Em, 2) + ' (' + nf(Em / E(1), 2) + ' E₁)', nf(xm, 3) + ' a', nf(t, 2)]);
    };
    S.legend([['Re Ψ', S.C.muted], ['Im Ψ', S.C.gold], ['|Ψ|²', S.C.accent]]);
    [1, 2, 3, 4].forEach(function (n) { S.slider('c' + n + ' (ψ' + n + ')', 0, 1, 0.01, c[n - 1], function (v) { return nf(v, 2); }, function (v) { c[n - 1] = v; S.draw(); }); });
    S.slider(L('Speed', 'السرعة'), 0, 3, 0.1, speed, function (v) { return v + '×'; }, function (v) { speed = v; });
    out = S.readout(['⟨E⟩', '⟨x⟩', 't']);
    S.loop(function (dt) { t += dt * speed * 0.08; S.draw(); });
  };

  // ===== Two-level system: Rabi oscillations =====
  SIMS['two-level'] = function (el) {
    var S = shell(el, L('Two-level system: Rabi oscillations', 'نظام ذو مستويين: تذبذبات رابي'), L('A resonant drive flips the system between |1⟩ and |2⟩. Detuning lowers the maximum probability and speeds up the oscillation.', 'تقلب القوة الرنينية النظام بين |1⟩ و |2⟩. ويُنقص الانحراف عن الرنين الاحتمال الأقصى ويسرّع التذبذب.'));
    var Om = 1, D = 0, t = 0, out;
    function P2(s) { var W = Math.sqrt(Om * Om + D * D); return W ? Om * Om / (W * W) * Math.pow(Math.sin(W * s / 2), 2) : 0; }
    S.draw = function () {
      clear(S); var ctx = S.ctx, Tm = 20;
      var P = frame(S, [44, 22, S.W - 140, S.H - 50], [0, Tm], [0, 1.05], { xlabel: 't', ylabel: 'P' });
      P.curve(function (s) { return 1 - P2(s); }, S.C.gold, 1.6, 600); P.curve(P2, S.C.accent, 2.6, 600);
      var tt = t % Tm; P.vline(tt, S.C.muted);
      var p = P2(tt), x = S.W - 80, h = S.H - 70;
      ctx.fillStyle = S.C.line; ctx.fillRect(x, 26, 22, h); ctx.fillRect(x + 32, 26, 22, h);
      ctx.fillStyle = S.C.gold; ctx.fillRect(x, 26 + h * p, 22, h * (1 - p));
      ctx.fillStyle = S.C.accent; ctx.fillRect(x + 32, 26 + h * (1 - p), 22, h * p);
      ctx.fillStyle = S.C.muted; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('|1⟩', x + 11, S.H - 30); ctx.fillText('|2⟩', x + 43, S.H - 30);
      var W = Math.sqrt(Om * Om + D * D);
      out && out([nf(W, 2), nf(Om * Om / (W * W || 1), 3), W ? nf(2 * Math.PI / W, 2) : '∞']);
    };
    S.legend([['P₁(t)', S.C.gold], ['P₂(t)', S.C.accent]]);
    S.slider(L('Rabi frequency Ω', 'تردد رابي Ω'), 0.1, 3, 0.05, Om, null, function (v) { Om = v; S.draw(); });
    S.slider(L('Detuning Δ = ω − ω₀', 'الانحراف Δ = ω − ω₀'), -3, 3, 0.05, D, null, function (v) { D = v; S.draw(); });
    out = S.readout([L('Generalised Rabi freq. W', 'تردد رابي المعمّم W'), L('Max P₂ = Ω²/W²', 'P₂ الأقصى = Ω²/W²'), L('Period 2π/W', 'الدور 2π/W')]);
    S.loop(function (dt) { t += dt * 2; S.draw(); });
  };

  // ===== Black-body radiation =====
  SIMS.blackbody = function (el) {
    var S = shell(el, L('Black-body radiation', 'إشعاع الجسم الأسود'), L("Planck's law. The peak moves to shorter wavelengths as T rises (Wien's law) and the area grows as T⁴ (Stefan–Boltzmann).", 'قانون بلانك. تنزاح القمة نحو الأطوال الموجية القصيرة كلما ارتفعت T (قانون فين) وتزداد المساحة بـ T⁴ (قانون ستيفان–بولتزمان).'));
    var T = 5800, cmp = true, out;
    var h = 6.626e-34, c = 2.998e8, kB = 1.381e-23;
    function B(lnm, TT) { var l = lnm * 1e-9; return 2 * h * c * c / Math.pow(l, 5) / (Math.exp(h * c / (l * kB * TT)) - 1); }
    function wl2rgb(l) {
      var r = 0, g = 0, b = 0;
      if (l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = -(l - 510) / 20; }
      else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = -(l - 645) / 65; } else { r = 1; }
      return 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ',0.22)';
    }
    S.draw = function () {
      clear(S); var lm = 3000, ymax = B(2.898e6 / Math.max(T, cmp ? 5800 : T), Math.max(T, cmp ? 5800 : T)) * 1.12;
      var P = frame(S, pad(S, 50, 16, 22, 26), [100, lm], [0, ymax], { xlabel: 'λ (nm)', ylabel: L('spectral radiance', 'الإشعاعية الطيفية'), noYLabels: true });
      for (var l = 380; l < 750; l += 4) { S.ctx.fillStyle = wl2rgb(l); S.ctx.fillRect(P.X(l), P.y0, P.X(l + 4) - P.X(l) + 0.5, P.h); }
      if (cmp && T !== 5800) P.curve(function (l) { return B(l, 5800); }, S.C.muted, 1.4);
      P.curve(function (l) { return B(l, T); }, S.C.accent, 2.6);
      var peak = 2.898e6 / T; if (peak < lm) P.vline(peak, S.C.gold, 'λmax');
      out && out([nf(peak, 0) + ' nm', nf(Math.pow(T / 5800, 4), 2) + ' × ☉', T < 4000 ? L('reddish', 'مائل للأحمر') : T < 6500 ? L('white-yellow', 'أبيض مصفرّ') : L('bluish white', 'أبيض مزرقّ')]);
    };
    S.legend([['T', S.C.accent], [L('Sun (5800 K)', 'الشمس (5800 K)'), S.C.muted]]);
    S.slider(L('Temperature T', 'درجة الحرارة T'), 1500, 12000, 50, T, function (v) { return v + ' K'; }, function (v) { T = v; S.draw(); });
    S.buttons([[L('Toggle Sun curve', 'إظهار/إخفاء منحنى الشمس'), function () { cmp = !cmp; S.draw(); }]]);
    out = S.readout([L('Wien peak λmax = b/T', 'قمة فين λmax = b/T'), L('Power per area vs Sun', 'القدرة لكل مساحة مقارنة بالشمس'), L('Colour', 'اللون')]);
  };

  // ===== Maxwell–Boltzmann distribution =====
  SIMS.boltzmann = function (el) {
    var S = shell(el, L('Maxwell–Boltzmann speeds', 'توزيع ماكسويل–بولتزمان للسرعات'), L('Speed distribution of an ideal gas. Sample molecules to see the histogram converge to the curve.', 'توزيع سرعات غاز مثالي. اسحب عيّنة من الجزيئات لترى المدرّج التكراري يقترب من المنحنى.'));
    var T = 300, M = 28, hist = null, out;
    var kB = 1.381e-23, amu = 1.6605e-27;
    function f(v) { var m = M * amu, a = m / (2 * kB * T); return 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v); }
    function gauss() { var u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    S.draw = function () {
      clear(S); var m = M * amu, vp = Math.sqrt(2 * kB * T / m), vmax = Math.sqrt(2 * kB * 1500 / (4 * amu)) * 1.0;
      vmax = Math.max(vp * 3.2, 800);
      var P = frame(S, pad(S, 50, 16, 22, 26), [0, vmax], [0, f(vp) * 1.25], { xlabel: 'v (m/s)', ylabel: 'f(v)', noYLabels: true });
      if (hist) {
        var bw = hist.bw; S.ctx.fillStyle = S.C.line;
        hist.c.forEach(function (n, i) { var x0 = P.X(i * bw), x1 = P.X((i + 1) * bw), y = P.Y(n / (hist.N * bw)); S.ctx.fillRect(x0, y, x1 - x0 - 1, P.Y(0) - y); });
      }
      P.curve(f, S.C.accent, 2.6);
      var vm = Math.sqrt(8 * kB * T / (Math.PI * m)), vr = Math.sqrt(3 * kB * T / m);
      P.vline(vp, S.C.gold, 'vp'); P.vline(vm, S.C.ok, '⟨v⟩'); P.vline(vr, S.C.bad, 'vrms');
      out && out([nf(vp, 0) + ' m/s', nf(vm, 0) + ' m/s', nf(vr, 0) + ' m/s', nf(1.5 * kB * T / 1.602e-19 * 1000, 1) + ' meV']);
    };
    S.slider(L('Temperature T', 'درجة الحرارة T'), 50, 1500, 10, T, function (v) { return v + ' K'; }, function (v) { T = v; hist = null; S.draw(); });
    S.select(L('Gas', 'الغاز'), ['N₂ (28 u)', 'He (4 u)', 'O₂ (32 u)', 'CO₂ (44 u)', 'Xe (131 u)'], function (i) { M = [28, 4, 32, 44, 131][i]; hist = null; S.draw(); });
    S.buttons([['⚄ ' + L('Sample 2000 molecules', 'اسحب عيّنة من 2000 جزيء'), function () {
      var m = M * amu, s = Math.sqrt(kB * T / m), vp = Math.sqrt(2 * kB * T / m), bw = vp / 8, c = [], N = 2000;
      for (var i = 0; i < N; i++) { var v = Math.hypot(gauss() * s, gauss() * s, gauss() * s), k = Math.floor(v / bw); c[k] = (c[k] || 0) + 1; }
      for (var j = 0; j < c.length; j++) c[j] = c[j] || 0;
      hist = { c: c, bw: bw, N: N }; S.draw();
    }]]);
    out = S.readout([L('Most probable vp', 'السرعة الأكثر احتمالًا vp'), L('Mean ⟨v⟩', 'المتوسطة ⟨v⟩'), 'vrms', L('Mean KE (3/2)kT', 'متوسط الطاقة الحركية (3/2)kT')]);
  };

  // ===== Fourier series =====
  SIMS.fourier = function (el) {
    var S = shell(el, L('Fourier series', 'متسلسلات فورييه'), L('Partial sums of the Fourier series. Notice the Gibbs overshoot (≈ 9%) near jumps.', 'المجاميع الجزئية لمتسلسلة فورييه. لاحظ تجاوز جيبس (≈ 9٪) قرب نقاط الانقطاع.'), { height: 380 });
    var N = 5, kind = 0, out;
    function target(x) { var u = ((x / (2 * Math.PI)) % 1 + 1) % 1; return kind === 0 ? (u < 0.5 ? 1 : -1) : (u < 0.5 ? 4 * u - 1 : 3 - 4 * u); }
    function coef(n) { // sine/cosine coefficients
      if (kind === 0) return n % 2 ? [0, 4 / (Math.PI * n)] : [0, 0];
      if (kind === 1) return n % 2 ? [-8 / (Math.PI * Math.PI * n * n), 0] : [0, 0];
      return [0, 0];
    }
    function saw(n) { return 2 * Math.pow(-1, n + 1) / (Math.PI * n); } // f(x)=x/π on (−π,π)
    function S_N(x) {
      var s = 0;
      for (var n = 1; n <= N; n++) {
        if (kind === 2) s += saw(n) * Math.sin(n * x);
        else { var c = coef(n); s += c[0] * Math.cos(n * x) + c[1] * Math.sin(n * x); }
      }
      return s;
    }
    function tgt(x) { if (kind === 2) { var y = ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return y / Math.PI; } return target(x); }
    S.draw = function () {
      clear(S); var H2 = S.H * 0.66;
      var P = frame(S, [40, 18, S.W - 56, H2 - 40], [-2 * Math.PI, 2 * Math.PI], [-1.5, 1.5], { xlabel: 'x', fx: function (x) { return nf(x / Math.PI, 1) + 'π'; } });
      P.curve(tgt, S.C.muted, 1.4, 1200); P.curve(S_N, S.C.accent, 2.4, 1500);
      var Q = frame(S, [40, H2 + 6, S.W - 56, S.H - H2 - 30], [0, 21], [0, 1.35], { xlabel: 'n', noYLabels: true, nx: 10 });
      for (var n = 1; n <= 20; n++) {
        var a = kind === 2 ? Math.abs(saw(n)) : Math.hypot.apply(null, coef(n));
        S.ctx.fillStyle = n <= N ? S.C.accent : S.C.line; var x = Q.X(n) - 5; S.ctx.fillRect(x, Q.Y(a), 10, Q.Y(0) - Q.Y(a));
      }
      var mx = 0; for (var i = 1; i < 400; i++) { var x2 = i / 400 * Math.PI; mx = Math.max(mx, S_N(x2)); }
      out && out([String(N), nf((mx - 1) * 100, 1) + ' %']);
    };
    S.legend([[L('function', 'الدالة'), S.C.muted], ['S_N(x)', S.C.accent]]);
    S.select(L('Waveform', 'شكل الموجة'), [L('Square wave', 'موجة مربعة'), L('Triangle wave', 'موجة مثلثية'), L('Sawtooth', 'موجة سن المنشار')], function (i) { kind = i; S.draw(); });
    S.slider(L('Number of terms N', 'عدد الحدود N'), 1, 60, 1, N, null, function (v) { N = v; S.draw(); });
    out = S.readout(['N', L('Overshoot near jump', 'التجاوز قرب الانقطاع')]);
  };

  // ===== ODE solvers =====
  SIMS['ode-solver'] = function (el) {
    var S = shell(el, L('Numerical ODE solvers', 'الحلول العددية للمعادلات التفاضلية'), L('Harmonic oscillator ẍ = −x solved with Euler, Euler–Cromer and RK4. Increase the step h and compare with the exact solution.', 'المهتز التوافقي ẍ = −x محلولًا بطرق أويلر وأويلر–كرومر ورونغ–كوتا 4. كبّر الخطوة h وقارن بالحل الدقيق.'));
    var h = 0.2, Tm = 30, out;
    function run(method) {
      var x = 1, v = 0, pts = [[0, 1]], n = Math.ceil(Tm / h);
      for (var i = 1; i <= n; i++) {
        if (method === 0) { var nx = x + h * v, nv = v - h * x; x = nx; v = nv; }
        else if (method === 1) { v = v - h * x; x = x + h * v; }
        else {
          var f = function (s) { return [s[1], -s[0]]; }, s = [x, v];
          var k1 = f(s), k2 = f([x + h / 2 * k1[0], v + h / 2 * k1[1]]), k3 = f([x + h / 2 * k2[0], v + h / 2 * k2[1]]), k4 = f([x + h * k3[0], v + h * k3[1]]);
          x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        }
        pts.push([i * h, x]);
      }
      return { pts: pts, E: (x * x + v * v) / 2 };
    }
    S.draw = function () {
      clear(S); var P = frame(S, pad(S, 40, 16, 22, 26), [0, Tm], [-2.5, 2.5], { xlabel: 't', ylabel: 'x' });
      var r = [run(0), run(1), run(2)];
      P.curve(Math.cos, S.C.muted, 4, 800);
      P.points(r[0].pts, S.C.bad, 1.8); P.points(r[1].pts, S.C.gold, 1.8); P.points(r[2].pts, S.C.accent, 2.2);
      var err = function (q) { var p = q.pts[q.pts.length - 1]; return Math.abs(p[1] - Math.cos(p[0])); };
      out && out([nf(r[0].E / 0.5, 3), nf(r[1].E / 0.5, 3), nf(r[2].E / 0.5, 6), err(r[2]).toExponential(2)]);
    };
    S.legend([[L('exact', 'الحل الدقيق'), S.C.muted], ['Euler', S.C.bad], ['Euler–Cromer', S.C.gold], ['RK4', S.C.accent]]);
    S.slider(L('Step size h', 'الخطوة h'), 0.01, 0.8, 0.01, h, function (v) { return nf(v, 2); }, function (v) { h = v; S.draw(); });
    S.slider(L('Time span', 'المدة الزمنية'), 5, 80, 1, Tm, null, function (v) { Tm = v; S.draw(); });
    out = S.readout([L('Energy ratio, Euler', 'نسبة الطاقة، أويلر'), L('Energy ratio, Euler–Cromer', 'نسبة الطاقة، أويلر–كرومر'), L('Energy ratio, RK4', 'نسبة الطاقة، RK4'), L('RK4 final error', 'خطأ RK4 النهائي')]);
  };

  // ===== Pendulum phase space =====
  SIMS['phase-space'] = function (el) {
    var S = shell(el, L('Pendulum phase portrait', 'الصورة الطورية للنواس'), L('Level curves of H(θ, p) = p²/2 − ω₀² cos θ. Click anywhere to launch a trajectory; the separatrix divides oscillation from rotation.', 'منحنيات تساوي H(θ, p) = p²/2 − ω₀² cos θ. انقر في أي مكان لإطلاق مسار؛ ويفصل الفاصل بين التذبذب والدوران.'), { height: 380 });
    var g = 0, tr = [], out;
    var H = function (th, p) { return p * p / 2 - Math.cos(th); };
    var P;
    S.draw = function () {
      clear(S); P = frame(S, pad(S, 40, 16, 20, 26), [-Math.PI * 1.5, Math.PI * 1.5], [-3, 3], { xlabel: 'θ', ylabel: 'p', fx: function (x) { return nf(x / Math.PI, 1) + 'π'; } });
      var ctx = S.ctx;
      [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 1.5, 2.2, 3].forEach(function (E) {
        [1, -1].forEach(function (sg) {
          P.curve(function (th) { var q = 2 * (E + Math.cos(th)); return q >= 0 ? sg * Math.sqrt(q) : NaN; }, Math.abs(E - 1) < 1e-9 ? S.C.bad : S.C.line, 1.2, 600);
        });
      });
      [1, -1].forEach(function (sg) { P.curve(function (th) { return sg * Math.sqrt(2 * (1 + Math.cos(th))); }, S.C.bad, 1.8, 800); });
      tr.forEach(function (q) { P.points(q.pts, S.C.accent, 2); P.dot(q.s[0], q.s[1], S.C.accent, 5); });
      var last = tr[tr.length - 1];
      out && out([last ? nf(H(last.s[0], last.s[1]), 3) : '—', last ? (H(last.s[0], last.s[1]) < 1 ? L('libration', 'تذبذب') : L('rotation', 'دوران')) : '—']);
    };
    S.legend([[L('separatrix', 'الفاصل'), S.C.bad], [L('trajectory', 'المسار'), S.C.accent]]);
    S.canvas.addEventListener('click', function (ev) {
      if (!P) return; var r = S.canvas.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      var th = P.xr[0] + (x - P.x0) / P.w * (P.xr[1] - P.xr[0]), p = P.yr[1] - (y - P.y0) / P.h * (P.yr[1] - P.yr[0]);
      tr.push({ s: [th, p], pts: [[th, p]] }); if (tr.length > 6) tr.shift();
    });
    S.canvas.style.cursor = 'crosshair';
    S.slider(L('Damping γ', 'التخميد γ'), 0, 0.5, 0.01, g, null, function (v) { g = v; });
    S.buttons([[L('Clear', 'مسح'), function () { tr = []; S.draw(); }]]);
    out = S.readout([L('Energy H', 'الطاقة H'), L('Motion', 'نوع الحركة')]);
    S.loop(function (dt) {
      var h = 0.01, n = Math.round(dt / h);
      tr.forEach(function (q) {
        for (var i = 0; i < n; i++) { q.s[1] += h * (-Math.sin(q.s[0]) - g * q.s[1]); q.s[0] += h * q.s[1]; if (q.s[0] > Math.PI * 1.5) { q.s[0] -= 2 * Math.PI; q.pts.push([NaN, NaN]); } if (q.s[0] < -Math.PI * 1.5) { q.s[0] += 2 * Math.PI; q.pts.push([NaN, NaN]); } }
        q.pts.push([q.s[0], q.s[1]]); if (q.pts.length > 1500) q.pts.shift();
      });
      S.draw();
    });
  };

  // ===== Standard Model table =====
  SIMS.particles = function (el) {
    var D = [
      ['u', L('up', 'العلوي'), '2.2 MeV', '+2/3', '1/2', 'q', 0], ['c', L('charm', 'الساحر'), '1.27 GeV', '+2/3', '1/2', 'q', 1], ['t', L('top', 'القمّي'), '172.7 GeV', '+2/3', '1/2', 'q', 2], ['g', L('gluon', 'الغليون'), '0', '0', '1', 'b', 3], ['H', L('Higgs', 'هيغز'), '125.2 GeV', '0', '0', 'h', 4],
      ['d', L('down', 'السفلي'), '4.7 MeV', '−1/3', '1/2', 'q', 5], ['s', L('strange', 'الغريب'), '93 MeV', '−1/3', '1/2', 'q', 6], ['b', L('bottom', 'القاعي'), '4.18 GeV', '−1/3', '1/2', 'q', 7], ['γ', L('photon', 'الفوتون'), '0', '0', '1', 'b', 8], null,
      ['e', L('electron', 'الإلكترون'), '0.511 MeV', '−1', '1/2', 'l', 9], ['μ', L('muon', 'الميون'), '105.7 MeV', '−1', '1/2', 'l', 10], ['τ', L('tau', 'التاو'), '1.777 GeV', '−1', '1/2', 'l', 11], ['Z', L('Z boson', 'بوزون Z'), '91.19 GeV', '0', '1', 'b', 12], null,
      ['νe', L('electron neutrino', 'نيوترينو إلكتروني'), '< 0.8 eV', '0', '1/2', 'l', 13], ['νμ', L('muon neutrino', 'نيوترينو ميوني'), '< 0.19 MeV', '0', '1/2', 'l', 14], ['ντ', L('tau neutrino', 'نيوترينو تاوي'), '< 18.2 MeV', '0', '1/2', 'l', 15], ['W', L('W boson', 'بوزون W'), '80.37 GeV', '±1', '1', 'b', 16], null
    ];
    var FAM = { q: [L('Quark', 'كوارك'), 'oklch(0.62 0.17 300)', L('strong, electromagnetic, weak', 'القوية والكهرومغناطيسية والضعيفة')], l: [L('Lepton', 'لبتون'), 'oklch(0.62 0.14 150)', L('weak (and electromagnetic if charged)', 'الضعيفة (والكهرومغناطيسية إن كان مشحونًا)')], b: [L('Gauge boson', 'بوزون معياري'), 'oklch(0.65 0.15 30)', L('force carrier', 'ناقل للقوة')], h: [L('Scalar boson', 'بوزون عددي'), 'oklch(0.7 0.14 80)', L('gives mass via the Higgs mechanism', 'يمنح الكتلة عبر آلية هيغز')] };
    el.innerHTML = '<div class="sim-head"><h3>' + L('The Standard Model', 'النموذج القياسي') + '</h3><p>' + L('Three generations of quarks and leptons, the force carriers and the Higgs boson. Select a particle.', 'ثلاثة أجيال من الكواركات واللبتونات، ونواقل القوى، وبوزون هيغز. اختر جسيمًا.') + '</p></div><div class="sm-grid"></div><div class="sm-info"></div>';
    var grid = el.querySelector('.sm-grid'), info = el.querySelector('.sm-info');
    grid.innerHTML = D.map(function (p, i) {
      if (!p) return '<span class="sm-cell empty"></span>';
      return '<button type="button" class="sm-cell" data-i="' + i + '" style="--c:' + FAM[p[5]][1] + '"><small>' + p[2] + '</small><b>' + p[0] + '</b><small>' + p[1] + '</small></button>';
    }).join('');
    function show(i) {
      var p = D[i]; grid.querySelectorAll('.sm-cell').forEach(function (c) { c.classList.toggle('on', +c.dataset.i === i); });
      info.innerHTML = '<div class="sim-readout">' +
        [[L('Particle', 'الجسيم'), p[1] + ' (' + p[0] + ')'], [L('Family', 'العائلة'), FAM[p[5]][0]], [L('Mass', 'الكتلة'), p[2]], [L('Charge (e)', 'الشحنة (e)'), p[3]], [L('Spin', 'اللف المغزلي'), p[4]], [L('Interactions', 'التفاعلات'), FAM[p[5]][2]]]
          .map(function (r) { return '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('') + '</div>';
    }
    grid.addEventListener('click', function (e) { var b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });
    show(0);
  };

  // ===== Vocabulary trainer (uses the course glossary) =====
  SIMS.vocab = function (el) {
    var rows = Array.prototype.slice.call(document.querySelectorAll('#glossary [data-term]'));
    var terms = rows.map(function (r) { return { en: r.dataset.en, ar: r.dataset.ar }; });
    el.innerHTML = '<div class="sim-head"><h3>' + L('Listen & choose', 'استمع واختر') + '</h3><p>' + L('Hear an English term, then pick its Arabic meaning. Builds listening and vocabulary at the same time.', 'استمع إلى مصطلح إنجليزي ثم اختر معناه بالعربية. يقوّي الاستماع والمفردات في آن واحد.') + '</p></div>' +
      '<div class="quiz" style="border:0;box-shadow:none"><div class="quiz-head"><span data-v-score></span></div><div class="q"><p class="q-text" data-v-word></p><div class="q-options" data-v-opts></div></div>' +
      '<div class="quiz-nav"><button class="btn btn-ghost" type="button" data-v-say>🔊 ' + L('Listen again', 'استمع مجددًا') + '</button><button class="btn btn-primary" type="button" data-v-next>' + L('Next word', 'الكلمة التالية') + '</button></div></div>';
    if (terms.length < 4) return;
    var ok = 0, tot = 0, cur = null, show = el.querySelector('[data-v-word]'), opts = el.querySelector('[data-v-opts]'), sc = el.querySelector('[data-v-score]');
    function say() { if (window.TW && TW.speak && cur) TW.speak(cur.en); }
    function next() {
      cur = terms[Math.floor(Math.random() * terms.length)];
      var pool = terms.filter(function (t) { return t !== cur; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3).concat([cur]).sort(function () { return Math.random() - 0.5; });
      show.textContent = '🔊 ' + cur.en; show.style.filter = 'blur(6px)'; show.style.cursor = 'pointer'; show.title = L('Click to reveal', 'انقر للإظهار');
      opts.innerHTML = pool.map(function (t, i) { return '<button type="button" class="opt" data-ok="' + (t === cur ? 1 : 0) + '"><span class="opt-key">' + (i + 1) + '</span><span class="opt-text" lang="ar">' + t.ar + '</span></button>'; }).join('');
      say();
    }
    show.addEventListener('click', function () { show.style.filter = 'none'; });
    opts.addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b || b.disabled) return;
      tot++; if (b.dataset.ok === '1') ok++;
      opts.querySelectorAll('.opt').forEach(function (o) { o.disabled = true; o.classList.add(o.dataset.ok === '1' ? 'right' : o === b ? 'wrong' : 'dim'); });
      show.style.filter = 'none'; sc.textContent = L('Score', 'النتيجة') + ': ' + ok + ' / ' + tot;
    });
    el.querySelector('[data-v-say]').addEventListener('click', say);
    el.querySelector('[data-v-next]').addEventListener('click', next);
    sc.textContent = L('Score', 'النتيجة') + ': 0 / 0';
    next();
  };

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-sim]'), function (el) {
      var f = SIMS[el.dataset.sim];
      if (f) { try { f(el); } catch (e) { el.hidden = true; if (window.console) console.error(e); } } else el.hidden = true;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
