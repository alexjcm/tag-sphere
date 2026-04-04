import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const sourceEntry = fileURLToPath(new URL('./src/index.ts', import.meta.url));

export default defineConfig(({ command }) => ({
  resolve: {
    alias: command === 'serve'
      ? {
          // Keep demo files importing dist for static deploys,
          // but hot-load source during local Vite development.
          '../dist/index.js': sourceEntry,
        }
      : {},
  },
}));
