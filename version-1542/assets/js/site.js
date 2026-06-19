document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    });

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
        var area = panel.parentElement.querySelector("[data-filter-area]");
        var input = panel.querySelector("[data-filter-input]");
        var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-select]"));
        var reset = panel.querySelector("[data-filter-reset]");

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilter() {
            if (!area) {
                return;
            }
            var query = normalize(input ? input.value : "");
            var filters = {};
            selects.forEach(function (select) {
                filters[select.getAttribute("data-filter-select")] = normalize(select.value);
            });
            area.querySelectorAll("[data-movie-card]").forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-search"));
                var visible = !query || haystack.indexOf(query) !== -1;

                Object.keys(filters).forEach(function (key) {
                    var value = filters[key];
                    if (value && normalize(card.getAttribute("data-" + key)) !== value) {
                        visible = false;
                    }
                });

                card.classList.toggle("is-hidden", !visible);
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        selects.forEach(function (select) {
            select.addEventListener("change", applyFilter);
        });

        if (reset) {
            reset.addEventListener("click", function () {
                if (input) {
                    input.value = "";
                }
                selects.forEach(function (select) {
                    select.value = "";
                });
                applyFilter();
            });
        }
    });
});
