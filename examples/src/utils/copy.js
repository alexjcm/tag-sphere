const COPY_ICON = `
<svg class="icon-copy" viewBox="0 0 16 16" aria-hidden="true">
  <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h6.5c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0 1 8.25 15h-6.5A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25Z"></path>
  <path fill="currentColor" d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5C14.216 1 15 1.784 15 2.75v6.5A1.75 1.75 0 0 1 13.25 11h-1.5a.75.75 0 0 1 0-1.5h1.5a.25.25 0 0 0 .25-.25v-6.5a.25.25 0 0 0-.25-.25h-6.5a.25.25 0 0 0-.25.25v1.5a.75.75 0 0 1-1.5 0Z"></path>
</svg>`;

const COPIED_ICON = `
<svg class="icon-copied" viewBox="0 0 16 16" aria-hidden="true">
  <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0L2.22 7.28a.75.75 0 1 1 1.06-1.06L7 9.94l5.72-5.72a.75.75 0 0 1 1.06 0"></path>
</svg>`;



export function hydrateCopyButton(
  button,
  {
    srText = 'Copy',
  } = {},
) {
  if (!button || button.querySelector('.icon-copy')) return;
  button.innerHTML = `${COPY_ICON}${COPIED_ICON}<span class="sr-only">${srText}</span>`;
}

function clearTimer(button) {
  const timerId = button.dataset.copyTimerId;
  if (!timerId) return;
  window.clearTimeout(Number(timerId));
  delete button.dataset.copyTimerId;
}

function setIdle(button, defaultAria) {
  button.classList.remove('is-copied');
  button.setAttribute('aria-label', defaultAria);
}

function setCopied(button, copiedAria) {
  button.classList.add('is-copied');
  button.setAttribute('aria-label', copiedAria);
}

export async function copyWithFeedback(
  button,
  text,
  {
    defaultAria = 'Copy code',
    copiedAria = 'Copied',
    duration = 1200,
  } = {},
) {
  if (!button) return false;

  try {
    await navigator.clipboard.writeText(text);
    clearTimer(button);
    setCopied(button, copiedAria);

    const timeout = window.setTimeout(() => {
      setIdle(button, defaultAria);
      clearTimer(button);
    }, duration);

    button.dataset.copyTimerId = String(timeout);
    return true;
  } catch {
    clearTimer(button);
    setIdle(button, defaultAria);
    return false;
  }
}

export function setupCopyButton(
  button,
  textProvider,
  options = {},
) {
  if (!button || typeof textProvider !== 'function') return;

  const { defaultAria = 'Copy code', srText = 'Copy' } = options;
  hydrateCopyButton(button, { srText });
  setIdle(button, defaultAria);

  button.addEventListener('click', async () => {
    const text = textProvider();
    await copyWithFeedback(button, text, options);
  });
}
