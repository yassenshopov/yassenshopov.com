'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';

/* Deterministic PRNG so the server and client render identical markup
 * (no Math.random → no hydration mismatch). */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/* ----------------------------------------------------------------------------
 * 3D value-noise field + fBm — the engine behind the clouds.
 * Sampling a slowly moving slice (the z axis = time) through the 3D volume
 * makes the cloud shapes billow and churn instead of staying frozen.
 * -------------------------------------------------------------------------- */
function makeNoise3(seed: number) {
  const rnd = seeded(seed);
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];

  const lattice = new Float32Array(256);
  for (let i = 0; i < 256; i += 1) lattice[i] = rnd();

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const valueAt = (ix: number, iy: number, iz: number) =>
    lattice[perm[(ix + perm[(iy + perm[iz & 255]) & 255]) & 255]];

  return (x: number, y: number, z: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const z0 = Math.floor(z);
    const u = fade(x - x0);
    const v = fade(y - y0);
    const w = fade(z - z0);
    const c000 = valueAt(x0, y0, z0);
    const c100 = valueAt(x0 + 1, y0, z0);
    const c010 = valueAt(x0, y0 + 1, z0);
    const c110 = valueAt(x0 + 1, y0 + 1, z0);
    const c001 = valueAt(x0, y0, z0 + 1);
    const c101 = valueAt(x0 + 1, y0, z0 + 1);
    const c011 = valueAt(x0, y0 + 1, z0 + 1);
    const c111 = valueAt(x0 + 1, y0 + 1, z0 + 1);
    const x00 = lerp(c000, c100, u);
    const x10 = lerp(c010, c110, u);
    const x01 = lerp(c001, c101, u);
    const x11 = lerp(c011, c111, u);
    return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
  };
}

type Noise3 = (x: number, y: number, z: number) => number;

