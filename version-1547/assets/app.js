(function () {
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;
    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }
    function restart() {
      if (timer) window.clearInterval(timer);
      play();
    }
    if (prev) prev.addEventListener('click', function () { show(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { show(index + 1); restart(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        restart();
      });
    });
    play();
  }

  function initRails() {
    document.querySelectorAll('[data-carousel]').forEach(function (rail) {
      var track = rail.querySelector('.rail-track');
      var left = rail.querySelector('[data-scroll-left]');
      var right = rail.querySelector('[data-scroll-right]');
      if (!track) return;
      if (left) left.addEventListener('click', function () { track.scrollBy({ left: -420, behavior: 'smooth' }); });
      if (right) right.addEventListener('click', function () { track.scrollBy({ left: 420, behavior: 'smooth' }); });
    });
  }

  function textOf(card) {
    return [
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-year'),
      card.getAttribute('data-type'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-tags'),
      card.getAttribute('data-category')
    ].join(' ').toLowerCase();
  }

  function initFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-search-input]');
      var selects = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-select]'));
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var empty = scope.querySelector('[data-empty-state]');
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (input && q) input.value = q;
      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var visible = 0;
        cards.forEach(function (card) {
          var ok = !query || textOf(card).indexOf(query) !== -1;
          selects.forEach(function (select) {
            var key = select.getAttribute('data-filter-select');
            var val = select.value;
            if (val && card.getAttribute('data-' + key) !== val) ok = false;
          });
          card.style.display = ok ? '' : 'none';
          if (ok) visible += 1;
        });
        if (empty) empty.classList.toggle('is-visible', visible === 0);
      }
      if (input) input.addEventListener('input', apply);
      selects.forEach(function (select) { select.addEventListener('change', apply); });
      apply();
    });
  }

  function initPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('.player-overlay');
      if (!video || !button) return;
      function start() {
        var url = video.getAttribute('data-video-url');
        if (!url) return;
        if (!video.getAttribute('data-ready')) {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ lowLatencyMode: true });
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            video.src = url;
          }
          video.setAttribute('data-ready', '1');
        }
        button.classList.add('is-hidden');
        video.controls = true;
        var action = video.play();
        if (action && typeof action.catch === 'function') action.catch(function () {});
      }
      button.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (!video.getAttribute('data-ready')) start();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initRails();
    initFilters();
    initPlayers();
  });
})();
