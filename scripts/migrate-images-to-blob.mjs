/**
 * One-shot migration: upload everything under public/resources/images/ to
 * Vercel Blob and rewrite the in-repo references so the app serves images from
 * the CDN instead of the deploy artifact (which is ~267 MB and trips Vercel's
 * 250 MB function trace limit — see the workaround in next.config.js).
 *
 * What it does:
 *   1. Walks public/resources/images/** and uploads each file to Blob under the
 *      same relative key (resources/images/...). Idempotent: re-running with the
 *      same content reuses the same pathname.
 *   2. Writes a manifest (scripts/blob-manifest.json) mapping each old public
 *      path ("/resources/images/foo.webp") to its new Blob URL.
 *   3. With --rewrite, replaces those paths across src/ (tsx/ts) and the JSON
 *      data files (blog-posts.json, library-items.json) with the Blob URLs.
 *
 * Requirements:
 *   - A Blob store on your Vercel project and a read/write token exposed as
 *     BLOB_READ_WRITE_TOKEN (vercel env pull, or paste it inline).
 *
 * Usage:
 *   node scripts/migrate-images-to-blob.mjs            # upload + write manifest
 *   node scripts/migrate-images-to-blob.mjs --rewrite  # also rewrite references
 *   node scripts/migrate-images-to-blob.mjs --dry-run  # list, upload nothing
 *
 * After a successful --rewrite run and a verified build, you can delete
 * public/resources/images/ from the repo (optionally purging git history with
 * git filter-repo — see docs/asset-offload.md) and drop the
 * outputFileTracingExcludes workaround from next.config.js.
 */

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'resources', 'images');
const MANIFEST_PATH = path.join(__dirname, 'blob-manifest.json');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const REWRITE = args.has('--rewrite');

const REWRITE_TARGETS = [
  path.join(ROOT, 'src'),
  path.join(ROOT, 'src', 'data', 'blog-posts.json'),
  path.join(ROOT, 'src', 'data', 'library-items.json'),
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

async function walkFiles(target) {
  const s = await stat(target).catch(() => null);
  if (!s) return [];
  if (s.isFile()) return [target];
  const out = [];
  for (const entry of await readdir(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(full)));
    else if (entry.isFile() && /\.(tsx?|jsx?|json)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function publicPathOf(absFile) {
  // /resources/images/... — the path the app currently references.
  return '/' + path.relative(path.join(ROOT, 'public'), absFile).split(path.sep).join('/');
}

async function upload() {
  const { put } = await import('@vercel/blob');
  if (!process.env.BLOB_READ_WRITE_TOKEN && !DRY_RUN) {
    console.error(
      'Missing BLOB_READ_WRITE_TOKEN. Run `vercel env pull .env.local` (after\n' +
        'creating a Blob store), then `node --env-file=.env.local scripts/migrate-images-to-blob.mjs`.'
    );
    process.exit(1);
  }

  const files = await walk(IMAGES_DIR);
  console.log(`Found ${files.length} image(s) under public/resources/images/`);

  const manifest = {};
  let done = 0;
  for (const file of files) {
    const publicPath = publicPathOf(file);
    const key = publicPath.replace(/^\//, ''); // resources/images/...
    if (DRY_RUN) {
      console.log(`  [dry-run] ${publicPath}`);
      continue;
    }
    const body = await readFile(file);
    const { url } = await put(key, body, {
      access: 'public',
      addRandomSuffix: false,
      contentType: undefined,
    });
    manifest[publicPath] = url;
    done += 1;
    if (done % 25 === 0) console.log(`  uploaded ${done}/${files.length}`);
  }

  if (!DRY_RUN) {
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
    console.log(
      `\nUploaded ${done} file(s). Manifest written to ${path.relative(ROOT, MANIFEST_PATH)}`
    );
  }
  return manifest;
}

async function rewrite(manifest) {
  const entries = Object.entries(manifest);
  if (entries.length === 0) {
    console.error('Manifest is empty — run the upload step first.');
    process.exit(1);
  }
  // Replace longest paths first so nested paths aren't partially matched.
  entries.sort((a, b) => b[0].length - a[0].length);

  const targets = (await Promise.all(REWRITE_TARGETS.map(walkFiles))).flat();
  let changedFiles = 0;
  let totalReplacements = 0;

  for (const file of targets) {
    let text = await readFile(file, 'utf-8');
    let fileReplacements = 0;
    for (const [oldPath, url] of entries) {
      if (!text.includes(oldPath)) continue;
      const count = text.split(oldPath).length - 1;
      text = text.split(oldPath).join(url);
      fileReplacements += count;
    }
    if (fileReplacements > 0) {
      await writeFile(file, text);
      changedFiles += 1;
      totalReplacements += fileReplacements;
      console.log(`  rewrote ${fileReplacements} ref(s) in ${path.relative(ROOT, file)}`);
    }
  }
  console.log(`\nRewrote ${totalReplacements} reference(s) across ${changedFiles} file(s).`);
}

async function main() {
  const manifest = await upload();
  if (REWRITE && !DRY_RUN) {
    const onDisk = JSON.parse(await readFile(MANIFEST_PATH, 'utf-8'));
    await rewrite(onDisk);
  } else if (REWRITE && DRY_RUN) {
    console.log('\n--dry-run set: skipping rewrite.');
  } else {
    console.log(
      '\nNext: re-run with --rewrite to update references, or inspect the manifest first.'
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
