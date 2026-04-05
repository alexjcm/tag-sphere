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
npm install
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

## Work Per Demo

From the repository root:

```bash
npm run dev:vanilla -w tag-sphere-examples
npm run dev:react -w tag-sphere-examples
npm run dev:astro -w tag-sphere-examples
```

## Build For GitHub Pages

From the repository root:

```bash
npm run examples:build
```

- `build` uses the Workspace symlink to build against your local source changes.
- CSS entrypoint (`styles.css`) is resolved locally.

Node requirement for this build: `Node >=24`.

This generates:

- `site/index.html` (showcase entry)
- `site/vanilla/`
- `site/react/`
- `site/astro/`

Publish the full `site/` directory.
