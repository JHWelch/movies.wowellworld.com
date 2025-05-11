import jhwelch from '@jhwelch/eslint-config'

export default [
  ...jhwelch,
  {
    ignores: [
      'built',
    ],
  },{
    rules: {
      '@stylistic/keyword-spacing': ['error', {
        before: true,
        after: true,
      }],

      'no-restricted-imports': ['error', {
        patterns: ['.*'], // Disable all relative imports
      }],
    },
  }]
