(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (touch) document.body.classList.add("is-touch");

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Soften image drag / hotlink UX without blocking accessibility
  document.addEventListener(
    "dragstart",
    (e) => {
      if (e.target instanceof HTMLImageElement) e.preventDefault();
    },
    { capture: true }
  );

  const nav = document.getElementById("nav");
  const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 20);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  };
  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Dual cursor — pause when tab hidden
  const dot = document.querySelector(".cursor:not(.ring)");
  const ring = document.querySelector(".cursor.ring");
  if (dot && ring && !touch) {
    let x = 0,
      y = 0,
      dx = 0,
      dy = 0,
      rx = 0,
      ry = 0,
      raf = 0;
    addEventListener(
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
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    start();
    document.querySelectorAll("a, button, .case, .filter, .service").forEach((el) => {
      el.addEventListener("pointerenter", () => {
        dot.classList.add("is-hover");
        ring.classList.add("is-hover");
      });
      el.addEventListener("pointerleave", () => {
        dot.classList.remove("is-hover");
        ring.classList.remove("is-hover");
      });
    });
  }

  // Portrait 3D tilt
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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("in"));

  // Filters + a11y
  const filters = [...document.querySelectorAll(".filter")];
  const cases = [...document.querySelectorAll(".case")];
  const live = document.getElementById("filterLive");
  filters.forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("is-on") ? "true" : "false");
    btn.addEventListener("click", () => {
      filters.forEach((f) => {
        f.classList.remove("is-on");
        f.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-on");
      btn.setAttribute("aria-pressed", "true");
      const key = btn.dataset.filter;
      let visible = 0;
      cases.forEach((card) => {
        const cats = (card.dataset.cat || "").split(/\s+/);
        const show = key === "all" || cats.includes(key);
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (live) live.textContent = `Показано проектов: ${visible}`;
    });
  });

  // Harden external anchors if any appear later
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    try {
      const url = new URL(a.href);
      if (url.origin !== location.origin) {
        a.rel = [a.rel, "noopener", "noreferrer"].filter(Boolean).join(" ").trim();
        if (!a.target) a.target = "_blank";
      }
    } catch {
      /* ignore */
    }
  });

  // Cookie consent (necessary vs analytics-ready)
  const cookieKey = "ss_cookie_consent";
  const bar = document.getElementById("cookieBar");
  const acceptBtn = document.getElementById("cookieAccept");
  const rejectBtn = document.getElementById("cookieReject");
  const saved = localStorage.getItem(cookieKey);
  const applyConsent = (value) => {
    localStorage.setItem(cookieKey, value);
    document.documentElement.dataset.consent = value;
    bar?.setAttribute("hidden", "");
    // Hook for future analytics: only load when value === "accepted"
    window.dispatchEvent(new CustomEvent("ss:consent", { detail: { value } }));
  };
  if (!saved && bar) bar.removeAttribute("hidden");
  else if (saved) document.documentElement.dataset.consent = saved;
  acceptBtn?.addEventListener("click", () => applyConsent("accepted"));
  rejectBtn?.addEventListener("click", () => applyConsent("necessary"));
})();
