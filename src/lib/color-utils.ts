/**
 * Boost an "r,g,b" string's saturation and lightness for a more vivid tint.
 * Used to generate header gradients from cover art dominant colors.
 */
export function boostColor(rgb: string, satBoost = 1.3, lightBoost = 1.15): string {
  let [r, g, b] = rgb.split(',').map(Number);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  s = Math.min(s * satBoost, 1);
  const lBoosted = Math.min(l * lightBoost, 1);
  const q = lBoosted < 0.5 ? lBoosted * (1 + s) : lBoosted + s - lBoosted * s;
  const p = 2 * lBoosted - q;
  function hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const rr = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const gg = Math.round(hue2rgb(p, q, h) * 255);
  const bb = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `${rr},${gg},${bb}`;
}
