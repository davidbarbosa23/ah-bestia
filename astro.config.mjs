// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://barbosacap.com',
  integrations: [sitemap({
    filter: (page) => {
      const path = new URL(page).pathname;
      const legacyRoutes = new Set([
        '/',
        '/en/',
        '/es/',
        '/en/projects/',
        '/es/projects/',
        '/en/photography/bogota-between-rains/',
        '/es/photography/bogota-between-rains/',
      ]);
      return !legacyRoutes.has(path);
    },
  })],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
