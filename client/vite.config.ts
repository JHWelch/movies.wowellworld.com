import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vue(),
  ],
  build: {
    manifest: true,
    outDir: '../built/public',
    rollupOptions: {
      input: 'src/main.ts',
    },
  },
  resolve: {
    alias: {
      '@assets/': new URL('./src/assets/', import.meta.url).pathname,
      '@client/': new URL('./src/', import.meta.url).pathname,
      '@components/': new URL('./src/components/', import.meta.url).pathname,
      '@pages/': new URL('./src/pages/', import.meta.url).pathname,
      '@shared/': new URL('../shared/', import.meta.url).pathname,
    },
  },
  test: {
    alias: {
      '@tests/': new URL('./src/__tests__/', import.meta.url).pathname,
    },
    setupFiles:[
      './src/__tests__/setup.ts',
    ],
  },
})
