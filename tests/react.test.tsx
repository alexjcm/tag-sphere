import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { TagSphere } from '../src/react/index';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const defaultStyle: React.CSSProperties = {
  width:    300,
  height:   300,
  position: 'relative',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('<TagSphere />', () => {

  // ── Mount / unmount ────────────────────────────────────────────────────────

  it('mounts without throwing an error', () => {
    expect(() =>
      render(<TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />)
    ).not.toThrow();
  });

  it('renders the host <div> in the document', () => {
    const { container } = render(
      <TagSphere tags={['Astro', 'React']} style={defaultStyle} />
    );
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('unmounts without throwing — destroy() is called on cleanup', () => {
    const { unmount } = render(
      <TagSphere tags={['A', 'B']} style={defaultStyle} />
    );
    expect(() => unmount()).not.toThrow();
  });

  it('after unmount all .ts-tag spans are removed from the DOM', () => {
    const { container, unmount } = render(
      <TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />
    );

    // Verify spans exist before unmount
    expect(container.querySelectorAll('.ts-tag').length).toBeGreaterThan(0);

    unmount();

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(0);
  });

  // ── Re-render ──────────────────────────────────────────────────────────────

  it('re-render with different props does not throw', () => {
    const { rerender } = render(
      <TagSphere tags={['A', 'B']} style={defaultStyle} />
    );
    expect(() =>
      rerender(<TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />)
    ).not.toThrow();
  });

  it('re-render does not produce duplicate span sets (no double initialisation)', () => {
    const { container, rerender } = render(
      <TagSphere tags={['A', 'B']} style={defaultStyle} />
    );

    const countBefore = container.querySelectorAll('.ts-tag').length;

    rerender(<TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />);

    // useEffect with [] deps → no re-init on re-render → span count unchanged
    expect(container.querySelectorAll('.ts-tag').length).toBe(countBefore);
  });

  // ── Props forwarding ───────────────────────────────────────────────────────

  it('forwards className to the host <div>', () => {
    const { container } = render(
      <TagSphere tags={['X']} className="my-sphere" style={defaultStyle} />
    );
    expect(container.querySelector('.my-sphere')).not.toBeNull();
  });

  it('forwards data-* attributes to the host <div>', () => {
    const { container } = render(
      <TagSphere tags={['X']} data-testid="sphere" style={defaultStyle} />
    );
    expect(container.querySelector('[data-testid="sphere"]')).not.toBeNull();
  });

  // ── StrictMode safety ──────────────────────────────────────────────────────

  it('survives React StrictMode double-invoke without errors', () => {
    expect(() =>
      render(
        <React.StrictMode>
          <TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />
        </React.StrictMode>
      )
    ).not.toThrow();
  });
});
