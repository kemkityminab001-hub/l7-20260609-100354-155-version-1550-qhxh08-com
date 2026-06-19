(function () {
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("is-locked", open);
    });
  }

  document.querySelectorAll("[data-search-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var target = form.getAttribute("data-search-target") || "search.html";
      var query = input ? input.value.trim() : "";
      var glue = target.indexOf("?") === -1 ? "?" : "&";
      window.location.href = query ? target + glue + "q=" + encodeURIComponent(query) : target;
    });
  });

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
    var input = panel.querySelector("[data-filter-input]");
    var year = panel.querySelector("[data-filter-year]");
    var type = panel.querySelector("[data-filter-type]");
    var region = panel.querySelector("[data-filter-region]");
    var status = panel.querySelector("[data-filter-status]");
    var scope = panel.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".filter-card"));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(input ? input.value : "");
      var selectedYear = normalize(year ? year.value : "");
      var selectedType = normalize(type ? type.value : "");
      var selectedRegion = normalize(region ? region.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-text"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardType = normalize(card.getAttribute("data-type"));
        var cardRegion = normalize(card.getAttribute("data-region"));
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (selectedYear && cardYear.indexOf(selectedYear) === -1) {
          matched = false;
        }
        if (selectedType && cardType.indexOf(selectedType) === -1 && text.indexOf(selectedType) === -1) {
          matched = false;
        }
        if (selectedRegion && cardRegion.indexOf(selectedRegion) === -1 && text.indexOf(selectedRegion) === -1) {
          matched = false;
        }

        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = visible > 0 ? "已为你筛选出匹配影片" : "没有找到匹配影片";
      }
    }

    [input, year, type, region].forEach(function (item) {
      if (item) {
        item.addEventListener("input", applyFilters);
        item.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  });
})();
