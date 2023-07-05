module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
