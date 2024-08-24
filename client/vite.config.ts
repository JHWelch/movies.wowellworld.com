import { defineConfig } from 'vite'
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
      '@client/': new URL('./src/', import.meta.url).pathname,
      '@components/': new URL('./src/components/', import.meta.url).pathname,
      '@pages/': new URL('./src/pages/', import.meta.url).pathname,
      '@shared/': new URL('../shared/', import.meta.url).pathname,
    },
  },
})
