import { defineConfig } from 'astro/config';
import blockbite from '@blockbite/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [blockbite()],
  image: { service: { entrypoint: '@blockbite/astro/images/service' } },
  vite: { plugins: [tailwindcss()] },
});
