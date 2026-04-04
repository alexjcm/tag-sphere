/**
 * Runtime constraints and defaults for `tagSphere`.
 */
export class TagSphereConstraints {
  /** Minimum number of tags required to render a sphere. */
  static readonly MIN_TAGS = 1;
  /** Maximum number of tags allowed to preserve readability and smoothness. */
  static readonly MAX_TAGS = 50;

  /** Default sphere radius in pixels. */
  static readonly DEFAULT_RADIUS = 120;
  static readonly MIN_RADIUS = 60;
  static readonly MAX_RADIUS = 200;

  /** Default idle rotation speed in radians-per-frame scale. */
  static readonly DEFAULT_SPEED = 0.010;
  static readonly MIN_SPEED = 0.001;
  static readonly MAX_SPEED = 0.08;
  static readonly SPEED_DECIMALS = 3;

  /**
   * Max hover boost applied to interactive pointer rotation.
   * Lower values produce smoother edge behavior.
   */
  static readonly HOVER_SPEED_MULTIPLIER = 1.6;

  /** Default idle direction in clockwise degrees. */
  static readonly DEFAULT_DIRECTION = 20;
  static readonly MIN_DIRECTION = 0;
  static readonly MAX_DIRECTION = 359;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function normalizeDirection(direction: number): number {
  const fullTurn = TagSphereConstraints.MAX_DIRECTION + 1;
  return ((direction % fullTurn) + fullTurn) % fullTurn;
}

export function normalizeSpeed(value: number): number {
  const bounded = clamp(Math.abs(value), TagSphereConstraints.MIN_SPEED, TagSphereConstraints.MAX_SPEED);
  return Number(bounded.toFixed(TagSphereConstraints.SPEED_DECIMALS));
}
