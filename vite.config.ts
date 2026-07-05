// vite.config.ts
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import ViteSitemap from 'vite-plugin-sitemap';

// works.json から作品個別ページ (/works/:cid) を sitemap の動的ルートとして生成
const works = JSON.parse(readFileSync(new URL('./src/data/works.json', import.meta.url), 'utf-8'));
const workRoutes: string[] = works
  .map((w: { fanzaUrl: string }) => {
    const m = w.fanzaUrl.match(/cid=([a-z0-9_]+)/);
    return m ? `/works/${m[1]}` : null;
  })
  .filter((r: string | null): r is string => r !== null);

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ViteSitemap({
      hostname: 'https://koroke-works.pages.dev',
      outDir: 'dist',
      dynamicRoutes: workRoutes,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});