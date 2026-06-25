#!/usr/bin/env node
/**
 * Merge a Notion "Media Ground" CSV export into src/data/library-items.json.
 *
 * - Existing items are preserved and enriched (fills missing author/director/
 *   creator, description, topics, year, externalUrl, dateCompleted, status).
 * - New items are appended with fresh IDs.
 * - Non-Book/Movie/Series categories are skipped.
 * - When --scrape is on, the script tries to fetch a cover image from the
 *   item's URL (IMDB / Amazon / OG-image fallback) and saves it to
 *   public/resources/images/library/<slug>.<ext>. Results are cached in
 *   .cache/library-scrape-cache.json so reruns are cheap.
 *
 * Usage (PowerShell):
 *   node scripts/migrate-library.mjs <csv-path> [flags]
 *
 * Flags:
 *   --dry-run            Don't write library-items.json or download images.
 *   --no-scrape          Skip cover-image scraping entirely.
 *   --force-rescrape     Ignore cache and refetch every cover.
 *   --max-scrape=N       Only attempt at most N scrapes this run (default: all).
 *   --concurrency=N      Parallel scrape workers (default: 3).
 */
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const csvPathArg = args.find((a) => !a.startsWith('--'));
const CSV_PATH =
  csvPathArg ||
  'C:\\Users\\yasse\\Downloads\\78fa716b-42e2-4636-95fd-faa56feeb6fd_ExportBlock-fe36cd45-c9f0-4b49-8fbe-1c603a0ca76e\\extracted\\Media Ground 32638dcb058e4ebeaf325136ce8f3ec4_all.csv';

const LIB_JSON = path.join(ROOT, 'src', 'data', 'library-items.json');
const PUBLIC_IMG_DIR = path.join(ROOT, 'public', 'resources', 'images', 'library');
const CACHE_DIR = path.join(ROOT, '.cache');
const CACHE_PATH = path.join(CACHE_DIR, 'library-scrape-cache.json');

const dryRun = args.includes('--dry-run');
const noScrape = args.includes('--no-scrape');
const force = args.includes('--force-rescrape');
const maxScrape =
  Number(args.find((a) => a.startsWith('--max-scrape='))?.split('=')[1]) || Infinity;
const concurrency = Number(args.find((a) => a.startsWith('--concurrency='))?.split('=')[1]) || 3;

const UA = 'yassenshopov.com-library-importer/1.0 (https://yassenshopov.com)';

// ---------- CSV ----------

/**
 * Tiny RFC 4180-ish CSV parser. Handles quoted fields with commas, newlines,
 * and "" escapes. Returns an array of row objects keyed by header.
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(cur);
        cur = '';
      } else if (c === '\r') {
        // ignore — handled with \n
      } else if (c === '\n') {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = '';
      } else {
        cur += c;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  const [headers, ...data] = rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
  return data.map((r) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = (r[i] ?? '').trim();
    });
    return obj;
  });
}

// ---------- normalization ----------

function stripYearSuffix(title) {
  return title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
}

function extractYear(title) {
  const m = title.match(/\((\d{4})\)\s*$/);
  return m ? Number(m[1]) : undefined;
}

/** Strip an embedded "- S2", "- Season 2", " S2" tail used for per-season rows. */
function stripSeasonSuffix(s) {
  return s.replace(/\s*[-–—]\s*s(?:eason)?\s*\d+\b.*$/i, '').trim();
}

/** Match group used to detect per-season variants. */
function seasonNumber(s) {
  const m = s.match(/\s[-–—]\s*s(?:eason)?\s*(\d+)\b/i);
  return m ? Number(m[1]) : null;
}

/**
 * Punctuation-stripped, case-folded title used as a join key.
 * Keeps unicode letters (Cyrillic, etc.) intact.
 */
function normalizeTitle(s) {
  return stripSeasonSuffix(stripYearSuffix(s))
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\p{P}\p{S}\s]+/gu, ' ')
    .trim();
}