function fbm3(noise: Noise3, x: number, y: number, z: number, octaves: number) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    sum += amp * noise(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

type CloudLobe = { ox: number; oy: number; rx: number; ry: number };

type CloudParams = {
  nFreq: number;
  warp: number;
  lobes: CloudLobe[];
  edgeChaos: number;
};

function lobeCentroid(lobes: CloudLobe[]) {
  let ox = 0;
  let oy = 0;
  for (const l of lobes) {
    ox += l.ox;
    oy += l.oy;
  }
  const n = lobes.length;
  return { cx: ox / n, cy: oy / n };
}

function lobeBounds(lobes: CloudLobe[]) {
  const { cx, cy } = lobeCentroid(lobes);
  let rx = 0;
  let ry = 0;
  for (const l of lobes) {
    rx = Math.max(rx, Math.abs(l.ox - cx) + l.rx);
    ry = Math.max(ry, Math.abs(l.oy - cy) + l.ry);
  }
  return { cx, cy, rx, ry };
}

/* Merged soft blobs + noise carve — breaks the uniform ellipse silhouette. */
function cloudSilhouetteMask(
  u: number,
  v: number,
  p: CloudParams,
  noise: Noise3,
  z: number,
  w: number,
  h: number
): number {
  let merge = 0;
  for (const l of p.lobes) {
    const dx = (u - l.ox) / l.rx;
    const dy = (v - l.oy) / l.ry;
    const d = Math.sqrt(dx * dx + dy * dy);
    merge = Math.max(merge, 1 - smoothstep(0.28, 1.04, d));
  }
  if (merge <= 0) return 0;

  const x = u * w;
  const y = v * h;
  const wu = u + p.warp * 0.5 * (noise(x * p.nFreq * 2.6, y * p.nFreq * 2.6, z + 3) - 0.5);
  const wv =
    v + p.warp * 0.5 * (noise(x * p.nFreq * 2.6 + 37, y * p.nFreq * 2.6 + 37, z + 3) - 0.5);
  const carve = fbm3(noise, wu * 5.4, wv * 5.4, z * 0.45, 3);
  const { cx, cy } = lobeCentroid(p.lobes);
  const angle = Math.atan2(v - cy, u - cx);
  const rim = fbm3(noise, Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, z * 0.25 + 9, 3);
  const wisp = fbm3(noise, wu * 11, wv * 11, z + 21, 2);

  const organic =
    merge * (0.56 + 0.54 * carve) * (0.76 + p.edgeChaos * (rim - 0.5)) + merge * wisp * 0.12;
  return clamp01(organic);
}

type CloudFieldSample = {
  alpha: number;
  bright: number;
  shape: number;
};

/* Shared density field for one cumulus slice (time = z). */
function sampleCloudField(
  noise: Noise3,
  p: CloudParams,
  z: number,
  u: number,
  v: number,
  w: number,
  h: number
): CloudFieldSample | null {
  const mask = cloudSilhouetteMask(u, v, p, noise, z, w, h);
  if (mask <= 0) return null;

  const x = u * w;
  const y = v * h;
  const topLight = 1 - v;
  const wx = x + p.warp * h * (noise(x * p.nFreq * 2, y * p.nFreq * 2, z) - 0.5);
  const wy = y + p.warp * h * (noise(x * p.nFreq * 2 + 50, y * p.nFreq * 2 + 50, z) - 0.5);
  const n = fbm3(noise, wx * p.nFreq, wy * p.nFreq, z, 4);
  const shape = n * (0.72 + 1.12 * mask);
  const alpha = smoothstep(0.24, 0.48, shape);
  if (alpha <= 0.003) return null;

  const bright = clamp01(0.62 + 0.32 * topLight + 0.45 * (shape - 0.5));
  return { alpha, bright, shape };
}

/** Sparse → dense letters; a few symbols mixed in at render time. */
const CLOUD_ASCII_LETTERS = 'aceorstwxzmnluvijdfghkpbqy';
const CLOUD_ASCII_SYMBOLS = '`.,:;+*#@()';
const CLOUD_ASCII_TRAIL = '.,:;*+';

/* Paint one cloud as a grid of white monospace glyphs (morphs each frame via z). */
function paintCloudAscii(target: HTMLCanvasElement, noise: Noise3, p: CloudParams, z: number) {
  const w = target.width;
  const h = target.height;
  const ctx = target.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  const cell = 5;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  ctx.font = `500 ${cell}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textBaseline = 'top';

  const shadow = [188, 206, 228];
  const lit = [255, 255, 255];

  for (let row = 0; row < rows; row += 1) {
    const v = (row + 0.5) / rows;
    for (let col = 0; col < cols; col += 1) {
      const u = (col + 0.5) / cols;
      let sample = sampleCloudField(noise, p, z, u, v, w, h);
      let trail = false;

      const bounds = lobeBounds(p.lobes);
      if (!sample && v > bounds.cy) {
        const dx = (u - bounds.cx) / (bounds.rx * 0.75);
        const dy = (v - bounds.cy) / (bounds.ry * 1.4);
        const inWake = dx * dx + dy * dy <= 1.15;
        const depth = (v - bounds.cy) / bounds.ry;
        if (inWake && depth > 0.15 && depth < 1.15) {
          const trailNoise = fbm3(noise, u * 14, v * 9 + z * 0.25, z + 40, 2);
          const trailAlpha = smoothstep(0.42, 0.78, trailNoise) * (1 - depth * 0.55) * 0.42;
          if (trailAlpha > 0.04) {
            sample = { alpha: trailAlpha, bright: 0.88, shape: 0.28 };
            trail = true;
          }
        }
      }

      if (!sample) continue;

      const { alpha, bright, shape } = sample;
      const jitter = noise(col * 0.67, row * 0.91, z * 2.1);
      const t = clamp01(shape * 0.82 + jitter * 0.18);
      const trailIdx = Math.floor(jitter * CLOUD_ASCII_TRAIL.length) % CLOUD_ASCII_TRAIL.length;
      let ch: string;
      if (trail) {
        ch = CLOUD_ASCII_TRAIL[trailIdx];
      } else if (jitter < 0.2) {
        const symIdx = Math.min(
          CLOUD_ASCII_SYMBOLS.length - 1,
          Math.floor(t * CLOUD_ASCII_SYMBOLS.length)
        );
        ch = CLOUD_ASCII_SYMBOLS[symIdx];
      } else {
        const letIdx = Math.min(
          CLOUD_ASCII_LETTERS.length - 1,
          Math.floor(t * CLOUD_ASCII_LETTERS.length)
        );
        ch = CLOUD_ASCII_LETTERS[letIdx];
      }

      const r = Math.round(shadow[0] + (lit[0] - shadow[0]) * bright);
      const g = Math.round(shadow[1] + (lit[1] - shadow[1]) * bright);
      const b = Math.round(shadow[2] + (lit[2] - shadow[2]) * bright);
      const a = Math.min(1, alpha * (trail ? 0.7 : 1.06));
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillText(ch, col * cell, row * cell);
    }
  }
}

type CloudDef = {
  left: number;
  width: number;
  opacity: number;
  duration: number;
  start: number;
  seed: number;
};

// Clouds are biased to the left/right thirds so they don't pass behind the
// centred hero copy. Each entry's span (left → left+width) stays out of the
// roughly 0.32–0.66 centre band.
const CLOUDS: CloudDef[] = [
  { left: -0.1, width: 0.28, opacity: 1, duration: 95, start: 0.1, seed: 1207 },
  { left: 0.04, width: 0.17, opacity: 0.95, duration: 130, start: 0.52, seed: 3391 },
  { left: 0.1, width: 0.17, opacity: 1, duration: 78, start: 0.8, seed: 5023 },
  { left: 0.67, width: 0.15, opacity: 0.96, duration: 145, start: 0.3, seed: 6619 },
  { left: 0.78, width: 0.28, opacity: 1, duration: 70, start: 0.62, seed: 7741 },
  { left: 0.7, width: 0.19, opacity: 0.95, duration: 112, start: 0.18, seed: 9133 },
  { left: 0.9, width: 0.17, opacity: 0.92, duration: 160, start: 0.92, seed: 10487 },
];

function buildStarField(count: number, seed: number, maxSize: number) {
  const rand = seeded(seed);
  const shadows: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    const spread = (rand() * maxSize).toFixed(2);
    const bright = (0.55 + rand() * 0.45).toFixed(2);
    shadows.push(`${x}vw ${y}vh 0 ${spread}px rgba(255,255,255,${bright})`);
  }
  return shadows.join(',');
}

// Sizes intentionally span a wide range (14 → 64px) for depth.
const LEAVES = [
  { left: '8%', size: 58, duration: 15, delay: 0, x: '9vw', rot: 260, op: 0.95, color: '#9aad4e' },
  {
    left: '20%',
    size: 20,
    duration: 18,
    delay: 2.5,
    x: '-5vw',
    rot: -220,
    op: 0.8,
    color: '#c2cf6a',
  },
  {
    left: '34%',
    size: 44,
    duration: 12,
    delay: 5,
    x: '12vw',
    rot: 300,
    op: 0.92,
    color: '#7e9442',
  },
  {
    left: '48%',
    size: 15,
    duration: 21,
    delay: 1.2,
    x: '-8vw',
    rot: 200,
    op: 0.7,
    color: '#b6c563',
  },
  {
    left: '60%',
    size: 52,
    duration: 13,
    delay: 6.5,
    x: '8vw',
    rot: -280,
    op: 0.95,
    color: '#8ea34a',
  },
  {
    left: '72%',
    size: 24,
    duration: 17,
    delay: 3.4,
    x: '-6vw',
    rot: 240,
    op: 0.82,
    color: '#cdd87f',
  },
  {
    left: '85%',
    size: 64,
    duration: 11,
    delay: 8,
    x: '11vw',
    rot: -320,
    op: 0.96,
    color: '#7e9442',
  },
  {
    left: '94%',
    size: 18,
    duration: 22,
    delay: 4.2,
    x: '-4vw',
    rot: 180,
    op: 0.72,
    color: '#b6c563',
  },
];

export function HomeHeroSky() {
  const reduce = useReducedMotion();
  const nearStars = useMemo(() => buildStarField(70, 12345, 1.1), []);
  const farStars = useMemo(() => buildStarField(120, 98765, 0.4), []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext('2d');
    if (!context) return;
    // Non-null aliases so the animation closures keep the narrowed types.
    const canvas = canvasEl;
    const ctx = context;

    const root = document.documentElement;
    let raf = 0;
    let disposed = false;
    let W = 0;
    let H = 0;

    type LiveCloud = {
      noise: Noise3;
      params: CloudParams;
      buf: HTMLCanvasElement;
      phase: number; // per-cloud z offset so they don't churn in sync
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      opacity: number;
    };
    let clouds: LiveCloud[] = [];

    // Every cloud is re-rendered every frame against a slowly advancing time
    // slice (zSpeed) so the interior morphs continuously and fluidly. zSpeed is
    // tiny on purpose — a gentle, barely-there billow.
    const zSpeed = 0.05;
    let t = 0;

    function build() {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      clouds = CLOUDS.map((def) => {
        const w = Math.max(148, Math.round(def.width * W));
        const h = Math.round(w / 1.82);
        // Low internal resolution so we can re-render every frame; upscaled on draw.
        const iw = Math.min(Math.max(112, Math.round(w * 0.58)), 200);
        const ih = Math.round(iw / 1.82);
        const noise = makeNoise3(def.seed);
        const r = seeded(def.seed * 17 + 3);
        const lobeCount = 3 + Math.floor(r() * 4);
        const lobes: CloudLobe[] = [];
        for (let i = 0; i < lobeCount; i += 1) {
          lobes.push({
            ox: 0.5 + (r() - 0.5) * 0.64,
            oy: 0.47 + (r() - 0.5) * 0.5,
            rx: 0.14 + r() * 0.24,
            ry: 0.12 + r() * 0.22,
          });
        }
        const params: CloudParams = {
          nFreq: (2.4 + r() * 0.75) / ih,
          warp: 0.14 + r() * 0.08,
          lobes,
          edgeChaos: 0.4 + r() * 0.32,
        };
        const buf = document.createElement('canvas');
        buf.width = iw;
        buf.height = ih;
        const phase = def.seed % 97;
        paintCloudAscii(buf, noise, params, phase);
        const travel = H + h + 80;
        return {
          noise,
          params,
          buf,
          phase,
          x: Math.round(def.left * W),
          y: H + 40 - def.start * travel,
          w,
          h,
          speed: travel / def.duration,
          opacity: def.opacity,
        };
      });
    }

    function isLight() {
      return !root.classList.contains('dark') && !root.classList.contains('olive');
    }

    function paintStatic() {
      ctx.clearRect(0, 0, W, H);
      if (!isLight()) return;
      for (const c of clouds) {
        ctx.globalAlpha = c.opacity;
        ctx.drawImage(c.buf, c.x, c.y, c.w, c.h);
      }
      ctx.globalAlpha = 1;
    }

    let last = performance.now();
    function frame(now: number) {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, W, H);
      if (isLight()) {
        const z = t * zSpeed;
        for (const c of clouds) {
          paintCloudAscii(c.buf, c.noise, c.params, z + c.phase); // re-render each frame → fluid morph
          c.y -= c.speed * dt;
          if (c.y + c.h < -40) c.y = H + 40;
          ctx.globalAlpha = c.opacity;
          ctx.drawImage(c.buf, c.x, c.y, c.w, c.h);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    }

    build();
    if (reduce) {
      paintStatic();
    } else {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (reduce) paintStatic();
      }, 200);
    }
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [reduce]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* ----------------------------- LIGHT: blue sky + procedural clouds ----------------------------- */}
      <div className="absolute inset-0 transition-opacity duration-700 dark:opacity-0 in-[.olive]:opacity-0">
        <div className="absolute inset-0" style={{ backgroundColor: '#11a1da' }} />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* ----------------------------- DARK: flat night sky + stars ----------------------------- */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 dark:opacity-100">
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)' }} />
        <div
          className="hero-stars"
          style={
            {
              boxShadow: farStars,
              animation: reduce
                ? undefined
                : 'hero-star-sway 90s ease-in-out infinite alternate, hero-twinkle 6s ease-in-out infinite',
              '--sway': '-28px',
              '--tw-min': 0.4,
              '--tw-max': 0.9,
            } as CSSProperties
          }
        />
        <div
          className="hero-stars"
          style={
            {
              boxShadow: nearStars,
              animation: reduce
                ? undefined
                : 'hero-star-sway 70s ease-in-out infinite alternate-reverse, hero-twinkle 4.2s ease-in-out infinite',
              '--sway': '34px',
              '--tw-min': 0.55,
              '--tw-max': 1,
            } as CSSProperties
          }
        />
      </div>

      {/* ----------------------------- OLIVE: canopy + falling leaves ----------------------------- */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 in-[.olive]:opacity-100">
        <div className="absolute inset-0" style={{ backgroundColor: 'oklch(0.17 0.02 130)' }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(40vw 30vh at 72% 6%, oklch(0.82 0.135 125 / 0.12) 0%, transparent 58%), radial-gradient(46vw 34vh at 18% 0%, oklch(0.82 0.135 125 / 0.08) 0%, transparent 60%)',
          }}
        />
        {LEAVES.map((leaf, i) => {
          const restTransform = `translate3d(${leaf.x}, ${30 + i * 7}vh, 0) rotate(${leaf.rot / 3}deg)`;
          return (
            <span
              key={`leaf-${i}`}
              className="absolute top-0"
              style={
                {
                  left: leaf.left,
                  width: `${leaf.size}px`,
                  height: `${leaf.size}px`,
                  opacity: reduce ? leaf.op : undefined,
                  animation: reduce
                    ? undefined
                    : `hero-leaf-fall ${leaf.duration}s linear ${leaf.delay}s infinite`,
                  transform: reduce ? restTransform : undefined,
                  '--leaf-x': leaf.x,
                  '--leaf-rot': `${leaf.rot}deg`,
                  '--leaf-op': leaf.op,
                } as CSSProperties
              }
            >
              <svg viewBox="0 0 24 24" width={leaf.size} height={leaf.size} fill={leaf.color}>
                <path d="M12 2C6.5 5.5 3.8 11 5.6 17.2c.5 1.7 1.6 3.3 3.4 4.3 0.2-4.2 1.4-8.2 4.3-11.2-2.1 3.2-3.1 7.1-3 11.2 4.1-1 7.2-4.2 8.1-9C23.2 8 21 4 16 2c-1.4-.6-2.7-.6-4 0z" />
                <path
                  d="M12 4c-1.5 4-2.2 8.6-2 13.5"
                  stroke={leaf.color}
                  strokeOpacity="0.35"
                  strokeWidth="0.6"
                  fill="none"
                />
              </svg>
            </span>
          );
        })}
      </div>
    </div>
  );
}
