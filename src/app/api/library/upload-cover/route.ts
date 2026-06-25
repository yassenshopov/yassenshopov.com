/**
 * Dev-only endpoint that replaces a library item's cover image.
 *
 *   POST /api/library/upload-cover
 *     multipart/form-data:
 *       id    – LibraryItem id
 *       file  – image file (jpeg | png | webp | gif | avif)
 *
 * Writes the file to public/resources/images/library/, updates
 * src/data/library-items.json, and returns the new public path.
 *
 * Disabled in production. Intended to be deleted once the library data is
 * locked down.
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LIB_PATH = path.join(process.cwd(), 'src', 'data', 'library-items.json');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'resources', 'images', 'library');

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

function slugify(s: string): string {
  const ascii = s
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (ascii) return ascii;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return `item-${Math.abs(h).toString(36)}`;
}

function slugFromCoverImage(coverImage: string): string | null {
  const m = coverImage.match(/\/library\/([^/.]+)\./);
  return m ? m[1].replace(/-\d{10,}$/, '') : null; // strip prior timestamp suffix
}

function pickExtension(file: File): string {
  const fromMime = MIME_TO_EXT[file.type];
  if (fromMime) return fromMime;
  const m = (file.name || '').match(/\.([a-z0-9]+)$/i);
  if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  return '.jpg';
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Cover upload is disabled in production' }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'invalid multipart body' }, { status: 400 });
  }

  const id = String(form.get('id') ?? '').trim();
  const file = form.get('file');

  if (!id || !(file instanceof File)) {
    return NextResponse.json({ error: 'id and file are required' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'file must be an image' }, { status: 400 });
  }
  // 10 MB cap — these are cover images.
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'file too large (max 10 MB)' }, { status: 413 });
  }

  const raw = await fs.readFile(LIB_PATH, 'utf-8');
  const items = JSON.parse(raw) as Array<Record<string, unknown> & { id: string }>;
  const item = items.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: 'item not found' }, { status: 404 });
  }

  const slug =
    (typeof item.coverImage === 'string' && slugFromCoverImage(item.coverImage)) ||
    slugify(String(item.title ?? ''));
  const ext = pickExtension(file);
  // Timestamp suffix so the URL always changes, dodging next/image's cache.
  const fileName = `${slug}-${Date.now()}${ext}`;
  const fullPath = path.join(PUBLIC_DIR, fileName);
  const publicPath = `/resources/images/library/${fileName}`;

  // Best-effort cleanup of the previous file so we don't accumulate orphans.
  if (typeof item.coverImage === 'string') {
    const oldFull = path.join(process.cwd(), 'public', item.coverImage.replace(/^\//, ''));
    try {
      await fs.unlink(oldFull);
    } catch {
      // pre-existing missing file — fine
    }
  }

  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.writeFile(fullPath, Buffer.from(await file.arrayBuffer()));

  item.coverImage = publicPath;
  await fs.writeFile(LIB_PATH, JSON.stringify(items, null, 2) + '\n');

  return NextResponse.json({ ok: true, coverImage: publicPath });
}