function slugify(title) {
  const ascii = stripSeasonSuffix(stripYearSuffix(title))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (ascii) return ascii;
  // Fall back to a hashed slug when the title has no ASCII letters (e.g. Cyrillic).
  let h = 0;
  for (let i = 0; i < title.length; i++) h = ((h << 5) - h + title.charCodeAt(i)) | 0;
  return `item-${Math.abs(h).toString(36)}`;
}

/**
 * Allocates a unique slug, appending the year (then -2, -3, …) when the base
 * slug is already taken by another item in this run. Seeded with existing
 * coverImage slugs so we never silently overwrite an existing cover.
 */
function makeSlugAllocator(existingItems) {
  const used = new Set();
  for (const it of existingItems) {
    if (!it.coverImage) continue;
    const m = it.coverImage.match(/\/library\/([^/.]+)\./);
    if (m) used.add(m[1]);
  }
  return function allocate(title, year) {
    const base = slugify(title);
    if (!used.has(base)) {
      used.add(base);
      return base;
    }
    if (year) {
      const ys = `${base}-${year}`;
      if (!used.has(ys)) {
        used.add(ys);
        return ys;
      }
    }
    for (let i = 2; i < 999; i++) {
      const t = `${base}-${i}`;
      if (!used.has(t)) {
        used.add(t);
        return t;
      }
    }
    return `${base}-${Math.random().toString(36).slice(2, 8)}`;
  };
}

function stripNotionLinks(field) {
  if (!field) return '';
  // Strips "(https://www.notion.so/...)" segments that Notion appends to
  // relation/author fields in the CSV export.
  return field.replace(/\s*\(https?:\/\/[^)]+\)/g, '').trim();
}

function mapCategory(cat) {
  return { Book: 'book', Movie: 'movie', Series: 'series' }[cat];
}

function mapStatus(notionStatus, type) {
  switch (notionStatus) {
    case 'Done':
      return 'completed';
    case 'In progress':
      return 'in-progress';
    case 'On pause':
      return 'on-pause';
    case 'DNF':
      return 'dnf';
    case 'Not started':
      return type === 'book' ? 'want-to-read' : 'want-to-watch';
    default:
      return undefined;
  }
}

function parseTopics(topic) {
  if (!topic) return [];
  return topic
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const MONTH_MAP = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

/** Pull the earliest "Month YYYY" tag from the Notion "Month(s)" field. */
function parseFirstMonth(monthsField) {
  if (!monthsField) return undefined;
  const cleaned = stripNotionLinks(monthsField);
  const parts = cleaned
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const dates = parts
    .map((p) => {
      const m = p.match(/(\w+)\s+(\d{4})/);
      if (!m) return null;
      const mon = MONTH_MAP[m[1].toLowerCase()];
      if (!mon) return null;
      return `${m[2]}-${mon}-01`;
    })
    .filter(Boolean)
    .sort();
  return dates[0];
}

// ---------- scrape ----------

let cache = {};
function loadCache() {
  if (!fsSync.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fsSync.readFileSync(CACHE_PATH, 'utf-8'));
  } catch {
    return {};
  }
}
async function saveCache() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url, opts = {}, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...opts,
      signal: ctrl.signal,
      headers: {
        'User-Agent': UA,
        'Accept-Language': 'en-US,en;q=0.9',
        ...(opts.headers || {}),
      },
    });
  } finally {
    clearTimeout(t);
  }
}

