import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pagesでの相対パス配信用
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
