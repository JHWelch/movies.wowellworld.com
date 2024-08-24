/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = { // eslint-disable-line no-undef
  transform: {
    '\\.[jt]sx?$': ['ts-jest', {
      isolatedModules: true,
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '^@server/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/../shared/$1',
    '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    '(.+)\\.js': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.spec.ts'],
}
