# Wallet presentations

Slide decks (Marp) and assets for EUDI Wallet, IT-Wallet trust, and related topics.

## Presentations in this repository

Each **top-level directory** that contains a `deck.md` and `Makefile` is one presentation. After a successful build, the count matches the entries on GitHub Pages.

| Folder | Topic |
|--------|--------|
| [`trust-management-eudi-wallet/`](trust-management-eudi-wallet/) | Trust management in the EUDI Wallet ecosystem (overview, matrices, diagrams) |
| [`openid-federation-wallet-tdi/`](openid-federation-wallet-tdi/) | OpenID Federation 1.0 vs EUDIW trusted lists in IT-Wallet — coexistence, costs, evolution (~20 min) |

To list folders locally:

```bash
find . -mindepth 2 -maxdepth 2 -name deck.md -printf '%h\n' | sort
```

## GitHub Pages

The workflow [`.github/workflows/release-trust-management-deck.yml`](.github/workflows/release-trust-management-deck.yml) builds **every** presentation, writes a **root `index.html`** that links to each deck, and deploys the `site/` output to the **`gh-pages`** branch.

- **Index (listing):** `https://<org>.github.io/<repo>/`  
- **A single deck:** `https://<org>.github.io/<repo>/<folder-name>/index.html` (the site index links here so the browser opens the Marp HTML directly)

Configure **Settings → Pages → Deploy from a branch → `gh-pages` → /** (root).

The site **index** lists each presentation with the same **`footer:`** text as in that deck’s Marp front matter (`deck.md`). To point the OpenID deck’s thank-you **QR** at another GitHub Pages base URL, set **`GITHUB_PAGES_BASE`** when running `./scripts/build-gh-pages-site.sh` locally, or define the repository variable **`WALLET_PRESENTATIONS_PAGES_URL`** (same value, no trailing slash) for GitHub Actions — empty means the default `https://peppelinux.github.io/Wallet-Presentations`. The script refreshes `openid-federation-wallet-tdi/images/gh-pages-index-qr.png` via **curl** (public QR API); ensure outbound HTTPS is allowed in CI, or rely on a committed PNG. Update the **thank-you link** in `openid-federation-wallet-tdi/deck.md` if your Pages URL differs.

## Build locally

From a presentation directory:

```bash
cd trust-management-eudi-wallet   # or openid-federation-wallet-tdi
make              # diagrams (if any), deck.html + deck.pdf
make help
```

Full site (same layout as CI):

```bash
./scripts/build-gh-pages-site.sh
# output: ./site/index.html and ./site/<presentation>/index.html
```

Prerequisites: **Node.js** (`npx` for `@marp-team/marp-cli` and, where used, `@mermaid-js/mermaid-cli`). PDF export needs headless Chromium dependencies (see the workflow for an apt package list).

## Releases

Publishing a **GitHub Release** attaches:

- one **PDF** per presentation (`<folder>-<tag>.pdf`);
- **`wallet-presentations-<tag>-html-full-site.zip`** — entire static site (index + all decks).

## License

Unless otherwise stated, content in this repository is licensed under [CC BY 4.0](LICENSE).
