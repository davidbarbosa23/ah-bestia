// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ahbestia.com',
  integrations: [sitemap({
    filter: (page) => {
      const pathname = new URL(page).pathname;
      return pathname !== '/' && !pathname.includes('/dev/projects/');
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
