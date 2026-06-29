import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

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
  // `eslint-config-next/core-web-vitals` is a native flat config (Next 16) that
  // bundles the React, React Hooks, jsx-a11y, import, @next/next, and TypeScript
  // plugins along with the Core Web Vitals rule set.
  ...nextCoreWebVitals,
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
      // react-hooks v7 (bundled with Next 16) ships React-Compiler-aligned rules
      // that flag patterns we use deliberately and that are not bugs:
      //  - set-state-in-effect fires on canonical hydration `mounted` guards
      //    (next-themes pattern) and prop-sync effects.
      //  - immutability false-positives on local running-totals inside useMemo
      //    (e.g. `cumulative += count` in a map callback).
      // Keep them as advisory warnings instead of build-breaking errors.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
];

export default eslintConfig;
