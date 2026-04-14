import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://webgraphicdesign.fr',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
