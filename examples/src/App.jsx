import { useEffect, useMemo, useRef, useState } from 'react';
import { TagSphere } from 'tag-sphere/react';
import { controlLimits, demoDefaults, primaryTags } from './data/demo-data.js';
import { setupCopyButton } from './utils/copy.js';
import { snippets } from './utils/snippets.js';

export default function App() {
  const reactDirectionDefault = (demoDefaults.direction + 90) % 360;
  const [radius, setRadius] = useState(demoDefaults.radius);
  const [speed, setSpeed] = useState(demoDefaults.speed);
  const [direction, setDirection] = useState(reactDirectionDefault);
  
  const snippetCopyRef = useRef(null);
  const installCopyRef = useRef(null);
  const tags = useMemo(() => primaryTags, []);

  useEffect(() => {
    if (snippetCopyRef.current) {
      setupCopyButton(snippetCopyRef.current, () => snippets.react.text, {
        defaultAria: 'Copy code',
        copiedAria: 'Copied',
        srText: 'Copy snippet',
      });
    }

    if (installCopyRef.current) {
      setupCopyButton(installCopyRef.current, () => 'npm i tag-sphere', {
        defaultAria: 'Copy install command',
        copiedAria: 'Copied',
        srText: 'Copy install',
      });
    }
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <h1>tag-sphere</h1>
        <p className="subtitle">Compatible with Astro, Vanilla JS, scaling smoothly everywhere. This interactive React demo is just a showcase.</p>
      </header>

      <section className="showcase-tools">
        <div className="install-row">
          <div className="install-group">
            <code className="install-code">npm i tag-sphere</code>
            <button ref={installCopyRef} className="copy-btn" type="button" aria-label="Copy install command">
              <span className="sr-only">Copy install</span>
            </button>
          </div>
          <a className="repo-link" href="https://github.com/alexjcm/tag-sphere" target="_blank" rel="noopener noreferrer">
            <svg className="repo-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.33c-2.24.49-2.71-1.08-2.71-1.08-.36-.93-.9-1.17-.9-1.17-.73-.5.06-.49.06-.49.81.06 1.24.84 1.24.84.72 1.24 1.9.88 2.36.67.07-.52.28-.88.5-1.08-1.79-.2-3.67-.9-3.67-4.02 0-.89.32-1.62.83-2.18-.08-.2-.36-1.02.08-2.12 0 0 .68-.22 2.22.83a7.7 7.7 0 0 1 4.04 0c1.54-1.05 2.22-.83 2.22-.83.44 1.1.16 1.92.08 2.12.52.56.83 1.29.83 2.18 0 3.13-1.88 3.81-3.68 4.01.29.25.55.74.55 1.5l-.01 2.22c0 .21.15.46.55.38A8 8 0 0 0 8 0"></path>
            </svg>
            GitHub
          </a>
        </div>
      </section>

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
            <button ref={snippetCopyRef} className="copy-btn" type="button" aria-live="polite" aria-label="Copy code">
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
