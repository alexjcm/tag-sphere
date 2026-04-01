// We replace it with a synchronous stub so tests can trigger animation logic.
let rafId = 0;

globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number => {
  rafId += 1;
  setTimeout(() => cb(performance.now()), 0);
  return rafId;
};

globalThis.cancelAnimationFrame = (_id: number): void => {
};
