import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ozenvitta-five.vercel.app',
  compressHTML: true,
  integrations: [
    tailwind(),
  ],
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },
});
