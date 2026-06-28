/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The /api/library/upload-cover route is dev-only (returns 403 in production)
  // but its static file references cause Next.js's tracer to bundle all of
  // public/resources/images (~260 MB) into the serverless function and trip
  // Vercel's 250 MB limit. Exclude that tree from the function's trace.
  outputFileTracingExcludes: {
    '/api/library/upload-cover': [
      './public/resources/images/**/*',
      './public/**/*.png',
      './public/**/*.webp',
      './public/**/*.jpg',
      './public/**/*.jpeg',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yassenshopov.com',
      },
      // Vercel Blob-hosted assets (see scripts/migrate-images-to-blob.mjs).
      // The subdomain is account-specific, so we match any *.public.blob host.
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

// Opt-in bundle analysis: `ANALYZE=true npm run build` opens treemap reports.
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
