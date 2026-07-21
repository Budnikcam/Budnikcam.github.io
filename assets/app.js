(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (touch) document.body.classList.add("is-touch");

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const cursor = document.querySelector(".cursor");
  if (cursor && !touch) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll("a, button, .case, .filter, .service").forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
    });
  }

  const reveals = [...document.querySelectorAll(".reveal")];
  if (reduced) reveals.forEach((el) => el.classList.add("is-in"));
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("is-in"));

  const filters = [...document.querySelectorAll(".filter")];
  const cases = [...document.querySelectorAll(".case")];
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("is-on"));
      btn.classList.add("is-on");
      const key = btn.dataset.filter;
      cases.forEach((card) => {
        const cats = (card.dataset.cat || "").split(/\s+/);
        card.hidden = !(key === "all" || cats.includes(key));
      });
    });
  });
})();
