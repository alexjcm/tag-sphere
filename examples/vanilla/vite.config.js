import { defineConfig } from 'vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  root,
  cacheDir: '../node_modules/.vite-vanilla',
  base: command === 'build' ? '/tag-sphere/vanilla/' : '/',
  build: {
    outDir: '../../site/vanilla',
    emptyOutDir: true,
  },
}));
