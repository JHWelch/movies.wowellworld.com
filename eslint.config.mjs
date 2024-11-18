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
    },
  }]
