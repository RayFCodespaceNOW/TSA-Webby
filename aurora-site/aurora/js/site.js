/* AURORA site script. Plain JavaScript, no libraries.
   Everything here is progressive enhancement: pages still read without it. */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Mission timeline: highlight the step closest to the middle of the screen ---- */
  var steps = document.querySelectorAll('.timeline li');
  if (steps.length) {
    var ticking = false;
    var mark = function () {
      var mid = window.innerHeight / 2, best = null, bestDist = Infinity;
      steps.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var d = Math.abs(r.top + Math.min(r.height, 120) / 2 - mid);
        if (d < bestDist) { bestDist = d; best = s; }
      });
      steps.forEach(function (s) { s.classList.toggle('is-active', s === best); });
      ticking = false;
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(mark); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mark();
  }

  /* ---- Spacecraft explorer ---- */
  var explorer = document.getElementById('explorer');
  if (explorer) {
    var buttons = explorer.querySelectorAll('.module-list button');
    var spots = explorer.querySelectorAll('.hotspot');
    var items = explorer.querySelectorAll('.module-item');
    explorer.classList.add('enhanced');

    var select = function (id, moveFocus) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.module === id)); });
      spots.forEach(function (s) { s.classList.toggle('on', s.dataset.module === id); });
      items.forEach(function (i) { i.hidden = i.dataset.module !== id; });
      if (moveFocus) {
        var shown = explorer.querySelector('.module-item:not([hidden])');
        if (shown) { shown.setAttribute('tabindex', '-1'); shown.focus({ preventScroll: false }); }
      }
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { select(b.dataset.module, false); });
    });
    spots.forEach(function (s) {
      s.addEventListener('click', function () { select(s.dataset.module, false); });
      s.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(s.dataset.module, false); }
      });
    });
    select(buttons[0].dataset.module, false);
  }

  /* ---- Transit planner ---- */
  var planner = document.getElementById('planner');
  if (planner) {
    var stay = planner.querySelector('#stay');
    var stayOut = planner.querySelector('#stay-out');
    var outDays = planner.querySelector('#out-days');
    var surfDays = planner.querySelector('#surf-days');
    var retDays = planner.querySelector('#ret-days');
    var totDays = planner.querySelector('#tot-days');
    var totMonths = planner.querySelector('#tot-months');
    var note = planner.querySelector('#planner-note');

    var update = function () {
      var chosen = planner.querySelector('input[name="speed"]:checked');
      var transit = Number(chosen.value);
      var s = Number(stay.value);
      var total = transit * 2 + s;
      stayOut.textContent = s + ' days';
      outDays.textContent = transit;
      surfDays.textContent = s;
      retDays.textContent = transit;
      totDays.textContent = total;
      totMonths.textContent = (total / 30.44).toFixed(1);
      note.textContent = s < 100
        ? 'A very short stay means less science per launch. It also needs a faster, more demanding trip than this simple model shows.'
        : s > 400
          ? 'A long stay lets the crew wait for the planets to line up for the trip home, and gives more time for research.'
          : 'A middle-length stay balances research time against time away from Earth.';
    };
    planner.addEventListener('input', update);
    update();
  }
})();
