# Wallet presentations

This repository holds slide decks and related assets for EUDI Wallet and trust-management topics.

## Trust management in the EUDI Wallet ecosystem

Source: [`trust-management-eudi-wallet/`](trust-management-eudi-wallet/).

| Item | Description |
| --- | --- |
| `deck.md` | [Marp](https://marp.app/) markdown for the deck |
| `workshop-barcelona.css` | Marp theme |
| `.marprc.yml` | Marp configuration |
| `diagrams/*.mmd` | [Mermaid](https://mermaid.js.org/) sources; built to `*.svg` for the deck |
| `pacing-notes.md` | Presenter notes (optional) |

### Build locally

From the deck directory:

```bash
cd trust-management-eudi-wallet
make              # diagrams (if needed), then deck.html + deck.pdf
make help         # targets and tips
make rebuild      # clean outputs then full rebuild
```

Prerequisites: **Node.js** (the `Makefile` uses `npx` for `@mermaid-js/mermaid-cli` and `@marp-team/marp-cli`). For PDF export, Marp uses headless Chromium; on minimal Linux systems you may need the same Chromium dependencies as [GitHub Actions](.github/workflows/release-trust-management-deck.yml) (e.g. `libgbm1`, `libnss3`, …).

### Continuous integration

[`.github/workflows/release-trust-management-deck.yml`](.github/workflows/release-trust-management-deck.yml) builds the deck on push to `main`/`master` (when files under `trust-management-eudi-wallet/` change), publishes a static site to the **`gh-pages`** branch, and attaches **PDF** and **HTML zip** assets when a **GitHub Release** is published.

Configure **Settings → Pages** with source **Deploy from a branch → `gh-pages` → /** (root).

## License

Unless otherwise stated, content in this repository is licensed under [CC BY 4.0](LICENSE).
