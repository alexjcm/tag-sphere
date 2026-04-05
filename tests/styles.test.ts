import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const testDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(testDir, '..');

function readText(path: string): string {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

describe('style entrypoints', () => {
  it('exports styled preset css entrypoints', () => {
    const pkg = JSON.parse(readText('package.json')) as {
      exports: Record<string, string | Record<string, string>>;
    };

    expect(pkg.exports['./styles']).toBe('./styles/styles.css');
    expect(pkg.exports['./styles.css']).toBe('./styles/styles.css');
    expect(pkg.exports['./base']).toBeUndefined();
    expect(pkg.exports['./base.css']).toBeUndefined();
    expect(pkg.exports['./theme']).toBeUndefined();
    expect(pkg.exports['./theme.css']).toBeUndefined();
  });

  it('keeps styles.css as styled default preset', () => {
    const preset = readText('styles/styles.css');

    expect(preset).toContain('display: inline-block;');
    expect(preset).toContain('background: var(--ts-bg');
    expect(preset).toContain('border: var(--ts-border');
  });

  it('retains a legacy css file alias for transition', () => {
    const legacy = readText('styles/tag-sphere.css');
    expect(legacy).toContain("@import './styles.css';");
  });
});
