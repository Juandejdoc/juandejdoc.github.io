document.addEventListener("DOMContentLoaded", () => {
  // Claves → deben coincidir con tus clases e IDs de botones
  const keys = [
    "ServiciosYCovertura",
    "ProcesosYContratacion",
    "NormativasYRespaldo",
  ];

  // 1) Localiza listas existentes por clase (no toques el HTML)
  const lists = keys
    .map((k) => document.querySelector(`ul.${k}`))
    .filter(Boolean);

  if (!lists.length) return;

  // 2) Crea el “viewport” y el “track” y mete dentro tus UL como slides
  const firstListParent = lists[0].parentElement;
  const viewport = document.createElement("div");
  viewport.className = "faq-viewport";
  const track = document.createElement("div");
  track.className = "faq-track";
  viewport.appendChild(track);
  firstListParent.insertBefore(viewport, lists[0]); // coloca antes de la primera UL

  const slides = [];
  lists.forEach((ul, i) => {
    const slide = document.createElement("section");
    slide.className = "faq-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", keys[i] || `Sección ${i + 1}`);
    track.appendChild(slide);
    slide.appendChild(ul); // mueve la UL dentro del slide
    slides.push(slide);
  });

  // 3) Botones (IDs deben coincidir con las claves)
  const buttons = Object.fromEntries(
    keys.map((k) => [k, document.getElementById(k)]).filter(([, b]) => !!b)
  );

  // Vincula aria-controls (asigna ID a cada UL si no tiene)
  lists.forEach((ul, i) => {
    if (!ul.id) ul.id = `faq-${keys[i] || i}`;
    buttons[keys[i]]?.setAttribute("aria-controls", ul.id);
  });

  // 4) Helpers
  let activeIndex = 0;

  const setViewportHeight = () => {
    const h = slides[activeIndex].offsetHeight;
    viewport.classList.add("animating-height");
    viewport.style.height = `${h}px`;
    // quita la clase al terminar transición (si existe)
    const off = () => viewport.classList.remove("animating-height");
    viewport.addEventListener("transitionend", off, { once: true });
  };

  const closeHiddenDetails = () => {
    slides.forEach((slide, i) => {
      if (i !== activeIndex) {
        slide
          .querySelectorAll("details[open]")
          .forEach((d) => d.removeAttribute("open"));
      }
    });
  };

  const setActiveBtn = (idx) => {
    keys.forEach((k, i) => {
      const b = buttons[k];
      if (!b) return;
      const on = i === idx;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  };

  const goTo = (idx) => {
    activeIndex = Math.max(0, Math.min(idx, slides.length - 1));
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    setViewportHeight();
    closeHiddenDetails();
    setActiveBtn(activeIndex);
    // Actualiza hash con la clave real si existe
    const key = keys[activeIndex];
    if (key) history.replaceState(null, "", `#${key}`);
  };

  // 5) Eventos
  Object.entries(buttons).forEach(([key, btn]) => {
    btn.addEventListener("click", () => {
      const idx = keys.indexOf(key);
      if (idx !== -1) goTo(idx);
    });
  });

  // Ajusta altura en: resize y al abrir/cerrar <details> de la slide activa
  const resizeObs = new ResizeObserver(() => setViewportHeight());
  slides.forEach((s) => resizeObs.observe(s));
  window.addEventListener("resize", setViewportHeight);

  track.addEventListener(
    "toggle",
    (e) => {
      // Captura aperturas/cierres de <details> dentro del track
      if (e.target.closest(".faq-slide") === slides[activeIndex]) {
        // espera al relayout
        requestAnimationFrame(setViewportHeight);
      }
    },
    true
  );

  // 6) Estado inicial: hash → índice, si no existe usa 0
  const initialKey = (location.hash || "").slice(1);
  const initialIndex = Math.max(0, keys.indexOf(initialKey));
  // Fija altura inicial antes de dibujar
  viewport.style.height = `${slides[initialIndex].offsetHeight}px`;
  goTo(initialIndex);
});
