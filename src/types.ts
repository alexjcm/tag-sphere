/**
 * Options passed to {@link tagSphere}.
 */
export interface TagSphereOptions {
  /**
   * List of tag labels to render on the sphere.
   * Runtime limits: min 1, max 50 (values above 50 are truncated).
   */
  tags: string[];
  /**
   * Sphere radius in pixels.
   * Runtime clamped to [60, 200].
   * @default 120
   */
  radius?: number;
  /**
   * Idle rotation speed (radians-per-frame scale).
   * Runtime rules: absolute value, 3 decimals, clamped to [0.001, 0.08].
   * @default 0.01
   */
  speed?: number;
  /**
   * Idle rotation direction in clockwise degrees.
   * Normalized at runtime to [0, 359].
   * 0 = right, 90 = down, 180 = left, 270 = up.
   * @default 20
   */
  direction?: number;
  /** Extra CSS class added to every tag `<span>`. */
  tagClass?: string;
  // 🔮 Future: expose minOpacity, minScale, maxScale as options
}

/**
 * Returned by {@link tagSphere} — holds the only public method: `destroy`.
 */
export interface TagSphereInstance {
  /**
   * Cancels the animation loop, removes all event listeners,
   * and deletes the tag spans from the DOM.
   * Safe to call multiple times (idempotent).
   */
  destroy: () => void;
}

/**
 * Internal 3-D point on the unit sphere.
 * Not exported in the public bundle.
 */
export interface Point {
  x: number;
  y: number;
  z: number;
}
