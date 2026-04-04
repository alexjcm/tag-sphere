# Examples Workspace

This folder contains isolated demo apps used to validate library changes before release.

## Purpose

- Test new features against real usage (`vanilla`, `react`, `astro`).
- Keep demo code independent from the library bundle.
- Build static artifacts for GitHub Pages.

## Showcase Stack

- `Vite` (server + build)
- `HTML`, `CSS`, `JavaScript`
- `iframe` tabs to switch between `vanilla`, `react`, and `astro` demos

## Quick Dev Flow

From the repository root:

```bash
npm run examples:install
npm run examples:dev
```

Dev mode behavior:

- `dev` uses local source from this repo (`src/` + `styles/`) via alias.
- This keeps iteration fast without publishing first.

Node requirement: `Node >=24` (Astro 6 in this workspace requires it).

Open the URL printed in the terminal (usually `http://localhost:3000`).
Default ports:

- `3000` showcase
- `5174` vanilla
- `5175` react
- `5176` astro

If a port is already in use, free it or override with `TAG_SPHERE_*_PORT`.

## Work Per Demo

From the repository root:

```bash
npm --prefix examples run dev:vanilla
npm --prefix examples run dev:react
npm --prefix examples run dev:astro
```

## Build For GitHub Pages

From the repository root:

```bash
npm run examples:build
```

Build mode behavior:

- `build` uses the published npm package, not local source aliases.
- Before build, the root script syncs `examples/package.json`:
  - tries root version first (exact)
  - falls back to npm `dist-tags.latest` if root version is not published yet

Node requirement for this build: `Node >=24`.

This generates:

- `site/index.html` (showcase entry)
- `site/vanilla/`
- `site/react/`
- `site/astro/`

Publish the full `site/` directory.
