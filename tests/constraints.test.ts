import { describe, it, expect } from 'vitest';
import {
  TagSphereConstraints,
  clamp,
  normalizeDirection,
  normalizeSpeed,
  isFiniteNumber,
} from '../src/constraints';

describe('TagSphereConstraints helpers', () => {
  it('clamp() keeps values within the provided range', () => {
    expect(clamp(10, 20, 30)).toBe(20);
    expect(clamp(25, 20, 30)).toBe(25);
    expect(clamp(35, 20, 30)).toBe(30);
  });

  it('normalizeDirection() maps any degree to [0, 359]', () => {
    expect(normalizeDirection(0)).toBe(0);
    expect(normalizeDirection(359)).toBe(359);
    expect(normalizeDirection(360)).toBe(0);
    expect(normalizeDirection(725)).toBe(5);
    expect(normalizeDirection(-1)).toBe(359);
  });

  it('normalizeSpeed() uses absolute value, clamps to range, and keeps 3 decimals', () => {
    expect(normalizeSpeed(-0.0024)).toBe(0.002);
    expect(normalizeSpeed(-0.0199)).toBe(0.02);
    expect(normalizeSpeed(0.03456)).toBe(0.035);
    expect(normalizeSpeed(1)).toBe(TagSphereConstraints.MAX_SPEED);
  });

  it('isFiniteNumber() accepts only finite numbers', () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(1.2)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isFiniteNumber('1.2')).toBe(false);
  });
});
