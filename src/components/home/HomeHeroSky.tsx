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

type CloudParams = {
  nFreq: number;
  warp: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

/* Paint one cumulus slice (at time z), pixel by pixel, into `target`. */
function paintCloud(target: HTMLCanvasElement, noise: Noise3, p: CloudParams, z: number) {
  const w = target.width;
  const h = target.height;
  const ctx = target.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const shadow = [168, 186, 210]; // cool, soft underside
  const lit = [255, 255, 255]; // sunlit top

  for (let y = 0; y < h; y += 1) {
    const v = y / h;
    const topLight = 1 - v;
    for (let x = 0; x < w; x += 1) {
      const u = x / w;
      const dx = (u - p.cx) / p.rx;
      const dy = (v - p.cy) / p.ry;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mask = 1 - smoothstep(0.5, 1.05, dist);
      if (mask <= 0) continue;

      // Domain warp (also evolving with z) → turbulent, natural boundaries.
      const wx = x + p.warp * h * (noise(x * p.nFreq * 2, y * p.nFreq * 2, z) - 0.5);
      const wy = y + p.warp * h * (noise(x * p.nFreq * 2 + 50, y * p.nFreq * 2 + 50, z) - 0.5);
      const n = fbm3(noise, wx * p.nFreq, wy * p.nFreq, z, 4);

      // Fuller body: more of the masked area reads as solid, edges stay wispy.
      const shape = n * (0.62 + 0.95 * mask);
      const alpha = smoothstep(0.4, 0.62, shape);
      if (alpha <= 0.003) continue;

      const bright = clamp01(0.5 + 0.4 * topLight + 0.5 * (shape - 0.5));
      const idx = (y * w + x) * 4;
      data[idx] = shadow[0] + (lit[0] - shadow[0]) * bright;
      data[idx + 1] = shadow[1] + (lit[1] - shadow[1]) * bright;
      data[idx + 2] = shadow[2] + (lit[2] - shadow[2]) * bright;
      data[idx + 3] = Math.round(alpha * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
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
  { left: -0.1, width: 0.3, opacity: 1, duration: 95, start: 0.1, seed: 1207 },
  { left: 0.04, width: 0.18, opacity: 0.95, duration: 130, start: 0.52, seed: 3391 },
  { left: 0.13, width: 0.18, opacity: 1, duration: 78, start: 0.8, seed: 5023 },
  { left: 0.67, width: 0.16, opacity: 0.96, duration: 145, start: 0.3, seed: 6619 },
  { left: 0.8, width: 0.3, opacity: 1, duration: 70, start: 0.62, seed: 7741 },
  { left: 0.72, width: 0.2, opacity: 0.95, duration: 112, start: 0.18, seed: 9133 },
  { left: 0.91, width: 0.18, opacity: 0.92, duration: 160, start: 0.92, seed: 10487 },
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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      clouds = CLOUDS.map((def) => {
        const w = Math.max(140, Math.round(def.width * W));
        const h = Math.round(w / 1.9);
        // Low internal resolution so we can re-render every frame; upscaled on draw.
        const iw = Math.min(Math.max(90, Math.round(w * 0.42)), 150);
        const ih = Math.round(iw / 1.9);
        const noise = makeNoise3(def.seed);
        const r = seeded(def.seed * 17 + 3);
        // Mask kept well inside the buffer (cy + ry stays < ~0.95) so the cloud
        // never touches an edge and gets cropped.
        const params: CloudParams = {
          nFreq: (2.5 + r() * 0.8) / ih,
          warp: 0.14,
          cx: 0.5,
          cy: 0.5 + (r() - 0.5) * 0.04,
          rx: 0.46 + r() * 0.05,
          ry: 0.4 + r() * 0.04,
        };
        const buf = document.createElement('canvas');
        buf.width = iw;
        buf.height = ih;
        const phase = def.seed % 97;
        paintCloud(buf, noise, params, phase);
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
          paintCloud(c.buf, c.noise, c.params, z + c.phase); // re-render each frame → fluid morph
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
      <div className="absolute inset-0 transition-opacity duration-700 dark:opacity-0 [.olive_&]:opacity-0">
        <div className="absolute inset-0" style={{ backgroundColor: '#1683db' }} />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* ----------------------------- DARK: flat night sky + stars ----------------------------- */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 dark:opacity-100">
        <div className="absolute inset-0" style={{ backgroundColor: '#0a0e1a' }} />
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
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 [.olive_&]:opacity-100">
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
