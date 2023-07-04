/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '\\.[jt]sx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
}
