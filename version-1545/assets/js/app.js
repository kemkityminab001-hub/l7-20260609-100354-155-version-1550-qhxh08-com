(function () {
    "use strict";

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initializeMobileNavigation() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");

        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initializeHero() {
        var hero = document.querySelector("[data-hero]");

        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initializeQuickSearch() {
        document.querySelectorAll("[data-quick-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                var target = "./all-movies.html";

                if (query) {
                    target += "?q=" + encodeURIComponent(query);
                }

                window.location.href = target;
            });
        });
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initializeFilters() {
        document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
            var search = scope.querySelector("[data-filter-search]");
            var category = scope.querySelector("[data-filter-category]");
            var year = scope.querySelector("[data-filter-year]");
            var reset = scope.querySelector("[data-filter-reset]");
            var count = scope.querySelector("[data-visible-count]");
            var empty = scope.querySelector("[data-filter-empty]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
            var parameters = new URLSearchParams(window.location.search);
            var initialQuery = parameters.get("q");

            if (initialQuery && search) {
                search.value = initialQuery;
            }

            function apply() {
                var query = normalize(search ? search.value : "");
                var selectedCategory = normalize(category ? category.value : "");
                var selectedYear = normalize(year ? year.value : "");
                var visible = 0;

                cards.forEach(function (card) {
                    var dataset = card.dataset;
                    var haystack = normalize([
                        dataset.title,
                        dataset.category,
                        dataset.year,
                        dataset.region,
                        dataset.genre,
                        dataset.tags
                    ].join(" "));
                    var matchesQuery = !query || haystack.indexOf(query) !== -1;
                    var matchesCategory = !selectedCategory || normalize(dataset.category) === selectedCategory;
                    var matchesYear = !selectedYear || normalize(dataset.year) === selectedYear;
                    var matches = matchesQuery && matchesCategory && matchesYear;

                    card.hidden = !matches;

                    if (matches) {
                        visible += 1;
                    }
                });

                if (count) {
                    count.textContent = String(visible);
                }

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            [search, category, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            if (reset) {
                reset.addEventListener("click", function () {
                    if (search) {
                        search.value = "";
                    }
                    if (category) {
                        category.value = "";
                    }
                    if (year) {
                        year.value = "";
                    }
                    apply();
                });
            }

            apply();
        });
    }

    ready(function () {
        initializeMobileNavigation();
        initializeHero();
        initializeQuickSearch();
        initializeFilters();
    });
}());
