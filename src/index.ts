import type { TagSphereOptions, TagSphereInstance, Point } from './types';

// ─── Depth constants (hardcoded) ──────────────────────────────────────────────
// 🔮 Future: expose as TagSphereOptions (minOpacity, minScale, maxScale)
const MIN_OPACITY = 0.3;
const MAX_OPACITY = 1.0;
const MIN_SCALE   = 0.75; // em
const MAX_SCALE   = 1.15; // em

// ─── Math helpers ─────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Distribute N points uniformly on the unit sphere using the
 * Fibonacci spherical lattice (golden-angle spiral).
 * O(N) — no clustering at poles.
 */
function fibonacci(n: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(-1 + (2 * i + 1) / n);
    const phi   = Math.sqrt(n * Math.PI) * theta;
    pts.push({
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    });
  }
  return pts;
}

function rotateX(p: Point, a: number): Point {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function rotateY(p: Point, a: number): Point {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

// ─── DOM helpers ──────────────────────────────────────────────────────────────

function createSpans(
  el: HTMLElement,
  tags: string[],
  tagClass?: string,
): HTMLSpanElement[] {
  return tags.map(label => {
    const span = document.createElement('span');
    span.textContent = label;
    span.className   = tagClass ? `ts-tag ${tagClass}` : 'ts-tag';
    // Guaranteed by JS — container needs position:relative (documented)
    span.style.position   = 'absolute';
    span.style.cursor     = 'default';
    span.style.userSelect = 'none';
    el.appendChild(span);
    return span;
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Renders a rotating 3-D tag sphere inside `el`.
 *
 * @param el      - Host element. Must have `position: relative` set in CSS.
 * @param options - Configuration options.
 * @returns       An instance with a single `destroy()` method.
 */
export function tagSphere(
  el: HTMLElement,
  options: TagSphereOptions,
): TagSphereInstance {
  const {
    tags,
    radius    = 120,
    speed     = 0.03,
    direction = 135,
    tagClass,
  } = options;

  const spans  = createSpans(el, tags, tagClass);
  let   points = fibonacci(tags.length);

  // Decompose idle direction (degrees → radians) into X/Y rotation per frame
  const rad    = (direction * Math.PI) / 180;
  const idleAY =  Math.cos(rad) * speed; // around Y axis
  const idleAX =  Math.sin(rad) * speed; // around X axis

  // Pointer state — updated by event handlers, consumed by RAF
  let pointerDx = 0;
  let pointerDy = 0;
  let isHovered = false;

  let rafHandle = 0;
  let destroyed = false;

  // ─── Render loop ────────────────────────────────────────────────────────────

  function render(): void {
    if (destroyed) return; // guard for cancelled RAF stubs (e.g. in tests)
    let angleX: number;
    let angleY: number;

    if (isHovered) {
      // Speed proportional to cursor distance from center, capped at speed * 4
      const dist   = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
      const factor = Math.min(dist, 1) * speed * 4;
      angleX = -pointerDy * factor;
      angleY =  pointerDx * factor;
    } else {
      angleX = idleAX;
      angleY = idleAY;
    }

    points = points.map(p => rotateX(rotateY(p, angleY), angleX));

    const cx = el.offsetWidth  / 2;
    const cy = el.offsetHeight / 2;

    for (let i = 0; i < spans.length; i++) {
      const p     = points[i];
      const depth = (p.z + 1) / 2; // normalised to [0, 1]
      const span  = spans[i];

      span.style.left     = `${(cx + p.x * radius - span.offsetWidth  / 2).toFixed(1)}px`;
      span.style.top      = `${(cy + p.y * radius - span.offsetHeight / 2).toFixed(1)}px`;
      span.style.opacity  = lerp(MIN_OPACITY, MAX_OPACITY, depth).toFixed(3);
      span.style.fontSize = `${lerp(MIN_SCALE, MAX_SCALE, depth).toFixed(3)}em`;
      span.style.zIndex   = String(Math.round(depth * 100));
    }

    rafHandle = requestAnimationFrame(render);
  }

  // ─── Event handlers ─────────────────────────────────────────────────────────

  function onMouseMove(e: MouseEvent): void {
    const r  = el.getBoundingClientRect();
    // Normalize by radius diameter so distance=1 means cursor is at sphere edge
    pointerDx = (e.clientX - r.left - r.width  / 2) / (radius * 2);
    pointerDy = (e.clientY - r.top  - r.height / 2) / (radius * 2);
  }

  function onMouseEnter(): void {
    isHovered = true;
  }

  function onMouseLeave(): void {
    isHovered = false;
    pointerDx = 0;
    pointerDy = 0;
  }

  function onTouchMove(e: TouchEvent): void {
    const touch = e.touches[0];
    if (!touch) return;
    const r   = el.getBoundingClientRect();
    pointerDx = (touch.clientX - r.left - r.width  / 2) / (radius * 2);
    pointerDy = (touch.clientY - r.top  - r.height / 2) / (radius * 2);
  }

  function onTouchEnd(): void {
    pointerDx = 0;
    pointerDy = 0;
  }

  el.addEventListener('mousemove',  onMouseMove);
  el.addEventListener('mouseenter', onMouseEnter);
  el.addEventListener('mouseleave', onMouseLeave);
  el.addEventListener('touchmove',  onTouchMove, { passive: true });
  el.addEventListener('touchend',   onTouchEnd,  { passive: true });

  rafHandle = requestAnimationFrame(render);

  // ─── Destroy ────────────────────────────────────────────────────────────────

  return {
    destroy(): void {
      if (destroyed) return; // idempotent
      destroyed = true;

      cancelAnimationFrame(rafHandle);

      el.removeEventListener('mousemove',  onMouseMove);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);

      for (const span of spans) span.remove();
    },
  };
}
