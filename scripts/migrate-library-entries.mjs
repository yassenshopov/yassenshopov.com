#!/usr/bin/env node
/**
 * One-shot migration: collapse top-level reading metadata into an `entries`
 * array on each library item, so re-reads/re-watches can be modelled as
 * separate engagements with the same work.
 *
 * Before:
 *   {
 *     "id": "1",
 *     "status": "completed",
 *     "rating": 5,
 *     "dateCompleted": "2025-06-01",
 *     "dateStarted": "2025-05-15",
 *     "notes": "Great pacing."
 *   }
 *
 * After:
 *   {
 *     "id": "1",
 *     "entries": [
 *       {
 *         "dateStarted": "2025-05-15",
 *         "dateCompleted": "2025-06-01",
 *         "status": "completed",
 *         "rating": 5,
 *         "notes": "Great pacing."
 *       }
 *     ]
 *   }
 *
 * Wishlist items (status === 'want-to-read' | 'want-to-watch') are left alone:
 * they have no reading session yet, so no entries.
 *
 * The script is idempotent — items already migrated (i.e. already have
 * `entries`) are skipped.
 *
 * Usage:
 *   node scripts/migrate-library-entries.mjs           # writes JSON in place
 *   node scripts/migrate-library-entries.mjs --dry-run # prints stats only
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const LIB_JSON = path.join(ROOT, 'src', 'data', 'library-items.json');

const DRY_RUN = process.argv.includes('--dry-run');

const WISHLIST_STATUSES = new Set(['want-to-read', 'want-to-watch']);
const READING_STATUSES = new Set(['completed', 'in-progress', 'on-pause', 'dnf']);

// Preserve a stable key order so the diff is reviewable.
const ENTRY_KEY_ORDER = ['dateStarted', 'dateCompleted', 'status', 'rating', 'notes'];
const TOP_LEVEL_DROP = ['dateStarted', 'dateCompleted', 'rating', 'notes', 'status'];

function buildEntry(item) {
  const entry = {};
  if (item.dateStarted) entry.dateStarted = item.dateStarted;
  if (item.dateCompleted) entry.dateCompleted = item.dateCompleted;
  entry.status = item.status;
  if (item.rating != null) entry.rating = item.rating;
  if (item.notes) entry.notes = item.notes;

  // Re-serialize in canonical key order for deterministic diffs.
  const ordered = {};
  for (const key of ENTRY_KEY_ORDER) {
    if (key in entry) ordered[key] = entry[key];
  }
  return ordered;
}

// Wishlist items shouldn't carry orphan reading metadata under the new
// schema — dates and notes belong inside entries. We keep `rating` on
// wishlist items (typically null) since the card uses it to render "Unrated".
const WISHLIST_DROP = ['dateStarted', 'dateCompleted', 'notes'];

function cleanWishlistItem(item) {
  let changed = false;
  const next = { ...item };
  for (const key of WISHLIST_DROP) {
    if (key in next) {
      delete next[key];
      changed = true;
    }
  }
  return { item: next, changed };
}

function migrateItem(item) {
  if (Array.isArray(item.entries)) {
    return { item, changed: false, reason: 'already-migrated' };
  }

  if (WISHLIST_STATUSES.has(item.status)) {
    const { item: cleaned, changed } = cleanWishlistItem(item);
    return { item: cleaned, changed, reason: changed ? 'wishlist-cleaned' : 'wishlist' };
  }

  if (!READING_STATUSES.has(item.status)) {
    return { item, changed: false, reason: `unknown-status:${item.status}` };
  }

  const entry = buildEntry(item);
  const next = { ...item, entries: [entry] };
  for (const key of TOP_LEVEL_DROP) {
    delete next[key];
  }
  return { item: next, changed: true, reason: 'migrated' };
}

async function main() {
  const raw = await fs.readFile(LIB_JSON, 'utf8');
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) {
    throw new Error('Expected library-items.json to be an array');
  }

  const stats = {
    total: items.length,
    migrated: 0,
    wishlistCleaned: 0,
    wishlist: 0,
    already: 0,
    skipped: 0,
  };
  const migrated = items.map((item) => {
    const { item: nextItem, changed, reason } = migrateItem(item);
    if (reason === 'migrated') stats.migrated += 1;
    else if (reason === 'wishlist-cleaned') stats.wishlistCleaned += 1;
    else if (reason === 'wishlist') stats.wishlist += 1;
    else if (reason === 'already-migrated') stats.already += 1;
    else stats.skipped += 1;
    return nextItem;
  });

  console.log('library-items.json migration:');
  console.log(`  total:              ${stats.total}`);
  console.log(`  migrated:           ${stats.migrated}`);
  console.log(`  wishlist cleaned:   ${stats.wishlistCleaned}`);
  console.log(`  wishlist untouched: ${stats.wishlist}`);
  console.log(`  already done:       ${stats.already}`);
  console.log(`  unknown status:     ${stats.skipped}`);

  if (DRY_RUN) {
    console.log('\n--dry-run: not writing file.');
    return;
  }

  // Match the existing file's trailing newline convention.
  const serialized = JSON.stringify(migrated, null, 2) + '\n';
  await fs.writeFile(LIB_JSON, serialized, 'utf8');
  console.log(`\nWrote ${LIB_JSON}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
