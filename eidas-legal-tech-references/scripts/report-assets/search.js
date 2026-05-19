/**
 * Client-side search over report/search-index.json
 * (legal markdown chunks + specification metadata and documents).
 */

(function () {
  "use strict";

  const INDEX_URL = "search-index.json";
  const SNIPPET_RADIUS = 90;
  const MAX_RESULTS = 80;
  const ES = window.EidasSearch;

  /** SDO folder name → primary tag used in reference.json */
  const SDO_TAG_BY_BODY = {
    ETSI: "etsi",
    IETF: "ietf",
    W3C: "w3c",
    CEN: "cen",
    "ISO-IEC": "iso-iec",
    "ITU-T": "itu-t",
    IEEE: "ieee",
  };

  const SDO_LABELS = {
    ETSI: "ETSI",
    IETF: "IETF",
    W3C: "W3C",
    CEN: "CEN",
    "ISO-IEC": "ISO/IEC",
    "ITU-T": "ITU-T",
    IEEE: "IEEE",
  };

  let index = null;

  const $ = (sel) => document.querySelector(sel);
  const form = $("#search-form");
  const qInput = $("#q");
  const bodySelect = $("#body");
  const tagsInput = $("#tags");
  const kindSelect = $("#kind");
  const statusEl = $("#status");
  const resultsEl = $("#results");
  const facetTagsEl = $("#facet-tags");
  const sdoChipsEl = $("#sdo-chips");

  const escapeHtml = ES ? ES.escapeHtml.bind(ES) : (s) => String(s);
  const tokenize = ES ? ES.tokenize.bind(ES) : (q) =>
    String(q)
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 2);
  const parseTags = ES ? ES.parseTags.bind(ES) : (raw) =>
    String(raw)
      .split(/[,;\s]+/)
      .filter(Boolean);

  function docBody(doc) {
    return doc.body || doc.metadata?.body || "";
  }

  function docMatchesSdo(doc, bodyFilter) {
    if (!bodyFilter) return true;
    if (doc.kind === "legal") return false;
    const body = docBody(doc);
    if (body === bodyFilter) return true;
    const primaryTag = SDO_TAG_BY_BODY[bodyFilter];
    if (!primaryTag) return false;
    const tags = (doc.tags || []).map((t) => String(t).toLowerCase());
    return tags.some((t) => t === primaryTag || t.startsWith(primaryTag + "-"));
  }

  function highlight(text, terms) {
    if (!terms.length) return escapeHtml(text);
    const lower = text.toLowerCase();
    let best = -1;
    let bestTerm = "";
    for (const t of terms) {
      const i = lower.indexOf(t);
      if (i >= 0 && (best < 0 || i < best)) {
        best = i;
        bestTerm = t;
      }
    }
    if (best < 0) {
      const short = text.length > 280 ? text.slice(0, 277) + "…" : text;
      return escapeHtml(short);
    }
    const start = Math.max(0, best - SNIPPET_RADIUS);
    const end = Math.min(text.length, best + bestTerm.length + SNIPPET_RADIUS);
    let snippet = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
    for (const t of [...terms].sort((a, b) => b.length - a.length)) {
      if (!t) continue;
      const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      snippet = snippet.replace(re, "<mark>$1</mark>");
    }
    return snippet;
  }

  function scoreDoc(doc, terms, requiredTags, bodyFilter, kindFilter) {
    if (!docMatchesSdo(doc, bodyFilter)) return -1;
    if (kindFilter && doc.kind !== kindFilter) return -1;
    const docTags = (doc.tags || []).map((t) => t.toLowerCase());
    for (const rt of requiredTags) {
      if (!docTags.some((t) => t === rt || t.includes(rt))) return -1;
    }
    const meta = doc.metadata || {};
    const hay = ES
      ? ES.buildHaystack([
          doc.text,
          doc.title,
          meta.summary,
          meta.scope_keywords,
          meta.designation,
          meta.body,
        ])
      : ((doc.text || "") + " " + (doc.title || "") + " " + (meta.summary || "")).toLowerCase();
    let score = 0;
    if (terms.length === 0) {
      return bodyFilter || kindFilter || requiredTags.length ? 1 : 0;
    }
    for (const t of terms) {
      if (hay.includes(t)) score += 10;
      else return -1;
    }
    for (const rt of requiredTags) {
      if ((doc.text || "").toLowerCase().includes(rt)) score += 2;
    }
    if (doc.kind === "specification") score += 1;
    return score;
  }

  function linkRow(label, href, external) {
    if (!href) return "";
    const ext = external || /^https?:\/\//i.test(href);
    const rel = ext ? ' rel="noopener noreferrer" target="_blank"' : "";
    return `<a href="${escapeHtml(href)}"${rel}>${escapeHtml(label)}</a>`;
  }

  function renderMetadata(meta) {
    if (!meta || typeof meta !== "object") return "";
    const rows = [];
    const skip = new Set(["parent_legal_regulations", "parent_specifications", "summary_meta"]);
    for (const [k, v] of Object.entries(meta)) {
      if (skip.has(k) || v == null || v === "") continue;
      rows.push(
        `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(
          typeof v === "object" ? JSON.stringify(v) : String(v)
        )}</td></tr>`
      );
    }
    if (meta.parent_legal_regulations?.length) {
      const acts = meta.parent_legal_regulations
        .map((p) => `${p.id || "?"} — ${p.title || ""}`)
        .join("; ");
      rows.push(`<tr><th>parent legal acts</th><td>${escapeHtml(acts)}</td></tr>`);
    }
    if (meta.parent_specifications?.length) {
      const parents = meta.parent_specifications
        .map((p) => `${p.body || ""} ${p.designation || ""}`.trim())
        .join("; ");
      rows.push(`<tr><th>parent specifications</th><td>${escapeHtml(parents)}</td></tr>`);
    }
    if (!rows.length) return "";
    return `<table class="meta-table"><tbody>${rows.join("")}</tbody></table>`;
  }

  function renderResult(doc, terms) {
    const links = doc.links || {};
    const linkParts = [];
    if (links.markdown) linkParts.push(linkRow("Legal markdown", links.markdown, false));
    if (links.reference_json)
      linkParts.push(linkRow("reference.json", links.reference_json, false));
    if (links.document) linkParts.push(linkRow("Specification document", links.document, false));
    if (links.folder) linkParts.push(linkRow("Spec folder", links.folder, false));
    if (links.metadata) linkParts.push(linkRow("Act metadata", links.metadata, false));
    if (links.eli) linkParts.push(linkRow("EUR-Lex (ELI)", links.eli, true));
    if (links.download) linkParts.push(linkRow("Download / catalogue", links.download, true));
    if (links.html) linkParts.push(linkRow("OJ HTML", links.html, false));

    const badges = [];
    if (doc.kind) badges.push(`<span class="badge kind">${escapeHtml(doc.kind)}</span>`);
    const sdo = docBody(doc);
    if (sdo) badges.push(`<span class="badge body">${escapeHtml(SDO_LABELS[sdo] || sdo)}</span>`);
    for (const t of (doc.tags || []).slice(0, 8)) {
      badges.push(`<span class="badge tag">${escapeHtml(t)}</span>`);
    }
    if ((doc.tags || []).length > 8) badges.push(`<span class="badge">+${doc.tags.length - 8}</span>`);

    const meta = doc.metadata || {};
    const summaryBlock = meta.summary
      ? `<p class="summary"><strong>Summary:</strong> ${escapeHtml(meta.summary)}</p>`
      : "";
    const kwBlock =
      meta.scope_keywords && meta.scope_keywords.length
        ? `<p class="keywords"><strong>Scope keywords:</strong> ${escapeHtml(
            meta.scope_keywords.join(", ")
          )}</p>`
        : "";

    const rawForDocs = Object.assign({}, meta, {
      section: meta.section,
      act_id: meta.id,
      files: meta.files,
      type: doc.kind === "legal" ? "legal_regulation" : doc.kind === "specification" ? "specification" : doc.kind,
    });
    const localDocsHtml =
      window.EidasDocs && EidasDocs.localDocumentsForNode
        ? EidasDocs.renderDocumentLinksHtml(
            EidasDocs.localDocumentsForNode(rawForDocs),
            escapeHtml
          )
        : "";

    return `<article class="result">
      <h3>${escapeHtml(doc.title || doc.id)}</h3>
      <p class="badges">${badges.join("")}</p>
      ${summaryBlock}
      ${kwBlock}
      ${localDocsHtml}
      <blockquote class="snippet">${highlight(doc.text || "", terms)}</blockquote>
      <p class="links">${linkParts.join(" · ") || "<em>No links</em>"}</p>
      ${renderMetadata(doc.metadata)}
    </article>`;
  }

  function runSearch() {
    if (!index) return;
    const q = qInput.value.trim();
    const terms = tokenize(q);
    const requiredTags = parseTags(tagsInput.value);
    const bodyFilter = bodySelect.value || "";
    const kindFilter = kindSelect.value || "";

    if (!terms.length && !requiredTags.length && !bodyFilter && !kindFilter) {
      statusEl.textContent = "Enter a search query, tag(s), or filter.";
      resultsEl.innerHTML = "";
      return;
    }

    const scored = [];
    for (const doc of index.documents) {
      const s = scoreDoc(doc, terms, requiredTags, bodyFilter, kindFilter);
      if (s > 0) scored.push({ doc, s });
    }
    scored.sort((a, b) => b.s - a.s);
    const top = scored.slice(0, MAX_RESULTS);

    const filterBits = [];
    if (bodyFilter) filterBits.push(SDO_LABELS[bodyFilter] || bodyFilter);
    if (kindFilter) filterBits.push(kindFilter);
    const filterNote = filterBits.length ? ` · filter: ${filterBits.join(", ")}` : "";

    statusEl.textContent =
      top.length === 0
        ? `No matches${filterNote}.`
        : `Showing ${top.length} of ${scored.length} match(es) in ${index.document_count} indexed chunks${filterNote}.`;

    resultsEl.innerHTML = top.map(({ doc }) => renderResult(doc, terms)).join("");
    if (window.EidasDocs) EidasDocs.bindViewButtons(resultsEl);
  }

  function setBodyFilter(value) {
    bodySelect.value = value || "";
    if (sdoChipsEl) {
      sdoChipsEl.querySelectorAll(".sdo-chip").forEach((btn) => {
        const active = btn.getAttribute("data-body") === value;
        btn.classList.toggle("active", active);
        btn.classList.toggle("muted", value && !active);
      });
    }
  }

  function populateFacets() {
    const bodies = index.facets.bodies || [];
    const counts = index.facets.body_counts || {};

    bodySelect.innerHTML =
      '<option value="">All standardization bodies</option>' +
      bodies
        .map((b) => {
          const label = SDO_LABELS[b] || b;
          const n = counts[b];
          const suffix = typeof n === "number" ? ` (${n})` : "";
          return `<option value="${escapeHtml(b)}">${escapeHtml(label)}${suffix}</option>`;
        })
        .join("");

    if (sdoChipsEl) {
      sdoChipsEl.innerHTML = bodies
        .map((b) => {
          const label = SDO_LABELS[b] || b;
          const n = counts[b];
          const suffix = typeof n === "number" ? ` (${n})` : "";
          return `<button type="button" class="sdo-chip" data-body="${escapeHtml(b)}">${escapeHtml(label)}${suffix}</button>`;
        })
        .join("");
      sdoChipsEl.querySelectorAll(".sdo-chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          const b = btn.getAttribute("data-body");
          setBodyFilter(bodySelect.value === b ? "" : b);
          runSearch();
        });
      });
    }

    const tags = (index.facets.tags || []).slice(0, 40);
    facetTagsEl.innerHTML = tags.length
      ? tags
          .map(
            (t) =>
              `<button type="button" class="tag-pick" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`
          )
          .join("")
      : '<span class="hint">No tag suggestions</span>';
    facetTagsEl.querySelectorAll(".tag-pick").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.getAttribute("data-tag");
        const cur = parseTags(tagsInput.value);
        if (!cur.includes(t)) {
          tagsInput.value = cur.length ? tagsInput.value + ", " + t : t;
        }
        runSearch();
      });
    });
  }

  function applyIndex(data) {
    index = data;
    populateFacets();
    statusEl.textContent = `Index ready — ${index.document_count} chunks (generated ${index.generated_at || "?"}).`;
  }

  function syncGraphLink() {
    const q = qInput?.value?.trim();
    const graphLink = document.querySelector('a[href="index.html#graph"]');
    if (graphLink && q) {
      graphLink.href = `index.html?q=${encodeURIComponent(q)}#graph`;
    }
  }

  async function init() {
    statusEl.textContent = "Loading search index…";
    if (window.EIDAS_SEARCH_INDEX) {
      applyIndex(window.EIDAS_SEARCH_INDEX);
      return;
    }
    try {
      const res = await fetch(INDEX_URL);
      if (!res.ok) throw new Error(res.statusText);
      applyIndex(await res.json());
    } catch (err) {
      statusEl.textContent =
        "Could not load search index. Run: make report (needs search-index.js beside this page).";
      console.error(err);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    syncGraphLink();
    runSearch();
  });
  qInput?.addEventListener("input", syncGraphLink);
  bodySelect.addEventListener("change", () => {
    setBodyFilter(bodySelect.value);
    runSearch();
  });
  kindSelect.addEventListener("change", runSearch);
  $("#clear").addEventListener("click", () => {
    qInput.value = "";
    tagsInput.value = "";
    setBodyFilter("");
    kindSelect.value = "";
    resultsEl.innerHTML = "";
    statusEl.textContent = index
      ? `Index ready — ${index.document_count} chunks.`
      : statusEl.textContent;
  });

  init();
})();
