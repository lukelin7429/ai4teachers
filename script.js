/* AI4Teachers — clean EN / 中文 toggle.
   SINGLE source of truth: the <html> element's class.
   CSS hides the other language; you never see both, never blank. */
(function () {
  var KEY = 'ai4t-lang';
  var html = document.documentElement;

  function apply(lang) {
    html.classList.remove('lang-en', 'lang-zh');
    html.classList.add('lang-' + lang);
    html.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        apply(this.getAttribute('data-lang'));
      });
    }
  });
})();

/* Expandable teaching cards on the lessons index. */
(function () {
  function toggle(card) {
    var open = card.getAttribute('aria-expanded') === 'true';
    card.setAttribute('aria-expanded', open ? 'false' : 'true');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cards = document.querySelectorAll('.expandable-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('a, button, .lang-seg')) return;
        toggle(this);
      });
      cards[i].addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        toggle(this);
      });
    }
  });
})();

/* Scroll reveal — getBoundingClientRect version, auto-applied site-wide.
   Elements get .rvl (hidden) then .in when they enter the viewport. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var SEL = '.section-head, .feature, .about, .ahead, .lesson-card, .starter-card, .prompt-box, .term, .site-card, ' +
            '.contact-card, .goals, .mode, .checklist, .track-head, .credo';

  document.addEventListener('DOMContentLoaded', function () {
    var els = [].slice.call(document.querySelectorAll(SEL));
    for (var i = 0; i < els.length; i++) {
      var el = els[i], p = el.parentNode;
      p.__rvlN = (p.__rvlN === undefined) ? 0 : p.__rvlN + 1;
      el.classList.add('rvl');
      if (p.__rvlN % 3 === 1) el.classList.add('d1');
      if (p.__rvlN % 3 === 2) el.classList.add('d2');
    }
    function check() {
      var vh = window.innerHeight;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.classList.contains('in')) continue;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.88 && r.bottom > 0) el.classList.add('in');
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    setTimeout(check, 80);
  });
})();

/* Cursor spotlight on cards + header shadow + reading progress bar. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var cards = document.querySelectorAll('.feature');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('mousemove', function (e) {
        var r = this.getBoundingClientRect();
        this.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        this.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }

    var header = document.querySelector('.site-header');
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    function onScroll() {
      if (header) header.classList[window.scrollY > 8 ? 'add' : 'remove']('scrolled');
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  });
})();

/* Hero mockup: "you type a prompt, AI builds the site" loop. */
(function () {
  var PROMPT = 'Make a bilingual website for my Grade 4 English club';

  document.addEventListener('DOMContentLoaded', function () {
    var txt = document.querySelector('.ai-text');
    if (!txt) return;
    var caret = document.querySelector('.ai-caret');
    var gens = document.querySelectorAll('.window-body .gen');
    var STEPS = 5;

    function setStep(s, on) {
      for (var i = 0; i < gens.length; i++) {
        if (+gens[i].getAttribute('data-step') === s) {
          gens[i].classList[on ? 'add' : 'remove']('on');
        }
      }
    }

    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      txt.textContent = PROMPT;
      if (caret) caret.style.display = 'none';
      for (var s = 1; s <= STEPS; s++) setStep(s, true);
      return;
    }

    function run() {
      for (var s = 1; s <= STEPS; s++) setStep(s, false);
      txt.textContent = '';
      var i = 0;
      (function type() {
        if (i < PROMPT.length) {
          txt.textContent += PROMPT.charAt(i++);
          setTimeout(type, 34 + Math.random() * 38);
        } else {
          setTimeout(function () { reveal(1); }, 550);
        }
      })();
      function reveal(s) {
        setStep(s, true);
        if (s < STEPS) setTimeout(function () { reveal(s + 1); }, 300);
        else setTimeout(run, 5600);
      }
    }
    setTimeout(run, 600);
  });
})();
