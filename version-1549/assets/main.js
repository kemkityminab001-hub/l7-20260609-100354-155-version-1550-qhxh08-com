(() => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      mobileNav.classList.toggle("is-open");
    });
  }

  const slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
    const previous = slider.querySelector("[data-hero-prev]");
    const next = slider.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    const show = (index) => {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    };

    const start = () => {
      timer = window.setInterval(() => show(current + 1), 5200);
    };

    const restart = () => {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    previous?.addEventListener("click", () => {
      show(current - 1);
      restart();
    });

    next?.addEventListener("click", () => {
      show(current + 1);
      restart();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        show(index);
        restart();
      });
    });

    show(0);
    start();
  }

  const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
  const searchInputs = Array.from(document.querySelectorAll("[data-card-search]"));
  const emptyMessage = document.querySelector("[data-empty-message]");

  const runSearch = (value) => {
    const query = value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const text = (card.getAttribute("data-search") || "").toLowerCase();
      const match = !query || text.includes(query);
      card.style.display = match ? "" : "none";
      if (match) {
        visible += 1;
      }
    });

    if (emptyMessage) {
      emptyMessage.classList.toggle("is-visible", visible === 0);
    }
  };

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => runSearch(input.value));
  });

  const sortGrid = document.querySelector("[data-sort-grid]");
  const sortActions = document.querySelector("[data-sort-actions]");

  if (sortGrid && sortActions) {
    sortActions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sort]");
      if (!button) {
        return;
      }

      const direction = button.getAttribute("data-sort");
      const items = Array.from(sortGrid.querySelectorAll("[data-movie-card]"));

      items.sort((a, b) => {
        const yearA = Number(a.getAttribute("data-year")) || 0;
        const yearB = Number(b.getAttribute("data-year")) || 0;
        return direction === "asc" ? yearA - yearB : yearB - yearA;
      });

      items.forEach((item) => sortGrid.appendChild(item));
    });
  }
})();
