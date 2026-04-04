import { useEffect, useMemo, useRef } from 'react';
import { tagSphere } from '../index';
import type { TagSphereOptions, TagSphereInstance } from '../types';
import { TagSphereConstraints } from '../constraints';

export type TagSphereProps = TagSphereOptions;

/**
 * React wrapper for tag-sphere.
 *
 * The host `<div>` needs `position: relative` in its CSS.
 * Pass `style` or `className` props to control its size and layout.
 *
 * @example
 * <TagSphere tags={['Astro', 'TypeScript']} radius={120} speed={0.03} />
 */
export function TagSphere({
  tags,
  radius    = TagSphereConstraints.DEFAULT_RADIUS,
  speed     = TagSphereConstraints.DEFAULT_SPEED,
  direction = TagSphereConstraints.DEFAULT_DIRECTION,
  tagClass,
  ...divProps
}: TagSphereProps & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  // Compare tags by value so equivalent arrays do not trigger unnecessary re-init.
  const tagsKey = useMemo(() => JSON.stringify(tags), [tags]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const options: TagSphereOptions = { tags, radius, speed, direction, tagClass };
    const instance: TagSphereInstance = tagSphere(el, options);

    return () => {
      // Cleanup: cancel RAF + remove listeners + remove spans.
      // Called on unmount and before every options-driven re-init.
      instance.destroy();
    };
  }, [tagsKey, tags, radius, speed, direction, tagClass]);

  return <div ref={ref} {...divProps} />;
}
