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
const devAstroPort = import.meta.env.VITE_TAG_SPHERE_ASTRO_PORT || '5176';
const isDev = import.meta.env.DEV;

const routes = {
  vanilla: {
    path: isDev ? `http://${devHost}:${devVanillaPort}/` : './vanilla/',
    title: 'Vanilla JS Demo',
  },
  react: {
    path: isDev ? `http://${devHost}:${devReactPort}/` : './react/',
    title: 'React Demo',
  },
  astro: {
    path: isDev ? `http://${devHost}:${devAstroPort}/` : './astro/',
    title: 'Astro Demo',
  },
};

const allowedClipboardOrigins = new Set([
  window.location.origin,
  `http://${devHost}:${devVanillaPort}`,
  `http://${devHost}:${devReactPort}`,
  `http://${devHost}:${devAstroPort}`,
]);

window.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || data.type !== CLIPBOARD_REQUEST_TYPE || typeof data.text !== 'string' || typeof data.requestId !== 'string') {
    return;
  }
  if (!allowedClipboardOrigins.has(event.origin)) {
    return;
  }

  let ok = false;
  try {
    await navigator.clipboard.writeText(data.text);
    ok = true;
  } catch {
    ok = false;
  }

  if (event.source && typeof event.source.postMessage === 'function') {
    event.source.postMessage(
      {
        type: CLIPBOARD_RESPONSE_TYPE,
        requestId: data.requestId,
        ok,
      },
      event.origin,
    );
  }
});

function activate(key) {
  const route = routes[key];
  if (!route) return;

  for (const tab of tabs) {
    const isActive = tab.dataset.target === key;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive) viewerPanel.setAttribute('aria-labelledby', tab.id);
  }

  viewer.dataset.demo = key;
  viewerPanel.dataset.demo = key;
  viewer.setAttribute('src', route.path);
  title.textContent = route.title;
  openLink.setAttribute('href', route.path);
}

function syncUrl(key) {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', key);
  window.history.replaceState({}, '', url);
}

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    const key = tab.dataset.target;
    if (!key) return;
    activate(key);
    syncUrl(key);
  });

  tab.addEventListener('keydown', (event) => {
    const currentIndex = tabs.indexOf(tab);
    if (currentIndex < 0) return;

    let nextIndex = -1;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex < 0) return;
    event.preventDefault();
    const nextTab = tabs[nextIndex];
    const nextKey = nextTab?.dataset.target;
    if (!nextTab || !nextKey) return;
    nextTab.focus();
    activate(nextKey);
    syncUrl(nextKey);
  });
}

const initial = new URL(window.location.href).searchParams.get('tab') || 'vanilla';
activate(initial);

installCommandEl.textContent = INSTALL_COMMAND;

setupCopyButton(copyButton, () => INSTALL_COMMAND, {
  defaultAria: 'Copy install command',
  copiedAria: 'Copied',
  srText: 'Copy install command',
});
