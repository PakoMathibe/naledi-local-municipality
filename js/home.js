/* ==========================================================================
   home.js — Homepage-only enhancements
   --------------------------------------------------------------------------
   - Count-up animation (respects prefers-reduced-motion)
   - Alert bar rotation (pauses on hover/focus, respects reduced-motion,
     pauses when tab is hidden, memory-safe)
   - Idle cleanup — removes observers/timers if page unloads
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ------------------------------------------------------------------
       Count-up animation
       ------------------------------------------------------------------ */
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function animateCount(el) {
      const raw = el.getAttribute("data-count");
      const target = parseInt(raw, 10);
      if (!Number.isFinite(target)) return;

      const originalText = el.textContent.trim();
      const prefix = originalText.match(/^[^\d]*/)?.[0] || "";
      const suffix = originalText.match(/[^\d]*$/)?.[0] || "";

      if (reduceMotion) {
        el.textContent = prefix + target.toLocaleString("en-ZA") + suffix;
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(target * eased);
        el.textContent = prefix + current.toLocaleString("en-ZA") + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const counters = document.querySelectorAll("[data-count]");
    let io = null;

    if (counters.length) {
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        counters.forEach((el) => io.observe(el));
      } else {
        // Fallback for very old browsers
        counters.forEach((el) => {
          const target = parseInt(el.getAttribute("data-count"), 10);
          if (!Number.isFinite(target)) return;
          const originalText = el.textContent.trim();
          const prefix = originalText.match(/^[^\d]*/)?.[0] || "";
          const suffix = originalText.match(/[^\d]*$/)?.[0] || "";
          el.textContent = prefix + target.toLocaleString("en-ZA") + suffix;
        });
      }
    }

    /* ------------------------------------------------------------------
       Alert bar rotation
       ------------------------------------------------------------------ */
    const track = document.getElementById("alertTrack");
    if (!track) return;

    const items = track.querySelectorAll(".alert-item");
    if (items.length < 2) return;

    let current = 0;
    let timer = null;
    const ROTATE_MS = 6000;

    function show(index) {
      items.forEach((el, i) => el.classList.toggle("active", i === index));
      current = index;
    }
    function next() { show((current + 1) % items.length); }
    function prev() { show((current - 1 + items.length) % items.length); }

    function start() {
      stop();
      if (reduceMotion) return;
      if (document.hidden) return; // don't run in background tabs
      timer = setInterval(next, ROTATE_MS);
    }
    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Manual controls
    document.querySelectorAll("[data-alert]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.alert === "next") next();
        else prev();
        start();
      });
    });

    // Pause on hover / focus
    const bar = track.closest(".alert-bar");
    if (bar) {
      bar.addEventListener("mouseenter", stop);
      bar.addEventListener("mouseleave", start);
      bar.addEventListener("focusin", stop);
      bar.addEventListener("focusout", start);
    }

    // Pause when tab is hidden, resume when visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    // Cleanup on unload (memory safety)
    window.addEventListener("pagehide", () => {
      stop();
      if (io) io.disconnect();
    });

    start();
  });
})();