(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (touch) document.body.classList.add("is-touch");

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const nav = document.getElementById("nav");
  const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 20);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // Dual cursor
  const dot = document.querySelector(".cursor:not(.ring)");
  const ring = document.querySelector(".cursor.ring");
  if (dot && ring && !touch) {
    let x = 0, y = 0, dx = 0, dy = 0, rx = 0, ry = 0;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const tick = () => {
      dx += (x - dx) * 0.35;
      dy += (y - dy) * 0.35;
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll("a, button, .case, .filter, .service").forEach((el) => {
      el.addEventListener("pointerenter", () => { dot.classList.add("is-hover"); ring.classList.add("is-hover"); });
      el.addEventListener("pointerleave", () => { dot.classList.remove("is-hover"); ring.classList.remove("is-hover"); });
    });
  }

  // Portrait 3D tilt + magnetic light
  const stage = document.getElementById("portrait");
  const frame = document.getElementById("portraitFrame");
  if (stage && frame && !touch && !reduced) {
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 10}deg)`;
    });
    stage.addEventListener("pointerleave", () => {
      frame.style.transform = "rotateY(0) rotateX(0)";
    });
  }

  // Reveal
  const reveals = [...document.querySelectorAll(".reveal")];
  if (reduced) reveals.forEach((el) => el.classList.add("in"));
  else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("in"));

  // Filters
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
