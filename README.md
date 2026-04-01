# tag-sphere 🪐

A lightweight, dependency-free 3D rotating tag sphere. Built with performance and DX (Developer Experience) in mind.

[![npm version](https://img.shields.io/npm/v/tag-sphere?color=7c6aff&style=flat-square)](https://www.npmjs.com/package/tag-sphere)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tag-sphere?color=00d4ff&label=min%2Bgzip&style=flat-square)](https://bundlephobia.com/package/tag-sphere)
[![license](https://img.shields.io/npm/l/tag-sphere?color=6b6b8a&style=flat-square)](./LICENSE)

---

## Features ✨

- **📦 Ultra Lightweight**: Under 1KB (min+gzip) for the core.
- **🚀 Zero Dependencies**: No runtime bloat.
- **🌗 Fully Themeable**: Powered by CSS custom properties.
- **🧩 Framework-Ready**: Native wrappers for **React (18+)** and **Astro**.
- **🔍 SEO Friendly**: Pre-renders tags as static HTML in Astro/React.
- **📱 Touch Support**: Supports mouse and touch interactions.

---

## Demo 🎮

Check out the demo: [**alexjcm.github.io/tag-sphere**](https://alexjcm.github.io/tag-sphere)

---

## Installation 💿

```bash
npm install tag-sphere
```

---

## Quick Start 🚀

### 🍦 Vanilla JS

```typescript
import { tagSphere } from 'tag-sphere';
import 'tag-sphere/styles'; // Optional base styles

const container = document.getElementById('my-sphere');
const options = {
  tags: ['Astro', 'React', 'TypeScript', 'Vite', 'HTML', 'CSS'],
  radius: 120,
  speed: 0.03
};

const instance = tagSphere(container, options);

// To clean up:
// instance.destroy();
```

### ⚛️ React (18+)

```tsx
import { TagSphere } from 'tag-sphere/react';
import 'tag-sphere/styles';

function MyComponent() {
  return (
    <TagSphere 
      tags={['Astro', 'TypeScript', 'React']}
      radius={120}
      speed={0.03}
      style={{ width: '300px', height: '300px' }}
    />
  );
}
```

### 🚀 Astro

```astro
---
import TagSphere from 'tag-sphere/astro';
import 'tag-sphere/styles';
---

<TagSphere 
  tags={['Astro', 'TypeScript', 'Vite']} 
  radius={150} 
  client:visible 
/>
```

---

## API Reference 📖

### Options

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `tags` | `string[]` | **Required** | Array of strings to render. |
| `radius` | `number` | `120` | Radius of the sphere in pixels. |
| `speed` | `number` | `0.03` | Idle rotation speed (radians per frame). |
| `direction` | `number` | `135` | Idle rotation direction in degrees (0-360). |
| `tagClass` | `string` | `undefined` | Additional CSS class for each tag span. |

### Instance Methods (Vanilla)

The `tagSphere()` function returns an object with:
- `destroy()`: Stops the animation loop and removes all spans from the container.

---

## Customization (CSS Variables) 🎨

The library uses CSS variables for effortless theming. Apply these to your container:

```css
#my-sphere {
  --ts-bg: transparent;       /* Tag background */
  --ts-color: #7c6aff;      /* Tag text color */
  --ts-border: none;         /* Tag border */
  --ts-radius: 4px;          /* Tag border-radius */
  --ts-padding: 4px 8px;     /* Tag padding */
  --ts-font-size: 0.8rem;    /* Tag font size */
  --ts-blur: none;           /* Glassmorphism blur (e.g. blur(4px)) */
  --ts-transition: opacity 0.3s; /* Transition for fade effects */
}
```

---

## Development 🛠️

```bash
npm install

npm run build

# Launch demo locally (http://localhost:3131)
npm run demo
```

---

## License 📜

[MIT](./LICENSE) © alexjcm
