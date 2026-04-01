import { tagSphere } from '../dist/index.js';

// ── Tag sets ──────────────────────────────────────────────────────────────
const TAGS_DARK = [
  'TypeScript', 'Astro', 'Vite', 'Node.js', 'React', 'CSS',
  'Vitest', 'tsup', 'ESM', 'Rollup', 'WebAPI', 'HTML',
];
const TAGS_LIGHT = [
  'Design', 'Tailwind', 'Figma', 'SVG', 'A11y', 'WCAG',
  'Motion', 'Grid', 'Flexbox', 'Tokens', 'Scale', 'Color',
];
const TAGS_GLASS = [
  'WebGL', 'WASM', 'Workers', 'Streams', 'Fetch', 'Cache',
  'Signals', 'Proxy', 'Shadow', 'Module', 'CORS', 'PWA',
];

// ── State ─────────────────────────────────────────────────────────────────
const state = {
  dark:  { radius: 120, speed: 0.03, direction: 135 },
  light: { radius: 120, speed: 0.03, direction: 135 },
  glass: { radius: 120, speed: 0.03, direction: 135 },
};

const instances = {};

function init(id, tags, extra = {}) {
  if (instances[id]) instances[id].destroy();
  const el = document.getElementById(`sphere-${id}`);
  instances[id] = tagSphere(el, { tags, ...state[id], ...extra });
}

// ── Initial render ────────────────────────────────────────────────────────
init('dark',  TAGS_DARK);
init('light', TAGS_LIGHT);
init('glass', TAGS_GLASS);

// ── Target selection ──────────────────────────────────────────────────────
let activeTarget = 'dark';

const btns = document.querySelectorAll('.target-btn');
btns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeTarget = btn.dataset.target;
    btns.forEach(b => b.classList.toggle('active', b === btn));
    syncSliders();
  });
});

function syncSliders() {
  const s = state[activeTarget];
  document.getElementById('ctrl-radius').value    = s.radius;
  document.getElementById('ctrl-speed').value     = s.speed;
  document.getElementById('ctrl-direction').value = s.direction;
  document.getElementById('val-radius').textContent    = s.radius;
  document.getElementById('val-speed').textContent     = s.speed.toFixed(3);
  document.getElementById('val-direction').textContent = `${s.direction}°`;
}

// ── Sliders ───────────────────────────────────────────────────────────────
function wireSlider(id, key, fmt) {
  const input = document.getElementById(`ctrl-${id}`);
  const label = document.getElementById(`val-${id}`);
  input.addEventListener('input', () => {
    const v = parseFloat(input.value);
    state[activeTarget][key] = v;
    label.textContent = fmt(v);
    reinit();
  });
}

function reinit() {
  const tagSets = { dark: TAGS_DARK, light: TAGS_LIGHT, glass: TAGS_GLASS };
  init(activeTarget, tagSets[activeTarget]);
}

wireSlider('radius',    'radius',    v => v);
wireSlider('speed',     'speed',     v => v.toFixed(3));
wireSlider('direction', 'direction', v => `${v}°`);
