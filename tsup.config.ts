import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'react/index': 'src/react/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom'],
});
