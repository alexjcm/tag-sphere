import { tagSphere } from './index';
import type { TagSphereInstance } from './types';

const instances = new Map<HTMLElement, TagSphereInstance>();

function cleanupDetached(): void {
  for (const [el, instance] of instances) {
    if (!el.isConnected) {
      instance.destroy();
      instances.delete(el);
    }
  }
}

function initContainer(el: HTMLElement): void {
  const prev = instances.get(el);
  if (prev) prev.destroy();

  const d = el.dataset;
  const tags: string[] = JSON.parse(d.tags ?? '[]');

  el.innerHTML = ''; // Clear pre-rendered static spans

  const instance = tagSphere(el, {
    tags,
    radius: d.radius ? Number(d.radius) : 120,
    speed: d.speed ? Number(d.speed) : 0.01,
    direction: d.direction ? Number(d.direction) : 20,
    tagClass: d.tagClass || undefined,
  });

  instances.set(el, instance);
}

export function initTagSphereAstro(): void {
  cleanupDetached();
  document
    .querySelectorAll<HTMLElement>('[data-tag-sphere]')
    .forEach(initContainer);
}
