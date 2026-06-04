import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: 'https://portalozenvitta.vercel.app',
  compressHTML: true,
  integrations: [tailwind(), preact()],
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR']
  }
});