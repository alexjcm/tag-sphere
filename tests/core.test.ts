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

  it('throws when tags is empty', () => {
    expect(() => tagSphere(container, { tags: [] })).toThrow();
  });

  it('throws a clear error when first argument is not a valid HTMLElement', () => {
    expect(() => tagSphere(null as unknown as HTMLElement, { tags: ['A'] }))
      .toThrow('invalid element');
    expect(() => tagSphere({} as unknown as HTMLElement, { tags: ['A'] }))
      .toThrow('invalid element');
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
    // Transform encodes both position (translate) and depth (scale).
    expect(span?.style.transform).not.toContain('NaN');
    expect(span?.style.transform).toMatch(/translate\(.+\) scale\(.+\)/);

    const opacity = Number(span?.style.opacity);
    // Depth effect: scale is now in transform, not fontSize.
    const scaleMatch = span?.style.transform.match(/scale\(([^)]+)\)/);
    const scaleVal = scaleMatch ? Number(scaleMatch[1]) : 0;
    expect(opacity).toBeGreaterThanOrEqual(0.3);
    expect(opacity).toBeLessThanOrEqual(1);
    expect(scaleVal).toBeGreaterThanOrEqual(0.75);
    expect(scaleVal).toBeLessThanOrEqual(1.15);

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

  // ─── Phase 1: Delta Time ──────────────────────────────────────────────────

  it('span positions remain finite across multiple consecutive RAF frames', async () => {
    const inst = tagSphere(container, { tags: ['A', 'B', 'C'], speed: 0.01 });

    // Three successive frames — exercises delta accumulation math.
    await nextFrame();
    await nextFrame();
    await nextFrame();

    const spans = container.querySelectorAll<HTMLSpanElement>('.ts-tag');
    for (const span of spans) {
      expect(span.style.transform).not.toContain('NaN');
      const opacity = Number(span.style.opacity);
      expect(Number.isFinite(opacity)).toBe(true);
    }

    inst.destroy();
  });

  it('renders valid style values on the first frame (lastTs = 0 path)', async () => {
    // Create a fresh instance — lastTs starts at 0 and first delta uses TARGET_FRAME_MS.
    const inst = tagSphere(container, { tags: ['X', 'Y'] });
    await nextFrame();

    const span = container.querySelector<HTMLSpanElement>('.ts-tag');
    expect(span).not.toBeNull();
    expect(span?.style.transform).not.toContain('NaN');
    const opacity = Number(span?.style.opacity);
    expect(Number.isFinite(opacity)).toBe(true);
    expect(opacity).toBeGreaterThanOrEqual(0.3);
    expect(opacity).toBeLessThanOrEqual(1);

    inst.destroy();
  });

  // ─── Phase 2: IntersectionObserver ───────────────────────────────────────

  it('destroy() disconnects the IntersectionObserver', () => {
    const inst = tagSphere(container, { tags: ['A', 'B'] });
    const io = (globalThis as Record<string, () => { disconnectCalled: boolean }>)['__getLastIO']();

    expect(io.disconnectCalled).toBe(false);
    inst.destroy();
    expect(io.disconnectCalled).toBe(true);
  });

  it('RAF does not start when the element is initially out-of-viewport', async () => {
    // Override observe() to fire with isIntersecting: false for this test.
    const OriginalIO = (globalThis as Record<string, unknown>)['IntersectionObserver'];
    (globalThis as Record<string, unknown>)['IntersectionObserver'] = class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe(el: Element): void {
        this.cb(
          [{ isIntersecting: false, target: el } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect(): void {}
      unobserve(): void {}
    };

    const inst = tagSphere(container, { tags: ['A', 'B', 'C'] });
    await nextFrame();

    // RAF never started → spans exist in DOM but have no animated styles yet.
    const span = container.querySelector<HTMLSpanElement>('.ts-tag');
    expect(span).not.toBeNull();
    // transform is empty because render() never ran (left:50% is set by createSpans, not render).
    expect(span?.style.transform).toBe('');

    inst.destroy();
    // Restore the global mock.
    (globalThis as Record<string, unknown>)['IntersectionObserver'] = OriginalIO;
  });

  it('RAF resumes with valid styles after re-entering the viewport', async () => {
    const inst = tagSphere(container, { tags: ['A', 'B', 'C'] });
    const io = (globalThis as Record<string, () => {
      trigger: (el: Element, v: boolean) => void;
      disconnectCalled: boolean;
    }>)['__getLastIO']();

    // Simulate leaving viewport → pause.
    io.trigger(container, false);
    // Simulate re-entering → resume with fresh lastTs.
    io.trigger(container, true);
    await nextFrame();

    const span = container.querySelector<HTMLSpanElement>('.ts-tag');
    expect(span?.style.transform).not.toContain('NaN');
    const opacity = Number(span?.style.opacity);
    expect(Number.isFinite(opacity)).toBe(true);

    inst.destroy();
  });
});
