import { defineConfig } from 'vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const showcaseRoot = dirname(fileURLToPath(import.meta.url));
const devHost = process.env.TAG_SPHERE_DEV_HOST || 'localhost';
const showcasePort = Number(process.env.TAG_SPHERE_SHOWCASE_PORT || 3000);
const basePath = process.env.TAG_SPHERE_BASE || '/tag-sphere/';

export default defineConfig(({ command }) => ({
  root: showcaseRoot,
  cacheDir: '../node_modules/.vite-showcase',
  base: command === 'build' ? basePath : '/',
  server: {
    host: devHost,
    port: showcasePort,
    strictPort: true,
  },
  build: {
    outDir: '../../site',
    emptyOutDir: true,
  },
}));
