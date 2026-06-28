# Asset offload — moving `public/resources/images/` to Vercel Blob

`public/` is ~267 MB, almost entirely images. That bloats clones and CI checkout,
and already forced a workaround in `next.config.js` (`outputFileTracingExcludes`)
to keep the upload-cover function under Vercel's 250 MB trace limit. Serving the
images from Vercel Blob (a CDN-backed object store) removes all of that.

This is the one part of the hardening work that needs **your Vercel account** and
a **decision about rewriting git history**, so it's documented here rather than
run automatically.

## 1. Create a Blob store and get a token

```bash
# In the Vercel dashboard: Storage → Create → Blob, attach to this project.
vercel link            # if not already linked
vercel env pull .env.local   # pulls BLOB_READ_WRITE_TOKEN locally
```

## 2. Upload + rewrite references

```bash
# Dry run first — lists what would upload, touches nothing.
node --env-file=.env.local scripts/migrate-images-to-blob.mjs --dry-run

# Upload everything and write scripts/blob-manifest.json.
npm run migrate:images

# Inspect the manifest, then rewrite all references in src/ and the JSON data.
node --env-file=.env.local scripts/migrate-images-to-blob.mjs --rewrite
```

The script:

- uploads every file under `public/resources/images/**` to Blob using the same
  relative key (`resources/images/...`), idempotently;
- writes a manifest mapping each old path (`/resources/images/...`) → Blob URL;
- with `--rewrite`, swaps those paths across `src/**` and the `blog-posts.json` /
  `library-items.json` data files.

`next.config.js` already allows `*.public.blob.vercel-storage.com` in
`images.remotePatterns`, so `next/image` works with the new URLs immediately.

## 3. Verify, then remove the local images

```bash
npm run build   # confirm every image resolves from Blob
```

Once the build is clean and the deployed site looks right:

- delete `public/resources/images/` from the working tree;
- remove the now-unnecessary `outputFileTracingExcludes` block in
  `next.config.js` (the upload-cover route no longer references a giant tree).

## 4. (Optional, destructive) purge image history

Deleting the files leaves them in git history, so the repo stays large. To
actually shrink it you must **rewrite history**, which changes commit hashes and
requires a force-push and re-clone by any collaborators. Do this deliberately:

```bash
# Back up the repo first.
pip install git-filter-repo
git filter-repo --path public/resources/images --invert-paths
git push --force-with-lease origin main
```

Skip this step if you'd rather keep history intact and only stop the repo from
growing further.
