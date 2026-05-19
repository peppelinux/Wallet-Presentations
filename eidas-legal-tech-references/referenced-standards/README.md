# Referenced technical standards

Part of the [eIDAS legal & technical references method](../README.md): this module helps **implementers** (and legal reviewers of technical annexes) navigate normative references without manually chasing each ETSI deliverable or RFC.

It discovers **technical standards and specifications** cited in the parent legal corpus, classifies them by **standardization body**, downloads openly available copies in parallel, records **provenance** (`reference.json`), and **recursively** follows references inside downloaded documents.

## Folder layout (`standards/`)

| Subfolder | Body |
|-----------|------|
| `ETSI/` | ETSI EN / TS / TR / SR |
| `IETF/` | RFCs |
| `W3C/` | W3C Recommendations (catalogued entries) |
| `ISO-IEC/` | ISO / IEC (metadata only — typically not free) |
| `CEN/` | CEN / CEN TS (metadata only) |
| `ITU-T/` | ITU-T (metadata only) |
| `IEEE/` | IEEE (metadata only) |
| `other/` | Unclassified |

Each specification has its own directory with downloaded files and/or `reference.json` when no public copy is available.

## Usage

From the parent directory:

```bash
make specs            # discover + download (WORKERS=10, DEPTH=2)
make discover-specs   # list references only
```

Or from here:

```bash
make specs
make discover
```

### Variables

- `WORKERS` — parallel HTTP workers (default `10`)
- `DEPTH` — recursion into downloaded specs (default `2`; PDF via `pdftotext` when installed)
- `LEGAL` — path to parent legal corpus (default `..`)
- `FORCE=1` — re-download existing files

## How discovery works

1. Scan `../**/*.md` for normative references.
2. Download into `standards/<body>/`.
3. Extract text from downloaded files and repeat for nested references up to `DEPTH`.

`manifest.lock.json` records status per reference.

Each spec folder includes **`reference.json`** with:

- `download_url` / `download_urls` — HTTPS locations to fetch the document (if known)
- `version` — normative version string when parsed from citations
- `released_at` — best-effort ISO-8601 release date (e.g. from ETSI `(YYYY-MM)`)
- `parent_legal_regulations` — EU acts that cite this spec (`id`, `title`, `celex`, `eli`, …)
- `parent_specifications` — other standards that cite this spec (nested references)
- `tags` — small allowlisted set for filtering (provenance, status, ETSI 119/319 series, trust-services, common-criteria, EU legal kind). SDO is **`body`**, not a tag. Vocabulary: `scripts/tag_normalize.py` · refresh with `make metadata`.
- `summary` — short description of scope/purpose (from abstract/scope text, or fallback when unavailable)
- `scope_keywords` — ranked terms describing what the specification addresses
- `summary_meta` — how the summary was derived (`artifact`, `sources`, `generated_at`)

Refresh metadata without re-downloading: `make metadata`  
Regenerate summaries for all local copies: `make summaries` (requires `pdftotext` for ETSI PDFs)

### Report

```bash
make -C .. report
```

Writes under **`../report/`** (corpus root). Published on GitHub Pages at **`/eidas-legal-tech-references/report/index.html`** when the corpus is built by CI (see repository root `scripts/build-gh-pages-site.sh`).

| File | Content |
|------|---------|
| `index.html` | Full report: summary, tables, interactive hierarchical graph (search + SDO filters) |
| `search.html` | Full-text search (legal markdown, specs, tags, SDO filters) |
| `search-index.json` | Search index (generated with the report) |
| `REFERENCES-REPORT.md` | Same content in markdown |
| `references-graph.json` | Nodes and edges for tooling |
