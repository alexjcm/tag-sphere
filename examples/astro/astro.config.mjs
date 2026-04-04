import { defineConfig } from 'astro/config';

const isBuild = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://alexjcm.github.io',
  base: isBuild ? '/tag-sphere/astro' : '/',
  outDir: '../../site/astro',
});
