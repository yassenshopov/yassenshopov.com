/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The /api/library/upload-cover route is dev-only (returns 403 in production)
  // but its static file references cause Next.js's tracer to bundle all of
  // public/resources/images (~260 MB) into the serverless function and trip
  // Vercel's 250 MB limit. Exclude that tree from the function's trace.
  outputFileTracingExcludes: {
    "/api/library/upload-cover": [
      "./public/resources/images/**/*",
      "./public/**/*.png",
      "./public/**/*.webp",
      "./public/**/*.jpg",
      "./public/**/*.jpeg",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yassenshopov.com",
      },
    ],
  },
};

module.exports = nextConfig;
