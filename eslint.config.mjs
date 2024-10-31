import jhwelch from '@jhwelch/eslint-config'

export default [
  ...jhwelch,
  {
    ignores: [
      'built',
    ],
  },{
    rules: {
      'no-restricted-imports': ['error', {
        patterns: ['.*'], // Disable all relative imports
      }],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  }]
