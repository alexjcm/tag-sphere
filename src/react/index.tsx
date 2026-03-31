import { useEffect, useRef } from 'react';
import { tagSphere } from '../index';
import type { TagSphereOptions, TagSphereInstance } from '../types';

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
  radius    = 120,
  speed     = 0.03,
  direction = 135,
  tagClass,
  ...divProps
}: TagSphereProps & React.HTMLAttributes<HTMLDivElement>) {
  const ref      = useRef<HTMLDivElement>(null);
  // Stable ref to always-current options — avoids restarting on every render
  const optsRef  = useRef<TagSphereOptions>({ tags, radius, speed, direction, tagClass });

  // Keep optsRef in sync without triggering the effect
  optsRef.current = { tags, radius, speed, direction, tagClass };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read latest options at mount time (covers StrictMode double-invoke)
    const instance: TagSphereInstance = tagSphere(el, optsRef.current);

    return () => {
      // Cleanup: cancel RAF + remove listeners + remove spans.
      // Called automatically by React on unmount and on StrictMode double-mount.
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — TagSphere uses destroy()+remount pattern for prop changes

  return <div ref={ref} {...divProps} />;
}
