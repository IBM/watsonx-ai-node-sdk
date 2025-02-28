// eslint.config.mjs

import jsdocPlugin from 'eslint-plugin-jsdoc';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import jestPlugin from 'eslint-plugin-jest';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  {
    ignores: ['jsdoc/', 'doc/', 'coverage/', 'dist/', '.yalc/', 'node_modules'],
  },
  {
    files: ['examples/src/**/*.{js,ts}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './examples/tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      jsdoc: jsdocPlugin,
      import: importPlugin,
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      jest: jestPlugin,
    },
    rules: {
      'no-console': 'off',
      'no-restricted-syntax': 'off',
      'prefer-template': 'off',
      'no-await-in-loop': 'off',
      'prettier/prettier': 'error',
      'spaced-comment': ['error', 'always', { exceptions: ['*'] }],
    },
    settings: {
      jest: {
        version: 26,
      },
    },
  },
];
