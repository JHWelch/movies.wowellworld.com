import typescriptEslint from '@typescript-eslint/eslint-plugin'
import parser from 'vue-eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import stylistic from '@stylistic/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [{
  ignores: [
    '**/node_modules',
    '**/dist',
    'built',
  ],
}, ...compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:vue/vue3-recommended',
), {
  plugins: {
    '@typescript-eslint': typescriptEslint,
    '@stylistic': stylistic,
  },

  languageOptions: {
    parser: parser,
    ecmaVersion: 5,
    sourceType: 'script',

    parserOptions: {
      parser: '@typescript-eslint/parser',
    },
  },

  rules: {
    'comma-dangle': ['error', 'always-multiline'],

    'no-console': ['error', {
      allow: ['warn', 'error'],
    }],

    '@stylistic/indent': ['error', 2],

    '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],

    '@stylistic/no-multi-spaces': 'error',

    'quote-props': ['error', 'as-needed'],

    'max-len': ['error', {
      ignoreStrings: true,
      ignoreTrailingComments: true,
      ignoreUrls: true,
      tabWidth: 2,
    }],

    'no-restricted-imports': ['error', {
      patterns: ['.*'], // Disable all relative imports
    }],

    'object-curly-spacing': ['error', 'always'],

    quotes: ['error', 'single', {
      avoidEscape: true,
    }],

    semi: ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],

    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],

    'vue/multi-word-component-names': 'off',

    'vue/comma-dangle': ['error', 'always-multiline'],
  },
}, {
  files: ['**/*.vue'],

  rules: {
    'max-len': 'off',
  },
}]
