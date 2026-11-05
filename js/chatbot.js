/* ==========================================================================
   chatbot.js — Naledi Assistant (rule-based)
   --------------------------------------------------------------------------
   This is NOT an AI model. It matches keywords and synonyms in a fixed
   knowledge base (data.js → knowledge[]) and returns the best-scoring
   answer. If nothing matches, it falls back to searchIndex.

   Improvements over the original:
     - Fuzzy matching (Levenshtein) to tolerate typos
     - Synonym expansion via alias table
     - Multi-word phrase weighting
     - Context memory (remembers last topic to resolve "what about X?")
     - Safe under missing data.js
     - Contextual follow-up suggestion appended to short answers
   ========================================================================== */

(function () {
  "use strict";

  /* Synonym table — expands short query terms into canonical concepts. */
  const SYNONYMS = {
    "whatsapp": "contact",
    "call": "contact",
    "phone": "contact",
    "email": "contact",
    "number": "contact",
    "leak": "water",
    "burst": "water",
    "pipe": "water",
    "toilet": "sanitation",
    "sewer": "sanitation",
    "sewage": "sanitation",
    "trash": "waste",
    "rubbish": "waste",
    "garbage": "waste",
    "bin": "waste",
    "lights": "electricity",
    "power": "electricity",
    "trip": "electricity",
    "rate": "rates",
    "rates": "rates",
    "bill": "account",
    "invoice": "account",
    "pay": "account",
    "jobs": "vacancy",
    "hire": "vacancy",
    "career": "vacancy",
    "rfq": "tender",
    "bid": "tender",
    "supplier": "tender"
  };

  /* Normalise to a lowercase, whitespace-collapsed string. */
  const norm = (s) =>
    String(s).toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

  /* Levenshtein distance — used for typo tolerance. */
  function editDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const dp = Array(a.length + 1).fill(0).map((_, i) => [i]);
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,       // delete
          dp[i][j - 1] + 1,       // insert
          dp[i - 1][j - 1] + cost // substitute
        );
      }
    }
    return dp[a.length][b.length];
  }

  /* Fuzzy contains — returns true if q contains a word within 1 edit of key. */
  function fuzzyMatch(q, key) {
    if (q.includes(key)) return true;
    // For single short keys only, allow 1-char mismatch
    if (key.length < 4 || key.includes(" ")) return false;
    for (const word of q.split(" ")) {
      if (word.length >= key.length - 1 && word.length <= key.length + 1) {
        if (editDistance(word, key) <= 1) return true;
      }
    }
    return false;
  }

  /* Expand the query using the synonym table. */
  function expandQuery(q) {
    const tokens = q.split(/\s+/).filter(Boolean);
    const expanded = new Set(tokens);
    for (const t of tokens) {
      if (SYNONYMS[t]) expanded.add(SYNONYMS[t]);
    }
    return Array.from(expanded).join(" ");
  }

  /* Score a single knowledge entry against the expanded query. */
  function scoreEntry(entry, expandedQ) {
    let score = 0;
    for (const keyRaw of entry.keys || []) {
      const key = norm(keyRaw);
      if (!key) continue;
      if (expandedQ.includes(key)) {
        score += key.includes(" ") ? 4 : 1;
      } else if (fuzzyMatch(expandedQ, key)) {
        score += key.includes(" ") ? 2 : 0.5;
      }
    }
    return score;
  }

  /* Lightweight context memory (per session). */
  let lastTopic = null;
  const FOLLOW_UP_HINT =
    "\n\nTip: ask about water, electricity, waste, accounts, tenders, vacancies, or council.";

  function answerFor(message) {
    const data = window.NALEDI_DATA;
    if (!data || !Array.isArray(data.knowledge)) {
      return "The demo assistant is not available right now. Please call 053 928 2200 or email info@naledigov.co.za.";
    }

    const raw = String(message || "").trim();
    if (!raw) return "Please type a question — for example “water leak” or “tenders”.";

    const q = norm(raw);

    // Resolve context references like "what about water?" or "more info"
    let effectiveQ = q;
    if (/^(more|tell me more|what about|and |also |explain)/.test(q) && lastTopic) {
      effectiveQ = q + " " + lastTopic;
    }
    const expandedQ = expandQuery(effectiveQ);

    // Score all entries
    let best = null;
    let bestScore = 0;
    for (const entry of data.knowledge) {
      const s = scoreEntry(entry, expandedQ);
      if (s > bestScore) {
        bestScore = s;
        best = entry;
      }
    }

    if (best && bestScore >= 1) {
      // Track last topic for context
      lastTopic = norm(best.keys[0]);
      let answer = best.answer;
      // Append follow-up hint for very short answers
      if (answer.length < 80) answer += FOLLOW_UP_HINT;
      return answer;
    }

    // Fallback: search the searchIndex
    const index = Array.isArray(data.searchIndex) ? data.searchIndex : [];
    if (index.length) {
      const hits = index
        .map((item) => {
          const hay = norm((item[0] || "") + " " + (item[1] || ""));
          const hitCount = hay.split(" ").filter(
            (w) => w.length > 2 && expandedQ.includes(w)
          ).length;
          return { item, score: hitCount };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);

      if (hits.length) {
        const [title, , href] = hits[0].item;
        return `I found a relevant municipal resource: ${title}.\nOpen it here: ${href}\n\nFor direct assistance, call 053 928 2200.`;
      }
    }

    // Default
    return (
      "I'm a demonstration assistant and don't have access to live municipal systems. " +
      "Try asking about water, electricity, tenders, vacancies, budgets, housing, " +
      "public notices, council or contact details.\n\n" +
      "You can also call 053 928 2200 or email info@naledigov.co.za."
    );
  }

  /* Public API */
  window.NalediAssistant = {
    answerFor,
    resetContext: () => { lastTopic = null; }
  };
})();