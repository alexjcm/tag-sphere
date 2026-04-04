import type { TagSphereOptions, TagSphereInstance, Point } from './types';
import {
  TagSphereConstraints,
  clamp,
  isFiniteNumber,
  normalizeDirection,
  normalizeSpeed,
} from './constraints';

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
  // Validate and normalize runtime options up-front so the render loop can stay
  // branch-light and deterministic on every frame.
  if (options.tags.length < TagSphereConstraints.MIN_TAGS) {
    throw new Error(
      `tagSphere: "tags" must contain at least ${TagSphereConstraints.MIN_TAGS} item.`,
    );
  }

  const tags = options.tags.slice(0, TagSphereConstraints.MAX_TAGS);
  const radius = isFiniteNumber(options.radius)
    ? clamp(options.radius, TagSphereConstraints.MIN_RADIUS, TagSphereConstraints.MAX_RADIUS)
    : TagSphereConstraints.DEFAULT_RADIUS;

  const speed = isFiniteNumber(options.speed)
    ? normalizeSpeed(options.speed)
    : TagSphereConstraints.DEFAULT_SPEED;

  const direction = isFiniteNumber(options.direction)
    ? normalizeDirection(options.direction)
    : TagSphereConstraints.DEFAULT_DIRECTION;

  const { tagClass } = options;

  const spans  = createSpans(el, tags, tagClass);
  let   points = fibonacci(tags.length);

  // Decompose idle direction (degrees → radians) into X/Y rotation per frame.
  // These are mutable so pointer interaction can update idle direction on leave.
  const rad    = (direction * Math.PI) / 180;
  let idleAY =  Math.cos(rad) * speed; // around Y axis
  let idleAX =  Math.sin(rad) * speed; // around X axis

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
      // Speed proportional to cursor distance from center, capped for smoothness.
      const dist   = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
      const factor = Math.min(dist, 1) * speed * TagSphereConstraints.HOVER_SPEED_MULTIPLIER;
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
    // Normalize by sphere radius so distance=1 means cursor is at sphere edge.
    pointerDx = (e.clientX - r.left - r.width  / 2) / radius;
    pointerDy = (e.clientY - r.top  - r.height / 2) / radius;
  }

  function onMouseEnter(): void {
    isHovered = true;
  }

  function onMouseLeave(): void {
    const dist = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
    if (dist > 0) {
      // Keep the last pointer direction as the new idle direction
      // while preserving the configured base speed.
      const nx = pointerDx / dist;
      const ny = pointerDy / dist;
      idleAX = -ny * speed;
      idleAY =  nx * speed;
    }
    isHovered = false;
  }

  function onTouchMove(e: TouchEvent): void {
    const touch = e.touches[0];
    if (!touch) return;
    const r   = el.getBoundingClientRect();
    // Keep touch coordinates in the same normalized space as mouse movement.
    pointerDx = (touch.clientX - r.left - r.width  / 2) / radius;
    pointerDy = (touch.clientY - r.top  - r.height / 2) / radius;
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
