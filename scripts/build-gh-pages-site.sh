#!/usr/bin/env bash
# Build static site under ./site:
#   - root index listing every presentation folder that contains deck.md
#   - eIDAS references report (eidas-legal-tech-references/report/) when the corpus is present
# Optional: GITHUB_PAGES_BASE — e.g. https://myorg.github.io/Wallet-Presentations (no trailing slash required)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="${ROOT}/site"
# GitHub Actions may set GITHUB_PAGES_BASE to empty when vars.* is unset — treat empty like missing.
PAGES_BASE="${GITHUB_PAGES_BASE:-}"
if [[ -z "${PAGES_BASE// }" ]]; then
  PAGES_BASE="https://peppelinux.github.io/Wallet-Presentations"
fi
PAGES_BASE="${PAGES_BASE%/}"

rm -rf "${SITE}"
mkdir -p "${SITE}"

mapfile -t DECK_PATHS < <(find "${ROOT}" -mindepth 2 -maxdepth 2 -type f -name deck.md | LC_ALL=C sort)

if [[ ${#DECK_PATHS[@]} -eq 0 ]]; then
  echo "No deck.md found under ${ROOT}" >&2
  exit 1
fi

# QR on last slide (openid deck): site index URL
OID_QR_DIR="${ROOT}/openid-federation-wallet-tdi/images"
if [[ -d "${OID_QR_DIR}" ]]; then
  mkdir -p "${OID_QR_DIR}"
  ENC="$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${PAGES_BASE}/")"
  if ! curl -sfS "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${ENC}" -o "${OID_QR_DIR}/gh-pages-index-qr.png"; then
    echo "WARN: could not download QR PNG (network); last slide may use stale image" >&2
  fi
fi

META_TMP="$(mktemp)"
trap 'rm -f "${META_TMP}"' EXIT

NAMES=()
for deck in "${DECK_PATHS[@]}"; do
  dir="$(dirname "${deck}")"
  name="$(basename "${dir}")"
  foot_esc="$(python3 "${ROOT}/scripts/extract_marp_footer.py" "${deck}" | python3 -c "import html,sys; print(html.escape(sys.stdin.read()))")"
  printf '%s\t%s\n' "${name}" "${foot_esc}" >> "${META_TMP}"

  echo "=== Building presentation: ${name} ==="
  (cd "${dir}" && make all)

  dest="${SITE}/${name}"
  mkdir -p "${dest}/diagrams" "${dest}/images"

  cp "${dir}/deck.html" "${dest}/index.html"
  shopt -s nullglob
  for css in "${dir}"/*.css; do
    cp "${css}" "${dest}/"
  done
  shopt -u nullglob

  shopt -s nullglob
  for svg in "${dir}/diagrams"/*.svg; do
    cp "${svg}" "${dest}/diagrams/"
  done
  for item in "${dir}/images"/*; do
    [[ -e "${item}" ]] || continue
    [[ "$(basename "${item}")" == .gitkeep ]] && continue
    cp -a "${item}" "${dest}/images/"
  done
  NAMES+=("${name}")
done

EIDAS_NAME="eidas-legal-tech-references"
EIDAS_SRC="${ROOT}/${EIDAS_NAME}"
EIDAS_DEST="${SITE}/${EIDAS_NAME}"
EIDAS_REPORT_READY=0

publish_eidas_report() {
  [[ -d "${EIDAS_SRC}" ]] || return 0

  if [[ -d "${EIDAS_SRC}/referenced-standards/standards" ]]; then
    echo "=== Building eIDAS references report ==="
    if ! make -C "${EIDAS_SRC}" report PYTHON="${PYTHON:-python3}"; then
      echo "WARN: make report failed; using existing report/ if present" >&2
    fi
  else
    echo "NOTE: ${EIDAS_SRC}/referenced-standards/standards not found — skip report build" >&2
  fi

  if [[ ! -f "${EIDAS_SRC}/report/index.html" ]]; then
    echo "NOTE: no ${EIDAS_SRC}/report/index.html — eIDAS report omitted from site" >&2
    return 0
  fi

  echo "=== Publishing eIDAS references report to site ==="
  rm -rf "${EIDAS_DEST}"
  mkdir -p "${EIDAS_DEST}"

  rsync -a \
    --exclude='.git' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.venv' \
    "${EIDAS_SRC}/report/" "${EIDAS_DEST}/report/"

  for sub in referenced-standards regulation implementing-acts implementing-decisions; do
    if [[ -d "${EIDAS_SRC}/${sub}" ]]; then
      rsync -a \
        --exclude='.git' \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        "${EIDAS_SRC}/${sub}/" "${EIDAS_DEST}/${sub}/"
    fi
  done

  EIDAS_REPORT_READY=1
}

publish_eidas_report

{
  echo '<!DOCTYPE html>'
  echo '<html lang="en">'
  echo '<head>'
  echo '<meta charset="utf-8"/>'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1"/>'
  echo '<title>Wallet presentations</title>'
  echo '<link rel="preconnect" href="https://fonts.googleapis.com"/>'
  echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>'
  echo '<link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600;700&amp;display=swap" rel="stylesheet"/>'
  echo '<style>'
  echo ':root { --teal:#008080; --peach:#ffcc99; --accent:#3465a4; --bg:#f7fcfb; }'
  echo 'body { font-family: "Titillium Web", system-ui, sans-serif; margin:0; min-height:100vh; background:linear-gradient(180deg,#fff 0%,var(--bg) 100%); color:#2d2d2d; }'
  echo 'header { border-bottom:6px solid var(--teal); padding:2rem 1.5rem 1.25rem; background:#fff; }'
  echo 'h1 { margin:0 0 0.35rem; color:var(--teal); font-weight:700; letter-spacing:-0.02em; }'
  echo 'p.lead { margin:0; max-width:48rem; color:#444; }'
  echo 'main { max-width:44rem; margin:0 auto; padding:2rem 1.25rem 3rem; }'
  echo 'ul.decks { list-style:none; padding:0; margin:0; }'
  echo 'li.deck-card { margin:0 0 1.1rem; padding:0.9rem 1rem 1rem; border-radius:6px; border-left:6px solid var(--peach); background:rgba(255,255,255,0.95); box-shadow:0 1px 3px rgba(0,0,0,0.06); }'
  echo 'li.deck-card.report-card { border-left-color: var(--teal); }'
  echo 'h2.site-section { margin:2rem 0 0.75rem; font-size:1.15rem; color:var(--teal); font-weight:700; }'
  echo 'li.deck-card a.deck-link { text-decoration:none; color:var(--accent); font-weight:600; display:block; }'
  echo 'li.deck-card a.deck-link:hover { text-decoration:underline; }'
  echo 'li.deck-card span.path { display:block; font-size:0.88rem; font-weight:400; color:#666; margin-top:0.25rem; }'
  echo 'p.deck-footer { margin:0.55rem 0 0 0; font-size:0.86rem; font-weight:400; color:#444; line-height:1.4; border-top:1px solid rgba(0,128,128,0.15); padding-top:0.55rem; }'
  echo 'footer { padding:1rem 1.5rem 2rem; font-size:0.9rem; color:#666; text-align:center; }'
  echo '</style>'
  echo '</head>'
  echo '<body>'
  echo '<header><h1>Wallet presentations</h1><p class="lead">Slide decks (Marp) and the eIDAS legal &amp; technical references report. Open an item below.</p></header>'
  echo '<main>'
  echo '<h2 class="site-section">Slide decks</h2>'
  echo '<ul class="decks">'
  while IFS=$'\t' read -r name foot_esc; do
    echo "  <li class=\"deck-card\">"
    echo "    <a class=\"deck-link\" href=\"./${name}/index.html\"><strong>${name}</strong><span class=\"path\">/${name}/index.html</span></a>"
    echo "    <p class=\"deck-footer\">${foot_esc}</p>"
    echo "  </li>"
  done < "${META_TMP}"
  echo '</ul>'
  if [[ "${EIDAS_REPORT_READY}" -eq 1 ]]; then
    eidas_foot='Interactive graph, full-text search, and tables linking EU implementing acts to normative standards (ETSI, IETF, W3C, …) and EUDI ARF technical specifications (EC TS). Built from the eidas-legal-tech-references toolchain.'
    echo '<h2 class="site-section">Reference reports</h2>'
    echo '<ul class="decks">'
    echo "  <li class=\"deck-card report-card\">"
    echo "    <a class=\"deck-link\" href=\"./${EIDAS_NAME}/report/index.html\"><strong>eIDAS legal &amp; technical references</strong><span class=\"path\">/${EIDAS_NAME}/report/index.html</span></a>"
    echo "    <p class=\"deck-footer\">${eidas_foot}</p>"
    echo '  </li>'
    echo '</ul>'
  fi
  echo '</main>'
  echo '<footer>Repository: Wallet-Presentations · Built by GitHub Actions · Index: <a href="'"${PAGES_BASE}"'/">'"${PAGES_BASE}"'/</a></footer>'
  echo '</body></html>'
} > "${SITE}/index.html"

extra=0
[[ "${EIDAS_REPORT_READY}" -eq 1 ]] && extra=1
echo "Site ready at ${SITE} (${#NAMES[@]} presentation(s), ${extra} reference report(s))"
