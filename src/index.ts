import type { TagSphereInstance, TagSphereOptions, Point } from './types';

const MIN_TAGS = 1;
const MAX_TAGS = 50;
const DEFAULT_RADIUS = 120;
const MIN_RADIUS = 60;
const MAX_RADIUS = 200;
const DEFAULT_SPEED = 0.01;
const MIN_SPEED = 0.001;
const MAX_SPEED = 0.08;
const SPEED_DECIMALS = 3;
const DEFAULT_DIRECTION = 20;
const FULL_TURN_DEGREES = 360;
const HOVER_SPEED_MULTIPLIER = 1.6;

const MIN_OPACITY = 0.3;
const OPACITY_RANGE = 0.7;
const MIN_SCALE = 0.75;
const SCALE_RANGE = 0.4;

function fibonacci(n: number): Point[] {
  const points: Point[] = [];
  const spread = Math.sqrt(n * Math.PI);
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(-1 + (2 * i + 1) / n);
    const phi = spread * theta;
    points.push({
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
    });
  }
  return points;
}

function createSpans(el: HTMLElement, tags: string[], tagClass?: string): HTMLSpanElement[] {
  return tags.map((label) => {
    const span = document.createElement('span');
    span.textContent = label;
    span.className = tagClass ? `ts-tag ${tagClass}` : 'ts-tag';
    span.style.position = 'absolute';
    span.style.userSelect = 'none';
    el.appendChild(span);
    return span;
  });
}

export function tagSphere(el: HTMLElement, options: TagSphereOptions): TagSphereInstance {
  if (!el || el.nodeType !== 1) {
    throw new TypeError('tagSphere: invalid element.');
  }

  if (options.tags.length < MIN_TAGS) {
    throw new Error('tagSphere: tags must not be empty.');
  }

  const tags = options.tags.slice(0, MAX_TAGS);
  const radius = Number.isFinite(options.radius)
    ? Math.min(Math.max(options.radius as number, MIN_RADIUS), MAX_RADIUS)
    : DEFAULT_RADIUS;
  const speed = Number.isFinite(options.speed)
    ? Number(
      Math.min(Math.max(Math.abs(options.speed as number), MIN_SPEED), MAX_SPEED)
        .toFixed(SPEED_DECIMALS),
    )
    : DEFAULT_SPEED;
  const direction = Number.isFinite(options.direction)
    ? (((options.direction as number) % FULL_TURN_DEGREES) + FULL_TURN_DEGREES) % FULL_TURN_DEGREES
    : DEFAULT_DIRECTION;

  const spans = createSpans(el, tags, options.tagClass);
  const points = fibonacci(tags.length);

  const rad = (direction * Math.PI) / 180;
  let idleAY = Math.cos(rad) * speed;
  let idleAX = Math.sin(rad) * speed;
  let pointerDx = 0;
  let pointerDy = 0;
  let isHovered = false;
  let rafHandle = 0;
  let destroyed = false;

  function keepPointerDirectionAsIdle(): void {
    const dist = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
    if (dist <= 0) return;
    const inv = speed / dist;
    idleAX = -pointerDy * inv;
    idleAY = pointerDx * inv;
  }

  function render(): void {
    if (destroyed) return;
    let angleX = idleAX;
    let angleY = idleAY;

    if (isHovered) {
      const dist = Math.sqrt(pointerDx * pointerDx + pointerDy * pointerDy);
      const factor = Math.min(dist, 1) * speed * HOVER_SPEED_MULTIPLIER;
      angleX = -pointerDy * factor;
      angleY = pointerDx * factor;
    }

    const cX = Math.cos(angleX);
    const sX = Math.sin(angleX);
    const cY = Math.cos(angleY);
    const sY = Math.sin(angleY);
    const cx = el.offsetWidth / 2;
    const cy = el.offsetHeight / 2;

    for (let i = 0; i < spans.length; i++) {
      const point = points[i];
      const x = point.x * cY + point.z * sY;
      const z = -point.x * sY + point.z * cY;
      const py = point.y;
      const y = py * cX - z * sX;
      const nextZ = py * sX + z * cX;
      point.x = x;
      point.y = y;
      point.z = nextZ;

      const depth = (nextZ + 1) / 2;
      const span = spans[i];
      span.style.left = `${(cx + x * radius - span.offsetWidth / 2).toFixed(1)}px`;
      span.style.top = `${(cy + y * radius - span.offsetHeight / 2).toFixed(1)}px`;
      span.style.opacity = (MIN_OPACITY + OPACITY_RANGE * depth).toFixed(3);
      span.style.fontSize = `${(MIN_SCALE + SCALE_RANGE * depth).toFixed(3)}em`;
      span.style.zIndex = String(Math.round(depth * 100));
    }

    rafHandle = requestAnimationFrame(render);
  }

  function onMouseMove(e: MouseEvent): void {
    const r = el.getBoundingClientRect();
    pointerDx = (e.clientX - r.left - r.width / 2) / radius;
    pointerDy = (e.clientY - r.top - r.height / 2) / radius;
  }

  function onMouseEnter(): void {
    isHovered = true;
  }

  function onMouseLeave(): void {
    keepPointerDirectionAsIdle();
    isHovered = false;
  }

  function onTouchMove(e: TouchEvent): void {
    const touch = e.touches[0];
    if (!touch) return;
    const r = el.getBoundingClientRect();
    pointerDx = (touch.clientX - r.left - r.width / 2) / radius;
    pointerDy = (touch.clientY - r.top - r.height / 2) / radius;
    isHovered = true;
  }

  function onTouchEnd(): void {
    keepPointerDirectionAsIdle();
    pointerDx = 0;
    pointerDy = 0;
    isHovered = false;
  }

  el.addEventListener('mousemove', onMouseMove);
  el.addEventListener('mouseenter', onMouseEnter);
  el.addEventListener('mouseleave', onMouseLeave);
  el.addEventListener('touchmove', onTouchMove, { passive: true });
  el.addEventListener('touchend', onTouchEnd, { passive: true });

  rafHandle = requestAnimationFrame(render);

  return {
    destroy(): void {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(rafHandle);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      for (const span of spans) span.remove();
    },
  };
}
