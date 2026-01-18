import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vue(),
  ],
  // build: {
  //   manifest: true,
  //   outDir: '../built/public',
  //   rollupOptions: {
  //     input: 'src/main.ts',
  //   },
  // },
  resolve: {
    alias: {
      // Client aliases
      '@assets/': new URL('./src/client/assets/', import.meta.url).pathname,
      '@client/': new URL('./src/client/', import.meta.url).pathname,
      '@components/': new URL('./src/client/components/', import.meta.url).pathname,
      '@pages/': new URL('./src/client/pages/', import.meta.url).pathname,
      '@shared/': new URL('./src/shared/', import.meta.url).pathname,

      // Server aliases
      '@server/': new URL('./src/server/', import.meta.url).pathname,
    },
  },
  test: {
    alias: {
      '@mocks': new URL('./__mocks__/', import.meta.url).pathname,
      '@tests/utils': new URL('./src/client/__tests__/utils', import.meta.url).pathname,
      '@tests/support': new URL('./src/server/__tests__/support', import.meta.url).pathname,
    },

    projects: [
      {
        extends: true,
        test: {
          name: { label: 'client', color: 'cyan' },
          include: ['src/client/**/*.spec.ts'],
          setupFiles: 'src/client/__tests__/setup.ts',
        },
      },
      {
        extends: true,
        test: {
          name: 'server',
          include: ['src/server/**/*.spec.ts'],
        },
      },
    ],
  },
})
