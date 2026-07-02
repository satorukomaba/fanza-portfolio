// vite.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import ViteSitemap from 'vite-plugin-sitemap';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ViteSitemap({
      hostname: 'https://koroke-works.pages.dev',
      outDir: 'dist',
      // オプション:
      // exclude: ['/secret'],
      // routes: ['/custom/path'],
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});