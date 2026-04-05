import { defineConfig } from 'vite';
import { dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => {
  const useLocalSource = command === 'serve';

  return {
    root,
    cacheDir: '../node_modules/.vite-vanilla',
    resolve: useLocalSource
      ? {
        alias: [
          { find: /^tag-sphere$/, replacement: pathResolve(root, '../../src/index.ts') },
        ],
      }
      : undefined,
    base: command === 'build' ? '/tag-sphere/vanilla/' : '/',
    build: {
      outDir: '../../site/vanilla',
      emptyOutDir: true,
    },
  };
});
