(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (touch) document.body.classList.add("is-touch");

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring && !touch) {
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let dx = 0;
    let dy = 0;

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
      },
      { passive: true }
    );

    const tick = () => {
      dx += (x - dx) * 0.35;
      dy += (y - dy) * 0.35;
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    const hoverables = document.querySelectorAll("a, button, .card, .filter, .service, .review");
    hoverables.forEach((el) => {
      el.addEventListener("pointerenter", () => {
        dot.classList.add("is-hover");
        ring.classList.add("is-hover");
      });
      el.addEventListener("pointerleave", () => {
        dot.classList.remove("is-hover");
        ring.classList.remove("is-hover");
      });
    });

    window.addEventListener("pointerdown", () => ring.classList.add("is-press"));
    window.addEventListener("pointerup", () => ring.classList.remove("is-press"));
  }

  const reveals = [...document.querySelectorAll(".reveal")];
  if (reduced) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const filters = [...document.querySelectorAll(".filter")];
  const cards = [...document.querySelectorAll(".card")];
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("is-on"));
      btn.classList.add("is-on");
      const key = btn.dataset.filter;
      cards.forEach((card) => {
        const cats = (card.dataset.cat || "").split(/\s+/);
        card.hidden = !(key === "all" || cats.includes(key));
      });
    });
  });
})();
