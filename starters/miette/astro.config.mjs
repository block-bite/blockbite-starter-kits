import { defineConfig } from 'astro/config';
import blockbite from '@blockbite/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [blockbite()],
  vite: { plugins: [tailwindcss()] },
});
