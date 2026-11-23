import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { createPageSchema } from '@blockbite/astro/content';
import { loadIslands } from '@blockbite/astro/islands';

const { islands } = await loadIslands(new URL('./islands/', import.meta.url));

export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/pages' }),
    schema: createPageSchema({ islands, templates: ['page'] }),
  }),
  articles: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/articles' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      published: z.coerce.date(),
      image: z.string(),
      imageAlt: z.string(),
      draft: z.boolean().default(false),
    }),
  }),
};
