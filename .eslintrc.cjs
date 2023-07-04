module.exports = {
  'root': true,
  'parser': '@typescript-eslint/parser',
  'env': {
    'browser': true,
    'es2022': true
  },
  'extends': 'standard-with-typescript',
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': './tsconfig.json'
  },
  'rules': {
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/keyword-spacing': 'off',
    '@typescript-eslint/semi': 'off',
  },
  'ignorePatterns': [
    'built/**/*',
    'node_modules/**/*',
    '/tailwind.config.js',
  ]
}
