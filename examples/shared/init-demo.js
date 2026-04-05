import { setupCopyButton } from './copy.js';
import { setupSphereControls } from './sphere-controls.js';

export function requireElements(ids, scope, label) {
  const entries = ids.map((id) => [id, scope.getElementById(id)]);
  const missing = entries.filter(([, value]) => !value).map(([id]) => id);
  if (missing.length > 0) {
    throw new Error(`${label}: missing DOM nodes (${missing.join(', ')})`);
  }
  return Object.fromEntries(entries);
}

export function applyRangeLimits(inputs, limits = {}) {
  for (const key of ['radius', 'speed', 'direction']) {
    const input = inputs[`${key}Input`];
    const limit = limits[key];
    if (!input || !limit) continue;
    input.min = String(limit.min);
    input.max = String(limit.max);
    input.step = String(limit.step);
  }
}

export function initInteractiveDemo({
  label,
  sphereEl,
  radiusInput,
  speedInput,
  directionInput,
  valuesEl,
  copyButton,
  snippetCodeEl,
  snippet,
  tags,
  defaults,
  limits,
}) {
  if (snippetCodeEl && snippet) {
    snippetCodeEl.innerHTML = snippet.html;
  }

  applyRangeLimits({ radiusInput, speedInput, directionInput }, limits);

  setupSphereControls({
    sphereEl,
    radiusInput,
    speedInput,
    directionInput,
    valuesEl,
    tags,
    defaults,
  });

  if (copyButton && snippet) {
    setupCopyButton(copyButton, () => snippet.text, {
      defaultAria: 'Copy code',
      copiedAria: 'Copied',
      srText: 'Copy snippet',
    });
  }

  return { label };
}
