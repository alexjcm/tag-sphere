import { setupCopyButton } from '../shared/copy.js';

const tabs = [...document.querySelectorAll('.tab')];
const viewer = document.getElementById('viewer');
const viewerPanel = document.getElementById('viewer-panel');
const title = document.getElementById('title');
const openLink = document.getElementById('open-link');
const copyButton = document.getElementById('copy-install');
const installCommandEl = document.getElementById('install-command');
const INSTALL_COMMAND = 'npm i tag-sphere';
const CLIPBOARD_REQUEST_TYPE = 'tag-sphere:clipboard-write';
const CLIPBOARD_RESPONSE_TYPE = 'tag-sphere:clipboard-write:result';

if (!viewer || !viewerPanel || !title || !openLink || !copyButton || !installCommandEl) {
  throw new Error('Showcase: missing required DOM nodes.');
}

const devHost = import.meta.env.VITE_TAG_SPHERE_DEV_HOST || window.location.hostname || 'localhost';
const devVanillaPort = import.meta.env.VITE_TAG_SPHERE_VANILLA_PORT || '5174';
const devReactPort = import.meta.env.VITE_TAG_SPHERE_REACT_PORT || '5175';
const isDev = import.meta.env.DEV;

const routes = {
  vanilla: { path: isDev ? `http://${devHost}:${devVanillaPort}/` : './vanilla/', title: 'Vanilla JS Demo' },
  react: { path: isDev ? `http://${devHost}:${devReactPort}/` : './react/', title: 'React Demo' },
};

const allowedClipboardOrigins = new Set([window.location.origin, `http://${devHost}:${devVanillaPort}`, `http://${devHost}:${devReactPort}`]);

window.addEventListener('message', async ({ data, origin, source }) => {
  if (data?.type !== CLIPBOARD_REQUEST_TYPE || !allowedClipboardOrigins.has(origin)) return;
  let ok = false;
  try { await navigator.clipboard.writeText(data.text); ok = true; } catch {}
  source?.postMessage({ type: CLIPBOARD_RESPONSE_TYPE, requestId: data.requestId, ok }, origin);
});

function activate(key, sUrl = false) {
  const route = routes[key];
  if (!route) return;
  tabs.forEach(t => {
    const active = t.dataset.target === key;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    if (active) viewerPanel.setAttribute('aria-labelledby', t.id);
  });
  viewer.setAttribute('src', route.path);
  title.textContent = route.title;
  openLink.setAttribute('href', route.path);
  if (sUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    window.history.replaceState({}, '', url);
  }
}

tabs.forEach(tab => {
  tab.onclick = () => activate(tab.dataset.target, true);
  tab.onkeydown = (e) => {
    const i = tabs.indexOf(tab);
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n >= 0) { e.preventDefault(); tabs[n].focus(); activate(tabs[n].dataset.target, true); }
  };
});

activate(new URL(window.location.href).searchParams.get('tab') || 'vanilla');
installCommandEl.textContent = INSTALL_COMMAND;
setupCopyButton(copyButton, () => INSTALL_COMMAND);
