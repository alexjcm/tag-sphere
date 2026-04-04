import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { tagSphere } from '../src/index';
import { TagSphereConstraints } from '../src/constraints';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeContainer(w = 300, h = 300): HTMLElement {
  const el = document.createElement('div');
  el.style.position = 'relative';
  // jsdom does not compute layout — provide values manually
  Object.defineProperty(el, 'offsetWidth',  { configurable: true, value: w });
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: h });
  document.body.appendChild(el);
  return el;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('tagSphere()', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = makeContainer();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ── Span creation ──────────────────────────────────────────────────────────

  it('creates exactly N .ts-tag spans in the container', () => {
    const tags = ['Astro', 'TypeScript', 'React', 'Vitest', 'tsup'];
    const inst = tagSphere(container, { tags });

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(tags.length);

    inst.destroy();
  });

  it('every span has position: absolute set via JS', () => {
    const inst = tagSphere(container, { tags: ['one', 'two', 'three'] });

    const spans = container.querySelectorAll<HTMLSpanElement>('.ts-tag');
    for (const span of spans) {
      expect(span.style.position).toBe('absolute');
    }

    inst.destroy();
  });

  it('every span has userSelect: none', () => {
    const inst = tagSphere(container, { tags: ['A', 'B'] });

    const spans = container.querySelectorAll<HTMLSpanElement>('.ts-tag');
    for (const span of spans) {
      expect(span.style.userSelect).toBe('none');
    }

    inst.destroy();
  });

  // ── tagClass ───────────────────────────────────────────────────────────────

  it('applies tagClass to all spans alongside ts-tag', () => {
    const inst = tagSphere(container, { tags: ['A', 'B', 'C'], tagClass: 'my-tag' });

    const tagged = container.querySelectorAll('.ts-tag.my-tag');
    expect(tagged).toHaveLength(3);

    inst.destroy();
  });

  it('works without tagClass — spans only have ts-tag class', () => {
    const inst = tagSphere(container, { tags: ['X', 'Y'] });

    const spans = container.querySelectorAll<HTMLSpanElement>('.ts-tag');
    for (const span of spans) {
      expect(span.className).toBe('ts-tag');
    }

    inst.destroy();
  });

  // ── Defaults ───────────────────────────────────────────────────────────────

  it('initialises without error using only required option (tags)', () => {
    const tags = ['Alpha', 'Beta', 'Gamma'];
    expect(() => {
      const inst = tagSphere(container, { tags });
      inst.destroy();
    }).not.toThrow();
  });

  it('accepts all documented defaults (radius 120, speed 0.03, direction 135)', () => {
    const tags = ['A', 'B', 'C'];
    const inst = tagSphere(container, { tags, radius: 120, speed: 0.03, direction: 135 });

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(tags.length);

    inst.destroy();
  });

  // ── Runtime constraints ────────────────────────────────────────────────────

  it('throws when tags is empty', () => {
    expect(() => tagSphere(container, { tags: [] })).toThrow();
  });

  it('truncates tags beyond the max limit', () => {
    const tags = Array.from({ length: 70 }, (_, i) => `Tag-${i}`);
    const inst = tagSphere(container, { tags });
    expect(container.querySelectorAll('.ts-tag')).toHaveLength(TagSphereConstraints.MAX_TAGS);
    inst.destroy();
  });


  // ── destroy() ──────────────────────────────────────────────────────────────

  it('destroy() removes all spans from the DOM', () => {
    const inst = tagSphere(container, { tags: ['A', 'B', 'C'] });

    inst.destroy();

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(0);
  });

  it('destroy() is idempotent — calling it twice does not throw', () => {
    const inst = tagSphere(container, { tags: ['X'] });

    expect(() => {
      inst.destroy();
      inst.destroy();
    }).not.toThrow();
  });

  it('destroy() leaves the container element itself untouched', () => {
    const inst = tagSphere(container, { tags: ['A'] });
    inst.destroy();

    expect(document.body.contains(container)).toBe(true);
  });

  // ── Span content ───────────────────────────────────────────────────────────

  it('each span contains the corresponding tag label as text content', () => {
    const tags = ['Astro', 'TypeScript', 'React'];
    const inst = tagSphere(container, { tags });

    const spans = container.querySelectorAll<HTMLSpanElement>('.ts-tag');
    const labels = [...spans].map(s => s.textContent);
    expect(labels).toEqual(expect.arrayContaining(tags));

    inst.destroy();
  });

  // ── Multiple instances ─────────────────────────────────────────────────────

  it('supports two independent instances on the same page', () => {
    const container2 = makeContainer();
    const tags1 = ['A', 'B'];
    const tags2 = ['X', 'Y', 'Z'];

    const inst1 = tagSphere(container,  { tags: tags1 });
    const inst2 = tagSphere(container2, { tags: tags2 });

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(2);
    expect(container2.querySelectorAll('.ts-tag')).toHaveLength(3);

    inst1.destroy();
    inst2.destroy();

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(0);
    expect(container2.querySelectorAll('.ts-tag')).toHaveLength(0);
  });
});
