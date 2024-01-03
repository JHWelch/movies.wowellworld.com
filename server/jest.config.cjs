/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '\\.[jt]sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
}
