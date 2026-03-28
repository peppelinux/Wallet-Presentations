# `gh-pages` branch (orphan)

This branch intentionally has **no deck build output** checked in.

The slide site is **built and deployed by GitHub Actions** (`deploy-pages`):

- Workflow: `.github/workflows/release-trust-management-deck.yml`
- **Settings → Pages → Build and deployment → Source:** **GitHub Actions**

After a successful workflow run, Pages serves the uploaded artifact (e.g. `index.html` + assets).
