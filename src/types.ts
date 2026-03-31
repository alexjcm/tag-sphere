/**
 * Options passed to {@link tagSphere}.
 */
export interface TagSphereOptions {
  /** List of tag labels to render on the sphere. */
  tags: string[];
  /** Sphere radius in pixels. @default 120 */
  radius?: number;
  /** Idle rotation speed (radians-per-frame scale). @default 0.03 */
  speed?: number;
  /**
   * Idle rotation direction in clockwise degrees.
   * 0 = right, 90 = down, 135 = diagonal bottom-right.
   * @default 135
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
