if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
}
// ===== Scroll Stack: señal global de actividad =====
{
  const container =
    document.querySelector(".InicioServicios__CardsServicios") ||
    document.querySelector("[data-scroll-stack]");

  if (container && window.ScrollTrigger) {
    // Evita crear observadores duplicados
    if (!container.__stackST) {
      container.__stackST = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onEnter() {
          document.documentElement.classList.add("in-scroll-stack");
          window.dispatchEvent(
            new CustomEvent("stack:toggle", { detail: { active: true } })
          );
        },
        onLeave() {
          document.documentElement.classList.remove("in-scroll-stack");
          window.dispatchEvent(
            new CustomEvent("stack:toggle", { detail: { active: false } })
          );
        },
        onEnterBack() {
          this.vars.onEnter();
        },
        onLeaveBack() {
          this.vars.onLeave();
        },
        // markers: true,
      });
    }
  }
}
// Scroll Stack vanilla para .InicioServicios__CardsServicios
{
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(
      ".InicioServicios__CardsServicios"
    );
    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll(".InicioServicios__CardsServicios--Item")
    );
    if (!cards.length) return;

    // Config (nombres parecidos a tu base React)
    const cfg = {
      itemDistance: 0, // separación vertical cuando quedan apiladas (px)
      itemScale: 0.03, // reducción incremental por profundidad
      itemStackDistance: 30, // offset vertical entre tarjetas apiladas (px)
      stackPosition: "20vh", // posición donde se "pegan" (sticky)
      scaleEndPosition: "10vh", // posición donde termina de escalar
      baseScale: 0.85, // escala base de la tarjeta más al fondo
      rotationAmount: 0, // grados de rotación incremental (0 = sin rotación)
      blurAmount: 0.1, // desenfoque por profundidad (0 = sin blur)
    };

    // Crea spacer final si no existe (para que suelte bien la última tarjeta)
    let end = container.querySelector(".scroll-stack-end");
    if (!end) {
      end = document.createElement("div");
      end.className = "scroll-stack-end";
      container.appendChild(end);
    }

    const px = (val, vh) => {
      if (typeof val === "number") return val;
      const s = String(val).trim();
      if (s.endsWith("vh")) return (parseFloat(s) / 100) * vh;
      if (s.endsWith("px")) return parseFloat(s);
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    let enabled = false;
    let ticking = false;

    function applyBaseStyles() {
      container.classList.add("scroll-stack");
      const vh = window.innerHeight;

      // Ajustes por tarjeta
      cards.forEach((card, i) => {
        // Cada tarjeta se "pega" un poco más abajo para crear el stack
        card.style.top = `calc(${cfg.stackPosition} + ${
          i * cfg.itemStackDistance
        }px)`;
        // separación entre tarjetas cuando están apiladas
        card.style.marginBottom = `${cfg.itemDistance}px`;
        card.style.transformOrigin = "top center";
        card.style.willChange = "transform, filter";
        card.style.backfaceVisibility = "hidden";
        card.style.zIndex = String(100 + i); // las de abajo quedan por detrás
      });

      // Altura del spacer: asegura la liberación suave del último sticky
      end.style.height = `${Math.max(vh * 0.6, 400)}px`;
    }

    function clearStyles() {
      container.classList.remove("scroll-stack");
      cards.forEach((card) => {
        card.style.top = "";
        card.style.marginBottom = "";
        card.style.transform = "";
        card.style.filter = "";
        card.style.willChange = "";
        card.style.backfaceVisibility = "";
        card.style.zIndex = "";
      });
      end.style.height = "1px";
    }

    function update() {
      const vh = window.innerHeight;
      const stackTop = px(cfg.stackPosition, vh);
      const scaleEnd = px(cfg.scaleEndPosition, vh);

      // Índice de la tarjeta actualmente "más arriba" en el stack (pegada)
      let topIndex = -1;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const targetTop = stackTop + i * cfg.itemStackDistance;
        if (rect.top <= targetTop + 1) topIndex = i;
      });

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const targetTop = stackTop + i * cfg.itemStackDistance;
        // Progreso de escalado entre cuando toca el "top" y el "scaleEnd"
        const p = clamp((targetTop - rect.top) / (targetTop - scaleEnd), 0, 1);
        const targetScale = cfg.baseScale + i * cfg.itemScale;
        const scale = 1 - p * (1 - targetScale);
        const rotate = cfg.rotationAmount ? i * cfg.rotationAmount * p : 0;

        // Blur por profundidad (opcional)
        let blur = 0;
        if (cfg.blurAmount && topIndex > -1 && i < topIndex) {
          const depth = topIndex - i;
          blur = depth * cfg.blurAmount;
        }

        card.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
        card.style.filter = blur ? `blur(${blur}px)` : "";
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    function enable() {
      if (enabled) return;
      applyBaseStyles();
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      enabled = true;
    }

    function disable() {
      if (!enabled) return;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearStyles();
      enabled = false;
    }

    function shouldEnable() {
      return (
        window.matchMedia("(min-width: 1025px)").matches &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches
      );
    }

    function onResize() {
      // Recalcula posiciones y alturas al cambiar viewport
      if (!enabled) return;
      applyBaseStyles();
      update();
    }

    // Activación condicional por tamaño de pantalla / accesibilidad
    shouldEnable() ? enable() : disable();

    // Escucha cambios de media queries
    window.matchMedia("(min-width: 1025px)").addEventListener("change", () => {
      shouldEnable() ? enable() : disable();
    });
    window
      .matchMedia("(prefers-reduced-motion: no-preference)")
      .addEventListener("change", () => {
        shouldEnable() ? enable() : disable();
      });
  });
}
// ===== LogoLoop (Clientes) - Vanilla JS =====
{
  document.addEventListener("DOMContentLoaded", () => {
    const defaults = {
      speed: 70, // px/s
      direction: "left", // 'left' | 'right'
      gap: 40, // px (CSS var)
      logoHeight: 64, // px (CSS var)
      pauseOnHover: true,
      scaleOnHover: true,
      fadeOut: true,
    };

    // Inicializa TODAS las barras de clientes dentro de .Clientes
    document.querySelectorAll(".Clientes .BarraClientes").forEach((list) => {
      initLogoLoop(list, defaults);
    });

    function initLogoLoop(list, cfg) {
      if (!list || list.dataset.logoloop === "on") return; // ya iniciada
      list.dataset.logoloop = "on";

      // 1) Envolver: wrapper + track
      const wrapper = document.createElement("div");
      wrapper.className = `BarraClientes logoloop${
        cfg.fadeOut ? " logoloop--fade" : ""
      }${cfg.scaleOnHover ? " logoloop--scale-hover" : ""}`;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Clientes de Planeta");

      const track = document.createElement("div");
      track.className = "logoloop__track";

      // Insertar wrapper y mover la lista original dentro del track
      list.parentElement.insertBefore(wrapper, list);
      wrapper.appendChild(track);

      // 2) Convertir la lista original en secuencia base
      const seq = list; // <ul>
      seq.classList.remove("BarraClientes"); // esa clase ahora la lleva el wrapper
      seq.classList.add("logoloop__list");
      seq.setAttribute("role", "list");
      seq.querySelectorAll("li").forEach((li) => {
        li.classList.add("logoloop__item");
        li.setAttribute("role", "listitem");
      });
      track.appendChild(seq);

      // 3) Variables CSS (gap y alto) — ahora responsivas
      function applyResponsiveVars() {
        const w = wrapper.clientWidth || window.innerWidth;

        if (w <= 600) {
          wrapper.style.setProperty("--logoloop-logoHeight", "40px");
          wrapper.style.setProperty("--logoloop-gap", "12px");
          wrapper.classList.add("logoloop--compact");
        } else if (w <= 820) {
          wrapper.style.setProperty("--logoloop-logoHeight", "52px");
          wrapper.style.setProperty("--logoloop-gap", "20px");
          wrapper.classList.remove("logoloop--compact");
        } else {
          wrapper.style.setProperty(
            "--logoloop-logoHeight",
            `${cfg.logoHeight}px`
          );
          wrapper.style.setProperty("--logoloop-gap", `${cfg.gap}px`);
          wrapper.classList.remove("logoloop--compact");
        }
      }
      applyResponsiveVars();
      window.addEventListener("resize", applyResponsiveVars, { passive: true });

      // 4) Esperar imágenes (si hay) para medir ancho real
      // Fuerza a cargar ya los logos si quedaron con loading="lazy"
      seq.querySelectorAll("img").forEach((img) => {
        if (img.loading === "lazy") {
          img.loading = "eager";
          // “Nudge” para que algunos navegadores inicien la carga ya
          img.src = img.src;
        }
        if (typeof img.decode === "function") {
          img.decode().catch(() => {}); // no bloquea si falla
        }
      });

      function whenImagesReady(root, cb) {
        const imgs = root.querySelectorAll("img");
        if (!imgs.length) {
          cb();
          return;
        }

        let remain = imgs.length;
        const done = () => {
          if (--remain === 0) {
            clearTimeout(fallback);
            cb();
          }
        };

        // Fallback por si el navegador difiere 'load' demasiado (lazy fuera de viewport)
        const fallback = setTimeout(cb, 1200);

        imgs.forEach((img) => {
          if (img.complete) done();
          else {
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
          }
        });
      }

      // 5) Clonado para cubrir ancho del contenedor de forma infinita
      let seqWidth = 0;
      let copies = [];
      const HEADROOM = 2; // copias extra para que nunca se corte

      function buildCopies() {
        // limpiar copias previas
        copies.forEach((c) => c.remove());
        copies = [];

        const containerW = wrapper.clientWidth;
        seqWidth = Math.ceil(seq.getBoundingClientRect().width) || 0;
        if (seqWidth === 0) return;

        const needed = Math.max(2, Math.ceil(containerW / seqWidth) + HEADROOM);
        for (let i = 1; i < needed; i++) {
          const clone = seq.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          track.appendChild(clone);
          copies.push(clone);
        }
      }

      // 6) Animación (rAF) con suavizado y pausa al hover
      let rafId = null;
      let lastT = null;
      let offset = 0;
      let v = 0; // velocidad suavizada
      const sign = cfg.direction === "left" ? 1 : -1;
      const TAU = 0.25; // constante de suavizado (s)

      let hovered = false;
      if (cfg.pauseOnHover) {
        wrapper.addEventListener("mouseenter", () => (hovered = true));
        wrapper.addEventListener("mouseleave", () => (hovered = false));
      }

      function loop(t) {
        if (lastT == null) lastT = t;
        const dt = Math.max(0, (t - lastT) / 1000);
        lastT = t;

        const target = cfg.pauseOnHover && hovered ? 0 : cfg.speed * sign;
        // easing exponencial hacia 'target'
        const k = 1 - Math.exp(-dt / TAU);
        v += (target - v) * k;

        if (seqWidth > 0) {
          // mantener offset en [0, seqWidth)
          offset = (((offset + v * dt) % seqWidth) + seqWidth) % seqWidth;
          track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }

        rafId = requestAnimationFrame(loop);
      }

      function start() {
        cancel();
        lastT = null;
        rafId = requestAnimationFrame(loop);
      }
      function cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }

      // 7) Resize / reduce motion / visibilidad de pestaña
      const ro = new ResizeObserver(() => {
        applyResponsiveVars(); // <--- añadir
        buildCopies();
        if (seqWidth > 0) {
          offset = ((offset % seqWidth) + seqWidth) % seqWidth;
          track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
      });

      ro.observe(wrapper);
      ro.observe(seq);

      const prefersReduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      function handleMotionPref() {
        if (prefersReduce.matches) {
          cancel();
          track.style.transform = "translate3d(0,0,0)";
        } else {
          start();
        }
      }
      prefersReduce.addEventListener("change", handleMotionPref);

      function handleVisibility() {
        if (document.visibilityState === "hidden") {
          cancel();
        } else {
          handleMotionPref();
        }
      }
      document.addEventListener("visibilitychange", handleVisibility);

      // 8) Inicializar tras carga de imágenes
      whenImagesReady(seq, () => {
        buildCopies();
        handleMotionPref();
      });

      // 9) Limpieza (SPA / cambio de página)
      window.addEventListener("pagehide", () => {
        cancel();
        ro.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
        prefersReduce.removeEventListener("change", handleMotionPref);
      });
    }
  });
}
// ===== RotatingText (vanilla GSAP) - Pill con transición de tamaño =====
{
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.gsap) return;

    const target = document.querySelector(".H1Inicio #rotating-text");
    if (!target) return;

    // --- Config ---
    const cfg = {
      texts: [
        "Servicios de saneamiento",
        "Tratamiento de aguas ",
        "Deshidratación de lodos",
        "Lavado de tanques",
        "Gestión ambiental",
      ],
      rotationInterval: 2500,
      duration: 0.6,
      ease: "power3.out",
      staggerEach: 0.025,
      staggerFrom: "end",
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "-120%", opacity: 0 },
    };

    target.classList.add("text-rotate");
    let i = 0;
    let letterSpans = [];

    // ===== NUEVO: control responsive (desactivar <1024px) =====
    let timerId = null;
    let active = null; // estado desconocido al iniciar
    const mq = window.matchMedia("(max-width: 1024px)");

    function enableEffect() {
      if (active === true) return;
      active = true;
      target.style.whiteSpace = "nowrap"; // una sola línea en desktop
      target.innerHTML = "";
      build(cfg.texts[i]);
      timerId = setInterval(rotate, cfg.rotationInterval);
    }

    function disableEffect() {
      if (active === false) return;
      active = false;
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      unlockSize(); // por si estaba bloqueado
      target.style.whiteSpace = "normal"; // permitir multilínea en móvil/tablet
      target.innerHTML = "";
      target.textContent = cfg.texts[i]; // deja la frase actual estática
    }

    function applyResponsive() {
      if (mq.matches) disableEffect();
      else enableEffect();
    }

    if (mq.addEventListener) mq.addEventListener("change", applyResponsive);
    else mq.addListener(applyResponsive);
    // ===== FIN NUEVO =====

    // Segmentación segura por grafemas (acentos/emojis)
    const splitGraphemes = (t) => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const seg = new Intl.Segmenter("es", { granularity: "grapheme" });
        return Array.from(seg.segment(t), (s) => s.segment);
      }
      return Array.from(t);
    };

    // Construye letras dentro de un contenedor dado
    function buildInto(container, text) {
      container.innerHTML = "";
      const chars = splitGraphemes(text);
      const locals = [];

      chars.forEach((ch) => {
        if (ch === " ") {
          const space = document.createElement("span");
          space.className = "text-rotate-space";
          space.textContent = "\u00A0";
          container.appendChild(space);
          return;
        }
        const split = document.createElement("span");
        split.className = "rt-split";
        const el = document.createElement("span");
        el.className = "text-rotate-element";
        el.textContent = ch;
        split.appendChild(el);
        container.appendChild(split);
        locals.push(el);
      });

      return locals; // devuelve referencias a letras
    }

    // Medir tamaño "natural" de un texto sin afectar el layout (clon oculto)
    function measureNextSize(text) {
      const clone = target.cloneNode(false); // solo el nodo, sin hijos
      clone.removeAttribute("id"); // no duplicar ID
      clone.style.position = "fixed";
      clone.style.left = "-99999px";
      clone.style.top = "0";
      clone.style.visibility = "hidden";
      clone.style.width = "auto";
      clone.style.height = "auto";
      clone.style.whiteSpace = "normal";
      clone.style.display = "inline-flex";
      clone.style.boxSizing = "border-box";

      // Copiamos estilos tipográficos/padding críticos para medir igual
      const cs = getComputedStyle(target);
      clone.style.font = cs.font; // copia font-size/family/weight/line-height
      clone.style.letterSpacing = cs.letterSpacing;
      clone.style.wordSpacing = cs.wordSpacing;
      clone.style.textTransform = cs.textTransform;
      clone.style.padding = cs.padding;
      clone.style.borderRadius = cs.borderRadius;

      document.body.appendChild(clone);
      buildInto(clone, text);
      const rect = clone.getBoundingClientRect();
      document.body.removeChild(clone);
      return { width: rect.width, height: rect.height };
    }

    // Bloquear tamaño actual (evita el "clip" entre frames)
    function lockSize(rect) {
      target.style.width = rect.width + "px";
      target.style.height = rect.height + "px";
      target.style.willChange = "width, height";
      // fuerza reflow para asegurar el lock antes de cambiar contenido
      // eslint-disable-next-line no-unused-expressions
      target.offsetWidth;
    }

    // Liberar lock
    function unlockSize() {
      target.style.width = "";
      target.style.height = "";
      target.style.willChange = "";
    }

    function build(text) {
      letterSpans = buildInto(target, text);
      gsap.fromTo(letterSpans, cfg.initial, {
        ...cfg.animate,
        duration: cfg.duration,
        ease: cfg.ease,
        stagger: { each: cfg.staggerEach, from: cfg.staggerFrom },
      });
    }

    function rotate() {
      if (active !== true) return; // seguridad si se desactiva durante el ciclo

      const curr = letterSpans;
      const before = target.getBoundingClientRect();
      const nextIndex = (i + 1) % cfg.texts.length;
      const nextText = cfg.texts[nextIndex];

      // 1) Lock al tamaño actual ANTES de tocar el DOM
      lockSize(before);

      // 2) Medimos el tamaño "natural" del siguiente texto en un clon oculto
      const after = measureNextSize(nextText);

      // 3) Animamos salida de letras actuales
      gsap.to(curr, {
        ...cfg.exit,
        duration: cfg.duration,
        ease: cfg.ease,
        stagger: { each: cfg.staggerEach, from: cfg.staggerFrom },
        onComplete: () => {
          // 4) Swap de contenido (el contenedor sigue bloqueado en 'before')
          i = nextIndex;
          buildInto(target, nextText);
          // Las nuevas letras entrarán con fromTo más abajo

          // 5) Tween suave del fondo al nuevo tamaño (sin "clip")
          gsap.to(target, {
            width: after.width,
            height: after.height,
            duration: cfg.duration,
            ease: cfg.ease,
            onComplete: unlockSize,
          });

          // 6) Entrada de letras nuevas
          gsap.fromTo(
            target.querySelectorAll(".text-rotate-element"),
            cfg.initial,
            {
              ...cfg.animate,
              duration: cfg.duration,
              ease: cfg.ease,
              stagger: { each: cfg.staggerEach, from: cfg.staggerFrom },
            }
          );
        },
      });
    }

    // Init + loop (con control responsive)
    applyResponsive();
  });
}
// ===== Logros: viewport + track interno=====
{
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    const viewport = document.querySelector(".Logros");
    if (!viewport) return;

    // 1) Asegurar un track interno que contenga los <ul>
    let track = viewport.querySelector(".Logros__Track");
    if (!track) {
      track = document.createElement("div");
      track.className = "Logros__Track";
      const children = Array.from(viewport.children);
      children.forEach((el) => {
        if (el.tagName === "UL") track.appendChild(el);
      });
      viewport.appendChild(track);
    }

    const panels = Array.from(track.children).filter(
      (el) => el.tagName === "UL"
    );
    if (!panels.length) return;

    const mqDesktop = window.matchMedia("(min-width:1025px)");
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let st = null;

    // --- helpers ---
    function fixAncestorOverflow() {
      // Evita recortes por overflow:hidden en wrappers cercanos (hasta 3 niveles)
      let p = viewport.parentElement;
      for (let i = 0; i < 3 && p; i++) {
        const cs = getComputedStyle(p);
        if (cs.overflowX === "hidden") p.style.overflowX = "visible";
        if (cs.overflow === "hidden") p.style.overflow = "visible";
        p = p.parentElement;
      }
    }

    function edge() {
      const cs = getComputedStyle(viewport);
      return {
        left: parseFloat(cs.paddingLeft) || 0,
        right: parseFloat(cs.paddingRight) || 0,
      };
    }

    function gapValue() {
      const v = getComputedStyle(viewport).getPropertyValue("--gap");
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 64;
    }

    function measure() {
      // altura del viewport mientras está pinneado
      const maxH = panels.reduce((m, el) => Math.max(m, el.offsetHeight), 0);
      viewport.style.minHeight = maxH + 48 + "px";
    }

    // Desplazamiento total: hasta que el borde derecho del último + gap final quede visible
    function computeEndX() {
      const { right: gutterR } = edge();
      const viewportW = window.innerWidth;
      const trail = gapValue();

      const last = panels[panels.length - 1];
      const lastRight = last.offsetLeft + last.offsetWidth + trail;
      const needed = lastRight - (viewportW - gutterR);
      return Math.max(0, Math.round(needed));
    }

    // Snaps: izquierda de cada panel + derecha (si el panel es más ancho que el viewport)
    function makeSnaps(totalX) {
      const { left: gutterL, right: gutterR } = edge();
      const viewportW = window.innerWidth;
      const trail = gapValue();

      const snapsPx = [];
      panels.forEach((el, i) => {
        const left = el.offsetLeft;

        // Snap al borde IZQUIERDO (alineado con gutter izquierdo)
        const leftTarget = Math.min(totalX, Math.max(0, left - gutterL));
        snapsPx.push(leftTarget);

        // Si el panel es más ancho que el viewport, snap también a su borde derecho
        const extra = i === panels.length - 1 ? trail : 0; // el último cuenta el gap final
        if (el.offsetWidth > viewportW - (gutterL + gutterR)) {
          const rightTarget = Math.min(
            totalX,
            Math.max(0, left + el.offsetWidth + extra - (viewportW - gutterR))
          );
          snapsPx.push(rightTarget);
        }
      });

      return totalX > 0 ? snapsPx.map((px) => px / totalX) : [0];
    }

    // --- modo desktop ---
    function enable() {
      if (viewport.dataset.hscroll === "on") return;
      viewport.dataset.hscroll = "on";

      fixAncestorOverflow();
      measure();

      let totalX = computeEndX();
      let snaps = makeSnaps(totalX);

      const tween = gsap.to(track, {
        x: () => -totalX, // mueve SOLO el track interno
        ease: "none",
      });

      viewport.__containerTween = tween;

      st = ScrollTrigger.create({
        trigger: viewport,
        pin: true,
        start: "center center", // comienza cuando .Logros llega a la mitad de pantalla
        end: () => "+=" + totalX,
        scrub: 0.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tween,
        snap: prefersReduce.matches
          ? false
          : {
              snapTo: (v) => gsap.utils.snap(snaps, v),
              duration: { min: 0.1, max: 0.35 },
              delay: 0,
            },
        onRefresh: () => {
          measure();
          totalX = computeEndX();
          snaps = makeSnaps(totalX);
        },
      });

      window.addEventListener("load", () => ScrollTrigger.refresh(), {
        once: true,
      });
    }

    function disable() {
      if (st) {
        st.kill();
        st = null;
      }
      gsap.set(track, { clearProps: "transform" });
      viewport.style.minHeight = "";
      delete viewport.dataset.hscroll;
    }

    function updateMode() {
      if (mqDesktop.matches && !prefersReduce.matches) {
        enable();
        ScrollTrigger.refresh();
      } else {
        disable();
      }
    }

    updateMode();
    mqDesktop.addEventListener("change", updateMode);
    prefersReduce.addEventListener("change", updateMode);
    window.addEventListener("resize", () => ScrollTrigger.refresh());
  });
}

{
  document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".NuestroProceso__Video");

    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // está visible en pantalla → reproducir
            video.play().catch(() => {
              // algunos navegadores bloquean play si no está muted, pero ya lo pusimos
              // este catch es solo para evitar errores en consola
            });
          } else {
            // salió de pantalla → pausar (opcional)
            video.pause();
          }
        });
      },
      {
        threshold: 0.4,
        // 0.4 = al menos 40% del video visible para que empiece
      }
    );

    observer.observe(video);
  });
}
