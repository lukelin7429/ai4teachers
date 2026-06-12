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
