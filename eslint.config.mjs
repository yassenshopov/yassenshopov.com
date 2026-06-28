import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['**/*.config.js', '**/*.config.mjs', '**/*.config.ts'],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // `next/image` is used everywhere except for markdown-rendered images,
      // whose dimensions aren't known ahead of time (see BlogContent.tsx).
      // Keep the rule on so accidental <img> in new code is flagged; the two
      // legitimate cases opt out with a local eslint-disable.
      '@next/next/no-img-element': 'warn',
    },
  },
];

export default eslintConfig;
