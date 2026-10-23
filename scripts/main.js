/* Интерактив страницы-приглашения:
   1) плавное появление блоков при прокрутке;
   2) мягкий переход с титульного экрана к приглашению. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Плавное появление при прокрутке */
  var revealItems = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* Кнопка «Открыть приглашение» — плавный переход к содержимому */
  var openButton = document.querySelector('[data-hero-open]');

  if (openButton) {
    openButton.addEventListener('click', function (event) {
      var target = document.querySelector(openButton.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }
})();