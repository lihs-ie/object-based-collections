import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

const configs = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
);

export default configs.map((config) => ({
  ...config,
  files: ['src/**/*.ts'],
  plugins: {
    import: importPlugin,
    '@typescript-eslint': tseslint.plugin,
    'unused-imports': unusedImports,
  },
  rules: {
    ...config.rules,
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}));
