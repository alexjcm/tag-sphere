import { controlLimits, demoDefaults, primaryTags } from '../shared/demo-data.js';
import { initInteractiveDemo, requireElements } from '../shared/init-demo.js';
import { snippets } from '../shared/snippets.js';

const {
  sphere: sphereEl,
  radius: radiusInput,
  speed: speedInput,
  direction: directionInput,
  values: valuesEl,
  'copy-snippet': copyButton,
  'snippet-code': snippetCodeEl,
} = requireElements(
  ['sphere', 'radius', 'speed', 'direction', 'values', 'copy-snippet', 'snippet-code'],
  document,
  'Vanilla JS demo',
);

initInteractiveDemo({
  label: 'Vanilla JS demo',
  sphereEl,
  radiusInput,
  speedInput,
  directionInput,
  valuesEl,
  copyButton,
  snippetCodeEl,
  snippet: snippets.vanilla,
  tags: primaryTags,
  defaults: demoDefaults,
  limits: controlLimits,
});
