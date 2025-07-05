# Library Thumbnails

This directory contains WebP thumbnail images for the library items.

## Image Requirements

- **Format**: WebP
- **Recommended size**: 
  - **Books**: 300x450px (2:3 portrait aspect ratio)
  - **Movies/Series**: 300x450px (2:3 portrait) or 533x300px (16:9 landscape)
- **Quality**: High quality but optimized for web
- **Display**: Images will be displayed with letterboxing (black bars) to maintain aspect ratio

## Filename Convention

Images should be named using the following pattern:
- Convert title to lowercase
- Remove special characters
- Replace spaces with hyphens
- Use `.webp` extension

## Current Required Images

### Movies & Series
- `money-heist.webp`
- `lilo-stitch.webp`
- `the-last-of-us.webp`
- `thunderbolts.webp`
- `gundi.webp`
- `peaky-blinders.webp`
- `gladiator-ii.webp`
- `paddington-in-peru.webp`
- `undercover.webp`
- `joker-folie-deux.webp`
- `fight-club.webp`
- `the-boys.webp`
- `inside-out-2.webp`
- `despicable-me-4.webp`
- `creed-iii.webp`
- `creed-ii.webp`

### Books
- `project-hail-mary.webp`
- `the-ballad-of-songbirds-and-snakes.webp`
- `the-martian.webp`
- `12-rules-for-life-an-antidote-to-chaos.webp`
- `beyond-order-12-more-rules-for-life.webp`
- `the-poppy-war.webp`
- `everything-is-fcked.webp`
- `the-subtle-art-of-not-giving-a-fck.webp`
- `lifespan-why-we-age-and-why-we-dont-have-to.webp`
- `dotcom-secrets.webp`
- `immune-a-journey-into-the-mysterious-system-that-keeps-you-alive.webp`
- `outlive-the-science-and-art-of-longevity.webp`
- `всички-и-никой.webp`
- `transcend-9-steps-to-living-well-forever.webp`
- `killing-commendatore.webp`
- `the-chrysalids.webp`
- `design-for-how-people-think-using-brain-science-to-build-better-products.webp`
- `the-science-of-storytelling-why-stories-make-us-human-and-how-to-tell-them-better.webp`
- `a-clash-of-kings.webp`
- `a-game-of-thrones.webp`
- `the-e-myth-revisited.webp`
- `building-a-second-brain.webp`
- `thirst.webp`

## Adding Images

1. Find high-quality cover images for each item
2. Convert to WebP format (you can use online converters or tools like `cwebp`)
3. Resize to recommended dimensions
4. Save with the exact filename from the list above
5. Place in this directory

## Tools for WebP Conversion

- **Online**: squoosh.app, cloudconvert.com
- **Command line**: `cwebp input.jpg -o output.webp`
- **Batch conversion**: Use ImageMagick or similar tools 