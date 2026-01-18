import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@server/': new URL('./src/', import.meta.url).pathname,
      '@shared/': new URL('../shared/', import.meta.url).pathname,
    },
  },
  test: {
    alias: {
      '@mocks': new URL('./__mocks__/', import.meta.url).pathname,
      '@tests/': new URL('./__tests__/', import.meta.url).pathname,
    },
  },
})
