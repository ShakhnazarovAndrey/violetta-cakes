import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL и BASE_PATH задаются в CI (GitHub Pages живёт под /<repo>/).
// Локально и на Vercel/своём домене остаются значения по умолчанию.
// TODO: заменить на боевой домен после подключения
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://violetta-cakes.vercel.app',
  base: process.env.BASE_PATH ?? '/',
  integrations: [sitemap()],
  // scope-класс родителя пробрасывается через проп class в дочерние компоненты
  scopedStyleStrategy: 'class',
});
