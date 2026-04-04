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
npm install tag-sphere
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

// Later:
// instance.destroy();
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

### `tagSphere(container, options)`

- `container`: `HTMLElement` (required).
- Returns: `{ destroy(): void }`.

`container` must have `position: relative` and a fixed size (`width`/`height`).

### Options

| Property | Type | Default | Description |
|---|---|---|---|
| `tags` | `string[]` | required | Labels to render. Min `1`, max `50` (extra tags are truncated). |
| `radius` | `number` | `120` | Sphere radius in pixels. Clamped to `[60, 200]`. |
| `speed` | `number` | `0.03` | Idle angular speed. Normalized to absolute value, rounded to 3 decimals, clamped to `[0.005, 0.08]`. |
| `direction` | `number` | `135` | Idle direction in clockwise degrees, normalized to `[0, 359]`. |
| `tagClass` | `string` | `undefined` | Extra class added to each `.ts-tag`. |

Runtime validation behavior:

- `tags.length < 1` throws an error.
- Non-finite numeric values (`NaN`, `Infinity`) fall back to defaults.

### Instance method

- `destroy()`: cancels animation, removes listeners, and removes created spans.
- Safe to call multiple times.

## Styling (`tag-sphere/styles`) 🎨

Importing `tag-sphere/styles` is optional. The library works without it.

```css
#my-sphere {
  --ts-bg: rgba(128, 128, 128, 0.08);
  --ts-color: inherit;
  --ts-border: 1px solid rgba(128, 128, 128, 0.2);
  --ts-radius: 20px;
  --ts-padding: 3px 10px;
  --ts-font-size: 0.8rem;
  --ts-font-weight: 500;
  --ts-blur: none;
  --ts-transition: opacity 0.15s;
}
```

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
npm run demo
```

### Fast local demo loop (instant updates)

Use Vite for local iteration. It serves both demos and hot-reloads when you edit files in `src/`.

```bash
npm run demo:dev
```

Then open:

- `http://localhost:5173/demo/`
- `http://localhost:5173/demo2/`

Quick open helpers:

```bash
npm run demo:dev:1
npm run demo:dev:2
```

Notes:

- `npm run demo` stays as a plain static server (matches GitHub Pages behavior).
- In Vite dev mode, demo imports are aliased to `src/index.ts` so library changes appear immediately.

## License 📜

[MIT](./LICENSE) © alexjcm
