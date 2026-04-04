export const primaryTags = [
  'TypeScript', 'Astro', 'React', 'Node.js', 'Vite', 'Vitest',
  'ESM', 'Accessibility', 'DX', 'Animation', 'Components', 'NPM',
];

export const demoDefaults = Object.freeze({
  radius: 120,
  speed: 0.01,
  direction: 20,
});

export const controlLimits = Object.freeze({
  radius: Object.freeze({
    min: 60,
    max: 200,
    step: 5,
  }),
  speed: Object.freeze({
    min: 0.001,
    max: 0.08,
    step: 0.001,
  }),
  direction: Object.freeze({
    min: 0,
    max: 359,
    step: 1,
  }),
});
