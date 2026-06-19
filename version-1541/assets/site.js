(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        const button = document.querySelector("[data-menu-toggle]");
        const nav = document.querySelector("[data-main-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        const carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        const slides = Array.from(carousel.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        let index = 0;
        let timer = null;
        const show = function (nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        };
        const start = function () {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        };
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(dotIndex);
                start();
            });
        });
        start();
    }

    function setupSearch() {
        const panels = Array.from(document.querySelectorAll("[data-search-panel]"));
        panels.forEach(function (panel) {
            const input = panel.querySelector("[data-movie-search]");
            const yearFilter = panel.querySelector("[data-year-filter]");
            const typeFilter = panel.querySelector("[data-type-filter]");
            const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
            const empty = document.querySelector("[data-empty-state]");
            if (!input || cards.length === 0) {
                return;
            }
            const apply = function () {
                const query = input.value.trim().toLowerCase();
                const year = yearFilter ? yearFilter.value : "";
                const type = typeFilter ? typeFilter.value : "";
                let visibleCount = 0;
                cards.forEach(function (card) {
                    const haystack = [
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.year,
                        card.dataset.genre,
                        card.dataset.category,
                        card.textContent
                    ].join(" ").toLowerCase();
                    const matchQuery = !query || haystack.indexOf(query) !== -1;
                    const matchYear = !year || card.dataset.year === year;
                    const matchType = !type || (card.dataset.type || "").indexOf(type) !== -1 || haystack.indexOf(type.toLowerCase()) !== -1;
                    const visible = matchQuery && matchYear && matchType;
                    card.hidden = !visible;
                    if (visible) {
                        visibleCount += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visibleCount !== 0;
                }
            };
            input.addEventListener("input", apply);
            if (yearFilter) {
                yearFilter.addEventListener("change", apply);
            }
            if (typeFilter) {
                typeFilter.addEventListener("change", apply);
            }
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
