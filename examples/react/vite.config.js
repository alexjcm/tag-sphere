import { defineConfig } from 'vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  root,
  cacheDir: '../node_modules/.vite-react',
  plugins: [react()],
  base: command === 'build' ? '/tag-sphere/react/' : '/',
  build: {
    outDir: '../../site/react',
    emptyOutDir: true,
  },
}));
