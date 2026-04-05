import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { tagSphere } from '../src/index';

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

function nextFrame(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
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

  it('creates exactly N .ts-tag spans in the container', () => {
    const tags = ['Astro', 'TypeScript', 'React', 'Vitest', 'tsup'];
    const inst = tagSphere(container, { tags });

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(tags.length);

    inst.destroy();
  });
  it('applies tagClass to all spans alongside ts-tag', () => {
    const inst = tagSphere(container, { tags: ['A', 'B', 'C'], tagClass: 'my-tag' });

    const tagged = container.querySelectorAll('.ts-tag.my-tag');
    expect(tagged).toHaveLength(3);

    inst.destroy();
  });

  it('throws when tags is empty', () => {
    expect(() => tagSphere(container, { tags: [] })).toThrow();
  });

  it('throws a clear error when first argument is not a valid HTMLElement', () => {
    expect(() => tagSphere(null as unknown as HTMLElement, { tags: ['A'] }))
      .toThrow('invalid element');
    expect(() => tagSphere({} as unknown as HTMLElement, { tags: ['A'] }))
      .toThrow('invalid element');
  });

  it('truncates tags beyond the max limit', () => {
    const tags = Array.from({ length: 70 }, (_, i) => `Tag-${i}`);
    const inst = tagSphere(container, { tags });
    expect(container.querySelectorAll('.ts-tag')).toHaveLength(50);
    inst.destroy();
  });

  it('normalizes numeric options and renders finite style values', async () => {
    const inst = tagSphere(container, {
      tags: ['A', 'B', 'C'],
      radius: Number.POSITIVE_INFINITY,
      speed: -2,
      direction: -450,
    });

    await nextFrame();

    const span = container.querySelector<HTMLSpanElement>('.ts-tag');
    expect(span).not.toBeNull();
    expect(span?.style.left).not.toContain('NaN');
    expect(span?.style.top).not.toContain('NaN');

    const opacity = Number(span?.style.opacity);
    const fontSize = Number((span?.style.fontSize || '').replace('em', ''));
    expect(opacity).toBeGreaterThanOrEqual(0.3);
    expect(opacity).toBeLessThanOrEqual(1);
    expect(fontSize).toBeGreaterThanOrEqual(0.75);
    expect(fontSize).toBeLessThanOrEqual(1.15);

    inst.destroy();
  });

  it('handles mouse and touch interaction events without breaking the instance', async () => {
    const inst = tagSphere(container, { tags: ['A', 'B', 'C'] });

    container.dispatchEvent(new MouseEvent('mouseenter'));
    container.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 110 }));
    container.dispatchEvent(new MouseEvent('mouseleave'));

    const touchMove = new Event('touchmove');
    Object.defineProperty(touchMove, 'touches', {
      configurable: true,
      value: [{ clientX: 130, clientY: 140 }],
    });
    container.dispatchEvent(touchMove);
    container.dispatchEvent(new Event('touchend'));

    await nextFrame();
    expect(container.querySelectorAll('.ts-tag').length).toBeGreaterThan(0);

    inst.destroy();
  });

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

  it('each span contains the corresponding tag label as text content', () => {
    const tags = ['Astro', 'TypeScript', 'React'];
    const inst = tagSphere(container, { tags });

    const spans = container.querySelectorAll<HTMLSpanElement>('.ts-tag');
    const labels = [...spans].map(s => s.textContent);
    expect(labels).toEqual(expect.arrayContaining(tags));

    inst.destroy();
  });

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