async function fetchJson(url) {
  try {
    const r = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/** Amazon /dp/{id} where id looks like an ISBN-10 / ISBN-13. */
function extractIsbn(url) {
  if (!url) return null;
  const m = url.match(/\/dp\/([A-Z0-9]{10,13})\b/i);
  if (!m) return null;
  const id = m[1].toUpperCase();
  if (/^\d{9}[\dX]$/.test(id)) return id;
  if (/^97[89]\d{10}$/.test(id)) return id;
  return null;
}

/** Open Library cover lookup. Returns a URL string (used as image source) or null. */
async function olCoverByIsbn(isbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  try {
    const r = await fetchWithTimeout(url);
    if (!r.ok) return null;
    // Sanity check: read content-type or first byte sniff.
    const ct = r.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return null;
    return url;
  } catch {
    return null;
  }
}

/**
 * Wikipedia REST summary API — works for any well-known media item. Returns
 * the page summary JSON, or null on miss / disambiguation pages.
 */
async function wikiSummary(pageName) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageName)}`;
  const data = await fetchJson(url);
  if (!data) return null;
  if (data.type === 'disambiguation') return null;
  return data;
}

async function wikiSearchTitles(query) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=5&srsearch=' +
    encodeURIComponent(query);
  const data = await fetchJson(url);
  return (data?.query?.search || []).map((s) => s.title);
}

function imageFromSummary(s) {
  return s?.originalimage?.source || s?.thumbnail?.source || null;
}

function descriptionMatchesType(s, type, year) {
  const d = (s?.description || '').toLowerCase();
  if (!d) return true; // accept rather than reject when description missing
  if (year && d.includes(String(year))) return true;
  if (type === 'movie') return /\bfilm\b|\bmovie\b/.test(d);
  if (type === 'series')
    return /\btv\b|\btelevision\b|\bseries\b|\bminiseries\b|\banime\b|\bsitcom\b/.test(d);
  if (type === 'book')
    return /\bnovel\b|\bbook\b|\bmemoir\b|\bnon[-\s]?fiction\b|\bfiction\b/.test(d);
  return true;
}

/**
 * Try a sequence of plausible Wikipedia page-name variants for the item,
 * then fall back to the search API.
 */
async function wikiResolve({ title, year, type }) {
  const base = title.replace(/ /g, '_');
  const variants = [];
  if (type === 'movie') {
    if (year) variants.push(`${base}_(${year}_film)`);
    variants.push(`${base}_(film)`);
  } else if (type === 'series') {
    if (year) variants.push(`${base}_(${year}_TV_series)`);
    variants.push(`${base}_(TV_series)`, `${base}_(miniseries)`);
  } else if (type === 'book') {
    if (year) variants.push(`${base}_(${year}_novel)`);
    variants.push(`${base}_(novel)`, `${base}_(book)`);
  }
  variants.push(base);

  for (const v of variants) {
    const s = await wikiSummary(v);
    if (!s) continue;
    const img = imageFromSummary(s);
    if (!img) continue;
    if (descriptionMatchesType(s, type, year)) return img;
  }

  // Fallback: free-text search with type-disambiguating hint.
  const hint =
    type === 'movie' ? 'film' : type === 'series' ? 'TV series' : type === 'book' ? 'book' : '';
  const q = `${title}${year ? ' ' + year : ''} ${hint}`.trim();
  const titles = await wikiSearchTitles(q);
  for (const t of titles) {
    const s = await wikiSummary(t.replace(/ /g, '_'));
    if (!s) continue;
    const img = imageFromSummary(s);
    if (!img) continue;
    if (descriptionMatchesType(s, type, year)) return img;
  }
  return null;
}

/**
 * Returns an image URL for the item, trying type-specific sources first.
 * Result is cached in cache[cacheKey] to keep reruns cheap.
 */
async function resolveCover(item) {
  const key = `${item.type}:${item.title}:${item.year ?? ''}`;
  if (!force && cache[key] !== undefined) return cache[key];

  let url = null;
  try {
    if (item.type === 'book' && item.externalUrl) {
      const isbn = extractIsbn(item.externalUrl);
      if (isbn) url = await olCoverByIsbn(isbn);
    }
    if (!url) url = await wikiResolve(item);
  } catch {
    url = null;
  }
  cache[key] = url;
  return url;
}

function extOf(url) {
  const clean = url.split('?')[0].split('#')[0];
  const m = clean.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i);
  if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  return '.jpg';
}

async function downloadImage(url, destSlug) {
  const ext = extOf(url);
  const fileName = `${destSlug}${ext}`;
  const fullPath = path.join(PUBLIC_IMG_DIR, fileName);
  const publicPath = `/resources/images/library/${fileName}`;

  if (fsSync.existsSync(fullPath) && !force) return publicPath;

  // wikipedia.org images live on upload.wikimedia.org and need a polite UA.
  const res = await fetchWithTimeout(url, {
    headers: { Referer: 'https://en.wikipedia.org/' },
  });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error('image too small');
  await fs.mkdir(PUBLIC_IMG_DIR, { recursive: true });
  await fs.writeFile(fullPath, buf);
  return publicPath;
}

// ---------- main ----------

async function main() {
  console.log(`Reading CSV:    ${CSV_PATH}`);
  console.log(`Library JSON:   ${LIB_JSON}`);
  console.log(
    `Mode:           ${dryRun ? 'DRY RUN' : 'WRITE'} | scrape=${!noScrape} | force=${force} | max=${maxScrape} | concurrency=${concurrency}`
  );

  const csvText = await fs.readFile(CSV_PATH, 'utf-8');
  const rows = parseCsv(csvText);
  console.log(`CSV rows:       ${rows.length}`);

  const existingRaw = await fs.readFile(LIB_JSON, 'utf-8');
  /** @type {Array<any>} */
  const existing = JSON.parse(existingRaw);
  console.log(`Existing items: ${existing.length}`);

  cache = loadCache();

  // -- Pre-process CSV rows ------------------------------------------------
  // 1. Filter to book/movie/series
  // 2. Collapse "Series - S1..SN" rows into one logical item per series
  // 3. Dedup exact (type + title + year) duplicates
  const filtered = [];
  let skippedCategory = 0;
  for (const row of rows) {
    const type = mapCategory(row['Category']);
    if (!type) {
      skippedCategory++;
      continue;
    }
    if (!row['Name']) continue;
    filtered.push({
      raw: row,
      type,
      rawTitle: row['Name'],
      year: extractYear(row['Name']),
      season: seasonNumber(row['Name']),
    });
  }

  // Group rows by (type, normalized title with season stripped).
  /** @type {Map<string, Array<typeof filtered[number]>>} */
  const groups = new Map();
  for (const f of filtered) {
    const k = `${f.type}::${normalizeTitle(f.rawTitle)}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(f);
  }

  /**
   * Each "merged row" represents one logical library item from the CSV side.
   * Per-season series rows are flattened into one merged row.
   */
  const merged = [];
  let collapsedSeasons = 0;
  for (const [, gRows] of groups) {
    const allSeason = gRows.every((r) => r.season != null);
    if (allSeason && gRows.length > 1) {
      // Sort by season desc — the latest season usually drives the "by",
      // url, and completion-date fields. Status is computed across all
      // seasons since a series can be partly watched.
      const sorted = [...gRows].sort((a, b) => (b.season || 0) - (a.season || 0));
      const rep = sorted[0];
      const earliestYear = Math.min(...gRows.map((r) => r.year ?? Infinity));
      const topicSet = new Set();
      let synopsis = '';
      for (const r of gRows) {
        for (const t of parseTopics(r.raw['Topic'])) topicSet.add(t);
        if (!synopsis && r.raw['Synopsis']) synopsis = r.raw['Synopsis'];
      }
      const statuses = gRows.map((r) => r.raw['Status']);
      const hasInProgress = statuses.includes('In progress');
      const hasDone = statuses.includes('Done');
      const hasNotStarted = statuses.includes('Not started');
      let collapsedStatus;
      if (hasInProgress) collapsedStatus = 'in-progress';
      else if (hasDone && hasNotStarted) collapsedStatus = 'in-progress';
      else if (statuses.every((s) => s === 'Done')) collapsedStatus = 'completed';
      else if (statuses.every((s) => s === 'Not started')) collapsedStatus = 'want-to-watch';
      else if (statuses.every((s) => s === 'DNF')) collapsedStatus = 'dnf';
      else collapsedStatus = mapStatus(rep.raw['Status'], rep.type);

      // Use the most recent completed season as the completion date.
      const completedRows = sorted.filter((r) => r.raw['Status'] === 'Done');
      const completedDate = (completedRows[0] || rep).raw['Month(s)']
        ? parseFirstMonth((completedRows[0] || rep).raw['Month(s)'])
        : undefined;

      merged.push({
        type: rep.type,
        displayTitle: stripYearSuffix(stripSeasonSuffix(rep.rawTitle)),
        year: Number.isFinite(earliestYear) ? earliestYear : rep.year,
        status: collapsedStatus,
        by: stripNotionLinks(rep.raw['By']) || stripNotionLinks(rep.raw['By:']),
        synopsis,
        topics: [...topicSet],
        url: rep.raw['URL'] || '',
        completedDate,
        seasonsCount: gRows.length,
      });
      collapsedSeasons += gRows.length - 1;
      continue;
    }

    // Non-season collisions (same normalized title, no season suffixes):
    // keep each row as its own merged item (year disambiguates).
    // Within this group, dedup exact (year) duplicates.
    const seenYears = new Set();
    for (const r of gRows) {
      const yearKey = r.year ?? '';
      const dupeKey = `${yearKey}`;
      if (seenYears.has(dupeKey)) continue;
      seenYears.add(dupeKey);
      const status = mapStatus(r.raw['Status'], r.type);
      merged.push({
        type: r.type,
        displayTitle: stripYearSuffix(r.rawTitle),
        year: r.year,
        status,
        by: stripNotionLinks(r.raw['By']) || stripNotionLinks(r.raw['By:']),
        synopsis: r.raw['Synopsis'] || '',
        topics: parseTopics(r.raw['Topic']),
        url: r.raw['URL'] || '',
        completedDate: parseFirstMonth(r.raw['Month(s)']),
        seasonsCount: 0,
      });
    }
  }

  // -- Index existing items by (type, normalized title) -------------------
  /** @type {Map<string, Array<any>>} */
  const existingByKey = new Map();
  for (const item of existing) {
    const k = `${item.type}::${normalizeTitle(item.title)}`;
    if (!existingByKey.has(k)) existingByKey.set(k, []);
    existingByKey.get(k).push(item);
  }

  let nextId =
    existing.reduce((max, it) => {
      const n = parseInt(it.id, 10);
      return Number.isFinite(n) && n > max ? n : max;
    }, 0) + 1;

  /**
   * Year-aware lookup. Multiple existing items may share a normalized title
   * (e.g. two remakes); pick by year when possible.
   */
  function findExistingMatch(m) {
    const k = `${m.type}::${normalizeTitle(m.displayTitle)}`;
    const bucket = existingByKey.get(k);
    if (!bucket || bucket.length === 0) return null;
    if (bucket.length === 1) {
      const cand = bucket[0];
      const cYear = cand.year ?? extractYear(cand.title);
      if (cYear && m.year && cYear !== m.year) return null;
      return cand;
    }
    // multiple candidates — disambiguate by year
    if (m.year) {
      const exact = bucket.find((c) => (c.year ?? extractYear(c.title)) === m.year);
      if (exact) return exact;
    }
    const noYear = bucket.find((c) => !(c.year ?? extractYear(c.title)));
    if (noYear) return noYear;
    return null;
  }

  function inferLinks(url) {
    if (!url) return {};
    if (/imdb\.com/.test(url)) return { imdb: url };
    if (/amazon\./.test(url)) return { amazon: url };
    if (/goodreads/.test(url)) return { goodreads: url };
    if (/spotify/.test(url)) return { spotify: url };
    if (/youtube/.test(url)) return { youtube: url };
    return { other: url };
  }

  let newCount = 0;
  let enrichedCount = 0;

  for (const m of merged) {
    const match = findExistingMatch(m);
    if (match) {
      // Enrich ONLY where existing fields are missing/empty — never clobber
      // the user's curated values (status, description, rating, etc.).
      if (!match.year && m.year) match.year = m.year;
      if (m.synopsis && !match.description) match.description = m.synopsis;
      if (m.topics.length && (!match.topics || match.topics.length === 0)) {
        match.topics = m.topics;
      }
      if (m.url && !match.externalUrl) match.externalUrl = m.url;
      if (m.by) {
        if (m.type === 'book' && !match.author) match.author = m.by;
        if (m.type === 'movie' && !match.director) match.director = m.by;
        if (m.type === 'series' && !match.creator) match.creator = m.by;
      }
      if (m.status && !match.status) match.status = m.status;
      if (m.completedDate && !match.dateCompleted) match.dateCompleted = m.completedDate;
      enrichedCount++;
    } else {
      const newItem = {
        id: String(nextId++),
        title: m.displayTitle,
        type: m.type,
        rating: null,
        status: m.status || (m.type === 'book' ? 'want-to-read' : 'want-to-watch'),
        genre: [],
        description: m.synopsis,
      };
      if (m.year) newItem.year = m.year;
      if (m.topics.length) newItem.topics = m.topics;
      if (m.url) newItem.externalUrl = m.url;
      if (m.by) {
        if (m.type === 'book') newItem.author = m.by;
        if (m.type === 'movie') newItem.director = m.by;
        if (m.type === 'series') newItem.creator = m.by;
      }
      if (m.completedDate) newItem.dateCompleted = m.completedDate;
      newItem.links = inferLinks(m.url);

      existing.push(newItem);
      const k = `${newItem.type}::${normalizeTitle(newItem.title)}`;
      if (!existingByKey.has(k)) existingByKey.set(k, []);
      existingByKey.get(k).push(newItem);
      newCount++;
    }
  }

  console.log(
    `\nMerge result: ${newCount} new, ${enrichedCount} enriched, ${collapsedSeasons} per-season rows collapsed, ${skippedCategory} skipped (non-book/movie/series)`
  );

  // Second pass: try to populate coverImage for items missing one.
  if (!noScrape) {
    const needCovers = existing.filter(
      (it) => !it.coverImage && (it.type === 'book' || it.type === 'movie' || it.type === 'series')
    );
    const todo = needCovers.slice(0, maxScrape);
    console.log(
      `\nCovers to fetch: ${todo.length} (of ${needCovers.length} missing; cap=${maxScrape})`
    );

    let done = 0;
    let ok = 0;
    let fail = 0;

    const allocate = makeSlugAllocator(existing);
    let cursor = 0;
    async function worker() {
      while (true) {
        const i = cursor++;
        if (i >= todo.length) return;
        const item = todo[i];
        try {
          const coverUrl = await resolveCover(item);
          if (coverUrl) {
            try {
              const slug = allocate(item.title, item.year);
              const publicPath = await downloadImage(coverUrl, slug);
              item.coverImage = publicPath;
              ok++;
            } catch {
              fail++;
            }
          } else {
            fail++;
          }
        } catch {
          fail++;
        }
        done++;
        if (done % 10 === 0 || done === todo.length) {
          console.log(`  ${done}/${todo.length}  ok=${ok}  fail=${fail}`);
          if (!dryRun) await saveCache();
        }
        // Be polite to Wikipedia / Open Library.
        await sleep(250);
      }
    }
    await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
    if (!dryRun) await saveCache();
    console.log(`Cover scrape done: ok=${ok}  fail=${fail}`);
  }

  // Write back.
  if (dryRun) {
    console.log('\nDRY RUN — not writing library-items.json');
  } else {
    await fs.writeFile(LIB_JSON, JSON.stringify(existing, null, 2) + '\n');
    console.log(`\nWrote ${existing.length} items to ${LIB_JSON}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
