import { defineConfig } from 'astro/config';
import { dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const isBuild = process.env.NODE_ENV === 'production';
const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://alexjcm.github.io',
  base: isBuild ? '/tag-sphere/astro' : '/',
  outDir: '../../site/astro',
  vite: {
    resolve: {
      alias: isBuild
        ? []
        : [
          { find: /^tag-sphere$/, replacement: pathResolve(root, '../../src/index.ts') },
          { find: /^tag-sphere\/react$/, replacement: pathResolve(root, '../../src/react/index.tsx') },
          { find: /^tag-sphere\/styles$/, replacement: pathResolve(root, '../../styles/tag-sphere.css') },
        ],
    },
  },
});
