(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileQuery = window.matchMedia('(max-width: 768px)');

  var revealItems = document.querySelectorAll('.reveal');

  function showAllReveal() {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAllReveal();
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

    function revealAtBottom() {
      var scrollBottom = window.scrollY + window.innerHeight;
      var documentHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= documentHeight - 4) {
        showAllReveal();
      }
    }

    window.addEventListener('scroll', revealAtBottom, { passive: true });
    window.addEventListener('resize', revealAtBottom);
    revealAtBottom();
  }

  var backgroundVideo = document.querySelector('[data-background-video]');
  var backgroundLayer = document.querySelector('.background');
  var parallaxTick = 0;

  function syncBackgroundVideo() {
    if (!backgroundVideo) {
      return;
    }

    if (mobileQuery.matches && !reduceMotion) {
      backgroundVideo.muted = true;
      var playPromise = backgroundVideo.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    } else {
      backgroundVideo.pause();
    }
  }

  function updateParallax() {
    parallaxTick = 0;

    if (!backgroundVideo || !backgroundLayer || !mobileQuery.matches || reduceMotion) {
      return;
    }

    var maxShift = window.innerHeight * 0.08;
    var offset = window.scrollY * -0.15;

    if (offset < -maxShift) {
      offset = -maxShift;
    } else if (offset > maxShift) {
      offset = maxShift;
    }

    backgroundVideo.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
  }

  function requestParallax() {
    if (parallaxTick) {
      return;
    }

    parallaxTick = window.requestAnimationFrame(updateParallax);
  }

  syncBackgroundVideo();

  if (backgroundLayer && !reduceMotion) {
    updateParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
  }

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', function () {
      syncBackgroundVideo();
      updateParallax();
    });
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(function () {
      syncBackgroundVideo();
      updateParallax();
    });
  }

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
