import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { createPageSchema } from '@blockbite/astro/content';
import { loadIslands } from '@blockbite/astro/islands';

const { islands } = await loadIslands(new URL('./islands/', import.meta.url));

export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/pages' }),
    schema: createPageSchema({ islands, templates: ['page'] }),
  }),
};
