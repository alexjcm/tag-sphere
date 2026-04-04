# tag-sphere

A lightweight, dependency-free 3D rotating tag sphere for Vanilla JS, React, and Astro. [View demo.](https://alexjcm.github.io/tag-sphere)

[![npm version](https://img.shields.io/npm/v/tag-sphere?color=7c6aff&style=flat-square)](https://www.npmjs.com/package/tag-sphere)
[![license](https://img.shields.io/npm/l/tag-sphere?color=6b6b8a&style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=111827&style=flat-square)](https://react.dev/)
[![Astro](https://img.shields.io/badge/Astro-Supported-FF5D01?logo=astro&logoColor=white&style=flat-square)](https://astro.build/)
[![ESM](https://img.shields.io/badge/ESM-only-1f6feb?style=flat-square)](https://nodejs.org/api/esm.html)

## Features

- Ultra lightweight core target: `< 1 KB` (min+brotli).
- Zero runtime dependencies.
- Themeable tags with CSS custom properties and optional `tag-sphere/styles`.
- Framework-ready entrypoints for Vanilla JS, React (18+), and Astro.
- ESM-only distribution for modern JavaScript/TypeScript tooling.
- SEO-friendly Astro pre-render strategy with client animation.
- Mouse and touch interaction support.

## Installation

```bash
npm i tag-sphere
```

## Quick Start

### Vanilla JS

```ts
import { tagSphere } from 'tag-sphere';

const el = document.getElementById('my-sphere');
if (!el) throw new Error('Missing #my-sphere container');

const instance = tagSphere(el, {
  tags: ['Astro', 'TypeScript', 'React'],
  radius: 120,
  speed: 0.03,
  direction: 135,
});
```

### React

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

## API Reference

### Options

| Property | Type | Default | Description |
|---|---|---|---|
| `tags` | `string[]` | required | Labels to render. Min `1`, max `50` (extra tags are truncated). |
| `radius` | `number` | `120` | Sphere radius in pixels. Clamped to `[60, 200]`. |
| `speed` | `number` | `0.01` | Idle angular speed. Normalized to absolute value, rounded to 3 decimals, clamped to `[0.001, 0.08]`. |
| `direction` | `number` | `20` | Idle direction in clockwise degrees, normalized to `[0, 359]`. |
| `tagClass` | `string` | `undefined` | Extra class added to each `.ts-tag`. |

## Runtime Compatibility

- Core library: Node `>=20`.
- Astro modern projects: Node `>=24` (Astro tooling requirement).

## Bundle Size Policy (Brotli)

Primary size KPI is Brotli-compressed output.

- Core target: `dist/index.js <= 1024 B` (brotli).
- Styles target: `styles/tag-sphere.css <= 400 B` (brotli).

Run size report:

```bash
npm run size
```

Run CI check:

```bash
npm run size:check
```

## Development

```bash
npm install
npm run build
```

## Examples

Isolated demos live in `examples/`. Extended notes are in [examples/README.md](./examples/README.md).

## License

[MIT](./LICENSE) © alexjcm
