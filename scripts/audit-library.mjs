#!/usr/bin/env node
/**
 * Audit + repair pass for src/data/library-items.json.
 *
 * Usage:
 *   node scripts/audit-library.mjs               # report only
 *   node scripts/audit-library.mjs --apply       # clear bad coverImage refs so
 *                                                # migrate-library.mjs will re-fetch
 *
 * Clears coverImage on items whose path is missing on disk OR collides with
 * another item's path. Then a normal `node scripts/migrate-library.mjs` run
 * will re-resolve them.
 */
import fs from 'node:fs';
import path from 'node:path';

const LIB_PATH = 'src/data/library-items.json';
const apply = process.argv.includes('--apply');

const items = JSON.parse(fs.readFileSync(LIB_PATH, 'utf-8'));

const groups = new Map();
for (const it of items) {
  if (!it.coverImage) continue;
  if (!groups.has(it.coverImage)) groups.set(it.coverImage, []);
  groups.get(it.coverImage).push(it);
}

const toClear = new Set();
let brokenCount = 0;
let collisionCount = 0;

for (const it of items) {
  if (!it.coverImage) continue;
  const onDisk = path.join('public', it.coverImage.replace(/^\//, ''));
  if (!fs.existsSync(onDisk)) {
    toClear.add(it.id);
    brokenCount++;
  }
}
for (const [, list] of groups) {
  if (list.length > 1) {
    list.forEach((i) => toClear.add(i.id));
    collisionCount += list.length;
  }
}

const missing = items.filter((i) => !i.coverImage);

console.log(`Total items:           ${items.length}`);
console.log(`With cover:            ${items.length - missing.length}`);
console.log(`Without cover:         ${missing.length}`);
console.log(`Broken cover paths:    ${brokenCount}`);
console.log(`Collision-shared:      ${collisionCount}`);
console.log(`Items to clear cover:  ${toClear.size}`);

if (missing.length) {
  console.log('\nItems missing a cover (use library-items.json or scrape manually):');
  for (const m of missing) {
    console.log(`  [${m.type}] ${m.title}${m.year ? ` (${m.year})` : ''}`);
  }
}

if (toClear.size && apply) {
  let cleared = 0;
  for (const it of items) {
    if (toClear.has(it.id) && it.coverImage) {
      delete it.coverImage;
      cleared++;
    }
  }
  fs.writeFileSync(LIB_PATH, JSON.stringify(items, null, 2) + '\n');
  console.log(`\nCleared coverImage from ${cleared} items.`);
} else if (toClear.size) {
  console.log('\n(re-run with --apply to clear them, then run migrate-library.mjs)');
}
