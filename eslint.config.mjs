import jhwelch from '@jhwelch/eslint-config'
import globals from 'globals'

export default [
  ...jhwelch,
  {
    ignores: [
      'built',
    ],
  },
  {
    rules: {
      '@stylistic/keyword-spacing': ['error', {
        before: true,
        after: true,
      }],

      'no-restricted-imports': ['error', {
        patterns: ['.*'], // Disable all relative imports
      }],
    },
  },
  {
    files: ['src/server/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/client/**/*.ts', 'src/client/**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]
