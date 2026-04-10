// We replace it with a synchronous stub so tests can trigger animation logic.
let rafId = 0;

globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number => {
  rafId += 1;
  setTimeout(() => cb(performance.now()), 0);
  return rafId;
};

globalThis.cancelAnimationFrame = (_id: number): void => {
};

// ─── IntersectionObserver mock ───────────────────────────────────────────────
// jsdom does not implement IntersectionObserver. This stub fires immediately
// with isIntersecting: true on observe() so all RAF-driven tests keep working.
// Individual tests can call io.trigger(el, false/true) to simulate visibility.

export interface MockIO {
  trigger(el: Element, isIntersecting: boolean): void;
  disconnectCalled: boolean;
}

let _lastIO: MockIO | null = null;

// Exposes the most-recently created observer so tests can inspect it.
(globalThis as Record<string, unknown>)['__getLastIO'] = (): MockIO | null => _lastIO;

class MockIntersectionObserver {
  private readonly _cb: IntersectionObserverCallback;
  disconnectCalled = false;

  constructor(cb: IntersectionObserverCallback) {
    this._cb = cb;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    _lastIO = this as unknown as MockIO;
  }

  observe(el: Element): void {
    // Fire as visible by default — matches normal page behaviour.
    this._cb(
      [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }

  /** Manual helper: simulate an intersection change in tests. */
  trigger(el: Element, isIntersecting: boolean): void {
    this._cb(
      [{ isIntersecting, target: el } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }

  unobserve(): void {}

  disconnect(): void {
    this.disconnectCalled = true;
  }
}

(globalThis as Record<string, unknown>)['IntersectionObserver'] = MockIntersectionObserver;
