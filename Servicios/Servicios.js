(() => {
  const BP = 1024; // breakpoint tablet/móvil
  const TARGET_PCT = 0.4; // línea objetivo (30% desde arriba)
  const BAND_PCT = 0.15; // tolerancia ±5% (ajústala a gusto)
  const items = Array.from(document.querySelectorAll(".Servicios__Item"));

  let ticking = false;

  function setActiveBy30pct() {
    if (window.innerWidth >= BP) {
      items.forEach((el) => el.classList.remove("is-active"));
      return;
    }
    const vh = window.innerHeight;
    const targetY = vh * TARGET_PCT; // línea 30%
    const tol = vh * BAND_PCT; // ancho de banda permitido

    let best = null,
      bestDist = Infinity;

    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      // salta cards totalmente fuera de pantalla
      if (r.bottom < 0 || r.top > vh) return;

      const centerY = r.top + r.height / 2; // usa el CENTRO de la card
      const dist = Math.abs(centerY - targetY);
      if (dist < bestDist) {
        best = el;
        bestDist = dist;
      }
    });

    items.forEach((el) => el.classList.remove("is-active"));
    if (best && bestDist <= tol) best.classList.add("is-active");
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActiveBy30pct();
      ticking = false;
    });
  }

  // init + listeners
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setActiveBy30pct);
  } else {
    setActiveBy30pct();
  }
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  window.addEventListener("orientationchange", onScrollOrResize);
})();
