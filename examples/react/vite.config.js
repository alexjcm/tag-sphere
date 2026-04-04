import { defineConfig } from 'vite';
import { dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  const useLocalSource = command === 'serve';

  return {
    root,
    cacheDir: '../node_modules/.vite-react',
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: [
        { find: /^react$/, replacement: pathResolve(root, '../node_modules/react') },
        { find: /^react-dom$/, replacement: pathResolve(root, '../node_modules/react-dom') },
        { find: /^react\/jsx-runtime$/, replacement: pathResolve(root, '../node_modules/react/jsx-runtime.js') },
        { find: /^react\/jsx-dev-runtime$/, replacement: pathResolve(root, '../node_modules/react/jsx-dev-runtime.js') },
        ...(useLocalSource
          ? [
            { find: /^tag-sphere$/, replacement: pathResolve(root, '../../src/index.ts') },
            { find: /^tag-sphere\/react$/, replacement: pathResolve(root, '../../src/react/index.tsx') },
            { find: /^tag-sphere\/styles$/, replacement: pathResolve(root, '../../styles/tag-sphere.css') },
          ]
          : []),
      ],
    },
    base: command === 'build' ? '/tag-sphere/react/' : '/',
    build: {
      outDir: '../../site/react',
      emptyOutDir: true,
    },
  };
});
