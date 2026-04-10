# tag-sphere

A ultra lightweight, dependency-free 3D rotating tag sphere for Vanilla JS, React, and Astro. [View demo.](https://alexjcm.github.io/tag-sphere)

[![npm version](https://img.shields.io/npm/v/tag-sphere?color=7c6aff&style=flat-square)](https://www.npmjs.com/package/tag-sphere)
[![License](https://img.shields.io/npm/l/tag-sphere?color=6b6b8a&style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D20-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=111827&style=flat-square)](https://react.dev/)
[![Astro](https://img.shields.io/badge/Astro-Supported-FF5D01?logo=astro&logoColor=white&style=flat-square)](https://astro.build/)

## Features

- Ultra lightweight core target.
- Zero runtime dependencies.
- Framework-ready entrypoints for Vanilla JS, React (18+), and Astro.
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

const instance = tagSphere(el, {
  tags: ['Astro', 'TypeScript', 'React'],
  radius: 120,
  speed: 0.01,
  direction: 20,
});
```

### React

```tsx
import { TagSphere } from 'tag-sphere/react';

export function Example() {
  return (
    <TagSphere
      tags={['Astro', 'TypeScript', 'React']}
      radius={120}
      speed={0.01}
      direction={20}
      style={{ width: 320, height: 320, position: 'relative' }}
    />
  );
}
```

### Astro

```astro
---
import TagSphere from 'tag-sphere/astro';
import 'tag-sphere/styles.css'; // Optional
---

<TagSphere
  tags={['Astro', 'TypeScript', 'Vite']}
  radius={150}
  speed={0.01}
  direction={20}
/>
```

## Styling Modes

- `Unstyled` (default): no CSS import from the library; bring your own styles via `.ts-tag` and/or `tagClass`.
- `Styled (Default)` (optional): import `tag-sphere/styles.css` (or alias `tag-sphere/styles`) for a basic preset.

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
- Astro projects: follow your Astro version requirement.

## Development

```bash
npm install
npm run build
```

## Examples

The unified React showcase lives in `examples/`. To test library changes with hot-reloading alongside the React demo application, **run the following from the repository root**:

```bash
npm run examples:dev
```

## License

MIT
