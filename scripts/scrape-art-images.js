/**
 * One-shot script to migrate the kofiscrib.com front-page portfolio gallery
 * into this Next.js app under public/resources/images/art/.
 *
 * The legacy site exposed 24 .webp images under
 * https://kofiscrib.com/resources/images/front-page-portfolio/imgN.webp
 * for N = 1..24. We mirror them locally so they survive kofiscrib.com expiring.
 *
 * Usage: `node scripts/scrape-art-images.js`
 */

const fs = require('node:fs');
const path = require('node:path');

const SOURCE_BASE = 'https://kofiscrib.com/resources/images/front-page-portfolio';
const DEST_DIR = path.join(__dirname, '..', 'public', 'resources', 'images', 'art');
const TOTAL_IMAGES = 24;

async function downloadImage(index) {
  const filename = `img${index}.webp`;
  const url = `${SOURCE_BASE}/${filename}`;
  const dest = path.join(DEST_DIR, filename);

  if (fs.existsSync(dest)) {
    console.log(`  [skip] ${filename} already exists`);
    return { filename, status: 'skipped' };
  }

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  [warn] ${filename} -> HTTP ${res.status}`);
    return { filename, status: 'failed', reason: `HTTP ${res.status}` };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  console.log(`  [ok]   ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return { filename, status: 'downloaded', bytes: buffer.length };
}

async function main() {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  console.log(`Downloading ${TOTAL_IMAGES} images -> ${DEST_DIR}\n`);

  const results = [];
  for (let i = 1; i <= TOTAL_IMAGES; i++) {
    try {
      results.push(await downloadImage(i));
    } catch (err) {
      console.error(`  [err]  img${i}.webp -> ${err.message}`);
      results.push({ filename: `img${i}.webp`, status: 'error', reason: err.message });
    }
  }

  const downloaded = results.filter((r) => r.status === 'downloaded').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const failed = results.filter((r) => r.status === 'failed' || r.status === 'error');
  console.log(`\nDone. downloaded=${downloaded} skipped=${skipped} failed=${failed.length}`);
  if (failed.length) {
    console.log('Failed files:');
    for (const r of failed) {
      console.log(`  - ${r.filename}: ${r.reason}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
