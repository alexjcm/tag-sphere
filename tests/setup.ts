// RAF mock — jsdom does not implement requestAnimationFrame
// We replace it with a synchronous stub so tests can trigger animation logic.
let rafId = 0;

globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number => {
  rafId += 1;
  // Execute on next tick so useEffect / RAF chains resolve in tests
  setTimeout(() => cb(performance.now()), 0);
  return rafId;
};

globalThis.cancelAnimationFrame = (_id: number): void => {
  // no-op: synchronous RAF stubs don't need real cancellation
};
