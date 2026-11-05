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
      items.forEach(function (i) { i.classList.toggle('is-active', i.dataset.module === id); });
      if (moveFocus) {
        var active = explorer.querySelector('.module-item.is-active');
        if (active) { active.setAttribute('tabindex', '-1'); active.focus({ preventScroll: false }); }
      }
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        select(b.dataset.module, false);
        explorer.querySelector('.module-item.is-active').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    spots.forEach(function (s) {
      s.addEventListener('click', function () {
        select(s.dataset.module, false);
        explorer.querySelector('.module-item.is-active').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      s.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(s.dataset.module, false);
          explorer.querySelector('.module-item.is-active').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
    var moduleTicking = false;
    var markModule = function () {
      var middle = window.innerHeight / 2;
      var best = null;
      var bestDistance = Infinity;
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        var distance = Math.abs(rect.top + Math.min(rect.height, 120) / 2 - middle);
        if (distance < bestDistance) { bestDistance = distance; best = item; }
      });
      if (best) { select(best.dataset.module, false); }
      moduleTicking = false;
    };
    var updateModuleOnScroll = function () {
      if (!moduleTicking) {
        moduleTicking = true;
        requestAnimationFrame(markModule);
      }
    };
    window.addEventListener('scroll', updateModuleOnScroll, { passive: true });
    window.addEventListener('resize', updateModuleOnScroll);
    markModule();
    select(items[0].dataset.module, false);
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
    var fuelLevels = planner.querySelectorAll('[data-fuel-speed]');

    var update = function () {
      var chosen = planner.querySelector('input[name="speed"]:checked');
      var transit = Number(chosen.value);
      var s = Number(stay.value);
      var total = transit * 2 + s;
      fuelLevels.forEach(function (level) {
        var selected = level.dataset.fuelSpeed === chosen.value;
        level.classList.toggle('is-selected', selected);
        level.querySelector('.fuel-selected').hidden = !selected;
      });
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
