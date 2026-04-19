#!/usr/bin/env bash
# Build static site under ./site: root index listing every presentation folder that contains deck.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="${ROOT}/site"

rm -rf "${SITE}"
mkdir -p "${SITE}"

mapfile -t DECK_PATHS < <(find "${ROOT}" -mindepth 2 -maxdepth 2 -type f -name deck.md | LC_ALL=C sort)

if [[ ${#DECK_PATHS[@]} -eq 0 ]]; then
  echo "No deck.md found under ${ROOT}" >&2
  exit 1
fi

NAMES=()
for deck in "${DECK_PATHS[@]}"; do
  dir="$(dirname "${deck}")"
  name="$(basename "${dir}")"
  echo "=== Building presentation: ${name} ==="
  (cd "${dir}" && make all)

  dest="${SITE}/${name}"
  mkdir -p "${dest}/diagrams" "${dest}/images"

  cp "${dir}/deck.html" "${dest}/index.html"
  if [[ -f "${dir}/workshop-barcelona.css" ]]; then
    cp "${dir}/workshop-barcelona.css" "${dest}/"
  fi

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
  echo 'main { max-width:40rem; margin:0 auto; padding:2rem 1.25rem 3rem; }'
  echo 'ul.decks { list-style:none; padding:0; margin:0; }'
  echo 'ul.decks li { margin:0 0 0.85rem; }'
  echo 'ul.decks a { display:block; padding:0.85rem 1rem; border-radius:6px; border-left:6px solid var(--peach); text-decoration:none; color:var(--accent); font-weight:600; background:rgba(255,255,255,0.95); box-shadow:0 1px 3px rgba(0,0,0,0.06); }'
  echo 'ul.decks a:hover { background:#fff; box-shadow:0 2px 8px rgba(52,101,164,0.12); }'
  echo 'ul.decks span.path { display:block; font-size:0.88rem; font-weight:400; color:#666; margin-top:0.25rem; }'
  echo 'footer { padding:1rem 1.5rem 2rem; font-size:0.9rem; color:#666; text-align:center; }'
  echo '</style>'
  echo '</head>'
  echo '<body>'
  echo '<header><h1>Wallet presentations</h1><p class="lead">Static slide decks built with Marp. Choose a presentation to open the HTML deck.</p></header>'
  echo '<main><ul class="decks">'
  for n in "${NAMES[@]}"; do
    echo "  <li><a href=\"./${n}/index.html\">${n}<span class=\"path\">/${n}/index.html</span></a></li>"
  done
  echo '</ul></main>'
  echo '<footer>Repository: Wallet-Presentations · Built by GitHub Actions</footer>'
  echo '</body></html>'
} > "${SITE}/index.html"

echo "Site ready at ${SITE} (${#NAMES[@]} presentation(s))"
