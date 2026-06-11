/* AI4Teachers — one-click EN / 中文 toggle, no page reload.
   Remembers the choice in localStorage. Default: English
   (Lesson 1 is taught to international teachers). */
(function () {
  var KEY = 'ai4t-lang';

  function apply(lang) {
    document.body.classList.remove('lang-en', 'lang-zh');
    document.body.classList.add('lang-' + lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = lang === 'en' ? '中文' : 'EN';
      btns[i].setAttribute('aria-label', lang === 'en' ? '切換到中文' : 'Switch to English');
    }
  }

  function current() {
    return document.body.classList.contains('lang-zh') ? 'zh' : 'en';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var saved = 'en';
    try { saved = localStorage.getItem(KEY) || 'en'; } catch (e) {}
    apply(saved);
    var btns = document.querySelectorAll('[data-lang-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        apply(current() === 'en' ? 'zh' : 'en');
      });
    }
  });
})();
