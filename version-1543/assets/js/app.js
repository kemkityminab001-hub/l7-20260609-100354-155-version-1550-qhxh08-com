(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var toggle = document.querySelector('.mobile-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var carousel = document.querySelector('.hero-carousel');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-indicator'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var active = 0;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
      });
    }

    if (slides.length > 1) {
      window.setInterval(function () {
        show(active + 1);
      }, 5600);
    }
  }

  function initCardFilters() {
    var inputs = document.querySelectorAll('[data-card-filter]');
    inputs.forEach(function (input) {
      var scope = document.querySelector('[data-filter-scope]');
      if (!scope) {
        return;
      }
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search]'));
      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.getAttribute('data-search') || '';
          card.hidden = keyword && text.indexOf(keyword) === -1;
        });
      });
    });
  }

  function initPlayers() {
    var players = document.querySelectorAll('.player-root');
    players.forEach(function (root) {
      var video = root.querySelector('video');
      var cover = root.querySelector('.player-cover');
      var button = root.querySelector('[data-play]');
      var stream = root.getAttribute('data-stream');
      var loaded = false;
      var hls = null;

      function attach() {
        if (!video || !stream || loaded) {
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
        loaded = true;
      }

      function play() {
        attach();
        if (cover) {
          cover.classList.add('is-hidden');
        }
        video.controls = true;
        var attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!loaded) {
            play();
          }
        });
        video.addEventListener('ended', function () {
          if (hls && hls.stopLoad) {
            hls.stopLoad();
          }
        });
      }
    });
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function makeCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">'
      + '<a class="card-poster" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">'
      + '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">'
      + '<span class="card-type">' + escapeHtml(movie.type) + '</span>'
      + '<span class="card-score">' + escapeHtml(movie.rating) + '</span>'
      + '</a>'
      + '<div class="card-body">'
      + '<a class="card-title" href="' + movie.url + '">' + escapeHtml(movie.title) + '</a>'
      + '<p>' + escapeHtml(shortText(movie.oneLine, 96)) + '</p>'
      + '<div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(shortText(movie.region, 14)) + '</span><span>' + escapeHtml(movie.hot) + '</span></div>'
      + '<div class="tag-row">' + tags + '</div>'
      + '</div>'
      + '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function shortText(value, length) {
    value = String(value || '').replace(/\s+/g, ' ').trim();
    return value.length > length ? value.slice(0, length) + '…' : value;
  }

  function initSearchPage() {
    var form = document.querySelector('[data-live-search]');
    var results = document.querySelector('[data-search-results]');
    var count = document.querySelector('[data-search-count]');
    var filters = document.querySelector('[data-search-filters]');
    var data = window.SEARCH_MOVIES || [];
    if (!form || !results || !data.length) {
      return;
    }
    var input = form.querySelector('input[name="q"]');
    var activeType = '';
    var firstQuery = getQuery();
    if (input && firstQuery) {
      input.value = firstQuery;
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var filtered = data.filter(function (movie) {
        var hay = [movie.title, movie.year, movie.region, movie.type, movie.genre, (movie.tags || []).join(' '), movie.oneLine].join(' ').toLowerCase();
        var matchKeyword = !keyword || hay.indexOf(keyword) >= 0;
        var matchType = !activeType || hay.indexOf(activeType.toLowerCase()) >= 0;
        return matchKeyword && matchType;
      }).slice(0, 120);
      results.innerHTML = filtered.map(makeCard).join('');
      if (count) {
        count.textContent = filtered.length ? '为你找到相关影片' : '没有找到匹配影片';
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply();
    });
    if (input) {
      input.addEventListener('input', apply);
    }
    if (filters) {
      filters.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function () {
          filters.querySelectorAll('button').forEach(function (item) {
            item.classList.remove('is-active');
          });
          button.classList.add('is-active');
          activeType = button.getAttribute('data-type') || '';
          apply();
        });
      });
      var first = filters.querySelector('button');
      if (first) {
        first.classList.add('is-active');
      }
    }
    if (firstQuery) {
      apply();
    }
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initCardFilters();
    initPlayers();
    initSearchPage();
  });
})();
