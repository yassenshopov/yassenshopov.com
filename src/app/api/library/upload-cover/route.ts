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
import { type NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  productionGuard,
  readLibraryItems,
  writeLibraryItems,
  jsonError,
} from '@/lib/library-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'resources', 'images', 'library');

/**
 * Identify an image by its magic bytes rather than trusting the client-declared
 * MIME type or filename. Returns the canonical extension, or null when the
 * bytes don't match a supported image format.
 */
function detectImageExtension(bytes: Uint8Array): string | null {
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return '.jpg';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return '.png';
  }
  // GIF: "GIF8"
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return '.gif';
  }
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  // WEBP: "RIFF"...."WEBP"
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return '.webp';
  // AVIF: ...."ftyp" with an "avif"/"avis" brand
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return '.avif';
  return null;
}

/**
 * Guard against path traversal: resolve `candidate` and confirm it stays inside
 * `base`. Returns the resolved path, or null if it would escape.
 */
function containedPath(base: string, candidate: string): string | null {
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(candidate);
  if (resolved === resolvedBase || resolved.startsWith(resolvedBase + path.sep)) {
    return resolved;
  }
  return null;
}

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
  return m ? m[1].replace(/-\d{10,}$/, '') : null;
}

export async function POST(req: NextRequest) {
  const guard = productionGuard('Cover upload');
  if (guard) return guard;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError('invalid multipart body', 400);
  }

  const id = String(form.get('id') ?? '').trim();
  const file = form.get('file');

  if (!id || !(file instanceof File)) {
    return jsonError('id and file are required', 400);
  }
  if (!file.type.startsWith('image/')) {
    return jsonError('file must be an image', 400);
  }
  if (file.size > 10 * 1024 * 1024) {
    return jsonError('file too large (max 10 MB)', 413);
  }

  // Verify the actual bytes are an image we support, rather than trusting the
  // client-declared MIME type / filename. The extension we persist is derived
  // from the detected format.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = detectImageExtension(bytes);
  if (!ext) {
    return jsonError('file is not a supported image (jpeg, png, webp, gif, avif)', 400);
  }

  const items = await readLibraryItems<Record<string, unknown> & { id: string }>();
  const item = items.find((i) => i.id === id);
  if (!item) {
    return jsonError('item not found', 404);
  }

  const slug =
    (typeof item.coverImage === 'string' && slugFromCoverImage(item.coverImage)) ||
    slugify(String(item.title ?? ''));
  const fileName = `${slug}-${Date.now()}${ext}`;
  const publicPath = `/resources/images/library/${fileName}`;

  // Both the destination and any old-cover deletion must stay inside the
  // managed library image directory — never let a crafted slug/coverImage path
  // escape it.
  const fullPath = containedPath(PUBLIC_DIR, path.join(PUBLIC_DIR, fileName));
  if (!fullPath) {
    return jsonError('resolved file path is invalid', 400);
  }

  if (typeof item.coverImage === 'string') {
    const oldFull = containedPath(
      PUBLIC_DIR,
      path.join(process.cwd(), 'public', item.coverImage.replace(/^\//, ''))
    );
    if (oldFull) {
      try {
        await fs.unlink(oldFull);
      } catch {
        // pre-existing missing file — fine
      }
    }
  }

  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.writeFile(fullPath, Buffer.from(bytes));

  item.coverImage = publicPath;
  await writeLibraryItems(items);

  return NextResponse.json({ ok: true, coverImage: publicPath });
}
