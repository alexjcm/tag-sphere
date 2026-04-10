export const snippetSources = {
  react: {
    lang: 'tsx',
    text: `import { TagSphere } from 'tag-sphere/react';

export function Example() {
  return (
    <TagSphere
      tags={['Astro', 'TypeScript', 'React']}
      radius={120}
      speed={0.01}
      direction={20}
      style={{ width: 320, height: 320, position: 'relative' }}
    />
  );
}`,
  },
};
