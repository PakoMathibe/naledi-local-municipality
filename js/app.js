/* ==========================================================================
   app.js — Shared interactivity layer for every page
   --------------------------------------------------------------------------
   Responsibilities:
     - Resolve data.js paths to work from root OR /pages/
     - Render mega navigation menus
     - Mobile navigation toggle
     - Site + modal search (search-as-you-type, keyboard nav)
     - Chat window (delegates answers to chatbot.js)
     - Demo contact form handler
     - Accessibility controls (font, contrast, motion)
     - Scroll-to-top
     - Persist accessibility preferences in localStorage

   Every DOM lookup is guarded — nothing throws on a page that lacks a
   specific element. The app degrades gracefully.

   Development logging:
     Set window.NALEDI_DEBUG = true before this script loads, or open the
     console and run `NALEDI_DEBUG = true` to see verbose logs.
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {

    /* ------------------------------------------------------------------
       Debug helper — silent unless window.NALEDI_DEBUG is truthy.
       ------------------------------------------------------------------ */
    const debug = (...args) => {
      if (window.NALEDI_DEBUG) console.log("[Naledi]", ...args);
    };

    /* ------------------------------------------------------------------
       Safe DOM helpers
       ------------------------------------------------------------------ */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const safeOn = (el, evt, fn) => { if (el && el.addEventListener) el.addEventListener(evt, fn); };
    const safeSet = (el, attr, val) => { if (el) el.setAttribute(attr, val); };
    const safeText = (el, text) => { if (el) el.textContent = text; };
    const safeHTML = (el, html) => { if (el) el.innerHTML = html; };

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      try { window.lucide.createIcons(); } catch (e) { console.warn("[Naledi] lucide.createIcons() failed:", e); }
    }

    /* ------------------------------------------------------------------
       Path resolution — works from root and from /pages/
       ------------------------------------------------------------------ */
    const inPages = /\/pages(\/|$)/.test(window.location.pathname);
    const root = inPages ? "../" : "./";

    function resolveHref(href) {
      if (!href || typeof href !== "string") return "";
      if (/^https?:/i.test(href)) return href;
      if (href.startsWith("#"))   return inPages ? root + "index.html" + href : href;
      if (href.startsWith("../")) return href;
      if (href.startsWith("pages/")) return inPages ? href.slice("pages/".length) : href;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return href;
      return inPages ? root + href : href;
    }

    const escapeHTML = (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[c]));

    /* ------------------------------------------------------------------
       Footer year
       ------------------------------------------------------------------ */
    safeText($("#year"), new Date().getFullYear());

    /* ------------------------------------------------------------------
       Mega navigation
       ------------------------------------------------------------------ */
    const mega = $("#megaMenu");
    const megaContent = $("#megaContent");
    const navButtons = $$("[data-menu]");

    function closeMega() {
      if (!mega) return;
      mega.hidden = true;
      navButtons.forEach((b) => b.classList.remove("active"));
    }

    function openMega(key, button) {
      if (!mega || !megaContent) return;
      navButtons.forEach((b) => b.classList.toggle("active", b === button));
      const groups = (window.NALEDI_DATA?.menus?.[key]) || [];
      if (!groups.length) {
        debug("No menu groups found for:", key);
        return;
      }
      megaContent.innerHTML = groups.map((g) => `
        <div class="mega-group">
          <h4>${escapeHTML(g.title)}</h4>
          ${(g.links || []).map(([label, rawHref]) => {
            const href = resolveHref(rawHref);
            const external = /^https?:/i.test(href);
            return `<a href="${escapeHTML(href)}"
              ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
              ${escapeHTML(label)} ${external ? "↗" : "→"}
            </a>`;
          }).join("")}
        </div>`).join("");
      mega.hidden = false;
    }

    navButtons.forEach((button) => {
      safeOn(button, "click", (e) => {
        e.stopPropagation();
        const key = button.dataset.menu;
        if (!key) return;
        if (!mega?.hidden && button.classList.contains("active")) {
          closeMega();
        } else {
          openMega(key, button);
        }
      });
    });

    safeOn(document, "click", (e) => {
      if (!e.target.closest || !e.target.closest(".main-nav")) closeMega();
    });

    safeOn(document, "keydown", (e) => {
      if (e.key === "Escape") closeMega();
    });

    /* ------------------------------------------------------------------
       Mobile menu
       ------------------------------------------------------------------ */
    const menuToggle = $("#menuToggle");
    safeOn(menuToggle, "click", () => {
      const nav = $(".main-nav");
      if (!nav) return;
      const open = nav.classList.toggle("mobile-open");
      safeSet(menuToggle, "aria-expanded", String(open));
      menuToggle.innerHTML = open
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    });

    /* ------------------------------------------------------------------
       Search — scoring + rendering
       ------------------------------------------------------------------ */

    /**
     * Score a single search index item against the query.
     * - Exact title match gets the highest score
     * - Title word match is worth 3
     * - Description word match is worth 1
     * - Multi-word phrases in the query boost score
     */
    function scoreItem(item, query) {
      const [title, description] = item;
      const lowerTitle = title.toLowerCase();
      const lowerDesc = (description || "").toLowerCase();
      const words = query.split(/[\s,]+/).filter((w) => w.length > 1);
      if (!words.length) return 0;

      let score = 0;
      // Full query match in title
      if (lowerTitle.includes(query)) score += 10;
      // Full query match in description
      if (lowerDesc.includes(query)) score += 3;
      // Per-word
      for (const w of words) {
        if (lowerTitle.includes(w)) score += 3;
        else if (lowerDesc.includes(w)) score += 1;
      }
      return score;
    }

    function runSearch(query, target) {
      const q = String(query || "").trim().toLowerCase();
      if (!q) {
        if (target) target.hidden = true;
        return;
      }
      if (!target) return;

      const index = window.NALEDI_DATA?.searchIndex || [];
      if (!index.length) {
        debug("searchIndex is empty");
        return;
      }

      const results = index
        .map((item) => ({ item, score: scoreItem(item, q) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);

      target.hidden = false;
      if (results.length) {
        target.innerHTML = `
          <strong>Search results for “${escapeHTML(query)}”</strong>
          ${results.slice(0, 8).map(({ item }) => {
            const [title, description, rawHref] = item;
            const href = resolveHref(rawHref);
            const external = /^https?:/i.test(href);
            return `<a href="${escapeHTML(href)}"
              ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
              <b>${escapeHTML(title)}</b> — ${escapeHTML(description || "")} ${external ? "↗" : "→"}
            </a>`;
          }).join("")}`;
      } else {
        target.innerHTML = `
          <strong>No matching demo results found.</strong>
          <p>Try “water”, “tenders”, “budget”, “vacancies”, “council” or “news”, or contact 053 928 2200.</p>`;
      }
    }

    // Homepage inline search
    const siteSearch = $("#siteSearch");
    safeOn(siteSearch, "submit", (e) => {
      e.preventDefault();
      const input = $("#searchInput");
      if (input) runSearch(input.value, $("#searchResults"));
    });

    // Search-as-you-type (debounced)
    const searchInput = $("#searchInput");
    if (searchInput) {
      let debounceTimer = null;
      safeOn(searchInput, "input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          runSearch(searchInput.value, $("#searchResults"));
        }, 250);
      });
    }

    // Modal search
    const modal = $("#searchModal");
    const modalInput = $("#modalSearchInput");
    const modalForm = $("#modalSearchForm");

    function openModal() {
      if (!modal) return;
      modal.hidden = false;
      setTimeout(() => modalInput?.focus(), 50);
    }
    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
    }

    safeOn($("#searchOpen"), "click", openModal);
    safeOn($("#searchClose"), "click", closeModal);
    safeOn(modal, "click", (e) => {
      if (e.target === modal) closeModal();
    });

    safeOn(modalForm, "submit", (e) => {
      e.preventDefault();
      const q = modalInput?.value || "";
      closeModal();
      const siteInput = $("#searchInput");
      if (siteInput) siteInput.value = q;

      // If the homepage search target exists on this page, use it.
      const resultsEl = $("#searchResults");
      if (resultsEl) {
        runSearch(q, resultsEl);
        const svc = document.getElementById("services");
        if (svc) svc.scrollIntoView({ behavior: "smooth" });
      } else {
        // From a sub-page: go to homepage search anchor
        window.location.href = resolveHref("index.html#services");
      }
    });

    // Popular searches
    $$(".popular-searches button").forEach((b) => {
      safeOn(b, "click", () => {
        if (!modalInput) return;
        modalInput.value = b.dataset.query || "";
        modalForm?.requestSubmit();
      });
    });

    // Global Escape handler for modal
    safeOn(document, "keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });

    /* ------------------------------------------------------------------
       Chat window
       ------------------------------------------------------------------ */
    const chat = $("#chatWindow");
    const messages = $("#chatMessages");
    const launcher = $("#chatLauncher");
    const chatClose = $("#chatClose");

    safeOn(launcher, "click", () => {
      if (!chat) return;
      chat.hidden = !chat.hidden;
      if (!chat.hidden) setTimeout(() => $("#chatInput")?.focus(), 50);
    });
    safeOn(chatClose, "click", () => { if (chat) chat.hidden = true; });

    function addMessage(text, type) {
      if (!messages) return;
      const div = document.createElement("div");
      div.className = "chat-message " + (type === "user" ? "user" : "bot");
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function sendChat(text) {
      if (!text || !text.trim()) return;
      addMessage(text, "user");
      const input = $("#chatInput");
      if (input) input.value = "";
      setTimeout(() => {
        const answer = window.NalediAssistant?.answerFor
          ? window.NalediAssistant.answerFor(text)
          : "This demo assistant isn't available right now.";
        addMessage(answer, "bot");
      }, 260);
    }

    const chatForm = $("#chatForm");
    safeOn(chatForm, "submit", (e) => {
      e.preventDefault();
      sendChat($("#chatInput")?.value || "");
    });
    $$(".chat-suggestions button").forEach((b) => {
      safeOn(b, "click", () => sendChat(b.dataset.chat || ""));
    });

    /* ------------------------------------------------------------------
       Contact form (demo)
       ------------------------------------------------------------------ */
    const contactForm = $("#contactForm");
    safeOn(contactForm, "submit", (e) => {
      e.preventDefault();
      const fb = $("#formFeedback");
      if (fb) {
        fb.textContent =
          "Thank you. This is a front-end demonstration; your enquiry has not been sent or stored.";
        fb.style.color = "var(--success)";
      }
      contactForm.reset();
    });

    /* ------------------------------------------------------------------
       Accessibility controls — persisted in localStorage
       ------------------------------------------------------------------ */
    const STORAGE_KEY = "naledi.a11y";
    const STORAGE_VERSION = 1;

    function loadA11y() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { fontScale: 1, contrast: false, motion: false };
        const data = JSON.parse(raw);
        if (data?.v !== STORAGE_VERSION) return { fontScale: 1, contrast: false, motion: false };
        return {
          fontScale: Number(data.fontScale) || 1,
          contrast: Boolean(data.contrast),
          motion: Boolean(data.motion)
        };
      } catch {
        return { fontScale: 1, contrast: false, motion: false };
      }
    }

    function saveA11y(state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: STORAGE_VERSION, ...state }));
      } catch {
        // LocalStorage may be blocked (privacy mode, quota, etc.) — safe to ignore.
      }
    }

    const a11yState = loadA11y();

    function applyA11y() {
      document.documentElement.style.fontSize = (16 * a11yState.fontScale) + "px";
      document.body.classList.toggle("high-contrast", a11yState.contrast);
      document.body.classList.toggle("reduce-motion", a11yState.motion);
    }
    applyA11y();

    const panel = $("#accessibilityPanel");
    const a11yToggle = $("#accessibilityToggle");
    safeOn(a11yToggle, "click", () => {
      if (!panel) return;
      panel.hidden = !panel.hidden;
      safeSet(a11yToggle, "aria-expanded", String(!panel.hidden));
    });

    $$("[data-font]").forEach((b) => {
      safeOn(b, "click", () => {
        const delta = b.dataset.font === "up" ? 0.05 : -0.05;
        a11yState.fontScale = Math.max(0.9, Math.min(1.15, a11yState.fontScale + delta));
        applyA11y();
        saveA11y(a11yState);
      });
    });

    safeOn($("#contrastToggle"), "click", () => {
      a11yState.contrast = !a11yState.contrast;
      applyA11y();
      saveA11y(a11yState);
    });

    safeOn($("#motionToggle"), "click", () => {
      a11yState.motion = !a11yState.motion;
      applyA11y();
      saveA11y(a11yState);
    });

    /* ------------------------------------------------------------------
       Scroll-to-top
       ------------------------------------------------------------------ */
    const topButton = $("#backToTop");
    if (topButton) {
      let rafPending = false;
      window.addEventListener("scroll", () => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
          topButton.classList.toggle("visible", window.scrollY > 450);
          rafPending = false;
        });
      }, { passive: true });

      safeOn(topButton, "click", () => {
        const behavior = document.body.classList.contains("reduce-motion") ? "auto" : "smooth";
        window.scrollTo({ top: 0, behavior });
      });
    }

    /* ------------------------------------------------------------------
       Global error safety — log but don't crash the UI
       ------------------------------------------------------------------ */
    window.addEventListener("error", (e) => {
      // Only report our own script errors
      if (e.filename && e.filename.includes("js/")) {
        console.warn("[Naledi] Runtime error:", e.message, "at", e.filename + ":" + e.lineno);
      }
    });

    window.addEventListener("unhandledrejection", (e) => {
      debug("Unhandled promise rejection:", e.reason);
    });

    debug("app.js initialised", { inPages, root });
  });
})();