import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '.yalc/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': 'error',

      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],

      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        fetch: 'readonly',
      },
    },
  },
];
