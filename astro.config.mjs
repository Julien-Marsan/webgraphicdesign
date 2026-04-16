import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://webgraphicdesign.fr',
  output: 'static',
  integrations: [sitemap()],
});
