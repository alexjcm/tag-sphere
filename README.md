# tag-sphere

A lightweight, dependency-free 3D rotating tag sphere for Vanilla JS, React, and Astro.

[![npm version](https://img.shields.io/npm/v/tag-sphere?color=7c6aff&style=flat-square)](https://www.npmjs.com/package/tag-sphere)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tag-sphere?color=00d4ff&label=min%2Bgzip&style=flat-square)](https://bundlephobia.com/package/tag-sphere)
[![license](https://img.shields.io/npm/l/tag-sphere?color=6b6b8a&style=flat-square)](./LICENSE)

## Features ✨

Status legend: `✅ implemented` · `⚠️ partial/pending`

- ⚠️ **📦 Ultra Lightweight**: Core target is `< 1 KB` (min+gzip). Current core gzip size is `1016 B`.
- ✅ **🚀 Zero Dependencies**: No runtime dependencies.
- ✅ **🌗 Fully Themeable**: CSS custom properties and optional `tag-sphere/styles`.
- ✅ **🧩 Framework-Ready**: Vanilla API + official React (18+) and Astro entrypoints.
- ⚠️ **🔍 SEO Friendly**: Astro pre-renders static tags. React wrapper renders tags client-side (not static pre-render by default).
- ✅ **📱 Touch Support**: Touch interaction implemented (`touchmove`/`touchend`, passive move listener).

## Demo 🎮

[alexjcm.github.io/tag-sphere](https://alexjcm.github.io/tag-sphere)

## Installation 💿

```bash
npm i tag-sphere
```

## Quick Start 🚀

### Vanilla JS

```ts
import { tagSphere } from 'tag-sphere';
import 'tag-sphere/styles'; // optional

const el = document.getElementById('my-sphere');
if (!el) throw new Error('Missing #my-sphere container');

const instance = tagSphere(el, {
  tags: ['Astro', 'TypeScript', 'React'],
  radius: 120,
  speed: 0.03,
  direction: 135,
});
```

### React (18+)

```tsx
import { TagSphere } from 'tag-sphere/react';
import 'tag-sphere/styles';

export function Example() {
  return (
    <TagSphere
      tags={['Astro', 'TypeScript', 'React']}
      radius={120}
      speed={0.03}
      direction={135}
      style={{ width: 320, height: 320, position: 'relative' }}
    />
  );
}
```

### Astro

```astro
---
import TagSphere from 'tag-sphere/astro';
import 'tag-sphere/styles';
---

<TagSphere
  tags={['Astro', 'TypeScript', 'Vite']}
  radius={150}
  speed={0.03}
  direction={135}
  client:visible
/>
```

## API Reference 📖

### Options

| Property | Type | Default | Description |
|---|---|---|---|
| `tags` | `string[]` | required | Labels to render. Min `1`, max `50` (extra tags are truncated). |
| `radius` | `number` | `120` | Sphere radius in pixels. Clamped to `[60, 200]`. |
| `speed` | `number` | `0.03` | Idle angular speed. Normalized to absolute value, rounded to 3 decimals, clamped to `[0.001, 0.08]`. |
| `direction` | `number` | `135` | Idle direction in clockwise degrees, normalized to `[0, 359]`. |
| `tagClass` | `string` | `undefined` | Extra class added to each `.ts-tag`. |

## How It Works ⚙️

### 1) Spherical distribution (Fibonacci spherical lattice)

Each tag is placed using a Fibonacci-based spherical distribution to avoid pole clustering.
This gives a visually uniform distribution in `O(N)`.

### 2) Rotation + depth cue

On every `requestAnimationFrame`, points rotate and depth is derived from `z`:

Depth controls `opacity`, `font-size`, and `z-index` to create perspective.

## Development 🛠️

```bash
npm install
npm run build
npm test
```

## Examples (Vanilla / React / Astro) 🧪

Examples are isolated apps under `examples/` so they do not affect the library bundle.
The examples workspace currently pins Astro to `6.1.3`.
Contributor-focused workflow and commands live in [examples/README.md](./examples/README.md).

### Run Locally

```bash
npm run examples:install
npm run examples:dev
```

Open the URL shown in the terminal:

- `http://localhost:3000` (showcase)
- sub-demos: `5174` (vanilla), `5175` (react), `5176` (astro)
- if a port is busy, stop the process using that port or override with `TAG_SPHERE_*_PORT`

### Build Static Showcase (GitHub Pages)

```bash
npm run examples:build
```

This generates `site/` with the unified showcase and the three demos.
For GitHub Pages, publish the full `site/` folder (not only `index.html`).

## License 📜

[MIT](./LICENSE) © alexjcm
