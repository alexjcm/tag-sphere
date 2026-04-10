# Examples Workspace

## Purpose

- Test new features via the React Showcase implementation.
- Keep demo code independent from the library bundle.
- Build static artifacts for GitHub Pages.

## Quick Dev Flow

Execute the following **from the repository root**:

```bash
npm install
npm run examples:dev
```

Open the URL printed in the terminal (usually `http://localhost:3000`).

## Build For GitHub Pages

From the repository root:

```bash
npm run examples:build
```
This generates the optimized static bundle under the `site/` directory:

Publish the full `site/` directory.
