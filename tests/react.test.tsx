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
  it('after unmount all .ts-tag spans are removed from the DOM', () => {
    const { container, unmount } = render(
      <TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />
    );

    // Verify spans exist before unmount
    expect(container.querySelectorAll('.ts-tag').length).toBeGreaterThan(0);

    unmount();

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(0);
  });

  it('re-render updates the rendered tags when options change', () => {
    const { container, rerender } = render(
      <TagSphere tags={['A', 'B']} style={defaultStyle} />
    );

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(2);

    rerender(<TagSphere tags={['A', 'B', 'C']} style={defaultStyle} />);

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(3);
  });

  it('re-render with equivalent tags values does not duplicate spans', () => {
    const { container, rerender } = render(
      <TagSphere tags={['A', 'B']} style={defaultStyle} />
    );
    expect(container.querySelectorAll('.ts-tag')).toHaveLength(2);

    rerender(<TagSphere tags={['A', 'B']} style={defaultStyle} />);

    expect(container.querySelectorAll('.ts-tag')).toHaveLength(2);
  });

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
