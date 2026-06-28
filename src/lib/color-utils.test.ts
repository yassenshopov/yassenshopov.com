import { describe, it, expect } from 'vitest';
import { boostColor } from './color-utils';

describe('boostColor', () => {
  it('returns a comma-separated RGB string', () => {
    const result = boostColor('128,64,32');
    const parts = result.split(',');
    expect(parts).toHaveLength(3);
    parts.forEach((p) => {
      const n = Number(p);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(255);
    });
  });

  it('boosts saturation (output differs from input)', () => {
    const input = '100,80,60';
    const result = boostColor(input);
    expect(result).not.toBe(input);
  });

  it('handles grayscale input without crashing', () => {
    const result = boostColor('128,128,128');
    expect(result).toMatch(/^\d+,\d+,\d+$/);
  });

  it('handles extreme values', () => {
    expect(() => boostColor('0,0,0')).not.toThrow();
    expect(() => boostColor('255,255,255')).not.toThrow();
  });
});
