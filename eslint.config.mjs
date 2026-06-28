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
    // Build output, deps, assets, and standalone Node scripts/config aren't
    // part of the app's lint surface.
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'public/**',
      'scripts/**',
      'next-env.d.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.ts',
    ],
  },
  // `next/core-web-vitals` brings the React, React Hooks, jsx-a11y, import, and
  // @next/next plugins; `next/typescript` layers in the TypeScript rules.
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // `next/image` is used everywhere except for markdown-rendered images,
      // whose dimensions aren't known ahead of time (see BlogContent.tsx).
      // Keep the rule on so accidental <img> in new code is flagged; the two
      // legitimate cases opt out with a local eslint-disable.
      '@next/next/no-img-element': 'warn',
      // Enforce `import type { ... }` for type-only imports — keeps the runtime
      // import graph honest (and our RSC/client boundaries clean). Autofixable.
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
];

export default eslintConfig;
