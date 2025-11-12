// -------------------- Rutas de los parciales --------------------
const HEADER_URL = "/Partials/header.html"; // Ajusta si tu ruta real es distinta
const FOOTER_URL = "/Partials/footer.html";

// ------------------------ Utilidades base ------------------------
async function inject(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    host.innerHTML = await res.text();
  } catch (err) {
    console.error("No se pudo cargar", url, err);
    host.innerHTML = "<!-- Error cargando " + url + " -->";
  }
}

// Marca como activo el enlace que coincide con la URL actual
function markActiveLink() {
  const current = normalizePath(location.pathname);
  document.querySelectorAll(".Header__Navegacion a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const abs = new URL(href, location.origin).pathname;
    if (normalizePath(abs) === current) {
      a.classList.add("is-current");
      a.closest("li")?.classList.add("is-current");
    }
  });

  function normalizePath(p) {
    if (!p) return "/";
    let out = p.endsWith("/") ? p.slice(0, -1) : p;
    if (out === "") out = "/";
    if (out.endsWith("/index.html")) out = out.replace("/index.html", "");
    return out;
  }
}

// Clase "is-scrolled" cuando hay desplazamiento
function initHeaderScroll() {
  const header = document.querySelector(".Header");
  if (!header || header.dataset.scrollInit === "1") return;
  header.dataset.scrollInit = "1";
  const onScroll = () =>
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// -------------------- Variantes & swap de logo --------------------
let __currentVariant = null; // cache para evitar DOM work innecesario

// Aplica variante y hace swap de logo con fade
function applyHeaderVariant(forcedVariant) {
  const host = document.querySelector("#header");
  const headerEl = host?.querySelector(".Header");
  if (!host || !headerEl) return;

  const variant =
    forcedVariant ||
    (host.dataset.headerVariant === "on-light" ? "on-light" : "on-dark");

  if (variant === __currentVariant) return; // nada que cambiar

  headerEl.classList.toggle("Header--on-light", variant === "on-light");
  headerEl.classList.toggle("Header--on-dark", variant !== "on-light");
  __currentVariant = variant;

  const logo = headerEl.querySelector(".Header__Img");
  if (logo) {
    const srcLight = host.dataset.logoOnLight || logo.dataset.logoOnLight;
    const srcDark = host.dataset.logoOnDark || logo.dataset.logoOnDark;
    const nextSrc = variant === "on-light" ? srcLight : srcDark;
    if (nextSrc) fadeSwapLogo(logo, nextSrc);
  }
}

// Fade suave al cambiar el src del logo
function fadeSwapLogo(imgEl, nextSrc) {
  // Evita swaps redundantes
  if (imgEl.dataset.activeSrc === nextSrc) return;
  imgEl.dataset.activeSrc = nextSrc;

  // Fade-out
  imgEl.style.opacity = "0";
  const temp = new Image();
  temp.onload = () => {
    // Cambia el src cuando la siguiente imagen ya está lista
    imgEl.src = nextSrc;
    // En el siguiente frame, hace fade-in
    requestAnimationFrame(() => {
      imgEl.style.opacity = "1";
    });
  };
  temp.src = nextSrc;
}

// ------------------ Modo B: cambio inmediato por sección ------------------
// Cambia la variante tan pronto el borde inferior del header está sobre una sección marcada.
// Usa un "probe" a la altura del borde inferior del header para decidir la sección activa.
// Ventaja: respuesta inmediata y estable; sin umbrales del IO difíciles de ajustar.

function initHeaderVariantProbe() {
  const host = document.querySelector("#header");
  const headerEl = host?.querySelector(".Header");
  if (!headerEl) return;

  // Secciones marcadas para el Modo B
  let sections = getVariantSections();

  // Recalcula secciones en resize (por si el layout cambia)
  window.addEventListener("resize", () => {
    sections = getVariantSections();
    requestAnimationFrame(updateVariantByProbe);
  });

  // Scroll con rAF para no saturar
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateVariantByProbe();
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Estado inicial
  updateVariantByProbe();

  // Helpers
  function getVariantSections() {
    return Array.from(
      document.querySelectorAll(
        "main [data-header-variant], section[data-header-variant]"
      )
    ).filter((el) => !el.closest("#header"));
  }

  function updateVariantByProbe() {
    const headerRect = headerEl.getBoundingClientRect();
    // Línea de sondeo justo por debajo del header (1px)
    const probeY = Math.min(headerRect.bottom + 1, window.innerHeight - 1);

    // Busca la sección que cubre ese Y
    let target = null;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= probeY && r.bottom >= probeY) {
        target = sec;
        break;
      }
    }

    // Fallback: si no cubre ninguna (p.ej. arriba del todo), usa la primera visible
    if (!target) {
      target = sections.find((sec) => {
        const r = sec.getBoundingClientRect();
        return r.bottom > 0; // algo de visibilidad
      });
    }

    const variant =
      target?.dataset.headerVariant === "on-light" ? "on-light" : "on-dark";
    applyHeaderVariant(variant);
  }
}

/* ---------------------- Secuencia de arranque ---------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Inyecta header
  await inject("#header", HEADER_URL);

  // 2) Variante inicial + Modo B inmediato y suave
  applyHeaderVariant(); // fallback si no hay secciones marcadas
  initHeaderVariantProbe(); // cambio inmediato al estar “encima” de cada sección

  // 3) Resto de inicializaciones del header
  markActiveLink();
  initHeaderScroll();

  // 4) Inyecta footer
  await inject("#footer", FOOTER_URL);
});
