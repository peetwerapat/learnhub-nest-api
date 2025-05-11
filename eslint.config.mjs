import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';


/** @type {import('eslint').FlatConfig.Config[]} */
export default [
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      semi: ['error', 'always'],
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
      'no-undef': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:'],
            ['^fs$', '^path$', '^os$', '^crypto$', '^http$', '^https$'],
            ['^@nestjs', '^typeorm', '^\\w'],
            ['^@common(/.*|$)'],
            ['^@config(/.*|$)'],
            ['^@module(/.*|$)'],
            ['^@service(/.*|$)'],
            ['^@util(/.*|$)'],
            ['^@interceptor(/.*|$)'],
            ['^@guard(/.*|$)'],
            ['^@decorator(/.*|$)'],
            ['^@filter(/.*|$)'],
            ['^@pipe(/.*|$)'],
            ['^@dto(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.css$'],
          ],
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];