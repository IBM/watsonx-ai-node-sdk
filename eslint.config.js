const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const jest = require('eslint-plugin-jest');
const jsdoc = require('eslint-plugin-jsdoc');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.nyc_output/**',
      'examples/**',
      'test/langchain/**',
      '*.min.js',
      '.eslintcache',
      '.eslintrc.js',
    ],
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'writable',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        AbortController: 'readonly',
      },
    },
    plugins: {
      jest,
      prettier,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...jest.configs.recommended.rules,
      'jest/padding-around-all': 'error',
      'camelcase': 'off',
      'no-template-curly-in-string': 'off',
      'no-underscore-dangle': 'off',
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      'no-self-assign': 'off',
      'require-yield': 'off',
    },
  },

  // JavaScript test files
  {
    files: ['**/*.test.js', '**/*.test.jsx', 'test/**/*.js'],
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
    rules: {
      'jest/expect-expect': 'off',
      'jest/no-conditional-expect': 'off',
      'jest/no-done-callback': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/no-try-expect': 'off',
      'no-restricted-syntax': 'off',
      'no-unused-vars': 'off',
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        AsyncIterable: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      jsdoc,
      import: importPlugin,
      prettier,
    },
    rules: {
      // Base ESLint + TS + Prettier
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,

      // Overrides & stylistic preferences
      'no-undef': 'off',
      'max-len': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-redeclare': 'off',
      'prettier/prettier': 'error',
      'spaced-comment': ['error', 'always', { exceptions: ['*'] }],
      'no-shadow': 'off',
      'no-use-before-define': 'off',
      // TypeScript-specific rule replacements
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: ['objectLiteralProperty', 'typeProperty'],
          format: null,
        },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        {
          selector: 'classProperty',
          format: ['camelCase', 'UPPER_CASE'],
        },
        { selector: ['typeLike'], format: ['PascalCase'] },
        { selector: 'variable', modifiers: ['const'], format: ['camelCase', 'UPPER_CASE'] },
      ],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {}, // fixes TS import resolution
      },
    },
  },
];
