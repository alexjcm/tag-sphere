import { defineConfig } from 'vite';
import { dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const root = dirname(fileURLToPath(import.meta.url));
const devHost = process.env.TAG_SPHERE_DEV_HOST || 'localhost';
const showcasePort = Number(process.env.TAG_SPHERE_SHOWCASE_PORT || 3000);
const basePath = process.env.TAG_SPHERE_BASE || '/tag-sphere/';

export default defineConfig(({ command }) => {
  const useLocalSource = command === 'serve';

  return {
    root,
    cacheDir: 'node_modules/.vite-showcase',
    base: command === 'build' ? basePath : '/',
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: [
        { find: /^tag-sphere\/styles$/, replacement: pathResolve(root, '../styles/styles.css') },
        { find: /^tag-sphere\/styles\.css$/, replacement: pathResolve(root, '../styles/styles.css') },
        ...(useLocalSource
          ? [
            { find: /^tag-sphere$/, replacement: pathResolve(root, '../src/index.ts') },
            { find: /^tag-sphere\/react$/, replacement: pathResolve(root, '../src/react/index.tsx') },
          ]
          : []),
      ],
    },
    server: {
      host: devHost,
      port: showcasePort,
      strictPort: true,
    },
    build: {
      outDir: '../site',
      emptyOutDir: true,
    },
  };
});
