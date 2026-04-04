import 'tag-sphere/styles';
import { controlLimits, demoDefaults, primaryTags } from '../shared/demo-data.js';
import { setupCopyButton } from '../shared/copy.js';
import { setupSphereControls } from '../shared/sphere-controls.js';
import { snippets } from '../shared/snippets.js';

const sphereEl = document.getElementById('sphere');
const radiusInput = document.getElementById('radius');
const speedInput = document.getElementById('speed');
const directionInput = document.getElementById('direction');
const valuesEl = document.getElementById('values');
const copyButton = document.getElementById('copy-snippet');
const snippetCodeEl = document.getElementById('snippet-code');

if (!sphereEl || !radiusInput || !speedInput || !directionInput || !valuesEl || !copyButton || !snippetCodeEl) {
  throw new Error('Vanilla demo: missing DOM nodes.');
}

snippetCodeEl.innerHTML = snippets.vanilla.html;

radiusInput.min = String(controlLimits.radius.min);
radiusInput.max = String(controlLimits.radius.max);
radiusInput.step = String(controlLimits.radius.step);

speedInput.min = String(controlLimits.speed.min);
speedInput.max = String(controlLimits.speed.max);
speedInput.step = String(controlLimits.speed.step);

directionInput.min = String(controlLimits.direction.min);
directionInput.max = String(controlLimits.direction.max);
directionInput.step = String(controlLimits.direction.step);

setupSphereControls({
  sphereEl,
  radiusInput,
  speedInput,
  directionInput,
  valuesEl,
  tags: primaryTags,
  defaults: demoDefaults,
});

setupCopyButton(copyButton, () => snippets.vanilla.text, {
  defaultAria: 'Copy code',
  copiedAria: 'Copied',
  srText: 'Copy snippet',
});
