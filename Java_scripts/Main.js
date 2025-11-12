// ======= Animacion de textos =======
{
  // ======= CONFIG GLOBAL (se mantiene tal cual) =======
  const SPLIT_CFG = {
    splitType: "words",
    duration: 0.6,
    ease: "power3.out",
    delayMsDefault: 0, // stagger por defecto (entre palabras)
    threshold: 0.1,
    rootMargin: "0px",
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
    textAlign: "center", // NO se aplica desde JS
    once: true,
  };
  // ===========================================

  (function () {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // "400ms" | "0.12s" | "120" (ms) -> segundos
    const toSeconds = (v, fallback = SPLIT_CFG.delayMsDefault / 1000) => {
      if (v == null) return fallback;
      const s = String(v).trim().toLowerCase();
      if (!s) return fallback;
      if (s.endsWith("ms")) return parseFloat(s) / 1000;
      if (s.endsWith("s")) return parseFloat(s);
      const n = parseFloat(s);
      return Number.isFinite(n) ? (n >= 10 ? n / 1000 : n) : fallback;
    };

    function waitForFonts() {
      if (!("fonts" in document)) return Promise.resolve();
      if (document.fonts.status === "loaded") return Promise.resolve();
      return document.fonts.ready.catch(() => {});
    }

    function buildStart(threshold, rootMargin) {
      const startPct = (1 - threshold) * 100;
      const m = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || "");
      const val = m ? parseFloat(m[1]) : 0;
      const unit = m ? m[2] || "px" : "px";
      const sign =
        val === 0
          ? ""
          : val < 0
          ? `-=${Math.abs(val)}${unit}`
          : `+=${val}${unit}`;
      return `top ${startPct}%${sign}`;
    }

    // Clasifica tokens preservando espacios; une puntuación a la palabra anterior
    function segmentWordTokens(text) {
      const PUNCT_RE = /^[\.,…;:!\?]+$/; // incluye ., ,, …, ;, :, !, ?
      const out = [];

      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const seg = new Intl.Segmenter("es", { granularity: "word" });
        for (const s of seg.segment(text)) {
          const str = s.segment;
          if (/^\s+$/.test(str)) {
            out.push({ str, type: "space" });
            continue;
          }
          if (PUNCT_RE.test(str)) {
            out.push({ str, type: "punct" });
            continue;
          }
          // lo demás lo tratamos como "word" (emojis, símbolos, etc. también animan)
          out.push({ str, type: s.isWordLike === false ? "word" : "word" });
        }
        return out;
      }

      // Fallback sin Segmenter
      const raw = text.match(/\s+|[^\s]+/g) || [text];
      for (const tok of raw) {
        if (/^\s+$/.test(tok)) out.push({ str: tok, type: "space" });
        else if (PUNCT_RE.test(tok)) out.push({ str: tok, type: "punct" });
        else out.push({ str: tok, type: "word" });
      }
      return out;
    }

    // Envuelve SOLO nodos de texto. Conserva etiquetas internas (p.ej., <span> con color)
    function wrapTextNodesWithWords(rootEl) {
      const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          if (node.parentElement && node.parentElement.closest("rb-word"))
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const textNodes = [];
      for (let n; (n = walker.nextNode()); ) textNodes.push(n);

      const created = [];

      textNodes.forEach((node) => {
        const tokens = segmentWordTokens(node.nodeValue);
        const frag = document.createDocumentFragment();

        for (let i = 0; i < tokens.length; i++) {
          const t = tokens[i];

          if (t.type === "space") {
            frag.appendChild(document.createTextNode(t.str));
            continue;
          }

          if (t.type === "word") {
            // Combinar puntuación inmediata a la DERECHA (ej: "hola,")
            let val = t.str;
            let j = i + 1;
            while (j < tokens.length && tokens[j].type === "punct") {
              val += tokens[j].str;
              j++;
            }
            i = j - 1;

            const w = document.createElement("rb-word");
            w.textContent = val;
            frag.appendChild(w);
            created.push(w);
            continue;
          }

          // Puntuación suelta (sin palabra previa): conservar como texto
          // (si quisieras pegar paréntesis/«“ a la palabra SIGUIENTE, se puede extender aquí)
          frag.appendChild(document.createTextNode(t.str));
        }

        node.parentNode.replaceChild(frag, node);
      });

      return created;
    }

    function initSplitElement(el) {
      const originalText = el.textContent || "";

      // stagger entre palabras y delay inicial (desde HTML)
      const staggerDelay = toSeconds(el.getAttribute("delay"));
      const startDelay = toSeconds(
        el.getAttribute("start-delay") ?? el.getAttribute("delay-start"),
        0
      );

      el.setAttribute("aria-label", originalText.trim());

      const items = wrapTextNodesWithWords(el); // genera <rb-word> y preserva HTML interno
      gsap.set(items, SPLIT_CFG.from);

      const start = buildStart(SPLIT_CFG.threshold, SPLIT_CFG.rootMargin);
      ScrollTrigger.create({
        trigger: el,
        start,
        once: SPLIT_CFG.once,
        onEnter: () => {
          gsap.to(items, {
            ...SPLIT_CFG.to,
            duration: SPLIT_CFG.duration,
            ease: SPLIT_CFG.ease,
            delay: startDelay, // retardo global antes de iniciar
            stagger: staggerDelay, // separación entre palabras
          });
        },
      });
    }

    async function initAll() {
      await waitForFonts();
      document.querySelectorAll("split-text").forEach(initSplitElement);
    }

    document.addEventListener("DOMContentLoaded", initAll);
  })();
}
// FAQ animada por JS: apertura/cierre suave y sin doble-toggle
{
  document.addEventListener("DOMContentLoaded", () => {
    const DUR = 320; // debe coincidir con --faq-dur
    const EASE = "cubic-bezier(.22,.61,.36,1)";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items = Array.from(
      document.querySelectorAll(".PreguntasFrecuentes__Item details")
    ).filter((d) => {
      const s = d.querySelector(":scope > summary");
      const w = s && s.nextElementSibling;
      return w && w.classList.contains("faq-wrap");
    });

    items.forEach((details) => {
      const summary = details.querySelector(":scope > summary");
      const wrap = summary.nextElementSibling; // .faq-wrap
      let animating = false;

      // Estado inicial
      wrap.style.overflow = "hidden";
      wrap.style.transition = `height ${DUR}ms ${EASE}`;
      wrap.style.height = details.hasAttribute("open")
        ? wrap.scrollHeight + "px"
        : "0px";

      // Si cambia el contenido estando abierto, ajustamos altura
      const ro = new ResizeObserver(() => {
        if (!details.hasAttribute("open") || animating) return;
        wrap.style.height = "auto";
        const h = wrap.scrollHeight;
        wrap.style.height = h + "px";
      });
      ro.observe(wrap);

      function openDetails() {
        if (animating) return;
        animating = true;
        details.classList.remove("is-closing");
        details.classList.add("is-opening");

        // Fijar punto de partida
        wrap.style.transition = "none";
        wrap.style.height = wrap.offsetHeight + "px";

        // Activar estilos abiertos
        details.setAttribute("open", "");

        // Medir destino
        const end = wrap.scrollHeight;

        requestAnimationFrame(() => {
          wrap.style.transition = `height ${DUR}ms ${EASE}`;
          wrap.style.height = end + "px";
        });

        wrap.addEventListener(
          "transitionend",
          function te(e) {
            if (e.propertyName !== "height") return;
            wrap.removeEventListener("transitionend", te);
            wrap.style.height = "auto"; // libera
            details.classList.remove("is-opening");
            animating = false;
          },
          { once: true }
        );
      }

      function closeDetails() {
        if (animating) return;
        animating = true;
        details.classList.remove("is-opening");
        details.classList.add("is-closing");

        // Partimos desde la altura real
        wrap.style.transition = "none";
        wrap.style.height = wrap.scrollHeight + "px";
        wrap.getBoundingClientRect(); // reflow

        requestAnimationFrame(() => {
          wrap.style.transition = `height ${DUR}ms ${EASE}`;
          wrap.style.height = "0px";
        });

        wrap.addEventListener(
          "transitionend",
          function tc(e) {
            if (e.propertyName !== "height") return;
            wrap.removeEventListener("transitionend", tc);
            details.removeAttribute("open"); // quitamos [open] al final del cierre
            details.classList.remove("is-closing");
            animating = false;
          },
          { once: true }
        );
      }

      function handleToggle(ev) {
        // Evitamos el toggle nativo para poder animar el cierre
        ev.preventDefault();

        if (reduce) {
          // Modo sin animación
          if (details.hasAttribute("open")) {
            wrap.style.height = "0px";
            details.removeAttribute("open");
          } else {
            details.setAttribute("open", "");
            wrap.style.height = "auto";
          }
          return;
        }

        if (details.hasAttribute("open")) closeDetails();
        else openDetails();
      }

      // Un SOLO listener en summary evita el doble toggle (click en botón burbujea)
      summary.addEventListener("click", handleToggle);
      // Accesible por teclado
      summary.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") handleToggle(e);
      });
    });
  });
}
// Header
{
  (function () {
    const header = document.querySelector(".Header");
    if (!header) return;
    const onScroll = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();
}
// --- Desplazamientos ---
{
  // --- Desplazamientos ---
  {
    const FIGMA_GENTLE = {
      delay: 0.001, // 1 ms por defecto
      ease: "power2.out",
      duration: 0.4, // 400 ms
      threshold: 0.1,
      initialOpacity: 0,
      scale: 1,
    };

    // "120ms" -> 0.12, "0.12s" -> 0.12, "0.12" -> 0.12, "120" -> 0.12
    function parseTimeToSeconds(v, fallback = FIGMA_GENTLE.delay) {
      if (v == null) return fallback;
      const s = String(v).trim().toLowerCase();
      if (!s) return fallback;
      if (s.endsWith("ms")) return parseFloat(s) / 1000;
      if (s.endsWith("s")) return parseFloat(s);
      const n = parseFloat(s);
      return Number.isFinite(n) ? (n >= 10 ? n / 1000 : n) : fallback;
    }

    function parsePx(v, fallback = 24) {
      if (v == null) return fallback;
      const s = String(v).trim().toLowerCase();
      const n = parseFloat(s.endsWith("px") ? s.slice(0, -2) : s);
      return Number.isFinite(n) ? n : fallback;
    }

    function normalizeFrom(val) {
      const s = String(val || "up")
        .toLowerCase()
        .trim();
      const map = {
        up: "up",
        top: "up",
        arriba: "up",
        down: "down",
        bottom: "down",
        abajo: "down",
        left: "left",
        izquierda: "left",
        right: "right",
        derecha: "right",
      };
      return map[s] || "up";
    }

    function initAnimatedContent(selector = "[data-anim]") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const isMobile = window.matchMedia("(max-width: 600px)").matches;

      document.querySelectorAll(selector).forEach((el) => {
        const from = normalizeFrom(el.dataset.animFrom);
        const distance = parsePx(el.dataset.animDistance, 24);
        const delaySec = parseTimeToSeconds(el.dataset.animDelay);

        const { ease, duration, threshold: thBase, scale } = FIGMA_GENTLE;

        // --- Estado inicial del elemento ---
        const dirMap = {
          up: { axis: "y", sign: -1 },
          down: { axis: "y", sign: +1 },
          left: { axis: "x", sign: -1 },
          right: { axis: "x", sign: +1 },
        };
        const conf = dirMap[from];

        gsap.set(el, {
          [conf.axis]: conf.sign * Math.abs(distance),
          scale,
          opacity: 0,
          willChange: "transform, opacity",
          force3D: true,
        });

        // --- Contenedor horizontal (tu .Logros) ---
        const logros = el.closest(".Logros");
        const containerTween =
          logros && logros.__containerTween ? logros.__containerTween : null;

        // --- Trigger por "padre" si existe ---
        const parentGroup = el.closest("[data-anim-parent]");

        // Función que ejecuta la animación del elemento (respeta tu gate/stack)
        const run = () => {
          gsap.delayedCall(delaySec, () => {
            gsap.to(el, {
              [conf.axis]: 0,
              scale: 1,
              opacity: 1,
              ease,
              duration,
              overwrite: "auto",
            });
          });
        };
        const gatedRun = () => {
          const inStack =
            document.documentElement.classList.contains("in-scroll-stack");
          const isInsideStack =
            !!el.closest(".InicioServicios__CardsServicios") ||
            !!el.closest(".ServiciosyCards .CardContacto") ||
            !!el.closest(".HaciaQuienesSomos");
          if (inStack && !isInsideStack) {
            const once = (e) => {
              if (!e.detail?.active) {
                window.removeEventListener("stack:toggle", once);
                run();
              }
            };
            window.addEventListener("stack:toggle", once);
          } else {
            run();
          }
        };

        // ======== MÓVIL: 30% del PADRE visible por defecto ========
        if (isMobile && parentGroup) {
          // Escucha un evento interno que el padre emitirá cuando alcance el 30%
          el.addEventListener("anim:go", function onGo() {
            el.removeEventListener("anim:go", onGo);
            gatedRun();
          });

          // Instalar un único observer por padre (flag en dataset)
          if (!parentGroup.__ioInstalled) {
            parentGroup.__ioInstalled = true;

            // Permite override opcional via data-anim-parent-threshold, pero default = 0.3
            let ratio = parseFloat(
              parentGroup.getAttribute("data-anim-parent-threshold")
            );
            if (Number.isNaN(ratio)) ratio = 0.3;
            ratio = Math.min(0.5, Math.max(0.1, ratio)); // clamp [0.1, 0.5]

            const io = new IntersectionObserver(
              (entries, obs) => {
                const e = entries[0];
                if (e.isIntersecting && e.intersectionRatio >= ratio) {
                  // Dispara a todos los hijos con data-anim dentro del padre
                  parentGroup
                    .querySelectorAll("[data-anim]")
                    .forEach((child) => {
                      child.dispatchEvent(new CustomEvent("anim:go"));
                    });
                  obs.disconnect(); // solo una vez
                }
              },
              { threshold: buildThresholds(ratio) }
            );

            io.observe(parentGroup);
          }

          // En móvil con padre, NO creamos ScrollTrigger por elemento
          return;
        }

        // ======== DESKTOP (o sin padre en móvil): ScrollTrigger normal ========
        const triggerEl = parentGroup || el;
        const axisStart = containerTween ? "left" : "top";
        const startPct = (1 - thBase) * 100; // p.ej., 70%
        const start = `${axisStart} ${startPct}%`;

        ScrollTrigger.create({
          trigger: triggerEl,
          start,
          once: true,
          invalidateOnRefresh: true,
          containerAnimation: containerTween || undefined,
          onEnter: gatedRun,
          // markers: true,
        });
      });
    }

    /* Utilidad: genera thresholds densos para que IO pueda detectar ~0.3 con precisión */
    function buildThresholds(target = 0.3) {
      const steps = 20;
      const list = [];
      for (let i = 1; i <= steps; i++) list.push(i / steps);
      if (!list.includes(target)) list.push(target);
      return list.sort((a, b) => a - b);
    }

    // Importante: espera a que .Logros haya creado su tween
    window.addEventListener("load", () => {
      initAnimatedContent();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }
}
