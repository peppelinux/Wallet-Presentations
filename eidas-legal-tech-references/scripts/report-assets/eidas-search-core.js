/**
 * Shared search helpers for report search + interactive graph filtering.
 */
(function (global) {
  "use strict";

  function tokenize(q) {
    return String(q || "")
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2);
  }

  function parseTags(raw) {
    return String(raw || "")
      .split(/[,;\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }

  function buildHaystack(parts) {
    return parts
      .flat()
      .filter(Boolean)
      .map((p) => (Array.isArray(p) ? p.join(" ") : String(p)))
      .join(" ")
      .toLowerCase();
  }

  function matchesTerms(haystack, terms) {
    if (!terms.length) return true;
    return terms.every((t) => haystack.includes(t));
  }

  function scoreHaystack(haystack, terms, requiredTags, tagHaystack) {
    if (requiredTags.length) {
      const tags = (tagHaystack || "").toLowerCase();
      for (const rt of requiredTags) {
        if (!tags.includes(rt)) return -1;
      }
    }
    if (!terms.length) return requiredTags.length ? 2 : 1;
    let score = 0;
    for (const t of terms) {
      if (haystack.includes(t)) score += 10;
      else return -1;
    }
    return score;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.EidasSearch = {
    tokenize,
    parseTags,
    buildHaystack,
    matchesTerms,
    scoreHaystack,
    escapeHtml,
  };
})(typeof window !== "undefined" ? window : globalThis);
