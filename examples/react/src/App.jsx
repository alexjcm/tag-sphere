import { useEffect, useMemo, useRef, useState } from 'react';
import { TagSphere } from 'tag-sphere/react';
import { controlLimits, demoDefaults, primaryTags } from '../../shared/demo-data.js';
import { setupCopyButton } from '../../shared/copy.js';
import { snippets } from '../../shared/snippets.js';

export default function App() {
  const reactDirectionDefault = (demoDefaults.direction + 90) % 360;
  const [radius, setRadius] = useState(demoDefaults.radius);
  const [speed, setSpeed] = useState(demoDefaults.speed);
  const [direction, setDirection] = useState(reactDirectionDefault);
  const copyButtonRef = useRef(null);
  const tags = useMemo(() => primaryTags, []);

  useEffect(() => {
    setupCopyButton(copyButtonRef.current, () => snippets.react.text, {
      defaultAria: 'Copy code',
      copiedAria: 'Copied',
      srText: 'Copy snippet',
    });
  }, []);

  return (
    <main className="page">
      <section className="panel">
        <TagSphere
          tags={tags}
          radius={radius}
          speed={speed}
          direction={direction}
          className="sphere"
          style={{ position: 'relative' }}
        />

        <div className="controls">
          <label>
            Radius
            <input
              type="range"
              min={controlLimits.radius.min}
              max={controlLimits.radius.max}
              step={controlLimits.radius.step}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </label>
          <label>
            Speed
            <input
              type="range"
              min={controlLimits.speed.min}
              max={controlLimits.speed.max}
              step={controlLimits.speed.step}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>
          <label>
            Direction
            <input
              type="range"
              min={controlLimits.direction.min}
              max={controlLimits.direction.max}
              step={controlLimits.direction.step}
              value={direction}
              onChange={(e) => setDirection(Number(e.target.value))}
            />
          </label>
          <p className="values">radius {radius}px • speed {speed.toFixed(3)} • direction {direction}°</p>
        </div>
      </section>

      <section className="resource-grid">
        <article className="resource-card">
          <div className="snippet-head">
            <h2>Minimal Example</h2>
            <button ref={copyButtonRef} className="copy-btn" type="button" aria-live="polite" aria-label="Copy code">
              <span className="sr-only">Copy snippet</span>
            </button>
          </div>
          <pre className="code-block">
            <code dangerouslySetInnerHTML={{ __html: snippets.react.html }} />
          </pre>
        </article>
      </section>
    </main>
  );
}
