import { tagSphere } from '../dist/index.js';

const DEMO_BOUNDS = {
  MIN_RADIUS: 60,
  MAX_RADIUS: 200,
  MIN_SPEED: 0.001,
  MAX_SPEED: 0.08,
  MIN_DIRECTION: 0,
  MAX_DIRECTION: 359,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function resolveBounds() {
  if (!import.meta?.env?.DEV) return DEMO_BOUNDS;

  try {
    const { TagSphereConstraints } = await import('../src/constraints.ts');
    return {
      MIN_RADIUS: TagSphereConstraints.MIN_RADIUS,
      MAX_RADIUS: TagSphereConstraints.MAX_RADIUS,
      MIN_SPEED: TagSphereConstraints.MIN_SPEED,
      MAX_SPEED: TagSphereConstraints.MAX_SPEED,
      MIN_DIRECTION: TagSphereConstraints.MIN_DIRECTION,
      MAX_DIRECTION: TagSphereConstraints.MAX_DIRECTION,
    };
  } catch {
    return DEMO_BOUNDS;
  }
}

function applySliderBounds(bounds) {
  const radius = document.getElementById('ctrl-radius');
  const speed = document.getElementById('ctrl-speed');
  const direction = document.getElementById('ctrl-direction');

  if (radius) {
    radius.min = String(bounds.MIN_RADIUS);
    radius.max = String(bounds.MAX_RADIUS);
  }
  if (speed) {
    speed.min = String(bounds.MIN_SPEED);
    speed.max = String(bounds.MAX_SPEED);
  }
  if (direction) {
    direction.min = String(bounds.MIN_DIRECTION);
    direction.max = String(bounds.MAX_DIRECTION);
  }
}

const TAGS_DEFAULT = [
  'ChatGPT', 'TikTok', 'YouTube', 'Instagram', 'Netflix', 'Spotify',
  'WhatsApp', 'Amazon', 'iPhone', 'Tesla', 'Bitcoin', 'AI',
];
const TAGS_GLASS = [
  'Reels', 'Streaming', 'Gaming', 'Podcasts', 'E-commerce', 'Cloud',
  'Neo', 'Electric Cars', 'Cybersecurity', 'Crypto', 'Smartwatch', 'VR',
];

const state = { radius: 120, speed: 0.002, direction: 20 };

let defaultInstance;
let glassInstance;

function initDefault(extra = {}) {
  if (defaultInstance) defaultInstance.destroy();
  const el = document.getElementById('sphere-default');
  if (!el) return;
  defaultInstance = tagSphere(el, { tags: TAGS_DEFAULT, ...state, ...extra });
}

function initGlass() {
  if (glassInstance) glassInstance.destroy();
  const el = document.getElementById('sphere-glass');
  if (!el) return;
  glassInstance = tagSphere(el, {
    tags: TAGS_GLASS,
    radius: 120,
    speed: 0.008,
    direction: 35,
  });
}

function syncSliders() {
  document.getElementById('ctrl-radius').value = String(state.radius);
  document.getElementById('ctrl-speed').value = String(state.speed);
  document.getElementById('ctrl-direction').value = String(state.direction);
  document.getElementById('val-radius').textContent = String(state.radius);
  document.getElementById('val-speed').textContent = state.speed.toFixed(3);
  document.getElementById('val-direction').textContent = `${state.direction}°`;
}

function wireSlider(id, key, fmt) {
  const input = document.getElementById(`ctrl-${id}`);
  const label = document.getElementById(`val-${id}`);
  if (!input || !label) return;

  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    state[key] = v;
    label.textContent = fmt(v);
    initDefault();
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function bindCopyButton(buttonId, getText, copiedLabel, onCopiedStateChange) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  const originalLabel = btn.getAttribute('aria-label') || '';
  const originalTitle = btn.getAttribute('title') || '';

  btn.addEventListener('click', async () => {
    const text = getText();
    if (!text) return;

    await copyText(text);

    btn.classList.add('copied');
    if (onCopiedStateChange) onCopiedStateChange(true);
    btn.setAttribute('aria-label', copiedLabel);
    btn.setAttribute('title', copiedLabel);
    window.setTimeout(() => {
      btn.classList.remove('copied');
      if (onCopiedStateChange) onCopiedStateChange(false);
      btn.setAttribute('aria-label', originalLabel);
      btn.setAttribute('title', originalTitle);
    }, 1200);
  });
}

function initCopyButtons() {
  const codeBlock = document.getElementById('vanilla-code');
  const vanillaCopyIconPath = document.querySelector('#copy-vanilla-btn svg path');
  const installCopyIconPath = document.querySelector('#copy-install-btn svg path');
  const copyPathD = 'M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z';
  const copiedPathD = 'M20.285 6.709a1 1 0 0 1 0 1.414l-9.192 9.192a1 1 0 0 1-1.414 0L3.715 11.35a1 1 0 1 1 1.414-1.414l5.257 5.257 8.485-8.484a1 1 0 0 1 1.414 0Z';

  bindCopyButton(
    'copy-vanilla-btn',
    () => codeBlock?.textContent?.trim() || '',
    'Code copied',
    (isCopied) => {
      if (!vanillaCopyIconPath) return;
      vanillaCopyIconPath.setAttribute('d', isCopied ? copiedPathD : copyPathD);
    },
  );
  bindCopyButton(
    'copy-install-btn',
    () => 'npm install tag-sphere',
    'Install command copied',
    (isCopied) => {
      if (!installCopyIconPath) return;
      installCopyIconPath.setAttribute('d', isCopied ? copiedPathD : copyPathD);
    },
  );
}

async function bootstrap() {
  const bounds = await resolveBounds();
  applySliderBounds(bounds);

  state.radius = clamp(state.radius, bounds.MIN_RADIUS, bounds.MAX_RADIUS);
  state.speed = clamp(state.speed, bounds.MIN_SPEED, bounds.MAX_SPEED);
  state.direction = clamp(state.direction, bounds.MIN_DIRECTION, bounds.MAX_DIRECTION);

  wireSlider('radius',    'radius',    v => v);
  wireSlider('speed',     'speed',     v => v.toFixed(3));
  wireSlider('direction', 'direction', v => `${v}°`);

  syncSliders();
  initDefault();
  initGlass();
  initCopyButtons();
}

bootstrap();
