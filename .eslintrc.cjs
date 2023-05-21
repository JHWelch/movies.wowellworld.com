module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        '@babel/plugin-syntax-import-assertions',
      ],
    },
  },
  rules: {
    'import/extensions': ['error', 'always'],
  },
  ignorePatterns: [
    'node_modules/',
    '*.config.js',
  ],
};
