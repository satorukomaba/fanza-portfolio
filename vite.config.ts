// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteSitemap from 'vite-plugin-sitemap';

export default defineConfig({
  base: '/fanza-portfolio/',
  plugins: [
    react(),
    ViteSitemap({
      hostname: 'https://satorukomaba.github.io/fanza-portfolio',
      outDir: 'dist',
      // オプション:
      // exclude: ['/secret'],
      // routes: ['/custom/path'],
    }),
  ],
});