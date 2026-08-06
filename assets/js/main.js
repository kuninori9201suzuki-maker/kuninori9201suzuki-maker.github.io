/* 有限会社 丸忍工業所 — 共通スクリプト（依存ライブラリなし） */
(function () {
  'use strict';

  /* --- モバイルメニュー --- */
  var burger = document.querySelector('.burger');
  var gnav = document.querySelector('.gnav');
  if (burger && gnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      gnav.classList.toggle('is-open', !open);
    });
    gnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        gnav.classList.remove('is-open');
      }
    });
  }

  /* --- スクロールで要素を表示 --- */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --- 数字のカウントアップ --- */
  var figs = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && figs.length &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var fo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var goal = parseFloat(el.getAttribute('data-count'));
        var start = performance.now();
        var dur = 1100;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var v = goal * eased;
          el.textContent = goal >= 1000
            ? Math.floor(v).toLocaleString('ja-JP')
            : Math.floor(v).toString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = goal >= 1000 ? goal.toLocaleString('ja-JP') : String(goal);
        })(start);
        fo.unobserve(el);
      });
    }, { threshold: 0.5 });
    figs.forEach(function (el) { fo.observe(el); });
  }

  /* --- 表示中のセクションをナビでハイライト（1枚もの用） --- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.gnav__link[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length) {
    var spy = function () {
      var pos = window.scrollY + 140;
      var active = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) active = s.id;
      });
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { spy(); ticking = false; });
    }, { passive: true });
    spy();
  }
})();
